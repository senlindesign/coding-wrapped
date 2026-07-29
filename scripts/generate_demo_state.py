#!/usr/bin/env python3
"""Replace bundled seed data with deterministic, explicitly synthetic data."""

from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SKILL_ROOT = ROOT / "skills" / "coding-wrapped"
DEFAULT_ROOT = SKILL_ROOT / "assets" / "default-state"
FRONTEND_ROOT = SKILL_ROOT / "assets" / "frontend-template"
GENERATED_AT = "2026-01-31T12:00:00+00:00"


ACTIVITY_7D = [
    {"date": "2026-01-25", "messages": 12},
    {"date": "2026-01-26", "messages": 18},
    {"date": "2026-01-27", "messages": 9},
    {"date": "2026-01-29", "messages": 22},
    {"date": "2026-01-30", "messages": 15},
    {"date": "2026-01-31", "messages": 11},
]

ACTIVITY_30D = [
    {"date": "2026-01-02", "messages": 8},
    {"date": "2026-01-04", "messages": 13},
    {"date": "2026-01-07", "messages": 17},
    {"date": "2026-01-09", "messages": 9},
    {"date": "2026-01-11", "messages": 21},
    {"date": "2026-01-13", "messages": 14},
    {"date": "2026-01-16", "messages": 19},
    {"date": "2026-01-18", "messages": 28},
    *ACTIVITY_7D,
]

ACTIVITY_ALL = [
    {"date": "2025-10-03", "messages": 12},
    {"date": "2025-10-18", "messages": 24},
    {"date": "2025-11-02", "messages": 15},
    {"date": "2025-11-21", "messages": 31},
    {"date": "2025-12-04", "messages": 18},
    {"date": "2025-12-19", "messages": 27},
    *ACTIVITY_30D,
]


def write_json(path: Path, payload: Any) -> None:
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def phrase_counts(scale: float) -> list[dict[str, Any]]:
    values = [
        ("continue / 继续", 14, 14),
        ("帮我 / help me", 19, 17),
        ("看一下", 16, 15),
        ("先", 13, 12),
        ("不要 / 别", 11, 10),
        ("直接", 9, 9),
        ("测试 / test", 7, 7),
        ("检查 / verify", 5, 5),
        ("重新 / again", 3, 3),
    ]
    return [
        {
            "phrase": phrase,
            "occurrences": max(1, round(occurrences * scale)),
            "messages": max(1, round(messages * scale)),
        }
        for phrase, occurrences, messages in values
    ]


def metrics(
    days: int | str,
    *,
    sessions: int,
    subagents: int,
    projects: int,
    active_days: int,
    messages: int,
    longest: float,
    activity: list[dict[str, Any]],
    scale: float,
) -> dict[str, Any]:
    claude_sessions = max(1, round(sessions * 0.4))
    codex_sessions = sessions - claude_sessions
    claude_subagents = max(1, round(subagents * 0.3))
    codex_subagents = subagents - claude_subagents
    total_tokens = round(12_845_300 * scale)
    input_tokens = round(8_134_200 * scale)
    cached_tokens = round(5_462_100 * scale)
    output_tokens = round(1_086_400 * scale)
    reasoning_tokens = round(214_600 * scale)
    cache_write_tokens = round(372_000 * scale)
    return {
        "analysis": {
            "generated_at": GENERATED_AT,
            "days": days,
            "timezone": "UTC",
            "privacy": (
                "Synthetic demo aggregates only. "
                "No user history was used to create this seed."
            ),
            "data_origin": "synthetic-demo",
        },
        "coverage": {
            "sessions": sessions,
            "sessions_by_source": {
                "claude-code": claude_sessions,
                "codex": codex_sessions,
            },
            "subagent_sessions": subagents,
            "subagent_sessions_by_source": {
                "claude-code": claude_subagents,
                "codex": codex_subagents,
            },
            "agent_runs": sessions + subagents,
            "projects": projects,
            "active_days": active_days,
            "user_messages": messages,
        },
        "rhythm": {
            "most_common_start_hour": 21,
            "sessions_started_in_that_hour": max(2, round(sessions * 0.3)),
            "most_common_start_weekday": "Tuesday",
            "sessions_started_that_weekday": max(2, round(sessions * 0.28)),
            "median_active_segment_minutes": round(24.0 * max(0.7, scale), 1),
            "longest_active_segment_minutes": longest,
            "longest_active_segment_started_at": (
                "2026-01-18T21:10:00+00:00"
            ),
            "activity_by_date": activity,
        },
        "prompts": {
            "median_characters": 42,
            "mean_characters": 186,
            "under_20_characters": round(messages * 0.24),
            "under_50_characters": round(messages * 0.55),
            "phrase_counts": phrase_counts(scale),
        },
        "behavior": {
            "plan_mode_sessions": max(1, round(sessions * 0.17)),
            "tool_categories": {
                "shell": round(220 * scale),
                "edit": round(164 * scale),
                "read": round(128 * scale),
                "browser": round(76 * scale),
                "search": round(54 * scale),
                "subagent": subagents,
            },
            "models": {
                "claude-sonnet": round(96 * scale),
                "gpt-codex": round(82 * scale),
                "claude-opus": round(31 * scale),
            },
        },
        "tokens": {
            "status": "synthetic-demo",
            "total_tokens": total_tokens,
            "input_tokens": input_tokens,
            "cached_input_tokens": cached_tokens,
            "cache_write_input_tokens": cache_write_tokens,
            "output_tokens": output_tokens,
            "reasoning_output_tokens": reasoning_tokens,
            "scope": "Fictional values bundled only for the first-run preview.",
        },
    }


def build_metrics() -> dict[str, dict[str, Any]]:
    return {
        "7d": metrics(
            7,
            sessions=6,
            subagents=9,
            projects=3,
            active_days=6,
            messages=87,
            longest=84.0,
            activity=ACTIVITY_7D,
            scale=0.42,
        ),
        "30d": metrics(
            30,
            sessions=18,
            subagents=32,
            projects=7,
            active_days=14,
            messages=214,
            longest=126.0,
            activity=ACTIVITY_30D,
            scale=1.0,
        ),
        "all": metrics(
            "all",
            sessions=47,
            subagents=78,
            projects=15,
            active_days=31,
            messages=586,
            longest=147.0,
            activity=ACTIVITY_ALL,
            scale=2.8,
        ),
    }


def update_insights() -> None:
    path = DEFAULT_ROOT / "data" / "insights.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    payload["updated_at"] = GENERATED_AT
    payload["batches"] = [
        {
            "id": "synthetic-demo-2026-01",
            "created_at": GENERATED_AT,
            "source_snapshot": f"dashboard-30d@{GENERATED_AT}",
            "count": 4,
            "generator": "prototype-seed",
        }
    ]

    by_id = {item["id"]: item for item in payload["insights"]}
    for item in payload["insights"]:
        item["batch_id"] = "synthetic-demo-2026-01"
        item["created_at"] = GENERATED_AT

    conductor = by_id["agent-conductor"]
    conductor["evidence"]["values"] = {
        "sessions": 18,
        "subagent_sessions": 32,
    }
    conductor["copy"]["zh"]["title"] = "18 次开场，32 路接力"
    conductor["copy"]["zh"]["subtitle"] = (
        "合成样例中，18 个主会话带出了 32 个子智能体。"
    )
    conductor["copy"]["en"]["title"] = "18 starts, 32 agents in relay"
    conductor["copy"]["en"]["subtitle"] = (
        "In this synthetic demo, 18 main sessions led to 32 subagent runs."
    )

    runner = by_id["night-runner"]
    runner["evidence"]["values"] = {
        "minutes": 126,
        "started_at": "2026-01-18T21:10:00+00:00",
    }
    runner["copy"]["zh"]["title"] = "126 分钟，一路做到底"
    runner["copy"]["zh"]["subtitle"] = (
        "合成样例中，最长活跃段从 21:10 开始，持续了 126 分钟。"
    )
    runner["copy"]["zh"]["rows"][0]["body"] = (
        "21:10 开始，把一条工作线连续推进到底。"
    )
    runner["copy"]["en"]["title"] = "126 minutes, one continuous run"
    runner["copy"]["en"]["subtitle"] = (
        "In this synthetic demo, the longest run began at 9:10 PM."
    )
    runner["copy"]["en"]["rows"][0]["body"] = (
        "Started at 9:10 PM and kept one workstream moving."
    )

    short = by_id["short-commander"]
    short["evidence"]["values"] = {
        "user_messages": 214,
        "under_50_characters": 118,
        "percentage": 55,
    }
    short["copy"]["zh"]["title"] = "55% 消息不到 50 字"
    short["copy"]["zh"]["subtitle"] = (
        "合成样例的 214 条消息里，有 118 条不到 50 字。"
    )
    short["copy"]["en"]["title"] = "55% under 50 characters"
    short["copy"]["en"]["subtitle"] = (
        "In this synthetic demo, 118 of 214 messages were under 50 characters."
    )

    continuing = by_id["continue-button"]
    continuing["evidence"]["values"] = {"messages": 14}
    continuing["copy"]["zh"]["title"] = "14 次「继续」，保持惯性"
    continuing["copy"]["zh"]["subtitle"] = (
        "合成样例中，continue / 继续在 14 条消息里出现。"
    )
    continuing["copy"]["en"]["title"] = "14 “continues”, momentum intact"
    continuing["copy"]["en"]["subtitle"] = (
        "In this synthetic demo, continue / 继续 appeared in 14 messages."
    )

    write_json(path, payload)


def update_overview() -> None:
    path = DEFAULT_ROOT / "data" / "overview.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    watermark = {
        "snapshot_generated_at": GENERATED_AT,
        "sessions": 18,
        "user_messages": 214,
    }
    payload["generated_at"] = GENERATED_AT
    payload["input_watermark"] = copy.deepcopy(watermark)
    payload["generation"] = {
        "batch_id": "overview-synthetic-demo",
        "mode": "synthetic-demo",
        "model_used": False,
    }
    payload["update_history"] = [
        {
            "batch_id": "overview-synthetic-demo",
            "generated_at": GENERATED_AT,
            "mode": "synthetic-demo",
            "model_used": False,
            "input_watermark": copy.deepcopy(watermark),
        }
    ]
    payload["copy"]["zh"]["summary"] = (
        "这是一段合成示例：18 个主会话带出 32 个子智能体，"
        "55% 的输入不到 50 字，最长活跃段为 126 分钟。"
        "它只用来展示 Coding Wrapped 会怎样讲述协作习惯。"
    )
    payload["copy"]["en"]["summary"] = (
        "This is a synthetic example: 18 main sessions led to 32 subagents, "
        "55% of prompts stayed under 50 characters, and the longest run was "
        "126 minutes. It exists only to preview the Coding Wrapped story."
    )
    write_json(path, payload)


def main() -> None:
    config_path = DEFAULT_ROOT / "config.json"
    config = json.loads(config_path.read_text(encoding="utf-8"))
    config["profile"] = {
        "display_name": "ALEX",
        "default_locale": "en",
    }
    config["seed"] = {
        "data_origin": "synthetic-demo",
        "contains_user_history": False,
    }
    write_json(config_path, config)

    for range_id, payload in build_metrics().items():
        for root in (DEFAULT_ROOT / "data", FRONTEND_ROOT / "data"):
            write_json(root / f"dashboard-{range_id}.json", payload)

    update_insights()
    update_overview()
    print("Rebuilt bundled seed data from deterministic synthetic values.")


if __name__ == "__main__":
    main()
