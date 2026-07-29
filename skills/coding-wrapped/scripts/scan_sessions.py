#!/usr/bin/env python3
"""Generate privacy-conscious aggregate metrics from local coding-agent sessions."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import statistics
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional
from zoneinfo import ZoneInfo

from common import detect_timezone_name


CLAUDE_ROOT = Path.home() / ".claude" / "projects"
CODEX_ROOT = Path.home() / ".codex" / "sessions"

SYSTEM_BLOCKS = re.compile(
    r"<(environment_context|recommended_plugins|skills_instructions|system-reminder|"
    r"local-command-caveat|command-message|command-name|task-notification|video)>.*?</\1>",
    re.IGNORECASE | re.DOTALL,
)
IMAGE_BLOCKS = re.compile(r"<image\b.*?</image>", re.IGNORECASE | re.DOTALL)
XML_TAGS = re.compile(r"</?[a-zA-Z][^>]*>")
PATHS = re.compile(r"(?:/Users|/home|/private|/tmp|~)/[^\s\]\[(){}<>\"']+")
EMAILS = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE)
URLS = re.compile(r"https?://\S+", re.IGNORECASE)
SECRETS = re.compile(
    r"(?:sk-[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9_-]+|xox[baprs]-[A-Za-z0-9-]+|"
    r"Bearer\s+[A-Za-z0-9._~-]+|AKIA[A-Z0-9]{16})",
    re.IGNORECASE,
)
CODE_FENCES = re.compile(r"```.*?```", re.DOTALL)

PHRASES = {
    "continue / 继续": re.compile(r"\bcontinue\b|继续", re.IGNORECASE),
    "先": re.compile(r"先"),
    "帮我 / help me": re.compile(r"帮我|\bhelp me\b", re.IGNORECASE),
    "看一下": re.compile(r"看一下|看下|\btake a look\b", re.IGNORECASE),
    "直接": re.compile(r"直接"),
    "不要 / 别": re.compile(r"不要|别动|别改|\bdon't\b|\bdo not\b", re.IGNORECASE),
    "停一下 / wait": re.compile(r"停一下|先停|等一下|\bstop\b|\bwait\b", re.IGNORECASE),
    "重新 / again": re.compile(r"重新|\bredo\b|\bagain\b", re.IGNORECASE),
    "测试 / test": re.compile(r"测试|\btests?\b", re.IGNORECASE),
    "检查 / verify": re.compile(r"检查|验证|\bcheck\b|\bverify\b", re.IGNORECASE),
    "谢谢 / thanks": re.compile(r"谢谢|多谢|\bthanks\b|\bthank you\b", re.IGNORECASE),
}


def parse_timestamp(value: object) -> Optional[datetime]:
    if not isinstance(value, str) or not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def clean_user_text(text: object) -> str:
    if not isinstance(text, str):
        return ""
    if "## My request for Codex:" in text:
        text = text.split("## My request for Codex:", 1)[1]
    text = SYSTEM_BLOCKS.sub(" ", text)
    text = IMAGE_BLOCKS.sub(" ", text)
    text = CODE_FENCES.sub(" [code] ", text)
    text = SECRETS.sub("[secret]", text)
    text = EMAILS.sub("[email]", text)
    text = URLS.sub("[url]", text)
    text = PATHS.sub("[path]", text)
    text = XML_TAGS.sub(" ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def claude_user_text(message: object) -> str:
    if isinstance(message, str):
        return clean_user_text(message)
    if not isinstance(message, list):
        return ""
    parts = []
    for item in message:
        if isinstance(item, dict) and item.get("type") == "text":
            parts.append(str(item.get("text", "")))
    return clean_user_text(" ".join(parts))


def codex_user_text(payload: dict) -> str:
    content = payload.get("content", [])
    if not isinstance(content, list):
        return ""
    parts = []
    for item in content:
        if isinstance(item, dict) and item.get("type") in {"input_text", "text"}:
            parts.append(str(item.get("text", "")))
    return clean_user_text(" ".join(parts))


def tool_category(name: str) -> str:
    lowered = name.lower()
    if any(token in lowered for token in ("test", "pytest", "jest", "vitest")):
        return "test"
    if any(token in lowered for token in ("read", "open", "view")):
        return "read"
    if any(token in lowered for token in ("edit", "write", "patch")):
        return "edit"
    if any(token in lowered for token in ("search", "grep", "find", "rg")):
        return "search"
    if any(token in lowered for token in ("bash", "shell", "exec", "command")):
        return "shell"
    if any(token in lowered for token in ("agent", "task", "spawn")):
        return "subagent"
    if any(token in lowered for token in ("browser", "web", "chrome")):
        return "browser"
    return "other"


def private_project_key(value: object) -> Optional[str]:
    if not isinstance(value, str) or not value:
        return None
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:12]


def iter_jsonl(path: Path):
    try:
        with path.open("r", encoding="utf-8", errors="replace") as handle:
            for line in handle:
                try:
                    value = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if isinstance(value, dict):
                    yield value
    except OSError:
        return


def analyze_claude(path: Path, cutoff: datetime) -> dict:
    users = []
    events = []
    tools = Counter()
    models = Counter()
    plan_mode = False
    is_subagent = False
    project_key = None
    token_usage = Counter()

    for row in iter_jsonl(path):
        timestamp = parse_timestamp(row.get("timestamp"))
        if timestamp and timestamp >= cutoff:
            events.append(timestamp)
        if project_key is None:
            project_key = private_project_key(row.get("cwd"))
        row_type = row.get("type")
        if row.get("isSidechain") is True or row.get("agentId") or row.get("agent_id"):
            is_subagent = True
        if row_type == "user" and timestamp and timestamp >= cutoff:
            text = claude_user_text((row.get("message") or {}).get("content"))
            if text:
                users.append((timestamp, text))
            if row.get("permissionMode") == "plan":
                plan_mode = True
        elif row_type == "assistant" and timestamp and timestamp >= cutoff:
            message = row.get("message") or {}
            model = message.get("model")
            if isinstance(model, str) and model and model != "<synthetic>":
                models[model] += 1
            usage = message.get("usage") or {}
            if isinstance(usage, dict):
                input_tokens = int(usage.get("input_tokens") or 0)
                cached_tokens = int(usage.get("cache_read_input_tokens") or 0)
                cache_write_tokens = int(usage.get("cache_creation_input_tokens") or 0)
                output_tokens = int(usage.get("output_tokens") or 0)
                token_usage["input_tokens"] += input_tokens
                token_usage["cached_input_tokens"] += cached_tokens
                token_usage["cache_write_input_tokens"] += cache_write_tokens
                token_usage["output_tokens"] += output_tokens
                token_usage["total_tokens"] += (
                    input_tokens
                    + cached_tokens
                    + cache_write_tokens
                    + output_tokens
                )
            content = message.get("content")
            if isinstance(content, list):
                for item in content:
                    if isinstance(item, dict) and item.get("type") == "tool_use":
                        name = str(item.get("name", "other"))
                        tools[tool_category(name)] += 1

    return {
        "source": "claude-code",
        "users": users,
        "events": events,
        "tools": tools,
        "models": models,
        "plan_mode": plan_mode,
        "is_subagent": is_subagent,
        "project_key": project_key,
        "token_usage": token_usage,
    }


def analyze_codex(path: Path, cutoff: datetime) -> dict:
    users = []
    events = []
    tools = Counter()
    models = Counter()
    plan_mode = False
    is_subagent = False
    project_key = None
    token_usage = Counter()

    for row in iter_jsonl(path):
        timestamp = parse_timestamp(row.get("timestamp"))
        if timestamp and timestamp >= cutoff:
            events.append(timestamp)
        row_type = row.get("type")
        payload = row.get("payload") or {}
        if row_type == "session_meta":
            project_key = private_project_key(payload.get("cwd"))
            if payload.get("thread_source") == "subagent":
                is_subagent = True
        elif (
            row_type == "event_msg"
            and timestamp
            and timestamp >= cutoff
            and payload.get("type") == "token_count"
        ):
            total = (payload.get("info") or {}).get("total_token_usage") or {}
            if isinstance(total, dict):
                for key in (
                    "input_tokens",
                    "cached_input_tokens",
                    "cache_write_input_tokens",
                    "output_tokens",
                    "reasoning_output_tokens",
                    "total_tokens",
                ):
                    token_usage[key] = max(token_usage[key], int(total.get(key) or 0))
        if row_type == "response_item" and timestamp and timestamp >= cutoff:
            if payload.get("type") == "message" and payload.get("role") == "user":
                text = codex_user_text(payload)
                if text:
                    users.append((timestamp, text))
            elif payload.get("type") in {"function_call", "custom_tool_call"}:
                name = str(payload.get("name") or payload.get("tool_name") or "other")
                tools[tool_category(name)] += 1
        elif row_type == "turn_context" and timestamp and timestamp >= cutoff:
            model = payload.get("model")
            if isinstance(model, str) and model:
                models[model] += 1
            if payload.get("collaboration_mode") == "plan":
                plan_mode = True

    return {
        "source": "codex",
        "users": users,
        "events": events,
        "tools": tools,
        "models": models,
        "plan_mode": plan_mode,
        "is_subagent": is_subagent,
        "project_key": project_key,
        "token_usage": token_usage,
    }


def active_segments(timestamps: list[datetime], max_gap: timedelta) -> list[list[datetime]]:
    if not timestamps:
        return []
    ordered = sorted(set(timestamps))
    segments = [[ordered[0]]]
    for timestamp in ordered[1:]:
        if timestamp - segments[-1][-1] > max_gap:
            segments.append([timestamp])
        else:
            segments[-1].append(timestamp)
    return segments


def build_metrics(
    days: Optional[int],
    tz_name: str,
    claude_root: Path = CLAUDE_ROOT,
    codex_root: Path = CODEX_ROOT,
) -> dict:
    tz = ZoneInfo(tz_name)
    now = datetime.now(timezone.utc)
    cutoff = (
        now - timedelta(days=days)
        if days is not None
        else datetime.min.replace(tzinfo=timezone.utc)
    )
    sessions = []
    all_results = []
    subagent_sessions = Counter()
    source_status = {}

    for source, root, analyzer in (
        ("claude-code", claude_root, analyze_claude),
        ("codex", codex_root, analyze_codex),
    ):
        paths = list(root.rglob("*.jsonl")) if root.is_dir() else []
        source_status[source] = {
            "directory_found": root.is_dir(),
            "session_files": len(paths),
        }
        for path in paths:
            result = analyzer(path, cutoff)
            if result["users"]:
                all_results.append(result)
                if result["is_subagent"]:
                    subagent_sessions[result["source"]] += 1
                else:
                    sessions.append(result)

    all_users = []
    source_sessions = Counter()
    tool_counts = Counter()
    model_counts = Counter()
    start_hours = Counter()
    weekdays = Counter()
    active_dates = set()
    activity_by_date = Counter()
    prompt_lengths = []
    phrase_occurrences = Counter()
    phrase_messages = Counter()
    plan_sessions = 0
    durations_minutes = []
    longest_segment = None
    project_keys = {
        result["project_key"] for result in all_results if result["project_key"]
    }
    token_usage = Counter()
    for result in all_results:
        token_usage.update(result["token_usage"])

    for session in sessions:
        source_sessions[session["source"]] += 1
        tool_counts.update(session["tools"])
        model_counts.update(session["models"])
        if session["plan_mode"]:
            plan_sessions += 1

        local_users = [(timestamp.astimezone(tz), text) for timestamp, text in session["users"]]
        all_users.extend(local_users)
        if local_users:
            first = min(timestamp for timestamp, _ in local_users)
            start_hours[first.hour] += 1
            weekdays[first.strftime("%A")] += 1

        for segment in active_segments(session["events"], timedelta(minutes=45)):
            duration = max(1.0, (segment[-1] - segment[0]).total_seconds() / 60)
            durations_minutes.append(duration)
            if longest_segment is None or duration > longest_segment[0]:
                longest_segment = (duration, segment[0].astimezone(tz))

    for timestamp, text in all_users:
        active_dates.add(timestamp.date().isoformat())
        activity_by_date[timestamp.date().isoformat()] += 1
        prompt_lengths.append(len(text))
        for label, pattern in PHRASES.items():
            if len(text) > 600:
                continue
            matches = pattern.findall(text)
            if matches:
                phrase_messages[label] += 1
                phrase_occurrences[label] += len(matches)

    phrase_stats = [
        {
            "phrase": label,
            "occurrences": phrase_occurrences[label],
            "messages": phrase_messages[label],
        }
        for label in PHRASES
        if phrase_occurrences[label]
    ]
    phrase_stats.sort(key=lambda item: (-item["occurrences"], item["phrase"]))

    most_common_hour = start_hours.most_common(1)[0] if start_hours else (None, 0)
    most_common_weekday = weekdays.most_common(1)[0] if weekdays else (None, 0)
    median_prompt = round(statistics.median(prompt_lengths)) if prompt_lengths else 0
    mean_prompt = round(statistics.mean(prompt_lengths)) if prompt_lengths else 0
    median_duration = round(statistics.median(durations_minutes), 1) if durations_minutes else 0

    return {
        "analysis": {
            "generated_at": now.isoformat(),
            "days": days if days is not None else "all",
            "timezone": tz_name,
            "privacy": "Aggregates and pre-approved short phrase counts only; no raw transcript export.",
        },
        "coverage": {
            "source_status": source_status,
            "available_sources": [
                source
                for source, status in source_status.items()
                if status["session_files"] > 0
            ],
            "missing_sources": [
                source
                for source, status in source_status.items()
                if status["session_files"] == 0
            ],
            "sessions": len(sessions),
            "sessions_by_source": dict(source_sessions),
            "subagent_sessions": sum(subagent_sessions.values()),
            "subagent_sessions_by_source": dict(subagent_sessions),
            "agent_runs": len(sessions) + sum(subagent_sessions.values()),
            "projects": len(project_keys),
            "active_days": len(active_dates),
            "user_messages": len(all_users),
        },
        "rhythm": {
            "most_common_start_hour": most_common_hour[0],
            "sessions_started_in_that_hour": most_common_hour[1],
            "most_common_start_weekday": most_common_weekday[0],
            "sessions_started_that_weekday": most_common_weekday[1],
            "median_active_segment_minutes": median_duration,
            "longest_active_segment_minutes": round(longest_segment[0], 1) if longest_segment else 0,
            "longest_active_segment_started_at": longest_segment[1].isoformat() if longest_segment else None,
            "activity_by_date": [
                {"date": date, "messages": messages}
                for date, messages in sorted(activity_by_date.items())
            ],
        },
        "prompts": {
            "median_characters": median_prompt,
            "mean_characters": mean_prompt,
            "under_20_characters": sum(length < 20 for length in prompt_lengths),
            "under_50_characters": sum(length < 50 for length in prompt_lengths),
            "phrase_counts": phrase_stats,
        },
        "behavior": {
            "plan_mode_sessions": plan_sessions,
            "tool_categories": dict(tool_counts.most_common()),
            "models": dict(model_counts.most_common()),
        },
        "tokens": {
            "status": "verified" if sum(token_usage.values()) else "unavailable",
            "total_tokens": token_usage["total_tokens"]
            or (
                token_usage["input_tokens"]
                + token_usage["cached_input_tokens"]
                + token_usage["cache_write_input_tokens"]
                + token_usage["output_tokens"]
                + token_usage["reasoning_output_tokens"]
            ),
            "input_tokens": token_usage["input_tokens"],
            "cached_input_tokens": token_usage["cached_input_tokens"],
            "cache_write_input_tokens": token_usage["cache_write_input_tokens"],
            "output_tokens": token_usage["output_tokens"],
            "reasoning_output_tokens": token_usage["reasoning_output_tokens"],
            "scope": "All main and subagent sessions with user activity in the selected range.",
        },
    }


def parse_days(value: str) -> Optional[int]:
    if value == "all":
        return None
    try:
        days = int(value)
    except ValueError as error:
        raise argparse.ArgumentTypeError("days must be a positive integer or 'all'") from error
    if days <= 0:
        raise argparse.ArgumentTypeError("days must be positive")
    return days


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=parse_days, default=30)
    parser.add_argument("--timezone", default=detect_timezone_name())
    parser.add_argument("--claude-root", type=Path, default=CLAUDE_ROOT)
    parser.add_argument("--codex-root", type=Path, default=CODEX_ROOT)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    metrics = build_metrics(
        args.days,
        args.timezone,
        claude_root=args.claude_root,
        codex_root=args.codex_root,
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(metrics, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"output": str(args.output), "sessions": metrics["coverage"]["sessions"]}))


if __name__ == "__main__":
    main()
