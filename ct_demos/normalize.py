"""Name, city, and trade resolution for Connecticut registry demos.

Display names stay inside what the filing actually wrote. Legal suffixes
come off. Mixed-case filings keep their capitals. All-caps filings use
title case for ordinary words, and keep dotted initials, ampersand
initials, and short unresolved tokens in the filing's own capitals.
Nothing in an email address or a guessed expansion is used as a name.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

# Longer forms first. "Company" and a bare "Co" stay: they are often the trade name.
_SUFFIX = re.compile(
    r"(?i)(?:,\s*|\s+)(?:"
    r"limited\s+liability\s+company|"
    r"limited\s+liability\s+co\.?|"
    r"l\.l\.c\.?|"
    r"l\.l\.p\.?|"
    r"incorporated|"
    r"corporation|"
    r"limited|"
    r"llc|llp|inc\.?|corp\.?|ltd\.?"
    r")\.?\s*$"
)

# Function and ordinary words we will title-case inside an all-caps filing.
_COMMON = {
    "A", "AN", "THE", "AND", "OF", "FOR", "TO", "OR", "IN", "ON", "AT", "BY",
    "ALL", "NEW", "OLD", "RED", "BLUE", "HOME", "AUTO", "TILE", "SONS", "SON",
    "BEST", "PEAK", "DUCT", "ROLL", "GO", "IT", "DE", "LA", "LOS", "LAS", "DEL",
    "CON", "Y", "MR", "ST", "SITE", "WORK", "CARE",
}

_NAICS = {
    "236118": ("remodeling", "ct-remodeling"),
    "561720": ("janitorial / cleaning", "ct-janitorial-cleaning"),
    "238990": ("specialty contractor", "ct-specialty-contractor"),
    "238350": ("carpentry", "ct-carpentry"),
    "238210": ("electrical", "ct-electrical"),
    "811111": ("auto repair", "ct-auto-repair"),
    "811198": ("auto repair", "ct-auto-repair"),
    "811114": ("auto repair", "ct-auto-repair"),
    "811121": ("auto body", "ct-auto-body"),
    "238320": ("painting", "ct-painting"),
    "238220": ("plumbing / HVAC", "ct-plumbing-hvac"),
    "561790": ("property services", "ct-property-services"),
    "238160": ("roofing", "ct-roofing"),
    "238140": ("masonry", "ct-masonry"),
    "238390": ("building finishing", "ct-building-finishing"),
    "238330": ("flooring", "ct-flooring"),
    "238190": ("foundation / concrete", "ct-foundation-concrete"),
    "238130": ("framing", "ct-framing"),
    "238170": ("siding", "ct-siding"),
    "238340": ("tile", "ct-tile"),
    "561740": ("carpet cleaning", "ct-carpet-cleaning"),
    "238310": ("drywall", "ct-drywall"),
    "238150": ("specialty contractor", "ct-specialty-contractor"),
}

# High-precision words in the legal name. Generic words (construction, services) are omitted.
_NAME_TRADE = (
    ("electrical", re.compile(r"\b(?:electrical|electrician|electric)\b", re.I)),
    ("plumbing / HVAC", re.compile(r"\b(?:plumb(?:ing|er)?|hvac|heating|cooling)\b", re.I)),
    ("roofing", re.compile(r"\broof(?:ing|er)?\b", re.I)),
    ("painting", re.compile(r"\bpaint(?:ing|er)?\b", re.I)),
    ("carpentry", re.compile(r"\bcarpent(?:ry|er)?\b", re.I)),
    ("masonry", re.compile(r"\bmason(?:ry)?\b", re.I)),
    ("janitorial / cleaning", re.compile(r"\b(?:clean(?:ing|ers?)?|janitorial)\b", re.I)),
    ("auto body", re.compile(r"\b(?:auto\s*body|autobody|collision)\b", re.I)),
    ("auto repair", re.compile(r"\b(?:auto\s+repair|automotive|mechanic)\b", re.I)),
    ("flooring", re.compile(r"\bfloor(?:ing)?\b", re.I)),
    ("tile", re.compile(r"\btiles?\b", re.I)),
    ("drywall", re.compile(r"\bdrywall\b", re.I)),
    ("siding", re.compile(r"\bsiding\b", re.I)),
    ("carpet cleaning", re.compile(r"\bcarpet\b", re.I)),
    ("framing", re.compile(r"\bfram(?:e|ing)\b", re.I)),
)


@dataclass
class ResolvedLead:
    registry_name: str
    stripped_name: str
    display_name: str
    query_name: str
    city_source: str
    display_city: str
    query_city: str
    state: str
    naics: str
    naics_code: str
    niche: str
    expected_slug: str
    url_slug: str
    legacy_url: str
    filing_date: str
    source: str
    source_url: str
    trade_status: str  # verified | unresolved
    name_trades: list[str] = field(default_factory=list)
    flags: list[str] = field(default_factory=list)

    @property
    def name_corrected(self) -> bool:
        return self.display_name != self.query_name


def strip_entity_suffix(name: str) -> str:
    text = name.strip().strip('"').strip()
    previous = None
    while text != previous:
        previous = text
        text = _SUFFIX.sub("", text).strip(" ,")
    return text


def _letters(token: str) -> str:
    return re.sub(r"[^A-Za-z]", "", token)


def _title_token(token: str) -> str:
    """Title-case letters. A hyphen starts a new word. Apostrophes do not."""
    chars: list[str] = []
    start = True
    for char in token:
        if char.isalpha():
            chars.append(char.upper() if start else char.lower())
            start = False
        else:
            chars.append(char)
            if char == "-":
                start = True
    return "".join(chars)


def _render_all_caps_token(token: str, flags: list[str]) -> str:
    letters = _letters(token)
    if re.search(r"[A-Za-z0-9]\.[A-Za-z0-9]", token) or re.fullmatch(r"[A-Z]\.", token):
        flags.append(f"preserved_initialism:{token}")
        return token
    if re.fullmatch(r"[A-Z]{1,4}(?:&[A-Z]{1,4})+", token):
        flags.append(f"preserved_initialism:{token}")
        return token
    if "'" in token or "’" in token:
        flags.append(f"ambiguous_apostrophe:{token}")
        return token
    if re.search(r"\d", token):
        flags.append(f"ambiguous_alnum:{token}")
        return token
    if letters and letters.upper() not in _COMMON:
        vowel_free = letters.isalpha() and not re.search(r"[AEIOU]", letters, re.I)
        if vowel_free and 2 <= len(letters) <= 6:
            flags.append(f"ambiguous_initialism:{token}")
            return token
        if letters.isalpha() and 2 <= len(letters) <= 3:
            flags.append(f"ambiguous_short_token:{token}")
            return token
    if "-" in token and letters:
        parts = token.split("-")
        return "-".join(_render_all_caps_token(part, flags) if part else part for part in parts)
    return _title_token(token)


def display_name(registry_name: str) -> tuple[str, str, list[str]]:
    """Return (stripped filing, display name, flags)."""
    flags: list[str] = []
    stripped = strip_entity_suffix(registry_name)
    if not stripped:
        flags.append("empty_name")
        return stripped, stripped, flags
    if re.search(r"(?i)(?:llc|l\.l\.c|llp|inc|corp)\.?$", stripped.replace(" ", "")):
        flags.append("ambiguous_glued_suffix")
    letters = _letters(stripped)
    if letters and letters.islower() and not any(ch.isupper() for ch in stripped):
        flags.append("ambiguous_all_lowercase")
        return stripped, stripped, flags
    if any(ch.islower() for ch in stripped):
        return stripped, stripped, flags
    shown = " ".join(_render_all_caps_token(token, flags) for token in stripped.split())
    return stripped, shown, flags


def display_city(city: str) -> tuple[str, list[str]]:
    flags: list[str] = []
    text = (city or "").strip()
    if not text:
        flags.append("missing_city")
        return "", flags
    if any(ch.islower() for ch in text) and any(ch.isupper() for ch in text):
        return text, flags
    if text.islower():
        flags.append("city_source_all_lowercase")
    parts = []
    for word in text.split():
        pieces = []
        for piece in word.split("-"):
            piece_letters = _letters(piece)
            if len(piece_letters) == 1:
                pieces.append(piece.upper())
            else:
                pieces.append(_title_token(piece))
        parts.append("-".join(pieces))
    return " ".join(parts), flags


def naics_code(niche_field: str) -> str:
    match = re.search(r"\((\d{6})\)", niche_field or "")
    return match.group(1) if match else ""


def name_trade_signals(registry_name: str) -> list[str]:
    found: list[str] = []
    for niche, pattern in _NAME_TRADE:
        if pattern.search(registry_name) and niche not in found:
            found.append(niche)
    return found


def resolve_row(row: dict, query_name: str, query_city: str, url_slug: str, legacy_url: str) -> ResolvedLead:
    stripped, shown, flags = display_name(row.get("name") or "")
    city, city_flags = display_city(row.get("city") or "")
    flags.extend(city_flags)
    code = naics_code(row.get("niche") or "")
    naics_niche, expected_slug = _NAICS.get(code, ("", ""))
    if not code or not naics_niche:
        flags.append("unknown_naics")
    if expected_slug and url_slug and expected_slug != url_slug:
        flags.append("url_trade_mismatch")
    signals = name_trade_signals(row.get("name") or "")
    conflict = bool(signals) and naics_niche not in signals
    if conflict:
        flags.append("trade_conflict")
    unresolved = conflict or "unknown_naics" in flags or "url_trade_mismatch" in flags
    state = (row.get("state") or "").strip()
    if state and state != "CT":
        flags.append("unexpected_state")
    filing = (row.get("filing_date") or "").strip()
    if filing and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", filing):
        flags.append("unexpected_filing_date")
        filing = ""
    return ResolvedLead(
        registry_name=row.get("name") or "",
        stripped_name=stripped,
        display_name=shown,
        query_name=query_name,
        city_source=row.get("city") or "",
        display_city=city,
        query_city=query_city,
        state=state,
        naics=row.get("niche") or "",
        naics_code=code,
        niche=naics_niche,
        expected_slug=expected_slug,
        url_slug=url_slug,
        legacy_url=legacy_url,
        filing_date=filing,
        source=row.get("source") or "",
        source_url=row.get("source_url") or "",
        trade_status="unresolved" if unresolved else "verified",
        name_trades=signals,
        flags=flags,
    )
