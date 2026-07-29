#!/usr/bin/env python3
"""Build deterministic Coding Wrapped metric snapshots."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from common import (
    RANGE_DAYS,
    detect_timezone_name,
    ensure_state,
    read_json,
    resolve_home,
    write_json_atomic,
)
from scan_sessions import CLAUDE_ROOT, CODEX_ROOT, build_metrics


def parse_ranges(value: str) -> list[str]:
    values = [item.strip() for item in value.split(",") if item.strip()]
    unsupported = [item for item in values if item not in RANGE_DAYS]
    if unsupported:
        raise argparse.ArgumentTypeError(
            f"Unsupported ranges: {', '.join(unsupported)}"
        )
    return values


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Scan local Claude Code and Codex sessions into aggregates."
    )
    parser.add_argument("--home", type=Path)
    parser.add_argument("--timezone", default=detect_timezone_name())
    parser.add_argument("--claude-root", type=Path, default=CLAUDE_ROOT)
    parser.add_argument("--codex-root", type=Path, default=CODEX_ROOT)
    parser.add_argument("--display-name")
    parser.add_argument("--locale", choices=("zh", "en"))
    parser.add_argument(
        "--ranges",
        type=parse_ranges,
        default=list(RANGE_DAYS),
        help="Comma-separated ranges: 7d,30d,all",
    )
    args = parser.parse_args()

    home = resolve_home(args.home)
    paths = ensure_state(home)
    if args.display_name or args.locale:
        config = read_json(paths["config"])
        profile = config.setdefault("profile", {})
        if args.display_name:
            profile["display_name"] = args.display_name.strip()[:40]
        if args.locale:
            profile["default_locale"] = args.locale
        write_json_atomic(paths["config"], config)
    results = {}

    for range_id in args.ranges:
        snapshot = build_metrics(
            RANGE_DAYS[range_id],
            args.timezone,
            claude_root=args.claude_root,
            codex_root=args.codex_root,
        )
        output = paths["metrics"] / f"dashboard-{range_id}.json"
        write_json_atomic(output, snapshot)
        results[range_id] = {
            "output": str(output),
            "sessions": snapshot["coverage"]["sessions"],
            "messages": snapshot["coverage"]["user_messages"],
        }

    print(
        json.dumps(
            {
                "home": str(home),
                "privacy": "aggregates-only",
                "snapshots": results,
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
