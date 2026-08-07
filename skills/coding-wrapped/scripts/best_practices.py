#!/usr/bin/env python3
"""Load, validate, and match the Coding Wrapped practice catalog."""

from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


SKILL_ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = SKILL_ROOT / "references" / "coding-best-practices.md"
JSON_BLOCK = re.compile(r"```json\s*(\{.*?\})\s*```", re.DOTALL)
SLUG = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")
SOURCE_TIERS = {"official", "practitioner", "expert-conversation"}
CONFIDENCE_LEVELS = {"high", "medium"}
MATCH_MODES = {"automatic", "reserve"}
BEHAVIOR_TAGS = {
    "short-prompts",
    "repeated-corrections",
    "continuation-loops",
    "long-runs",
    "subagent-use",
    "high-tool-use",
    "browser-work",
    "verification-language",
    "plan-use",
    "low-plan-use",
    "many-projects",
    "general",
}


def _localized(value: Any, field: str) -> None:
    if not isinstance(value, dict):
        raise ValueError(f"{field} must contain zh and en text")
    for locale in ("zh", "en"):
        text = value.get(locale)
        if not isinstance(text, str) or not text.strip():
            raise ValueError(f"{field}.{locale} must be a non-empty string")


def _valid_date(value: Any, field: str, allow_null: bool = False) -> None:
    if value is None and allow_null:
        return
    if not isinstance(value, str):
        raise ValueError(f"{field} must be an ISO date")
    try:
        parsed = date.fromisoformat(value)
    except ValueError as error:
        raise ValueError(f"{field} must be an ISO date") from error
    if parsed > date.today():
        raise ValueError(f"{field} may not be in the future")


def load_catalog(path: Path = CATALOG_PATH) -> dict[str, Any]:
    """Parse the strict JSON fences embedded in the Markdown reference."""
    blocks = []
    for match in JSON_BLOCK.finditer(path.read_text(encoding="utf-8")):
        try:
            blocks.append(json.loads(match.group(1)))
        except json.JSONDecodeError as error:
            raise ValueError(
                f"Invalid JSON block in {path.name}: {error}"
            ) from error

    registries = [block for block in blocks if block.get("kind") == "source_registry"]
    practices = [block for block in blocks if block.get("kind") == "practice"]
    if len(registries) != 1:
        raise ValueError("Practice catalog needs exactly one source_registry block")
    catalog = {
        "schema_version": registries[0].get("schema_version"),
        "checked_at": registries[0].get("checked_at"),
        "sources": registries[0].get("sources"),
        "practices": practices,
    }
    validate_catalog(catalog)
    return catalog


def validate_catalog(catalog: dict[str, Any]) -> None:
    """Reject ambiguous or unverifiable catalog entries."""
    if not isinstance(catalog.get("schema_version"), str):
        raise ValueError("Catalog schema_version is required")
    _valid_date(catalog.get("checked_at"), "catalog.checked_at")

    sources = catalog.get("sources")
    practices = catalog.get("practices")
    if not isinstance(sources, list) or len(sources) < 3:
        raise ValueError("Catalog needs at least three sources")
    if not isinstance(practices, list) or len(practices) < 40:
        raise ValueError("Catalog needs at least forty practices")

    source_ids: set[str] = set()
    for source in sources:
        if not isinstance(source, dict):
            raise ValueError("Each source must be an object")
        source_id = source.get("id")
        if (
            not isinstance(source_id, str)
            or not SLUG.fullmatch(source_id)
            or source_id in source_ids
        ):
            raise ValueError("Source IDs must be unique lower-case slugs")
        for field in ("title", "publisher", "type"):
            if not isinstance(source.get(field), str) or not source[field].strip():
                raise ValueError(f"Source {source_id} needs {field}")
        parsed_url = urlparse(str(source.get("url", "")))
        if parsed_url.scheme != "https" or not parsed_url.netloc:
            raise ValueError(f"Source {source_id} needs a direct HTTPS URL")
        if source.get("source_tier") not in SOURCE_TIERS:
            raise ValueError(f"Source {source_id} has an invalid source_tier")
        _valid_date(
            source.get("published_at"),
            f"source.{source_id}.published_at",
            allow_null=True,
        )
        _valid_date(source.get("checked_at"), f"source.{source_id}.checked_at")
        claims = source.get("supporting_claims")
        topics = source.get("topics")
        if not isinstance(claims, list) or not claims or not all(
            isinstance(claim, str) and claim.strip() for claim in claims
        ):
            raise ValueError(f"Source {source_id} needs supporting_claims")
        if not isinstance(topics, list) or not topics or not all(
            isinstance(topic, str) and topic.strip() for topic in topics
        ):
            raise ValueError(f"Source {source_id} needs topics")
        source_ids.add(source_id)

    practice_ids: set[str] = set()
    used_sources: set[str] = set()
    for practice in practices:
        practice_id = practice.get("id") if isinstance(practice, dict) else None
        if (
            not isinstance(practice_id, str)
            or not SLUG.fullmatch(practice_id)
            or practice_id in practice_ids
        ):
            raise ValueError("Practice IDs must be unique lower-case slugs")
        _localized(practice.get("title"), f"practice.{practice_id}.title")
        _localized(practice.get("rationale"), f"practice.{practice_id}.rationale")
        _localized(practice.get("action"), f"practice.{practice_id}.action")
        family = practice.get("family")
        if not isinstance(family, str) or not SLUG.fullmatch(family):
            raise ValueError(f"Practice {practice_id} needs a family slug")
        if practice.get("match_mode") not in MATCH_MODES:
            raise ValueError(f"Practice {practice_id} has an invalid match_mode")
        tags = practice.get("behavior_tags")
        if not isinstance(tags, list) or not tags or any(
            tag not in BEHAVIOR_TAGS for tag in tags
        ):
            raise ValueError(f"Practice {practice_id} has invalid behavior_tags")
        hints = practice.get("signal_hints")
        if not isinstance(hints, list) or not hints or not all(
            isinstance(hint, str) and hint.strip() for hint in hints
        ):
            raise ValueError(f"Practice {practice_id} needs signal_hints")
        references = practice.get("source_ids")
        if not isinstance(references, list) or not references or any(
            source_id not in source_ids for source_id in references
        ):
            raise ValueError(f"Practice {practice_id} has unknown source_ids")
        if practice.get("confidence") not in CONFIDENCE_LEVELS:
            raise ValueError(f"Practice {practice_id} has invalid confidence")
        _valid_date(
            practice.get("last_verified"),
            f"practice.{practice_id}.last_verified",
        )
        practice_ids.add(practice_id)
        used_sources.update(references)

    orphan_sources = source_ids - used_sources
    if orphan_sources:
        raise ValueError(f"Catalog has orphan sources: {sorted(orphan_sources)}")


def sources_payload(catalog: dict[str, Any] | None = None) -> dict[str, Any]:
    """Return the runtime URL allow-list derived from the Markdown catalog."""
    current = catalog or load_catalog()
    return {
        "schema_version": current["schema_version"],
        "checked_at": current["checked_at"],
        "derived_from": "references/coding-best-practices.md",
        "sources": current["sources"],
    }


def _phrase_count(metrics: dict[str, Any], fragments: tuple[str, ...]) -> int:
    rows = metrics.get("prompts", {}).get("phrase_counts", [])
    total = 0
    for row in rows if isinstance(rows, list) else []:
        phrase = str(row.get("phrase", "")).lower()
        if any(fragment in phrase for fragment in fragments):
            total += int(row.get("messages", row.get("occurrences", 0)) or 0)
    return total


def detect_behavior_signals(metrics: dict[str, Any]) -> list[dict[str, Any]]:
    """Derive only aggregate-safe signals that the scanner can actually prove."""
    coverage = metrics.get("coverage", {})
    rhythm = metrics.get("rhythm", {})
    prompts = metrics.get("prompts", {})
    behavior = metrics.get("behavior", {})
    messages = max(int(coverage.get("user_messages", 0) or 0), 1)
    sessions = max(int(coverage.get("sessions", 0) or 0), 1)
    signals: list[dict[str, Any]] = []

    def add(tag: str, evidence: dict[str, Any]) -> None:
        signals.append({"tag": tag, "evidence": evidence})

    under_50 = int(prompts.get("under_50_characters", 0) or 0)
    median_prompt = int(prompts.get("median_characters", 0) or 0)
    if median_prompt and (median_prompt <= 60 or under_50 / messages >= 0.35):
        add(
            "short-prompts",
            {"median_characters": median_prompt, "under_50_messages": under_50},
        )

    corrections = _phrase_count(metrics, ("重新", "again", "重做", "redo"))
    if corrections >= 3:
        add("repeated-corrections", {"matched_messages": corrections})

    continues = _phrase_count(metrics, ("continue", "继续"))
    if continues >= 2:
        add("continuation-loops", {"matched_messages": continues})

    longest_run = float(rhythm.get("longest_active_segment_minutes", 0) or 0)
    if longest_run >= 75:
        add("long-runs", {"longest_active_segment_minutes": longest_run})

    subagents = int(coverage.get("subagent_sessions", 0) or 0)
    if subagents > 0:
        add("subagent-use", {"subagent_sessions": subagents})

    tools = behavior.get("tool_categories", {})
    tool_total = sum(
        int(value or 0) for value in tools.values()
    ) if isinstance(tools, dict) else 0
    if tool_total >= messages * 2:
        add("high-tool-use", {"tool_actions": tool_total, "user_messages": messages})
    if isinstance(tools, dict) and int(tools.get("browser", 0) or 0) > 0:
        add("browser-work", {"browser_actions": int(tools.get("browser", 0) or 0)})

    verification = _phrase_count(metrics, ("测试", "test", "检查", "verify"))
    if verification > 0:
        add("verification-language", {"matched_messages": verification})

    plan_sessions = int(behavior.get("plan_mode_sessions", 0) or 0)
    if plan_sessions > 0 and plan_sessions / sessions >= 0.2:
        add("plan-use", {"plan_mode_sessions": plan_sessions})
    elif sessions >= 5 and plan_sessions / sessions < 0.2:
        add(
            "low-plan-use",
            {"plan_mode_sessions": plan_sessions, "sessions": sessions},
        )

    projects = int(coverage.get("projects", 0) or 0)
    if projects >= 3:
        add("many-projects", {"projects": projects})

    if not signals:
        add("general", {"reason": "no strong aggregate behavior signal"})
    return signals


def select_practices(
    metrics: dict[str, Any],
    limit: int = 6,
    catalog: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Select a small, deterministic practice set for a model generation brief."""
    current = catalog or load_catalog()
    signals = detect_behavior_signals(metrics)
    active_tags = {signal["tag"] for signal in signals}
    source_tiers = {
        source["id"]: source["source_tier"] for source in current["sources"]
    }

    ranked = []
    for order, practice in enumerate(current["practices"]):
        if practice["match_mode"] != "automatic":
            continue
        overlap = active_tags.intersection(practice["behavior_tags"])
        if not overlap and "general" not in practice["behavior_tags"]:
            continue
        official = any(
            source_tiers[source_id] == "official"
            for source_id in practice["source_ids"]
        )
        score = len(overlap) * 10 + (2 if official else 0)
        if practice["confidence"] == "high":
            score += 1
        ranked.append((score, -order, practice))

    selected = []
    selected_families: set[str] = set()
    for _, _, practice in sorted(ranked, reverse=True):
        if practice["family"] in selected_families:
            continue
        selected.append(practice)
        selected_families.add(practice["family"])
        if len(selected) >= limit:
            break
    source_ids = {
        source_id
        for practice in selected
        for source_id in practice["source_ids"]
    }
    return {
        "observed_behavior_signals": signals,
        "candidate_practices": selected,
        "sources": [
            source for source in current["sources"] if source["id"] in source_ids
        ],
    }


def practice_map(catalog: dict[str, Any] | None = None) -> dict[str, dict[str, Any]]:
    current = catalog or load_catalog()
    return {practice["id"]: practice for practice in current["practices"]}


def source_ids_for_practice(
    practice_id: str,
    catalog: dict[str, Any] | None = None,
) -> list[str]:
    practice = practice_map(catalog).get(practice_id)
    if practice is None:
        raise ValueError(f"Unknown practice ID: {practice_id}")
    return list(practice["source_ids"])
