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
        "references/coding-best-practices.md",
        "references/visual-system.md",
    )
    for relative in required:
        if relative not in text:
            fail(f"SKILL.md does not link {relative}")
        if not (SKILL_ROOT / relative).is_file():
            fail(f"missing linked reference: {relative}")

    illustration_assets = (
        "agent-orchestra-warm.png",
        "night-runner-blue.png",
        "prompt-machine-pink.png",
        "continue-steps-green.png",
    )
    illustration_root = (
        SKILL_ROOT / "assets" / "frontend-template" / "assets"
    )
    for filename in illustration_assets:
        if not (illustration_root / filename).is_file():
            fail(f"missing canonical illustration reference: {filename}")

    scripts_path = str(SKILL_ROOT / "scripts")
    if scripts_path not in sys.path:
        sys.path.insert(0, scripts_path)
    from best_practices import load_catalog, sources_payload

    catalog = load_catalog()
    bundled_sources = read_json(
        SKILL_ROOT / "assets" / "default-state" / "data" / "sources.json"
    )
    if bundled_sources != sources_payload(catalog):
        fail("sources.json is stale relative to coding-best-practices.md")


def validate_frontend() -> None:
    source_root = SKILL_ROOT / "assets" / "frontend-source"
    template_root = SKILL_ROOT / "assets" / "frontend-template"
    required_source = (
        "index.html",
        "package.json",
        "package-lock.json",
        "vite.config.mjs",
        "src/App.jsx",
        "src/main.jsx",
        "src/styles.css",
        "src/enhancements.css",
        "src/responsive.css",
    )
    for relative in required_source:
        if not (source_root / relative).is_file():
            fail(f"missing editable frontend source: {relative}")

    source_css = (source_root / "src" / "styles.css").read_text(encoding="utf-8")
    source_app = (source_root / "src" / "App.jsx").read_text(encoding="utf-8")
    if "overflow-y: auto" not in source_css:
        fail("Dashboard source must keep body overflow-y:auto")
    if (
        "html.export-page" not in source_css
        or "body.export-page" not in source_css
        or "document.documentElement.classList" not in source_app
        or "document.body.classList" not in source_app
    ):
        fail("fixed overflow must be scoped to export pages")
    if re.search(
        r"@media\s*\(min-width:\s*1000px\).*?body\s*\{\s*overflow:\s*hidden",
        source_css,
        re.S,
    ):
        fail("Dashboard source contains a global desktop body overflow lock")

    swipe_source_markers = (
        "function useHorizontalSwipe",
        "onPointerCancel={insightSwipe.handlePointerCancel}",
        "onPointerMove={insightSwipe.handlePointerMove}",
        "draggable={false}",
    )
    if any(marker not in source_app for marker in swipe_source_markers):
        fail("Dashboard source is missing the complete Insight swipe contract")
    if not re.search(
        r"\.rpg-carousel\s*\{[^}]*touch-action:\s*pan-y",
        source_css,
        re.S,
    ):
        fail("Dashboard carousel must preserve vertical scroll during swipe")
    if "-webkit-user-drag: none" not in source_css:
        fail("Dashboard source must disable native image dragging")

    css_assets = sorted((template_root / "assets").glob("index-*.css"))
    js_assets = sorted((template_root / "assets").glob("index-*.js"))
    if len(css_assets) != 1 or len(js_assets) != 1:
        fail("frontend template must contain exactly one hashed CSS and JS asset")
    built_css = css_assets[0].read_text(encoding="utf-8")
    built_js = js_assets[0].read_text(encoding="utf-8")
    if not re.search(
        r"html\.export-page,body\.export-page\{[^}]*overflow:hidden",
        built_css,
    ):
        fail("bundled CSS is missing the scoped export overflow rule")
    if not re.search(
        r"body\.export-page\{position:fixed;[^}]*top:0;[^}]*right:0;"
        r"[^}]*bottom:0;[^}]*left:0",
        built_css,
    ):
        fail("bundled export page is not fixed to the capture viewport")
    if "overflow-y:auto" not in built_css or "export-page" not in built_js:
        fail("bundled frontend is stale relative to editable source")
    if re.search(
        r"@media\(min-width:1000px\)and "
        r"\(max-height:900px\)\{body\{overflow:hidden",
        built_css,
    ):
        fail("bundled Dashboard still contains the desktop scroll bug")
    if "touch-action:pan-y" not in built_css or "onPointerCancel" not in built_js:
        fail("bundled frontend is missing the complete Insight swipe contract")


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
    validate_frontend()
    validate_public_seed()
    compile_python()
    run_eval()
    print("PASS: repository, manifests, Skill, Python, and evaluator")


if __name__ == "__main__":
    main()
