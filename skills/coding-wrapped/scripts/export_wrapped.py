#!/usr/bin/env python3
"""Export a portable snapshot of the local Coding Wrapped site and state."""

from __future__ import annotations

import argparse
import json
import shutil
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from common import (
    FRONTEND_ROOT,
    ensure_state,
    read_json,
    resolve_home,
    sanitize_metrics,
    write_json_atomic,
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--home", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    home = resolve_home(args.home)
    paths = ensure_state(home)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    output = (
        args.output.expanduser().resolve()
        if args.output
        else paths["exports"] / f"coding-wrapped-{timestamp}.zip"
    )
    output.parent.mkdir(parents=True, exist_ok=True)
    archive_base = output.with_suffix("")

    with tempfile.TemporaryDirectory(prefix="coding-wrapped-export-") as temp:
        root = Path(temp) / "coding-wrapped"
        shutil.copytree(FRONTEND_ROOT, root / "site")
        shutil.copytree(home / "data", root / "data")
        for metric_file in (root / "data" / "metrics").glob("dashboard-*.json"):
            write_json_atomic(metric_file, sanitize_metrics(read_json(metric_file)))
        shutil.copy2(home / "config.json", root / "config.json")
        shutil.copytree(
            home / "assets" / "generated-images",
            root / "assets" / "generated-images",
        )
        (root / "EXPORT.json").write_text(
            json.dumps(
                {
                    "schema_version": "1.0.0",
                    "exported_at": datetime.now(timezone.utc).isoformat(),
                    "privacy": "Aggregates, generated copy, and generated images only.",
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        archive = Path(
            shutil.make_archive(
                str(archive_base),
                "zip",
                root_dir=root.parent,
                base_dir=root.name,
            )
        )

    print(json.dumps({"archive": str(archive)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
