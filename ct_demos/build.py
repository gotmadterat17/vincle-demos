"""Build static Connecticut demo pages from the sanitized registry file."""

from __future__ import annotations

import csv
import json
import shutil
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from ct_demos.normalize import ResolvedLead, resolve_row
from ct_demos.render import render_page, render_trade_index

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "ct_ready_public.csv"

_SLUG_LABEL = {
    "ct-auto-body": "Auto body",
    "ct-auto-repair": "Auto repair",
    "ct-building-finishing": "Building finishing",
    "ct-carpentry": "Carpentry",
    "ct-carpet-cleaning": "Carpet cleaning",
    "ct-drywall": "Drywall",
    "ct-electrical": "Electrical",
    "ct-flooring": "Flooring",
    "ct-foundation-concrete": "Foundation and concrete",
    "ct-framing": "Framing",
    "ct-janitorial-cleaning": "Janitorial and cleaning",
    "ct-masonry": "Masonry",
    "ct-painting": "Painting",
    "ct-plumbing-hvac": "Plumbing and HVAC",
    "ct-property-services": "Property services",
    "ct-remodeling": "Remodeling",
    "ct-roofing": "Roofing",
    "ct-siding": "Siding",
    "ct-specialty-contractor": "Specialty contractor",
    "ct-tile": "Tile",
}

def _flagged(record: dict, prefix: str) -> bool:
    return any(flag == prefix or flag.startswith(prefix) for flag in record["flags"])


def repo_root() -> Path:
    return ROOT


def load_public_rows(path: Path | None = None) -> list[dict]:
    with (path or DATA).open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def parse_legacy(url: str) -> tuple[str, str, str]:
    parsed = urlparse(url)
    slug = parsed.path.rstrip("/").split("/")[-1]
    query = parse_qs(parsed.query, keep_blank_values=True)
    name = query.get("n", [""])[0]
    city = query.get("c", [""])[0]
    return slug, name, city


def resolve_leads(rows: list[dict] | None = None) -> list[ResolvedLead]:
    leads = []
    for row in rows if rows is not None else load_public_rows():
        slug, query_name, query_city = parse_legacy(row["demo_url"])
        leads.append(resolve_row(row, query_name, query_city, slug, row["demo_url"]))
    return leads


def _slug_piece(text: str) -> str:
    lowered = text.casefold()
    piece = []
    prev_dash = True
    for char in lowered:
        if char.isascii() and char.isalnum():
            piece.append(char)
            prev_dash = False
        elif not prev_dash:
            piece.append("-")
            prev_dash = True
    return "".join(piece).strip("-") or "filing"


def page_slug(lead: ResolvedLead, used: set[str]) -> str:
    base = _slug_piece(lead.display_name)
    if lead.display_city:
        base = f"{base}-{_slug_piece(lead.display_city)}"
    candidate = base
    number = 2
    while candidate in used:
        candidate = f"{base}-{number}"
        number += 1
    used.add(candidate)
    return candidate


def _record(lead: ResolvedLead, static_path: str) -> dict:
    return {
        "legacy_url": lead.legacy_url,
        "url_slug": lead.url_slug,
        "query_name": lead.query_name,
        "query_city": lead.query_city,
        "registry_name": lead.registry_name,
        "display_name": lead.display_name,
        "city_source": lead.city_source,
        "display_city": lead.display_city,
        "state": lead.state,
        "naics": lead.naics,
        "naics_code": lead.naics_code,
        "niche": lead.niche,
        "trade_status": lead.trade_status,
        "name_trades": lead.name_trades,
        "flags": lead.flags,
        "static_path": static_path,
        "filing_date": lead.filing_date,
    }


def build(root: Path | None = None) -> dict:
    root = root or ROOT
    leads = resolve_leads(load_public_rows(root / "data" / "ct_ready_public.csv"))
    by_slug: dict[str, list[tuple[ResolvedLead, str]]] = {}
    used: dict[str, set[str]] = {}
    records = []
    for lead in leads:
        folder = root / lead.url_slug
        if not folder.is_dir():
            raise FileNotFoundError(f"Missing trade directory for {lead.legacy_url}")
        pages = folder / "pages"
        used.setdefault(lead.url_slug, set())
        slug = page_slug(lead, used[lead.url_slug])
        static_path = f"{lead.url_slug}/pages/{slug}/index.html"
        by_slug.setdefault(lead.url_slug, []).append((lead, slug))
        records.append(_record(lead, static_path))

    for slug in _SLUG_LABEL:
        pages = root / slug / "pages"
        if pages.exists():
            shutil.rmtree(pages)

    for slug, items in by_slug.items():
        routes = []
        for lead, page in items:
            target = root / lead.url_slug / "pages" / page
            target.mkdir(parents=True, exist_ok=True)
            (target / "index.html").write_text(render_page(lead), encoding="utf-8")
            routes.append({"n": lead.query_name, "c": lead.query_city, "href": f"pages/{page}/"})
        label = _SLUG_LABEL.get(slug, slug)
        (root / slug / "index.html").write_text(
            render_trade_index(slug, label, routes),
            encoding="utf-8",
        )

    corrections = [
        record for record in records
        if record["display_name"] != record["query_name"] or record["display_city"] != record["query_city"]
    ]
    ambiguous = {
        "trade_conflicts": [record for record in records if _flagged(record, "trade_conflict") or _flagged(record, "url_trade_mismatch") or _flagged(record, "unknown_naics")],
        "name_ambiguities": [record for record in records if any(flag.startswith("ambiguous_") for flag in record["flags"])],
        "missing_city": [record for record in records if _flagged(record, "missing_city")],
        "city_filed_all_lowercase": [record for record in records if _flagged(record, "city_source_all_lowercase")],
    }
    ambiguous_ids = {
        record["legacy_url"]
        for group in ("trade_conflicts", "name_ambiguities", "missing_city")
        for record in ambiguous[group]
    }
    summary = {
        "lead_count": len(records),
        "pages_written": len(records),
        "legacy_urls": len({record["legacy_url"] for record in records}),
        "trade_directories": len(by_slug),
        "names_changed_from_query": sum(record["display_name"] != record["query_name"] for record in records),
        "cities_changed_from_query": sum(record["display_city"] != record["query_city"] for record in records),
        "verified_trade_pages": sum(record["trade_status"] == "verified" for record in records),
        "unresolved_trade_pages": sum(record["trade_status"] == "unresolved" for record in records),
        "ambiguous_rows": len(ambiguous_ids),
        "trade_conflicts": len(ambiguous["trade_conflicts"]),
        "name_ambiguities": len(ambiguous["name_ambiguities"]),
        "city_filed_all_lowercase": len(ambiguous["city_filed_all_lowercase"]),
        "missing_city": sum("missing_city" in record["flags"] for record in records),
        "verified_by_trade": {},
    }
    counts: dict[str, int] = {}
    for record in records:
        if record["trade_status"] == "verified":
            counts[record["niche"]] = counts.get(record["niche"], 0) + 1
    summary["verified_by_trade"] = dict(sorted(counts.items()))
    data_dir = root / "data"
    data_dir.mkdir(exist_ok=True)
    MANIFEST_OUT = data_dir / "ct_demo_manifest.json"
    payload = {"summary": summary, "routes": records}
    MANIFEST_OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (data_dir / "ct_ambiguous_rows.json").write_text(
        json.dumps(ambiguous, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (data_dir / "ct_name_corrections.json").write_text(
        json.dumps(corrections, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (data_dir / "ct_summary.json").write_text(
        json.dumps(summary, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return summary


def lookup(leads: list[ResolvedLead] | None = None) -> dict[tuple[str, str, str], ResolvedLead]:
    found = {}
    for lead in leads if leads is not None else resolve_leads():
        found[(lead.url_slug, lead.query_name, lead.query_city)] = lead
    return found


def main() -> None:
    summary = build()
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
