#!/usr/bin/env python3
"""Serve the prebuilt Coding Wrapped dashboard and local-state API."""

from __future__ import annotations

import argparse
import json
import mimetypes
import shutil
import subprocess
import threading
import urllib.parse
import webbrowser
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from common import (
    FRONTEND_ROOT,
    RANGE_DAYS,
    SEED_ILLUSTRATIONS,
    SOURCE_ILLUSTRATIONS_ROOT,
    detect_timezone_name,
    ensure_state,
    read_json,
    resolve_home,
    sanitize_metrics,
    write_json_atomic,
)
from generate_insights import persist_batch


MAX_REQUEST_BYTES = 1_000_000


def overview_decision(overview: dict[str, Any], metrics: dict[str, Any]) -> dict[str, Any]:
    policy = overview.get("refresh_policy", {})
    watermark = overview.get("input_watermark", {})
    coverage = metrics.get("coverage", {})
    generated = datetime.fromisoformat(
        str(overview.get("generated_at", "1970-01-01T00:00:00+00:00")).replace(
            "Z", "+00:00"
        )
    )
    now = datetime.now(timezone.utc)
    age_days = max(0.0, (now - generated).total_seconds() / 86400)
    new_sessions = max(
        0, int(coverage.get("sessions", 0)) - int(watermark.get("sessions", 0))
    )
    new_messages = max(
        0,
        int(coverage.get("user_messages", 0))
        - int(watermark.get("user_messages", 0)),
    )
    stale = age_days >= int(policy.get("stale_after_days", 7))
    enough = (
        new_sessions >= int(policy.get("minimum_new_sessions", 3))
        or new_messages >= int(policy.get("minimum_new_messages", 20))
    )
    return {
        "updated": False,
        "eligible": stale and enough,
        "stale": stale,
        "enough_new_data": enough,
        "reason": "agent-generation-required" if stale and enough else (
            "fresh" if not stale else "insufficient-new-data"
        ),
        "age_days": round(age_days, 2),
        "data_delta": {
            "sessions": new_sessions,
            "user_messages": new_messages,
        },
        "checked_at": now.isoformat(),
    }


class CodingWrappedHandler(BaseHTTPRequestHandler):
    server_version = "CodingWrapped/1.0"

    @property
    def app(self) -> "CodingWrappedServer":
        return self.server  # type: ignore[return-value]

    def log_message(self, format: str, *args: object) -> None:
        if not self.app.quiet:
            super().log_message(format, *args)

    def send_json(self, payload: Any, status: int = HTTPStatus.OK) -> None:
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(encoded)

    def send_file(self, path: Path, cache: bool = True) -> None:
        if not path.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        contents = path.read_bytes()
        mime, _ = mimetypes.guess_type(path.name)
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", mime or "application/octet-stream")
        self.send_header("Content-Length", str(len(contents)))
        self.send_header("Cache-Control", "public, max-age=3600" if cache else "no-store")
        self.end_headers()
        self.wfile.write(contents)

    def request_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length > MAX_REQUEST_BYTES:
            raise ValueError("Request body too large")
        if not length:
            return {}
        payload = json.loads(self.rfile.read(length).decode("utf-8"))
        if not isinstance(payload, dict):
            raise ValueError("Request body must be an object")
        return payload

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)
        route = parsed.path
        paths = self.app.paths

        if route == "/api/state":
            self.send_json(
                {
                    "config": read_json(paths["config"]),
                    "insights": read_json(paths["insights"]),
                    "overview": read_json(paths["overview"]),
                    "sources": read_json(paths["sources"]),
                }
            )
            return

        state_routes = {
            "/api/config": "config",
            "/api/insights": "insights",
            "/api/overview": "overview",
            "/api/sources": "sources",
        }
        if route in state_routes:
            self.send_json(read_json(paths[state_routes[route]]))
            return

        if route == "/api/metrics":
            range_id = query.get("range", ["30d"])[0]
            if range_id not in RANGE_DAYS:
                self.send_json({"error": "Unsupported range"}, HTTPStatus.BAD_REQUEST)
                return
            self.send_json(
                sanitize_metrics(
                    read_json(paths["metrics"] / f"dashboard-{range_id}.json")
                )
            )
            return

        if route.startswith("/generated-images/"):
            relative = Path(
                urllib.parse.unquote(route.removeprefix("/generated-images/"))
            )
            if relative.is_absolute() or ".." in relative.parts:
                self.send_error(HTTPStatus.BAD_REQUEST)
                return
            self.send_file(paths["images"] / relative, cache=False)
            return

        relative = Path(route.lstrip("/") or "index.html")
        if relative.is_absolute() or ".." in relative.parts:
            self.send_error(HTTPStatus.BAD_REQUEST)
            return
        candidate = FRONTEND_ROOT / relative
        if candidate.is_file():
            self.send_file(candidate)
            return
        self.send_file(FRONTEND_ROOT / "index.html", cache=False)

    def do_POST(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)
        route = parsed.path

        try:
            if route == "/api/refresh":
                range_id = query.get("range", ["30d"])[0]
                if range_id not in RANGE_DAYS:
                    self.send_json(
                        {"error": "Unsupported range"}, HTTPStatus.BAD_REQUEST
                    )
                    return
                output = self.app.paths["metrics"] / f"dashboard-{range_id}.json"
                subprocess.run(
                    [
                        "python3",
                        str(Path(__file__).with_name("scan_sessions.py")),
                        "--days",
                        str(
                            RANGE_DAYS[range_id]
                            if RANGE_DAYS[range_id] is not None
                            else "all"
                        ),
                        "--timezone",
                        self.app.timezone,
                        "--output",
                        str(output),
                    ],
                    check=True,
                    capture_output=True,
                    text=True,
                )
                self.send_json(sanitize_metrics(read_json(output)))
                return

            if route == "/api/overview/auto-refresh":
                overview = read_json(self.app.paths["overview"])
                metrics = read_json(
                    self.app.paths["metrics"] / "dashboard-30d.json"
                )
                update = overview_decision(overview, metrics)
                overview["last_update_attempt"] = {
                    "checked_at": update["checked_at"],
                    "result": "skipped",
                    "reason": update["reason"],
                    "data_delta": update["data_delta"],
                }
                write_json_atomic(self.app.paths["overview"], overview)
                self.send_json({"overview": overview, "update": update})
                return

            if route == "/api/insights/generate":
                payload = self.request_json()
                normalized = []
                for index, item in enumerate(payload.get("insights", [])):
                    next_item = dict(item)
                    source = next_item.pop("image_source", "")
                    filename = Path(source).name if isinstance(source, str) else ""
                    if filename not in SEED_ILLUSTRATIONS:
                        filename = SEED_ILLUSTRATIONS[index % 4]
                    next_item["image_source"] = str(
                        SOURCE_ILLUSTRATIONS_ROOT / filename
                    )
                    normalized.append(next_item)
                payload["insights"] = normalized
                result = persist_batch(self.app.home, payload)
                self.send_json(
                    read_json(self.app.paths["insights"]),
                    HTTPStatus.CREATED,
                )
                return

            self.send_error(HTTPStatus.NOT_FOUND)
        except (ValueError, json.JSONDecodeError) as error:
            self.send_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
        except subprocess.CalledProcessError as error:
            self.send_json(
                {"error": "Local scan failed", "details": error.stderr[-1000:]},
                HTTPStatus.INTERNAL_SERVER_ERROR,
            )
        except Exception as error:
            self.send_json(
                {"error": "Local operation failed", "details": str(error)},
                HTTPStatus.INTERNAL_SERVER_ERROR,
            )


class CodingWrappedServer(ThreadingHTTPServer):
    def __init__(
        self,
        address: tuple[str, int],
        home: Path,
        timezone_name: str,
        quiet: bool,
    ):
        super().__init__(address, CodingWrappedHandler)
        self.home = home
        self.paths = ensure_state(home)
        self.timezone = timezone_name
        self.quiet = quiet


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--home", type=Path)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=4173)
    parser.add_argument("--timezone", default=detect_timezone_name())
    parser.add_argument("--open", action="store_true")
    parser.add_argument("--quiet", action="store_true")
    args = parser.parse_args()

    home = resolve_home(args.home)
    server = CodingWrappedServer(
        (args.host, args.port),
        home,
        args.timezone,
        args.quiet,
    )
    url = f"http://{args.host}:{args.port}/"
    print(json.dumps({"url": url, "home": str(home)}, ensure_ascii=False))
    if args.open:
        threading.Timer(0.25, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
