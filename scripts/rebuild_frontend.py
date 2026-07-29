#!/usr/bin/env python3
"""Build the editable dashboard source and refresh the bundled template."""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skills" / "coding-wrapped" / "assets" / "frontend-source"
DIST = SOURCE / "dist"
TARGET = ROOT / "skills" / "coding-wrapped" / "assets" / "frontend-template"


def single_asset(pattern: str) -> Path:
    matches = sorted((DIST / "assets").glob(pattern))
    if len(matches) != 1:
        raise SystemExit(
            f"Expected exactly one {pattern} build asset, found {len(matches)}"
        )
    return matches[0]


def main() -> None:
    subprocess.run(["npm", "run", "build"], cwd=SOURCE, check=True)
    built_assets = (single_asset("index-*.css"), single_asset("index-*.js"))

    target_assets = TARGET / "assets"
    target_assets.mkdir(parents=True, exist_ok=True)
    for pattern in ("index-*.css", "index-*.js"):
        for stale in target_assets.glob(pattern):
            stale.unlink()

    shutil.copy2(DIST / "index.html", TARGET / "index.html")
    for asset in built_assets:
        shutil.copy2(asset, target_assets / asset.name)

    print(
        "Refreshed frontend-template with "
        + ", ".join(asset.name for asset in built_assets)
    )


if __name__ == "__main__":
    main()
