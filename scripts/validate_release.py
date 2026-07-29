#!/usr/bin/env python3
"""Validate the public Coding Wrapped repository without external packages."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL_ROOT = ROOT / "skills" / "coding-wrapped"


def fail(message: str) -> None:
    raise SystemExit(f"FAIL: {message}")


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        fail(f"{path.relative_to(ROOT)}: {error}")


def validate_manifests() -> None:
    codex = read_json(ROOT / ".codex-plugin" / "plugin.json")
    claude = read_json(ROOT / ".claude-plugin" / "plugin.json")
    marketplace = read_json(ROOT / ".claude-plugin" / "marketplace.json")

    for key in ("name", "version", "description", "author", "skills"):
        if key not in codex or key not in claude:
            fail(f"missing {key!r} in a platform manifest")

    if codex["name"] != "coding-wrapped" or claude["name"] != "coding-wrapped":
        fail("platform manifest names must be coding-wrapped")
    if codex["version"] != claude["version"]:
        fail("Claude and Codex manifest versions differ")
    if codex["skills"] != "./skills/" or claude["skills"] != "./skills/":
        fail("both manifests must point to the canonical skills directory")

    plugins = marketplace.get("plugins", [])
    if len(plugins) != 1 or plugins[0].get("name") != "coding-wrapped":
        fail("Claude marketplace must expose exactly one coding-wrapped plugin")
    if plugins[0].get("source") != "./":
        fail("Claude marketplace source must be the repository root")


def validate_skill() -> None:
    skill_file = SKILL_ROOT / "SKILL.md"
    text = skill_file.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        fail("SKILL.md has no YAML frontmatter")
    frontmatter = text.split("---\n", 2)[1]
    fields = {
        match.group(1): match.group(2).strip()
        for match in re.finditer(r"^([a-z_]+):\s*(.+)$", frontmatter, re.M)
    }
    if set(fields) != {"name", "description"}:
        fail("SKILL.md frontmatter must contain only name and description")
    if fields["name"] != "coding-wrapped":
        fail("SKILL.md name must match its directory")
    if len(text.splitlines()) > 500:
        fail("SKILL.md exceeds the 500-line context budget")

    required = (
        "references/privacy-policy.md",
        "references/insight-writing.md",
        "references/visual-system.md",
    )
    for relative in required:
        if relative not in text:
            fail(f"SKILL.md does not link {relative}")
        if not (SKILL_ROOT / relative).is_file():
            fail(f"missing linked reference: {relative}")


def compile_python() -> None:
    paths = sorted(
        [
            *SKILL_ROOT.glob("scripts/*.py"),
            *(ROOT / "evals").glob("**/*.py"),
            *(ROOT / "scripts").glob("*.py"),
        ]
    )
    for path in paths:
        compile(path.read_text(encoding="utf-8"), str(path), "exec")


def run_eval() -> None:
    command = [
        sys.executable,
        str(ROOT / "evals" / "coding-wrapped" / "run_eval.py"),
        "--skill-root",
        str(SKILL_ROOT),
    ]
    completed = subprocess.run(command, cwd=ROOT, check=False)
    if completed.returncode:
        fail("functional evaluator failed")


def validate_layout() -> None:
    required = (
        "README.md",
        "README.zh-CN.md",
        "RELEASE_CHECKLIST.md",
        "PRIVACY.md",
        "SECURITY.md",
        "THIRD_PARTY_NOTICES.md",
        "LICENSE",
        "skills/coding-wrapped/agents/openai.yaml",
        "skills/coding-wrapped/assets/frontend-template/fonts/Noto-OFL.txt",
        "skills/coding-wrapped/assets/frontend-template/fonts/PlusJakartaSans-OFL.txt",
        "docs/images/dashboard.png",
        "docs/images/insight-detail.png",
        "docs/images/behavior-metrics.png",
        "docs/images/insights.jpg",
        "docs/images/mobile.png",
    )
    for relative in required:
        if not (ROOT / relative).is_file():
            fail(f"missing release file: {relative}")

    duplicate_skills = [
        path
        for path in ROOT.glob("**/SKILL.md")
        if path.resolve() != (SKILL_ROOT / "SKILL.md").resolve()
    ]
    if duplicate_skills:
        fail("duplicate SKILL.md found outside canonical Skill folder")


def validate_public_seed() -> None:
    default_root = SKILL_ROOT / "assets" / "default-state"
    config = read_json(default_root / "config.json")
    seed = config.get("seed", {})
    if seed.get("data_origin") != "synthetic-demo":
        fail("bundled seed must declare data_origin=synthetic-demo")
    if seed.get("contains_user_history") is not False:
        fail("bundled seed must declare contains_user_history=false")

    forbidden = (
        "sen" + "lin",
        "/Users/" + "sen" + "lin",
        "2026-07-28T17:45:" + "18.843",
        "682" + "044" + "519",
    )
    paths = [
        default_root / "config.json",
        *(default_root / "data").glob("*.json"),
        *(SKILL_ROOT / "assets" / "frontend-template" / "data").glob("*.json"),
    ]
    encoded = "\n".join(path.read_text(encoding="utf-8") for path in paths)
    for marker in forbidden:
        if marker.lower() in encoded.lower():
            fail(f"bundled public seed contains private marker: {marker}")
    if encoded.count('"data_origin": "synthetic-demo"') < 4:
        fail("every bundled metric snapshot must identify synthetic origin")


def main() -> None:
    validate_layout()
    validate_manifests()
    validate_skill()
    validate_public_seed()
    compile_python()
    run_eval()
    print("PASS: repository, manifests, Skill, Python, and evaluator")


if __name__ == "__main__":
    main()
