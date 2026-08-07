#!/usr/bin/env python3
"""Shared local-state helpers for Coding Wrapped."""

from __future__ import annotations

import json
import os
import shutil
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Any, Optional, Union
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from best_practices import sources_payload


SKILL_ROOT = Path(__file__).resolve().parents[1]
ASSETS_ROOT = SKILL_ROOT / "assets"
DEFAULT_STATE_ROOT = ASSETS_ROOT / "default-state"
FRONTEND_ROOT = ASSETS_ROOT / "frontend-template"
SOURCE_ILLUSTRATIONS_ROOT = FRONTEND_ROOT / "assets"
DEFAULT_HOME = Path.home() / ".coding-wrapped"

RANGE_DAYS = {
    "7d": 7,
    "30d": 30,
    "all": None,
}

SEED_BATCH_ID = "initial-2026-07-28"
SEED_ILLUSTRATIONS = (
    "agent-orchestra-warm.png",
    "night-runner-blue.png",
    "prompt-machine-pink.png",
    "continue-steps-green.png",
)


def resolve_home(value: Optional[Union[str, Path]] = None) -> Path:
    """Resolve the local state directory without writing to the Skill folder."""
    if value:
        return Path(value).expanduser().resolve()
    configured = os.environ.get("CODING_WRAPPED_HOME")
    if configured:
        return Path(configured).expanduser().resolve()
    return DEFAULT_HOME


def detect_timezone_name() -> str:
    """Return a usable local IANA timezone name, falling back safely to UTC."""
    candidates = []
    configured = os.environ.get("TZ")
    if configured:
        candidates.append(configured.lstrip(":"))

    localtime = Path("/etc/localtime")
    try:
        target = localtime.resolve()
        marker = "zoneinfo/"
        if marker in str(target):
            candidates.append(str(target).split(marker, 1)[1])
    except OSError:
        pass

    timezone_file = Path("/etc/timezone")
    try:
        candidates.append(timezone_file.read_text(encoding="utf-8").strip())
    except OSError:
        pass

    local_name = datetime.now().astimezone().tzname()
    if local_name:
        candidates.append(local_name)

    for candidate in candidates:
        if not candidate:
            continue
        try:
            ZoneInfo(candidate)
            return candidate
        except ZoneInfoNotFoundError:
            continue
    return "UTC"


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def sanitize_metrics(metrics: Any) -> dict[str, Any]:
    """Keep only aggregate fields that are safe for UI, model briefs, and exports."""
    if not isinstance(metrics, dict):
        return {}
    allowed = {
        "analysis": {
            "generated_at",
            "days",
            "timezone",
            "privacy",
        },
        "coverage": {
            "source_status",
            "available_sources",
            "missing_sources",
            "sessions",
            "sessions_by_source",
            "subagent_sessions",
            "subagent_sessions_by_source",
            "agent_runs",
            "projects",
            "active_days",
            "user_messages",
        },
        "rhythm": {
            "most_common_start_hour",
            "sessions_started_in_that_hour",
            "most_common_start_weekday",
            "sessions_started_that_weekday",
            "median_active_segment_minutes",
            "longest_active_segment_minutes",
            "longest_active_segment_started_at",
            "activity_by_date",
        },
        "prompts": {
            "median_characters",
            "mean_characters",
            "under_20_characters",
            "under_50_characters",
            "phrase_counts",
        },
        "behavior": {
            "plan_mode_sessions",
            "tool_categories",
            "models",
        },
        "tokens": {
            "status",
            "total_tokens",
            "input_tokens",
            "cached_input_tokens",
            "cache_write_input_tokens",
            "output_tokens",
            "reasoning_output_tokens",
            "scope",
        },
    }
    sanitized = {}
    for section, keys in allowed.items():
        source = metrics.get(section)
        if isinstance(source, dict):
            sanitized[section] = {
                key: source[key]
                for key in keys
                if key in source
            }
    return sanitized


def write_json_atomic(path: Path, payload: Any) -> None:
    """Write JSON atomically so interrupted generations do not corrupt state."""
    path.parent.mkdir(parents=True, exist_ok=True)
    handle, temporary_name = tempfile.mkstemp(
        prefix=f".{path.name}.",
        suffix=".tmp",
        dir=path.parent,
    )
    temporary_path = Path(temporary_name)
    try:
        with os.fdopen(handle, "w", encoding="utf-8") as output:
            json.dump(payload, output, ensure_ascii=False, indent=2)
            output.write("\n")
        temporary_path.replace(path)
    except Exception:
        temporary_path.unlink(missing_ok=True)
        raise


def state_paths(home: Path) -> dict[str, Path]:
    data = home / "data"
    return {
        "config": home / "config.json",
        "insights": data / "insights.json",
        "overview": data / "overview.json",
        "sources": data / "sources.json",
        "metrics": data / "metrics",
        "images": home / "assets" / "generated-images",
        "exports": home / "exports",
    }


def ensure_state(home: Path) -> dict[str, Path]:
    """Initialize missing state while preserving every existing user file."""
    paths = state_paths(home)
    paths["metrics"].mkdir(parents=True, exist_ok=True)
    paths["images"].mkdir(parents=True, exist_ok=True)
    paths["exports"].mkdir(parents=True, exist_ok=True)

    seed_files = {
        paths["config"]: DEFAULT_STATE_ROOT / "config.json",
        paths["insights"]: DEFAULT_STATE_ROOT / "data" / "insights.json",
        paths["overview"]: DEFAULT_STATE_ROOT / "data" / "overview.json",
        paths["sources"]: DEFAULT_STATE_ROOT / "data" / "sources.json",
    }
    for destination, source in seed_files.items():
        if not destination.exists():
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)

    # Keep the curated source registry current for existing installations while
    # preserving unknown historical entries referenced by older insight cards.
    canonical_sources = sources_payload()
    local_sources = read_json(paths["sources"])
    canonical_ids = {
        source["id"] for source in canonical_sources.get("sources", [])
    }
    historical_sources = [
        source
        for source in local_sources.get("sources", [])
        if isinstance(source, dict)
        and isinstance(source.get("id"), str)
        and source["id"] not in canonical_ids
    ]
    merged_sources = {
        **canonical_sources,
        "sources": [
            *canonical_sources.get("sources", []),
            *historical_sources,
        ],
    }
    if merged_sources != local_sources:
        write_json_atomic(paths["sources"], merged_sources)

    for range_id in RANGE_DAYS:
        destination = paths["metrics"] / f"dashboard-{range_id}.json"
        source = DEFAULT_STATE_ROOT / "data" / f"dashboard-{range_id}.json"
        if not destination.exists():
            shutil.copy2(source, destination)

    seed_image_root = paths["images"] / SEED_BATCH_ID
    seed_image_root.mkdir(parents=True, exist_ok=True)
    for filename in SEED_ILLUSTRATIONS:
        destination = seed_image_root / filename
        if not destination.exists():
            shutil.copy2(SOURCE_ILLUSTRATIONS_ROOT / filename, destination)

    return paths


def safe_relative_image_path(value: str) -> Path:
    candidate = Path(value)
    if candidate.is_absolute() or ".." in candidate.parts:
        raise ValueError("Image path must be a safe relative path")
    return candidate
