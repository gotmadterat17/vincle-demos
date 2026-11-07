"""Serve original Connecticut demo URLs as the static HTML page.

GitHub Pages ignores the query string, so `ct-electrical/?n=&c=` would
otherwise be the shared directory file. This server returns the business
document for that URL. The name and city are already in the HTML.
"""

from __future__ import annotations

import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from ct_demos.build import ROOT

INDEX_NAMES = {"", "index.html"}


def load_routes(root: Path | None = None) -> dict[tuple[str, str, str], Path]:
    manifest = json.loads(( (root or ROOT) / "data" / "ct_demo_manifest.json").read_text(encoding="utf-8"))
    routes = {}
    base = root or ROOT
    for record in manifest["routes"]:
        key = (record["url_slug"], record["query_name"], record["query_city"])
        routes[key] = base / record["static_path"]
    return routes


class DemoHandler(SimpleHTTPRequestHandler):
    routes: dict[tuple[str, str, str], Path] = {}
    site_root: Path = ROOT

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        raw_parts = [unquote(part) for part in parsed.path.split("/") if part]
        query = parse_qs(parsed.query, keep_blank_values=True)
        if len(raw_parts) == 1 and raw_parts[0].startswith("ct-") and ("n" in query or "c" in query):
            key = (raw_parts[0], query.get("n", [""])[0], query.get("c", [""])[0])
            target = self.routes.get(key)
            if target is None or not target.is_file():
                self.send_error(404, "No demo for that name and city")
                return
            body = target.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def log_message(self, fmt: str, *args) -> None:
        return


def make_server(host: str = "127.0.0.1", port: int = 0, root: Path | None = None) -> ThreadingHTTPServer:
    site = root or ROOT
    handler = partial(DemoHandler, directory=str(site))
    handler.routes = load_routes(site)  # type: ignore[attr-defined]
    handler.site_root = site  # type: ignore[attr-defined]
    DemoHandler.routes = load_routes(site)
    DemoHandler.site_root = site
    return ThreadingHTTPServer((host, port), handler)


def main() -> None:
    server = make_server(port=8765)
    print(f"http://{server.server_address[0]}:{server.server_address[1]}/")
    server.serve_forever()


if __name__ == "__main__":
    main()
