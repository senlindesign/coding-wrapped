#!/usr/bin/env python3
"""Unified command entry point for the Coding Wrapped Skill."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


SCRIPT_ROOT = Path(__file__).resolve().parent


def place_global_options_before_subcommand(
    subcommand: str,
    arguments: list[str],
) -> list[str]:
    globals_: list[str] = []
    remainder: list[str] = []
    index = 0
    while index < len(arguments):
        argument = arguments[index]
        if argument == "--home" and index + 1 < len(arguments):
            globals_.extend(arguments[index : index + 2])
            index += 2
            continue
        if argument.startswith("--home="):
            globals_.append(argument)
            index += 1
            continue
        remainder.append(argument)
        index += 1
    return [*globals_, subcommand, *remainder]


def run(script: str, arguments: list[str]) -> None:
    completed = subprocess.run(
        [sys.executable, str(SCRIPT_ROOT / script), *arguments],
        check=False,
    )
    raise SystemExit(completed.returncode)


def main() -> None:
    parser = argparse.ArgumentParser(prog="coding-wrapped")
    parser.add_argument(
        "command",
        choices=(
            "scan",
            "brief",
            "persist",
            "overview-brief",
            "overview-persist",
            "serve",
            "export",
        ),
    )
    args, remainder = parser.parse_known_args()

    mapping = {
        "scan": ("build_metrics.py", remainder),
        "brief": (
            "generate_insights.py",
            place_global_options_before_subcommand("brief", remainder),
        ),
        "persist": (
            "generate_insights.py",
            place_global_options_before_subcommand("persist", remainder),
        ),
        "overview-brief": (
            "generate_overview.py",
            place_global_options_before_subcommand("brief", remainder),
        ),
        "overview-persist": (
            "generate_overview.py",
            place_global_options_before_subcommand("persist", remainder),
        ),
        "serve": ("serve_site.py", remainder),
        "export": ("export_wrapped.py", remainder),
    }
    script, arguments = mapping[args.command]
    run(script, arguments)


if __name__ == "__main__":
    main()
