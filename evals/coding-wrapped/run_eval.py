#!/usr/bin/env python3
"""Repeatable functional and contract evaluation for the Coding Wrapped Skill."""

from __future__ import annotations

import argparse
import copy
import json
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import threading
import urllib.request
import zipfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable


EVAL_ROOT = Path(__file__).resolve().parent
DEFAULT_SKILL_ROOT = EVAL_ROOT.parents[1] / "skills" / "coding-wrapped"
RESULTS_ROOT = EVAL_ROOT / "results"


class Evaluation:
    def __init__(self) -> None:
        self.results: list[dict[str, Any]] = []

    def check(
        self,
        category: str,
        name: str,
        operation: Callable[[], Any],
    ) -> None:
        try:
            details = operation()
            self.results.append(
                {
                    "category": category,
                    "name": name,
                    "status": "pass",
                    "details": details if details is not None else "ok",
                }
            )
        except Exception as error:
            self.results.append(
                {
                    "category": category,
                    "name": name,
                    "status": "fail",
                    "details": f"{type(error).__name__}: {error}",
                }
            )

    @property
    def passed(self) -> int:
        return sum(result["status"] == "pass" for result in self.results)

    @property
    def failed(self) -> int:
        return sum(result["status"] == "fail" for result in self.results)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def parse_frontmatter(skill_file: Path) -> dict[str, str]:
    text = skill_file.read_text(encoding="utf-8")
    require(text.startswith("---\n"), "SKILL.md must start with YAML frontmatter")
    block = text.split("---\n", 2)[1]
    values = {}
    for line in block.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        values[key.strip()] = value.strip().strip("\"'")
    return values


def load_modules(skill_root: Path) -> dict[str, Any]:
    scripts = str(skill_root / "scripts")
    if scripts not in sys.path:
        sys.path.insert(0, scripts)
    import common
    import generate_insights
    import generate_overview
    import scan_sessions
    import serve_site

    return {
        "common": common,
        "generate_insights": generate_insights,
        "generate_overview": generate_overview,
        "scan_sessions": scan_sessions,
        "serve_site": serve_site,
    }


def iso(minutes_ago: int) -> str:
    return (
        datetime.now(timezone.utc) - timedelta(minutes=minutes_ago)
    ).isoformat()


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "".join(json.dumps(row, ensure_ascii=False) + "\n" for row in rows),
        encoding="utf-8",
    )


def create_fixtures(root: Path) -> tuple[Path, Path, list[str]]:
    claude_root = root / "claude" / "projects"
    codex_root = root / "codex" / "sessions"
    private_markers = [
        "alice@example.com",
        "sk-test-secret-123456789",
        "/Users/alice/SecretProject",
        "private launch checklist",
        "https://internal.example.test/launch",
    ]

    write_jsonl(
        claude_root / "main" / "session.jsonl",
        [
            {
                "type": "user",
                "timestamp": iso(90),
                "cwd": private_markers[2],
                "message": {
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "继续 private launch checklist "
                                "alice@example.com sk-test-secret-123456789 "
                                "/Users/alice/SecretProject "
                                "https://internal.example.test/launch"
                            ),
                        }
                    ]
                },
            },
            {
                "type": "assistant",
                "timestamp": iso(80),
                "message": {
                    "model": "claude-sonnet-test",
                    "usage": {
                        "input_tokens": 100,
                        "cache_read_input_tokens": 20,
                        "cache_creation_input_tokens": 10,
                        "output_tokens": 40,
                    },
                    "content": [
                        {"type": "tool_use", "name": "Read"},
                        {"type": "tool_use", "name": "Edit"},
                    ],
                },
            },
            {
                "type": "user",
                "timestamp": iso(70),
                "cwd": private_markers[2],
                "message": {"content": [{"type": "text", "text": "继续测试"}]},
            },
        ],
    )
    write_jsonl(
        claude_root / "subagent" / "session.jsonl",
        [
            {
                "type": "user",
                "timestamp": iso(60),
                "cwd": "/Users/alice/AnotherPrivateProject",
                "isSidechain": True,
                "message": {"content": [{"type": "text", "text": "检查"}]},
            }
        ],
    )

    write_jsonl(
        codex_root / "main" / "session.jsonl",
        [
            {
                "type": "session_meta",
                "timestamp": iso(55),
                "payload": {"cwd": "/Users/alice/CodexPrivate"},
            },
            {
                "type": "response_item",
                "timestamp": iso(50),
                "payload": {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "continue"}],
                },
            },
            {
                "type": "response_item",
                "timestamp": iso(45),
                "payload": {"type": "function_call", "name": "exec_command"},
            },
            {
                "type": "turn_context",
                "timestamp": iso(40),
                "payload": {"model": "gpt-test", "collaboration_mode": "default"},
            },
            {
                "type": "event_msg",
                "timestamp": iso(35),
                "payload": {
                    "type": "token_count",
                    "info": {
                        "total_token_usage": {
                            "input_tokens": 200,
                            "cached_input_tokens": 30,
                            "output_tokens": 50,
                            "reasoning_output_tokens": 10,
                            "total_tokens": 290,
                        }
                    },
                },
            },
        ],
    )
    write_jsonl(
        codex_root / "subagent" / "session.jsonl",
        [
            {
                "type": "session_meta",
                "timestamp": iso(30),
                "payload": {
                    "cwd": "/Users/alice/CodexSubagentPrivate",
                    "thread_source": "subagent",
                },
            },
            {
                "type": "response_item",
                "timestamp": iso(25),
                "payload": {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "verify"}],
                },
            },
        ],
    )
    return claude_root, codex_root, private_markers


def valid_insight_payload(skill_root: Path, suffix: str) -> dict[str, Any]:
    seed = json.loads(
        (
            skill_root
            / "assets"
            / "default-state"
            / "data"
            / "insights.json"
        ).read_text(encoding="utf-8")
    )
    items = copy.deepcopy(seed["insights"][:4])
    for index, item in enumerate(items):
        item["id"] = f"eval-{suffix}-{index + 1}"
        item["composition"] = f"eval-{suffix}-composition-{index + 1}"
        item.pop("image", None)
        item.pop("batch_id", None)
        item.pop("created_at", None)
    return {
        "source_snapshot": "dashboard-30d-eval",
        "generator": "eval-suite",
        "insights": items,
    }


def expect_value_error(operation: Callable[[], Any], contains: str) -> str:
    try:
        operation()
    except ValueError as error:
        require(contains.lower() in str(error).lower(), str(error))
        return str(error)
    raise AssertionError("Expected ValueError")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skill-root", type=Path, default=DEFAULT_SKILL_ROOT)
    parser.add_argument("--with-server", action="store_true")
    args = parser.parse_args()

    skill_root = args.skill_root.resolve()
    modules = load_modules(skill_root)
    common = modules["common"]
    insight_module = modules["generate_insights"]
    overview_module = modules["generate_overview"]
    scan_module = modules["scan_sessions"]
    serve_module = modules["serve_site"]
    evaluation = Evaluation()

    def metadata_contract() -> dict[str, Any]:
        metadata = parse_frontmatter(skill_root / "SKILL.md")
        name = metadata.get("name", "")
        description = metadata.get("description", "")
        require(name == skill_root.name, "name must match the parent directory")
        require(bool(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name)), "invalid name")
        require(1 <= len(description) <= 1024, "description length invalid")
        require(description.startswith("Creates or refreshes"), "description should be third-person and front-loaded")
        for phrase in ("Coding Wrapped", "Claude Code", "Codex", "localhost"):
            require(phrase in description, f"description is missing trigger term: {phrase}")
        return {
            "name": name,
            "description_characters": len(description),
            "frontmatter_keys": sorted(metadata),
        }

    evaluation.check("spec", "Agent Skills frontmatter and discovery metadata", metadata_contract)

    def progressive_disclosure() -> dict[str, Any]:
        skill_file = skill_root / "SKILL.md"
        lines = skill_file.read_text(encoding="utf-8").splitlines()
        require(len(lines) < 500, "SKILL.md must stay under 500 lines")
        links = re.findall(r"\[[^\]]+\]\(([^)]+\.md)\)", "\n".join(lines))
        require(links, "SKILL.md should route to reference files")
        for link in links:
            require((skill_root / link).is_file(), f"missing reference: {link}")
            require(len(Path(link).parts) <= 2, f"deeply nested reference: {link}")
        long_references_without_contents = []
        for path in (skill_root / "references").glob("*.md"):
            reference_text = path.read_text(encoding="utf-8")
            count = len(reference_text.splitlines())
            has_contents = bool(
                re.search(
                    r"^## (?:Contents|Table of contents)$",
                    reference_text,
                    re.M | re.I,
                )
            )
            if count > 100 and not has_contents:
                long_references_without_contents.append(path.name)
        require(
            not long_references_without_contents,
            "long references need contents sections: "
            f"{long_references_without_contents}",
        )
        return {"skill_lines": len(lines), "direct_references": links}

    evaluation.check("spec", "Progressive disclosure and reference depth", progressive_disclosure)

    def platform_contract() -> dict[str, Any]:
        repository_root = EVAL_ROOT.parents[1]
        readme = (repository_root / "README.md").read_text(encoding="utf-8")
        for path in (
            "~/.agents/skills/coding-wrapped",
            "~/.claude/skills/coding-wrapped",
        ):
            require(path in readme, f"missing platform install path: {path}")
        for manifest in (
            repository_root / ".codex-plugin" / "plugin.json",
            repository_root / ".claude-plugin" / "plugin.json",
        ):
            payload = json.loads(manifest.read_text(encoding="utf-8"))
            require(payload["name"] == "coding-wrapped", f"bad plugin name: {manifest}")
            require(payload["skills"] == "./skills/", f"bad skills path: {manifest}")
        openai_yaml = (skill_root / "agents" / "openai.yaml").read_text(encoding="utf-8")
        require("$coding-wrapped" in openai_yaml, "Codex default prompt must name the skill")
        return "One canonical Skill is exposed through Claude and Codex manifests"

    evaluation.check("compatibility", "Codex and Claude Code install contract", platform_contract)

    def activation_manifest() -> dict[str, Any]:
        payload = json.loads((EVAL_ROOT / "evals.json").read_text(encoding="utf-8"))
        scenarios = payload["activation_scenarios"]
        require(len(scenarios) >= 3, "at least three activation evals are required")
        ids = {scenario["id"] for scenario in scenarios}
        for required in (
            "direct-zh",
            "direct-en",
            "indirect-behavior",
            "incomplete",
            "negative-code-wrap",
        ):
            require(required in ids, f"missing activation case: {required}")
        return {
            "scenarios": len(scenarios),
            "note": "Contract cases are defined; fresh-agent model activation is reported separately.",
        }

    evaluation.check("activation", "Direct, indirect, incomplete, and negative trigger cases", activation_manifest)

    def static_security() -> dict[str, Any]:
        scripts = "\n".join(
            path.read_text(encoding="utf-8")
            for path in sorted((skill_root / "scripts").glob("*.py"))
        )
        forbidden = (
            "import requests",
            "from urllib import request",
            "import urllib.request",
            "import http.client",
            "socket.create_connection",
            "\"curl\"",
            "\"wget\"",
        )
        hits = [token for token in forbidden if token in scripts]
        require(not hits, f"outbound network primitives found: {hits}")
        require('parser.add_argument("--host", default="127.0.0.1")' in scripts, "server must bind to loopback by default")
        privacy = (skill_root / "references" / "privacy-policy.md").read_text(encoding="utf-8")
        require("raw transcripts" in privacy and "Forbidden outputs" in privacy, "privacy boundary is incomplete")
        return "No bundled outbound HTTP client; local server defaults to 127.0.0.1"

    evaluation.check("privacy", "Static network and local-only boundary", static_security)

    with tempfile.TemporaryDirectory(prefix="coding-wrapped-eval-") as temporary:
        temp = Path(temporary)
        claude_root, codex_root, private_markers = create_fixtures(temp / "fixtures")
        home = temp / "state"

        def aggregate_scan() -> dict[str, Any]:
            metrics = scan_module.build_metrics(
                30,
                "UTC",
                claude_root=claude_root,
                codex_root=codex_root,
            )
            coverage = metrics["coverage"]
            require(coverage["sessions"] == 2, f"expected 2 main sessions: {coverage}")
            require(coverage["subagent_sessions"] == 2, "expected 2 subagent sessions")
            require(set(coverage["available_sources"]) == {"claude-code", "codex"}, "both sources should be available")
            require(metrics["prompts"]["phrase_counts"], "approved phrase counts should be present")
            require("repeated_safe_short_prompts" not in metrics["prompts"], "arbitrary prompt excerpts must not be emitted")
            encoded = json.dumps(metrics, ensure_ascii=False)
            for marker in private_markers:
                require(marker not in encoded, f"private marker leaked: {marker}")
            return {
                "sessions": coverage["sessions"],
                "subagents": coverage["subagent_sessions"],
                "sources": coverage["available_sources"],
            }

        evaluation.check("function", "Synthetic Claude + Codex aggregate scan", aggregate_scan)

        def source_degradation() -> dict[str, Any]:
            missing = temp / "missing"
            empty = scan_module.build_metrics(
                30,
                "UTC",
                claude_root=missing / "claude",
                codex_root=missing / "codex",
            )
            require(empty["coverage"]["sessions"] == 0, "missing sources must yield no sessions")
            require(set(empty["coverage"]["missing_sources"]) == {"claude-code", "codex"}, "missing sources must be explicit")
            claude_only = scan_module.build_metrics(
                30,
                "UTC",
                claude_root=claude_root,
                codex_root=missing / "codex",
            )
            require(claude_only["coverage"]["sessions_by_source"] == {"claude-code": 1}, "single-source fallback failed")
            return "Both-missing and Claude-only coverage states are explicit"

        evaluation.check("recovery", "Missing and single-source graceful degradation", source_degradation)

        def cli_snapshots() -> dict[str, Any]:
            completed = subprocess.run(
                [
                    sys.executable,
                    str(skill_root / "scripts" / "build_metrics.py"),
                    "--home",
                    str(home),
                    "--timezone",
                    "UTC",
                    "--claude-root",
                    str(claude_root),
                    "--codex-root",
                    str(codex_root),
                    "--display-name",
                    "Eval",
                    "--locale",
                    "zh",
                    "--ranges",
                    "7d,30d,all",
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            payload = json.loads(completed.stdout)
            require(set(payload["snapshots"]) == {"7d", "30d", "all"}, "range snapshots missing")
            all_metrics = json.loads(
                (home / "data" / "metrics" / "dashboard-all.json").read_text(encoding="utf-8")
            )
            require(all_metrics["analysis"]["days"] == "all", "all range must be unbounded")
            require(all_metrics["analysis"]["timezone"] == "UTC", "timezone override failed")
            config = json.loads((home / "config.json").read_text(encoding="utf-8"))
            require(config["profile"] == {"display_name": "Eval", "default_locale": "zh"}, "profile config failed")
            return {
                range_id: {
                    **details,
                    "output": f"data/metrics/dashboard-{range_id}.json",
                }
                for range_id, details in payload["snapshots"].items()
            }

        evaluation.check("function", "CLI builds 7d, 30d, and unbounded all snapshots", cli_snapshots)

        def brief_privacy() -> dict[str, Any]:
            metric_path = home / "data" / "metrics" / "dashboard-30d.json"
            legacy_metrics = json.loads(metric_path.read_text(encoding="utf-8"))
            legacy_metrics["prompts"]["repeated_safe_short_prompts"] = [
                {"prompt": private_markers[3], "count": 2}
            ]
            metric_path.write_text(
                json.dumps(legacy_metrics, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            brief = insight_module.generation_brief(home)
            encoded = json.dumps(brief, ensure_ascii=False)
            for marker in private_markers:
                require(marker not in encoded, f"private marker leaked into generation brief: {marker}")
            require(brief["privacy"]["forbidden"], "brief must state forbidden data")
            require(brief["requirements"]["count"] == 4, "brief must request four insights")
            require(brief["requirements"]["locale"] == "zh", "brief must use one configured locale")
            illustration = brief["requirements"]["illustration_contract"]
            require(
                illustration["style_id"] == "cw-pixel-diorama-v1",
                "brief must name the canonical illustration style",
            )
            require(
                illustration["canvas"]
                == {
                    "width": 1536,
                    "height": 1024,
                    "format": "png",
                    "aspect_ratio": "3:2",
                },
                "brief must require the canonical 3:2 PNG canvas",
            )
            require(
                set(illustration["theme_reference_images"])
                == {"warm", "blue", "pink", "green"},
                "brief must expose one canonical reference per theme",
            )
            require(
                illustration["qa_reference_comparison_required"] is True,
                "brief must require visual reference QA",
            )
            return {
                "locale": brief["requirements"]["locale"],
                "count": brief["requirements"]["count"],
                "illustration_style": illustration["style_id"],
                "canvas": illustration["canvas"],
            }

        evaluation.check("privacy", "Generation brief excludes raw private markers", brief_privacy)

        def insight_persistence() -> dict[str, Any]:
            first = insight_module.persist_batch(home, valid_insight_payload(skill_root, "one"))
            second = insight_module.persist_batch(home, valid_insight_payload(skill_root, "two"))
            state = common.read_json(common.state_paths(home)["insights"])
            require(first["count"] == second["count"] == 4, "each batch must contain four")
            require(len(state["batches"]) == 2, "seed should be replaced, then a second batch appended")
            require(len(state["insights"]) == 8, "insights should survive and append")
            require(all(item["image"].startswith("/generated-images/") for item in state["insights"]), "image URLs must stay local")
            return {"batches": 2, "insights": 8}

        evaluation.check("persistence", "Four-at-a-time replacement and append persistence", insight_persistence)

        def invalid_batches() -> dict[str, Any]:
            sources = common.read_json(common.state_paths(home)["sources"])
            allowed = {item["id"] for item in sources["sources"]}
            one = valid_insight_payload(skill_root, "invalid-one")
            one["insights"] = one["insights"][:1]
            count_error = expect_value_error(
                lambda: insight_module.validate_batch(one, allowed, "zh"),
                "exactly four",
            )
            duplicate = valid_insight_payload(skill_root, "invalid-duplicate")
            duplicate["insights"][1]["composition"] = duplicate["insights"][0]["composition"]
            composition_error = expect_value_error(
                lambda: insight_module.validate_batch(duplicate, allowed, "zh"),
                "different compositions",
            )
            unknown = valid_insight_payload(skill_root, "invalid-source")
            unknown["insights"][0]["source_ids"] = ["not-allow-listed"]
            source_error = expect_value_error(
                lambda: insight_module.validate_batch(unknown, allowed, "zh"),
                "source ID",
            )
            wrong_size = home / "wrong-size.png"
            wrong_size.write_bytes(
                b"\x89PNG\r\n\x1a\n"
                + b"\x00\x00\x00\rIHDR"
                + struct.pack(">II", 1024, 1024)
            )
            wrong_image = valid_insight_payload(skill_root, "invalid-image")
            wrong_image["insights"][0]["image_source"] = str(wrong_size)
            image_root = common.state_paths(home)["images"]
            image_dirs_before = {path.name for path in image_root.iterdir()}
            image_error = expect_value_error(
                lambda: insight_module.persist_batch(home, wrong_image),
                "1536 × 1024",
            )
            require(
                {path.name for path in image_root.iterdir()}
                == image_dirs_before,
                "invalid illustration must not leave an empty batch directory",
            )
            return [
                count_error,
                composition_error,
                source_error,
                image_error,
            ]

        evaluation.check(
            "validation",
            "Rejects invalid count, composition, source, and illustration canvas",
            invalid_batches,
        )

        def overview_persistence() -> dict[str, Any]:
            paths = common.state_paths(home)
            source_id = common.read_json(paths["sources"])["sources"][0]["id"]
            brief = overview_module.build_brief(home)
            summary_contract = brief["requirements"]["summary"]
            require(
                summary_contract["sentences"] == 2,
                "overview brief must request two summary sentences",
            )
            require(
                summary_contract["representative_facts"] == {"min": 2, "max": 3},
                "overview brief must limit the summary to representative facts",
            )
            require(
                summary_contract["include_behavior_interpretation"] is True,
                "overview brief must request a behavior interpretation",
            )
            payload = {
                "copy": {
                    "zh": {
                        "eyebrow": "你的 Coding 总览",
                        "title": "你在持续校准一支临时团队",
                        "summary": "过去 30 天，三个主会话带出两个子智能体。你习惯沿同一条工作线检查结果、再调整方向，最长连续推进约 90 分钟。",
                        "recommendations": [
                            {
                                "id": "eval-recommendation",
                                "title": "先写完成标准",
                                "body": "给任务补一句可验证的完成标准。",
                                "source_ids": [source_id],
                            }
                        ],
                    }
                }
            }
            result = overview_module.persist(home, payload)
            overview = common.read_json(paths["overview"])
            require(overview["status"] == "ready", "overview should be ready")
            require(overview["copy"]["zh"]["recommendations"][0]["source_ids"] == [source_id], "source ID should persist")
            bad = copy.deepcopy(payload)
            bad["copy"]["zh"]["recommendations"][0]["source_ids"] = ["unknown"]
            expect_value_error(
                lambda: overview_module.persist(home, bad),
                "allow-listed",
            )
            verbose = copy.deepcopy(payload)
            verbose["copy"]["zh"]["summary"] = (
                "第一句复述一组指标。第二句又复述另一组指标。"
                "第三句才开始解释这些数字说明了什么。"
            )
            expect_value_error(
                lambda: overview_module.persist(home, verbose),
                "at most two sentences",
            )
            return {
                "batch_id": result["batch_id"],
                "summary_sentences": summary_contract["sentences"],
                "summary_fact_range": summary_contract["representative_facts"],
            }

        evaluation.check(
            "persistence",
            "Overview compactness, watermark, and source validation",
            overview_persistence,
        )

        def export_privacy() -> dict[str, Any]:
            output = temp / "export" / "coding-wrapped-eval.zip"
            completed = subprocess.run(
                [
                    sys.executable,
                    str(skill_root / "scripts" / "export_wrapped.py"),
                    "--home",
                    str(home),
                    "--output",
                    str(output),
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            archive = Path(json.loads(completed.stdout)["archive"])
            require(archive.is_file(), "export archive missing")
            with zipfile.ZipFile(archive) as package:
                names = package.namelist()
                require(not any(name.endswith(".jsonl") for name in names), "raw session files must not be exported")
                for name in names:
                    if not name.endswith((".json", ".html", ".js", ".css", ".md")):
                        continue
                    contents = package.read(name).decode("utf-8", errors="ignore")
                    for marker in private_markers:
                        require(marker not in contents, f"private marker leaked into export: {name}")
            return {"archive": archive.name, "files": len(names)}

        evaluation.check("privacy", "Portable export excludes transcripts and private markers", export_privacy)

        def portable_copy() -> dict[str, Any]:
            copied = temp / "portable" / "coding-wrapped"
            shutil.copytree(skill_root, copied)
            scripts = sorted((copied / "scripts").glob("*.py"))
            for script in scripts:
                compile(
                    script.read_text(encoding="utf-8"),
                    str(script),
                    "exec",
                )
            output = temp / "portable-metrics.json"
            subprocess.run(
                [
                    sys.executable,
                    str(copied / "scripts" / "scan_sessions.py"),
                    "--days",
                    "all",
                    "--timezone",
                    "UTC",
                    "--claude-root",
                    str(claude_root),
                    "--codex-root",
                    str(codex_root),
                    "--output",
                    str(output),
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            payload = json.loads(output.read_text(encoding="utf-8"))
            require(payload["coverage"]["sessions"] == 2, "portable copy scan failed")
            return {"compiled_scripts": len(scripts), "portable_sessions": 2}

        evaluation.check("compatibility", "Fresh-directory copy compiles and scans", portable_copy)

        if args.with_server:
            def local_server() -> dict[str, Any]:
                server = serve_module.CodingWrappedServer(
                    ("127.0.0.1", 0),
                    home,
                    "UTC",
                    True,
                )
                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                port = server.server_address[1]
                try:
                    with urllib.request.urlopen(
                        f"http://127.0.0.1:{port}/api/state",
                        timeout=5,
                    ) as response:
                        state = json.load(response)
                    with urllib.request.urlopen(
                        f"http://127.0.0.1:{port}/api/metrics?range=30d",
                        timeout=5,
                    ) as response:
                        metrics = json.load(response)
                    require(state["config"]["profile"]["default_locale"] == "zh", "API locale mismatch")
                    require(metrics["coverage"]["sessions"] == 2, "API metrics mismatch")
                    return {"port": port, "locale": "zh", "sessions": 2}
                finally:
                    server.shutdown()
                    server.server_close()
                    thread.join(timeout=5)

            evaluation.check("runtime", "Loopback server and state API", local_server)

    RESULTS_ROOT.mkdir(parents=True, exist_ok=True)
    generated_at = datetime.now(timezone.utc).isoformat()
    summary = {
        "schema_version": "1.0.0",
        "generated_at": generated_at,
        "skill_root": "skills/coding-wrapped",
        "passed": evaluation.passed,
        "failed": evaluation.failed,
        "activation_model_eval": {
            "status": "not-run",
            "reason": "Requires fresh Claude and Codex sessions with the Skill installed; static contract cases are defined in evals.json.",
        },
        "results": evaluation.results,
    }
    latest_json = RESULTS_ROOT / "latest.json"
    latest_json.write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    rows = "\n".join(
        f"| {result['category']} | {result['name']} | {result['status'].upper()} | {str(result['details']).replace('|', '/')} |"
        for result in evaluation.results
    )
    report = f"""# Coding Wrapped Skill evaluation

Generated: `{generated_at}`

Automated result: **{evaluation.passed} passed / {evaluation.failed} failed**

| Category | Check | Result | Details |
| --- | --- | --- | --- |
{rows}

## Model activation evaluation

The direct, indirect, incomplete-input, explain-only, and should-not-trigger
prompts are defined in `evals.json`. They have not yet been executed in fresh
Claude Haiku, Sonnet, Opus, and Codex sessions. This report does not treat a
metadata heuristic as proof that a model will activate the Skill correctly.
"""
    latest_md = RESULTS_ROOT / "latest.md"
    latest_md.write_text(report, encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False))
    raise SystemExit(1 if evaluation.failed else 0)


if __name__ == "__main__":
    main()
