#!/usr/bin/env python3
"""Validate the practice catalog and optionally refresh derived sources."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from best_practices import CATALOG_PATH, load_catalog, sources_payload
from common import write_json_atomic


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", type=Path, default=CATALOG_PATH)
    parser.add_argument("--write-sources", type=Path)
    args = parser.parse_args()

    catalog = load_catalog(args.catalog)
    if args.write_sources:
        write_json_atomic(args.write_sources, sources_payload(catalog))
    print(
        json.dumps(
            {
                "catalog": str(args.catalog),
                "sources": len(catalog["sources"]),
                "practices": len(catalog["practices"]),
                "derived_sources": str(args.write_sources)
                if args.write_sources
                else None,
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
