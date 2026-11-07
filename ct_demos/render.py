"""Static HTML for one Connecticut registry demo.

The business name and city are written into the document. No script reads
the query string. Pages do not invent reviews, phones, prices, streets, or
service lists.
"""

from __future__ import annotations

import html
import json
import re

from ct_demos.normalize import ResolvedLead

_SCHEMA = {
    "electrical": "Electrician",
    "auto repair": "AutomotiveRepair",
    "auto body": "AutomotiveRepair",
    "plumbing / HVAC": "HomeAndConstructionBusiness",
    "remodeling": "HomeAndConstructionBusiness",
    "carpentry": "HomeAndConstructionBusiness",
    "painting": "HomeAndConstructionBusiness",
    "roofing": "HomeAndConstructionBusiness",
    "masonry": "HomeAndConstructionBusiness",
    "siding": "HomeAndConstructionBusiness",
    "flooring": "HomeAndConstructionBusiness",
    "drywall": "HomeAndConstructionBusiness",
    "tile": "HomeAndConstructionBusiness",
    "framing": "HomeAndConstructionBusiness",
    "foundation / concrete": "HomeAndConstructionBusiness",
    "building finishing": "HomeAndConstructionBusiness",
    "specialty contractor": "HomeAndConstructionBusiness",
    "janitorial / cleaning": "LocalBusiness",
    "carpet cleaning": "LocalBusiness",
    "property services": "LocalBusiness",
}

_PALETTES = {
    "electrical": ("#141820", "#f3f6f8", "#3e4a57", "#d5dee6", "#8a5a12", "#d5e4f2", "#f4e7cf"),
    "auto-repair": ("#1c140f", "#f6f3ee", "#5c4e43", "#e3d8cc", "#9a3412", "#f0d9c8", "#e7e0d6"),
    "auto-body": ("#1a1216", "#f7f2f3", "#5c4650", "#e6d5da", "#9f1239", "#f3d0d8", "#efe6e4"),
    "plumbing-hvac": ("#102027", "#f2f7f7", "#3d5558", "#d0e0e2", "#0f6e6e", "#d4ecec", "#e7f0e4"),
    "remodeling": ("#1c1915", "#f6f4ef", "#564e43", "#e4ddd2", "#8a5a2b", "#efe2d2", "#e7e2d8"),
    "carpentry": ("#23180f", "#f6f3ee", "#5a4636", "#e4d8c8", "#7c4a1e", "#f0ddc6", "#e9e2d6"),
    "painting": ("#1b1a22", "#f5f4f8", "#4c4a58", "#dddbe6", "#5b4b8a", "#e3def4", "#f7efe4"),
    "roofing": ("#1a1d22", "#f4f5f6", "#454c57", "#d8dde3", "#3f4c5a", "#d9e1ea", "#ece4d8"),
    "masonry": ("#1c1917", "#f5f4f2", "#514a44", "#e0dbd6", "#7a5344", "#eadfd6", "#e6e2dc"),
    "janitorial-cleaning": ("#10241f", "#f3f7f5", "#3d524b", "#d3e2db", "#1f6b52", "#d7eee4", "#e7f0ea"),
    "specialty-contractor": ("#1a1c1f", "#f4f5f6", "#4a5160", "#d9dee6", "#334155", "#dde3ee", "#eceae4"),
    "property-services": ("#14201c", "#f4f6f4", "#445248", "#d5e0d8", "#3f6212", "#e0ecd4", "#e8eee8"),
    "flooring": ("#24180f", "#f7f4ef", "#5a4638", "#e6dccf", "#92400e", "#f3e0cc", "#eee6da"),
    "building-finishing": ("#1c1917", "#f6f5f3", "#534c46", "#e3ddd6", "#57534e", "#e7e2da", "#efeae3"),
    "foundation-concrete": ("#1b1e22", "#f4f5f6", "#4b5563", "#d9dee5", "#4b5563", "#e1e5eb", "#e9e6e1"),
    "framing": ("#21170f", "#f6f3ee", "#594838", "#e5d9c8", "#8a5a12", "#f0e0c8", "#e8e2d6"),
    "siding": ("#161e27", "#f3f6f8", "#3e4c5c", "#d4dee8", "#1e4e79", "#d6e4f2", "#e8eef3"),
    "tile": ("#1c1720", "#f6f4f7", "#534858", "#e0d9e4", "#6d28a8", "#e6dcf3", "#f3eef2"),
    "carpet-cleaning": ("#10241f", "#f3f7f5", "#3d524b", "#d3e2db", "#0f766e", "#d5efea", "#e7f1ec"),
    "drywall": ("#1c1b19", "#f6f5f3", "#524e49", "#e2ded8", "#78716c", "#e8e4de", "#f1eee8"),
    "unresolved": ("#1f2933", "#f7f7f5", "#52606d", "#e4e7eb", "#334e68", "#e6edf2", "#f3f0e8"),
}

_BASE_CSS = """
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink);background:var(--paper);line-height:1.5;font-size:1.0625rem}
.skip{position:absolute;left:0.75rem;top:0.75rem;transform:translateY(-160%);background:var(--ink);color:var(--paper);padding:0.75rem 1rem;min-height:44px;z-index:5;text-decoration:none}
.skip:focus{transform:none}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.bar{background:var(--ink);color:var(--paper);padding:0.7rem 1.25rem;font-size:0.95rem}
.bar p{margin:0;max-width:72rem}
.hero{position:relative;isolation:isolate;padding:2.5rem 1.25rem 2rem;overflow:hidden}
.hero:before{content:"";position:absolute;inset:-20%;z-index:-1;background:
  radial-gradient(ellipse at 12% 0%, var(--mesh-a), transparent 58%),
  radial-gradient(ellipse at 88% 10%, var(--mesh-b), transparent 52%);
}
h1{font-family:Georgia,"Iowan Old Style","Palatino Linotype",Palatino,serif;font-weight:500;font-size:clamp(2.6rem,8vw,5.4rem);line-height:0.96;letter-spacing:-0.03em;margin:0.35rem 0 0.75rem;max-width:16ch;text-wrap:balance}
.where{margin:0;font-size:1rem}
.lede{max-width:38rem;font-size:1.15rem;margin:0}
.rule{width:4.5rem;height:3px;background:var(--accent);border:0;margin:1rem 0}
.proof{list-style:none;display:flex;flex-wrap:wrap;gap:1.25rem 2rem;margin:0;padding:1.25rem 1.25rem;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.proof strong{display:block;font-family:Georgia,serif;font-size:1.75rem;font-weight:500;letter-spacing:-0.03em}
.proof span{color:var(--muted);font-size:0.95rem}
main{padding:0 0 4rem}
section{padding:2.5rem 1.25rem;border-bottom:1px solid var(--line)}
.section-label{margin:0 0 0.75rem;color:var(--muted);font-size:0.95rem}
h2{font-family:Georgia,serif;font-weight:500;font-size:1.75rem;margin:0 0 0.75rem;text-wrap:balance}
dl{margin:0}
.row{padding:0.85rem 0;border-top:1px solid var(--line)}
.row:first-child{border-top:0}
dt{color:var(--muted);font-size:0.95rem}
dd{margin:0.15rem 0 0;font-size:1.15rem}
.note{max-width:40rem}
footer{padding:2rem 1.25rem 3rem;color:var(--muted);font-size:0.95rem}
footer a{color:var(--ink)}
@keyframes drift{from{transform:translate3d(0,0,0)}to{transform:translate3d(0,-1.5%,0)}}
@media (prefers-reduced-motion:no-preference){
  .hero:before{animation:drift 28s ease-in-out infinite alternate}
}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .hero:before{animation:none}
}
@media (min-width:800px){
  .hero,section,footer,.proof{padding-left:6vw;padding-right:6vw}
  section{display:grid;grid-template-columns:12rem 1fr;column-gap:2rem;align-items:start}
  .section-label{grid-column:1}
  section > :not(.section-label){grid-column:2}
}
@media (min-width:1100px){
  h1{max-width:18ch}
}
"""


def trade_key(lead: ResolvedLead) -> str:
    if lead.trade_status != "verified" or not lead.niche:
        return "unresolved"
    return re.sub(r"[^a-z0-9]+", "-", lead.niche.lower()).strip("-")


def _esc(value: str) -> str:
    return html.escape(value or "", quote=True)


def _palette(key: str) -> tuple[str, str, str, str, str, str, str]:
    return _PALETTES.get(key, _PALETTES["unresolved"])


def _notes(lead: ResolvedLead) -> list[str]:
    notes: list[str] = []
    if "ambiguous_all_lowercase" in lead.flags:
        notes.append("The registry filing wrote this name in lowercase. Capitals were not added.")
    if any(flag.startswith("ambiguous_apostrophe:") for flag in lead.flags):
        notes.append("An apostrophe in the filing was left as filed. A different capital after the mark would be a guess.")
    if any(flag.startswith("ambiguous_short_token:") or flag.startswith("ambiguous_initialism:") or flag.startswith("ambiguous_alnum:") for flag in lead.flags):
        notes.append("A short or initial-style token stays in the filing’s capitals. It was not expanded into another word.")
    if "ambiguous_glued_suffix" in lead.flags:
        notes.append("The filing glues an entity ending onto the name. It was not split into a guessed phrase.")
    if "city_source_all_lowercase" in lead.flags:
        notes.append("The city is the filing’s spelling with case adjusted. It was not replaced with a different place name.")
    return notes


def _json_ld(lead: ResolvedLead) -> str:
    if lead.trade_status == "verified":
        schema_type = _SCHEMA.get(lead.niche, "LocalBusiness")
        description = f"Connecticut Business Registry category: {lead.naics}."
    else:
        schema_type = "LocalBusiness"
        description = (
            "Connecticut Business Registry filing. The legal name and the NAICS category do not name the same trade, "
            "so this preview does not add a service list."
        )
    payload: dict = {
        "@context": "https://schema.org",
        "@type": schema_type,
        "name": lead.display_name,
        "url": lead.legacy_url,
        "description": description,
        "address": {
            "@type": "PostalAddress",
            "addressRegion": lead.state or "CT",
            "addressCountry": "US",
        },
    }
    if lead.display_city:
        payload["address"]["addressLocality"] = lead.display_city
        payload["areaServed"] = lead.display_city
    raw = json.dumps(payload, ensure_ascii=True).replace("<", "\\u003c")
    return raw


def render_page(lead: ResolvedLead) -> str:
    key = trade_key(lead)
    ink, paper, muted, line, accent, mesh_a, mesh_b = _palette(key)
    if lead.trade_status == "verified":
        trade_label = lead.niche[:1].upper() + lead.niche[1:] if lead.niche else "Registry filing"
        if lead.display_city:
            title = f"{lead.display_name} | {trade_label} in {lead.display_city}, CT"
            description = (
                f"{lead.display_name} in {lead.display_city}, CT. "
                f"Connecticut Business Registry category: {lead.naics}."
            )
        else:
            title = f"{lead.display_name} | {trade_label} in Connecticut"
            description = (
                f"{lead.display_name} in Connecticut. "
                f"Connecticut Business Registry category: {lead.naics}. City was blank on the filing."
            )
        lede = f"The Connecticut Business Registry category on this filing is {lead.naics}."
    else:
        trade_label = "Registry filing"
        if lead.display_city:
            title = f"{lead.display_name} in {lead.display_city}, CT"
        else:
            title = f"{lead.display_name} in Connecticut"
        description = (
            f"{lead.display_name}. The legal name and the Connecticut Business Registry NAICS category "
            "do not name the same trade. No service list is shown."
        )
        named = ", ".join(lead.name_trades) if lead.name_trades else "a different trade"
        lede = (
            f"The legal name includes wording for {named}. "
            f"The registry category on this filing is {lead.naics or 'not coded'}. "
            "Those do not match, so this page does not turn either one into a service list or a trade pitch."
        )
    if lead.display_city:
        where = f"{lead.display_city}, Connecticut"
    else:
        where = "City was not in the registry row."
    note_html = "".join(f"<p class=\"note\">{_esc(note)}</p>" for note in _notes(lead))
    filed = lead.filing_date or "Not in row"
    state = lead.state or "Not in row"
    source_url = lead.source_url or "https://data.ct.gov/Business/Connecticut-Business-Registry-Business-Master/n7gp-d28j"
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{_esc(title)}</title>
<meta name="description" content="{_esc(description)}">
<link rel="canonical" href="{_esc(lead.legacy_url)}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%23141820'/%3E%3C/svg%3E">
<script type="application/ld+json">{_json_ld(lead)}</script>
<style>
:root {{
  --ink:{ink}; --paper:{paper}; --muted:{muted}; --line:{line}; --accent:{accent};
  --mesh-a:{mesh_a}; --mesh-b:{mesh_b};
}}
{_BASE_CSS}
</style>
</head>
<body data-trade="{_esc(key)}" data-naics="{_esc(lead.naics_code)}" data-trade-status="{_esc(lead.trade_status)}">
<a class="skip" href="#main">Skip to content</a>
<div class="bar"><p>Demo preview. Not this business’s website. The only business facts here are the name, city, and NAICS category from the Connecticut Business Registry filing.</p></div>
<header class="hero">
  <p class="where" id="business-city">{_esc(where)}</p>
  <h1 id="business-name">{_esc(lead.display_name)}</h1>
  <hr class="rule">
  <p class="lede">{_esc(lede)}</p>
</header>
<ul class="proof">
  <li><strong>{_esc(state)}</strong><span>State on the filing</span></li>
  <li><strong>{_esc(lead.naics_code or "None")}</strong><span>NAICS code</span></li>
  <li><strong>{_esc(filed)}</strong><span>Filing date</span></li>
</ul>
<main id="main">
  <section>
    <p class="section-label">Record</p>
    <div>
      <h2>What the filing says</h2>
      <dl>
        <div class="row"><dt>Name</dt><dd>{_esc(lead.display_name)}</dd></div>
        <div class="row"><dt>City</dt><dd>{_esc(lead.display_city or "Not in the registry row")}</dd></div>
        <div class="row"><dt>State</dt><dd>{_esc(state)}</dd></div>
        <div class="row"><dt>Category</dt><dd>{_esc(lead.naics or "Not in the registry row")}</dd></div>
        <div class="row"><dt>Filed</dt><dd>{_esc(filed)}</dd></div>
      </dl>
      {note_html}
    </div>
  </section>
  <section>
    <p class="section-label">Limits</p>
    <div>
      <h2>What this preview leaves out</h2>
      <p class="note">Phone, street, hours, prices, reviews, and a service menu are not in this registry row, so they are not on this page. There is no quote form and no call button.</p>
    </div>
  </section>
</main>
<footer>
  <p>Source: <a href="{_esc(source_url)}">Connecticut Business Registry dataset n7gp-d28j</a>.</p>
  <p>Demo preview for {_esc(lead.display_name)}.</p>
</footer>
</body>
</html>
"""


def render_trade_index(slug: str, label: str, routes: list[dict]) -> str:
    """Directory page. Query links redirect when JavaScript runs.

    The personalized document itself is the static page (and the demo server
    returns that document for the original query URL). This file is only the
    fallback GitHub Pages serves for the directory.
    """
    payload = json.dumps(routes, ensure_ascii=True).replace("<", "\\u003c")
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(label)} previews</title>
<meta name="description" content="Demo previews for Connecticut {html.escape(label)} filings. Each business page has its name and city in the HTML.">
<style>
body{{margin:0;font:1.05rem/1.5 system-ui,sans-serif;color:#141820;background:#f6f7f8}}
main{{max-width:40rem;padding:3rem 1.25rem}}
a{{color:#141820}}
</style>
<script type="application/json" id="ct-routes">{payload}</script>
<script>
(function(){{
  var node=document.getElementById("ct-routes");
  if(!node||!window.URLSearchParams) return;
  var routes=JSON.parse(node.textContent||"[]");
  var params=new URLSearchParams(location.search);
  var name=params.get("n")||"";
  var city=params.get("c")||"";
  for(var i=0;i<routes.length;i++){{
    if(routes[i].n===name && routes[i].c===city){{ location.replace(routes[i].href); return; }}
  }}
}})();
</script>
</head>
<body>
<main>
<h1>{html.escape(label)} previews</h1>
<p>Each business preview is its own HTML page. The name and city are in that page, not filled in by a script.</p>
<p>Links that were already sent use <code>{html.escape(slug)}/?n=&amp;c=</code>. The demo server answers those URLs with the business page. On a host that ignores the query string, the script above opens the same page when JavaScript is available.</p>
<noscript><p>JavaScript is off, so this directory page cannot read the link’s parameters. Open the business’s static page, or request the original link from the demo server.</p></noscript>
</main>
</body>
</html>
"""
