#!/usr/bin/env python3
"""Prepare sanitized generation briefs and persist four-insight batches."""

from __future__ import annotations

import argparse
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from common import (
    SEED_ILLUSTRATIONS,
    SOURCE_ILLUSTRATIONS_ROOT,
    ensure_state,
    read_json,
    resolve_home,
    safe_relative_image_path,
    sanitize_metrics,
    write_json_atomic,
)


THEMES = ("warm", "blue", "pink", "green")
REQUIRED_ROW_KEYS = ("you_did", "agent_did", "your_style")


def generation_brief(home: Path) -> dict[str, Any]:
    paths = ensure_state(home)
    metrics = read_json(paths["metrics"] / "dashboard-30d.json")
    sources = read_json(paths["sources"])
    config = read_json(paths["config"])
    locale = config.get("profile", {}).get("default_locale", "en")
    return {
        "schema_version": "1.0.0",
        "privacy": {
            "allowed": [
                "aggregate counts",
                "rounded/grouped timestamps",
                "approved short phrase counts",
                "anonymous project counts",
            ],
            "forbidden": [
                "raw transcripts",
                "source code",
                "project or customer names",
                "local paths",
                "secrets",
            ],
        },
        "requirements": {
            "count": 4,
            "locale": locale,
            "themes": list(THEMES),
            "different_compositions": True,
            "maximum_center_hub_compositions": 1,
            "source_ids_must_exist": True,
        },
        "metrics": sanitize_metrics(metrics),
        "sources": sources["sources"],
    }


def validate_localized_copy(copy: Any) -> None:
    required = ("profile_title", "title", "subtitle", "tip", "image_alt")
    if not isinstance(copy, dict) or any(
        not isinstance(copy.get(key), str) or not copy[key].strip()
        for key in required
    ):
        raise ValueError("Each locale needs complete title, subtitle, tip, and alt text")
    rows = copy.get("rows")
    if not isinstance(rows, list) or len(rows) != 3:
        raise ValueError("Each locale needs exactly three behavior rows")
    keys = tuple(row.get("key") for row in rows if isinstance(row, dict))
    if keys != REQUIRED_ROW_KEYS:
        raise ValueError("Behavior rows must be you_did, agent_did, your_style")
    for row in rows:
        if not isinstance(row.get("label"), str) or not isinstance(row.get("body"), str):
            raise ValueError("Each behavior row needs a label and body")


def validate_batch(
    payload: Any,
    allowed_sources: set[str],
    locale: str,
) -> list[dict[str, Any]]:
    insights = payload.get("insights") if isinstance(payload, dict) else None
    if not isinstance(insights, list) or len(insights) != 4:
        raise ValueError("Insight batches must contain exactly four items")

    seen_ids: set[str] = set()
    seen_compositions: set[str] = set()
    center_hub_count = 0
    validated = []
    for item in insights:
        if not isinstance(item, dict):
            raise ValueError("Each insight must be an object")
        insight_id = item.get("id")
        if (
            not isinstance(insight_id, str)
            or not re.fullmatch(r"[a-z0-9-]+", insight_id)
            or insight_id in seen_ids
        ):
            raise ValueError("Insight IDs must be unique lower-case slugs")
        theme = item.get("theme")
        if theme not in THEMES:
            raise ValueError("Each insight must use one approved theme")
        composition = item.get("composition")
        if not isinstance(composition, str) or not composition.strip():
            raise ValueError("Each insight needs a composition name")
        if composition in seen_compositions:
            raise ValueError("All four insights must use different compositions")
        if "hub" in composition.lower() or "network" in composition.lower():
            center_hub_count += 1
        source_ids = item.get("source_ids", [])
        if (
            not isinstance(source_ids, list)
            or any(source_id not in allowed_sources for source_id in source_ids)
        ):
            raise ValueError("Every source ID must exist in sources.json")
        validate_localized_copy((item.get("copy") or {}).get(locale))
        seen_ids.add(insight_id)
        seen_compositions.add(composition)
        validated.append(item)

    if center_hub_count > 1:
        raise ValueError("At most one insight may use a center-hub composition")
    return validated


def resolve_source_image(item: dict[str, Any], index: int) -> Path:
    supplied = item.get("image_source")
    if isinstance(supplied, str) and supplied.strip():
        candidate = Path(supplied).expanduser().resolve()
        if not candidate.is_file():
            raise ValueError(f"Image source does not exist: {candidate}")
        return candidate
    return SOURCE_ILLUSTRATIONS_ROOT / SEED_ILLUSTRATIONS[index]


def persist_batch(home: Path, payload: dict[str, Any]) -> dict[str, Any]:
    paths = ensure_state(home)
    source_state = read_json(paths["sources"])
    config = read_json(paths["config"])
    locale = config.get("profile", {}).get("default_locale", "en")
    allowed_sources = {
        source["id"]
        for source in source_state.get("sources", [])
        if isinstance(source, dict) and isinstance(source.get("id"), str)
    }
    insights = validate_batch(payload, allowed_sources, locale)
    state = read_json(paths["insights"])
    created_at = datetime.now(timezone.utc).isoformat()
    batch_id = f"batch-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')}"
    image_root = paths["images"] / batch_id
    image_root.mkdir(parents=True, exist_ok=False)

    persisted = []
    for index, item in enumerate(insights):
        source_image = resolve_source_image(item, index)
        suffix = source_image.suffix.lower()
        if suffix not in {".png", ".jpg", ".jpeg", ".webp"}:
            raise ValueError("Insight images must be PNG, JPG, or WebP")
        filename = f"{index + 1:02d}-{item['id']}{suffix}"
        shutil.copy2(source_image, image_root / filename)
        persisted.append(
            {
                "id": f"{item['id']}-{batch_id}",
                "batch_id": batch_id,
                "created_at": created_at,
                "theme": item["theme"],
                "composition": item["composition"],
                "image": f"/generated-images/{batch_id}/{filename}",
                "source_ids": item.get("source_ids", []),
                "evidence": item.get("evidence", {}),
                "copy": item["copy"],
            }
        )

    existing_batches = state.setdefault("batches", [])
    existing_insights = state.setdefault("insights", [])
    seed_only = (
        len(existing_batches) == 1
        and existing_batches[0].get("generator") == "prototype-seed"
    )
    if seed_only:
        existing_batches.clear()
        existing_insights.clear()

    state["updated_at"] = created_at
    existing_batches.append(
        {
            "id": batch_id,
            "created_at": created_at,
            "source_snapshot": payload.get("source_snapshot", "dashboard-30d"),
            "count": 4,
            "generator": payload.get("generator", "coding-wrapped-skill"),
        }
    )
    existing_insights.extend(persisted)
    write_json_atomic(paths["insights"], state)
    return {
        "batch_id": batch_id,
        "count": 4,
        "insights_file": str(paths["insights"]),
        "images": str(image_root),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--home", type=Path)
    subparsers = parser.add_subparsers(dest="command", required=True)

    brief_parser = subparsers.add_parser(
        "brief", help="Write a sanitized generation brief"
    )
    brief_parser.add_argument("--output", type=Path, required=True)

    persist_parser = subparsers.add_parser(
        "persist", help="Validate and save exactly four generated insights"
    )
    persist_parser.add_argument("--input", type=Path, required=True)

    args = parser.parse_args()
    home = resolve_home(args.home)

    if args.command == "brief":
        payload = generation_brief(home)
        write_json_atomic(args.output, payload)
        result = {"brief": str(args.output), "raw_transcripts": False}
    else:
        payload = json.loads(args.input.read_text(encoding="utf-8"))
        result = persist_batch(home, payload)

    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
