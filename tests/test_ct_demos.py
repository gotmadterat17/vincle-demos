"""Connecticut demo names, trades, and static HTML."""

from __future__ import annotations

import hashlib
import json
import re
import threading
import unittest
import urllib.request
from html import escape, unescape
from pathlib import Path

from ct_demos.build import ROOT, build, lookup, resolve_leads
from ct_demos.render import render_page
from ct_demos.serve import make_server

ROOT_INDEX = ROOT / "index.html"
OTHER_DEMO = ROOT / "quick-connect-electrical-services-marble-falls" / "index.html"


def visible_text(page: str) -> str:
    page = re.sub(r"<script\b[^>]*>.*?</script>", " ", page, flags=re.I | re.S)
    page = re.sub(r"<style\b[^>]*>.*?</style>", " ", page, flags=re.I | re.S)
    page = re.sub(r"<[^>]+>", " ", page)
    return re.sub(r"\s+", " ", unescape(page))


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class ConnecticutDemos(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.root_hash = sha(ROOT_INDEX)
        cls.other_hash = sha(OTHER_DEMO)
        cls.summary = build()
        cls.leads = resolve_leads()
        cls.by_url = {lead.legacy_url: lead for lead in cls.leads}
        cls.manifest = json.loads((ROOT / "data" / "ct_demo_manifest.json").read_text(encoding="utf-8"))
        cls.ambiguous = json.loads((ROOT / "data" / "ct_ambiguous_rows.json").read_text(encoding="utf-8"))

    def test_other_demos_untouched(self):
        self.assertEqual(self.root_hash, sha(ROOT_INDEX))
        self.assertEqual(self.other_hash, sha(OTHER_DEMO))

    def test_every_legacy_url_has_static_html(self):
        self.assertEqual(383, len(self.leads))
        self.assertEqual(383, self.summary["pages_written"])
        self.assertEqual(383, self.summary["legacy_urls"])
        for record in self.manifest["routes"]:
            path = ROOT / record["static_path"]
            self.assertTrue(path.is_file(), record["static_path"])
            page = path.read_text(encoding="utf-8")
            self.assertIn(f'href="{escape(record["legacy_url"], quote=True)}"', page)
            self.assertNotIn("URLSearchParams", page)
            self.assertNotIn("Your Business Name", page)
            self.assertNotIn("Your City", page)
            text = visible_text(page)
            self.assertIn(record["display_name"], text)
            if record["display_city"]:
                self.assertIn(record["display_city"], text)
            else:
                self.assertIn("City was not in the registry row", text)
                self.assertNotIn("Your City", text)

    def test_names_only_change_case_or_legal_suffix(self):
        for lead in self.leads:
            self.assertEqual(lead.display_name.casefold(), lead.stripped_name.casefold(), lead.registry_name)
            self.assertEqual(lead.display_city.casefold(), lead.city_source.strip().casefold())

    def test_wd_dk_and_mixed_case_names(self):
        wd = self._lead("WD.DK LLC")
        self.assertEqual("WD.DK", wd.display_name)
        self.assertEqual("Wd.dk", wd.query_name)
        self.assertEqual("Tolland", wd.display_city)
        page = (ROOT / self._record(wd)["static_path"]).read_text(encoding="utf-8")
        text = visible_text(page)
        self.assertIn("WD.DK", text)
        self.assertIn("Tolland", text)
        self.assertNotIn("Wd.dk", text)
        self.assertEqual("ElecStrick Integrated Solutions", self._lead("ElecStrick Integrated Solutions LLC").display_name)
        self.assertEqual("PM Masonry", self._lead("PM Masonry LLC").display_name)
        self.assertEqual("A&J Cleaning", self._lead("A&J Cleaning LLC").display_name)
        self.assertEqual("The SKY Housing", self._lead("The SKY Housing LLC").display_name)
        self.assertEqual("Vantage Property Service Group", self._lead("Vantage Property Service Group Limited Liability Co.").display_name)
        self.assertEqual("veronica cleaning services", self._lead("veronica cleaning services LLC").display_name)

    def test_electrical_page_is_not_an_auto_demo(self):
        lead = self._lead("ElecStrick Integrated Solutions LLC")
        self.assertEqual("verified", lead.trade_status)
        self.assertEqual("electrical", lead.niche)
        page = render_page(lead)
        self.assertIn('data-trade="electrical"', page)
        self.assertIn("238210", page)
        self.assertIn("Electrical Contractors and Other Wiring Installation Contractors", page)
        self.assertNotIn("Automotive", page)
        self.assertNotIn("811111", page)
        self.assertNotIn("811198", page)
        self.assertNotIn("811114", page)
        self.assertNotIn("Panel upgrades", page)
        text = visible_text(page)
        self.assertIn("ElecStrick Integrated Solutions", text)
        self.assertIn("Cheshire", text)

    def test_auto_page_is_not_an_electrical_demo(self):
        lead = self._lead("Dr. D's Express Auto LLC")
        self.assertEqual("verified", lead.trade_status)
        self.assertEqual("auto repair", lead.niche)
        page = render_page(lead)
        self.assertIn('data-trade="auto-repair"', page)
        self.assertIn("811198", page)
        self.assertIn("All Other Automotive Repair and Maintenance", page)
        self.assertNotIn("238210", page)
        self.assertNotIn("Electrical Contractors", page)
        self.assertNotIn("Electrician", page)
        self.assertNotIn("Panel upgrades", page)
        text = visible_text(page)
        self.assertIn("Dr. D's Express Auto", text)
        self.assertIn("Unionville", text)

    def test_electrical_name_with_auto_naics_is_not_an_auto_pitch(self):
        lead = self._lead("EFRA'N HERMANDEZ ELECTRICAL LLC")
        self.assertEqual("unresolved", lead.trade_status)
        self.assertIn("trade_conflict", lead.flags)
        self.assertIn("electrical", lead.name_trades)
        self.assertEqual("auto repair", lead.niche)
        page = render_page(lead)
        self.assertIn('data-trade="unresolved"', page)
        self.assertNotIn('data-trade="auto-repair"', page)
        self.assertNotIn("AutomotiveRepair", page)
        self.assertNotIn("Panel upgrades", page)
        self.assertNotIn("free quote", page.lower())
        self.assertIn("811114", page)
        self.assertIn("Specialized Automotive Repair", page)
        text = visible_text(page)
        self.assertIn("EFRA'N Hermandez Electrical", text)
        self.assertIn("Danbury", text)
        self.assertIn("do not match", text)
        urls = [row["legacy_url"] for row in self.ambiguous["trade_conflicts"]]
        self.assertIn(lead.legacy_url, urls)

    def test_no_invented_contact_or_reviews(self):
        for lead in self.leads:
            page = render_page(lead).lower()
            self.assertNotIn("tel:", page)
            self.assertNotIn("mailto:", page)
            self.assertNotIn("free quote", page)
            self.assertNotIn("upfront", page)
            self.assertNotIn("google review", page)
            self.assertNotIn("★★", page)
            self.assertNotIn("$", page)
            self.assertNotIn("years in business", page)
            self.assertNotIn("licensed", page)
            self.assertNotIn("guarantee", page)
            scripts = re.findall(r"<script\b([^>]*)>", page, flags=re.I)
            self.assertTrue(scripts)
            for attrs in scripts:
                self.assertIn("application/ld+json", attrs)

    def test_missing_city_is_not_invented(self):
        lead = self._lead("Next Level Home Solutions Inc")
        self.assertEqual("", lead.display_city)
        self.assertIn("missing_city", lead.flags)
        text = visible_text(render_page(lead))
        self.assertIn("Next Level Home Solutions", text)
        self.assertIn("City was not in the registry row", text)
        self.assertNotIn("Your City", text)

    def test_short_tokens_are_not_expanded(self):
        self.assertEqual("DGO House Buyers", self._lead("DGO HOUSE BUYERS LLC").display_name)
        self.assertEqual("JX", self._lead("JX LLC").display_name)
        self.assertEqual("KND", self._lead("KND L.L.C.").display_name)
        blob = json.dumps(self.ambiguous["name_ambiguities"])
        self.assertIn("DGO", blob)
        self.assertIn("JX", blob)
        self.assertNotIn("Dgo Homes", blob)

    def test_legacy_url_server_returns_static_html_without_js(self):
        server = make_server(port=0)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            host, port = server.server_address
            for registry, expect_name, expect_city in (
                ("WD.DK LLC", "WD.DK", "Tolland"),
                ("ElecStrick Integrated Solutions LLC", "ElecStrick Integrated Solutions", "Cheshire"),
                ("Dr. D's Express Auto LLC", "Dr. D's Express Auto", "Unionville"),
                ("EFRA'N HERMANDEZ ELECTRICAL LLC", "EFRA'N Hermandez Electrical", "Danbury"),
            ):
                lead = self._lead(registry)
                quoted = lead.legacy_url.split("github.io/vincle-demos/")[1]
                with urllib.request.urlopen(f"http://{host}:{port}/{quoted}") as response:
                    page = response.read().decode("utf-8")
                    self.assertEqual(200, response.status)
                self.assertNotIn("URLSearchParams", page)
                text = visible_text(page)
                self.assertIn(expect_name, text)
                self.assertIn(expect_city, text)
                static = (ROOT / self._record(lead)["static_path"]).read_text(encoding="utf-8")
                self.assertEqual(static, page)
        finally:
            server.shutdown()
            server.server_close()

    def _lead(self, registry_name: str):
        matches = [lead for lead in self.leads if lead.registry_name == registry_name]
        self.assertEqual(1, len(matches), registry_name)
        return matches[0]

    def _record(self, lead):
        matches = [row for row in self.manifest["routes"] if row["legacy_url"] == lead.legacy_url]
        self.assertEqual(1, len(matches))
        return matches[0]


if __name__ == "__main__":
    unittest.main()
