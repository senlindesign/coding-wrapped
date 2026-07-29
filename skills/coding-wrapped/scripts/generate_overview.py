#!/usr/bin/env python3
"""Prepare and persist the bilingual Coding Overview."""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from common import (
    ensure_state,
    read_json,
    resolve_home,
    sanitize_metrics,
    write_json_atomic,
)


def build_brief(home: Path) -> dict[str, Any]:
    paths = ensure_state(home)
    config = read_json(paths["config"])
    locale = config.get("profile", {}).get("default_locale", "en")
    return {
        "schema_version": "1.0.0",
        "task": "Write one concise behavior overview and up to three recommendations.",
        "privacy": "Use only the supplied aggregates and source IDs.",
        "requirements": {
            "locale": locale,
            "summary": {
                "sentences": 2,
                "representative_facts": {"min": 2, "max": 3},
                "include_behavior_interpretation": True,
                "do_not_repeat_every_metric": True,
                "target_length": {
                    "zh_characters": {"min": 45, "max": 75},
                    "en_words": {"min": 18, "max": 34},
                },
                "layout_goal": "Usually about two lines on the desktop dashboard.",
            },
            "recommendations_max": 3,
            "no_score": True,
            "no_ranking": True,
            "source_ids_must_exist": True,
        },
        "metrics": sanitize_metrics(
            read_json(paths["metrics"] / "dashboard-30d.json")
        ),
        "sources": read_json(paths["sources"])["sources"],
    }


def validate_summary(summary: str, locale: str) -> None:
    compact = summary.strip()
    if locale == "zh":
        sentence_count = len(
            [part for part in re.split(r"[。！？]+", compact) if part.strip()]
        )
        length = len(re.sub(r"\s+", "", compact))
        maximum = 90
        unit = "non-space characters"
    else:
        sentence_count = len(
            [
                part
                for part in re.split(r"(?<=[.!?])(?:\s+|$)", compact)
                if part.strip()
            ]
        )
        length = len(re.findall(r"\b[\w'-]+\b", compact, flags=re.UNICODE))
        maximum = 45
        unit = "words"
    if sentence_count > 2:
        raise ValueError("Overview summary may contain at most two sentences")
    if length > maximum:
        raise ValueError(
            f"Overview summary is too long; keep it within {maximum} {unit}"
        )


def validate_copy(copy: Any, allowed_sources: set[str], locale: str) -> None:
    if not isinstance(copy, dict):
        raise ValueError("Overview copy must be an object")
    localized = copy.get(locale)
    if not isinstance(localized, dict):
        raise ValueError(f"Missing {locale} overview")
    for field in ("eyebrow", "title", "summary"):
        if not isinstance(localized.get(field), str) or not localized[field].strip():
            raise ValueError(f"Missing {locale}.{field}")
    validate_summary(localized["summary"], locale)
    recommendations = localized.get("recommendations")
    if not isinstance(recommendations, list) or len(recommendations) > 3:
        raise ValueError("The overview may contain up to three recommendations")
    for recommendation in recommendations:
        if any(
            not isinstance(recommendation.get(field), str)
            or not recommendation[field].strip()
            for field in ("id", "title", "body")
        ):
            raise ValueError("Recommendations need id, title, and body")
        source_ids = recommendation.get("source_ids", [])
        if (
            not isinstance(source_ids, list)
            or not source_ids
            or any(source_id not in allowed_sources for source_id in source_ids)
        ):
            raise ValueError("Every recommendation needs allow-listed source IDs")


def persist(home: Path, payload: dict[str, Any]) -> dict[str, Any]:
    paths = ensure_state(home)
    metrics = read_json(paths["metrics"] / "dashboard-30d.json")
    sources = read_json(paths["sources"])
    config = read_json(paths["config"])
    locale = config.get("profile", {}).get("default_locale", "en")
    allowed_sources = {
        source["id"]
        for source in sources.get("sources", [])
        if isinstance(source, dict) and isinstance(source.get("id"), str)
    }
    copy = payload.get("copy")
    validate_copy(copy, allowed_sources, locale)

    previous = read_json(paths["overview"])
    generated_at = datetime.now(timezone.utc).isoformat()
    batch_id = f"overview-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')}"
    coverage = metrics.get("coverage", {})
    watermark = {
        "snapshot_generated_at": metrics.get("analysis", {}).get(
            "generated_at", generated_at
        ),
        "sessions": int(coverage.get("sessions", 0)),
        "user_messages": int(coverage.get("user_messages", 0)),
    }
    history = list(previous.get("update_history", []))
    history.append(
        {
            "batch_id": batch_id,
            "generated_at": generated_at,
            "mode": "coding-wrapped-skill",
            "model_used": True,
            "input_watermark": watermark,
        }
    )
    next_overview = {
        **previous,
        "status": "ready",
        "generated_at": generated_at,
        "input_watermark": watermark,
        "generation": {
            "batch_id": batch_id,
            "mode": "coding-wrapped-skill",
            "model_used": True,
        },
        "last_update_attempt": {
            "checked_at": generated_at,
            "result": "updated",
            "reason": "agent-generated",
        },
        "update_history": history[-20:],
        "copy": copy,
    }
    write_json_atomic(paths["overview"], next_overview)
    return {"batch_id": batch_id, "overview": str(paths["overview"])}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--home", type=Path)
    subparsers = parser.add_subparsers(dest="command", required=True)
    brief = subparsers.add_parser("brief")
    brief.add_argument("--output", type=Path, required=True)
    save = subparsers.add_parser("persist")
    save.add_argument("--input", type=Path, required=True)
    args = parser.parse_args()

    home = resolve_home(args.home)
    if args.command == "brief":
        write_json_atomic(args.output, build_brief(home))
        result = {"brief": str(args.output), "raw_transcripts": False}
    else:
        payload = json.loads(args.input.read_text(encoding="utf-8"))
        result = persist(home, payload)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
