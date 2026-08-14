import re
import unittest
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
JAVASCRIPT = (ROOT / "app.js").read_text(encoding="utf-8")
STYLES = (ROOT / "styles.css").read_text(encoding="utf-8")


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.step_indicators = []
        self.step_contents = []
        self.previous_steps = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if attributes.get("id"):
            self.ids.add(attributes["id"])
        if tag == "img":
            self.images.append(attributes)
        classes = attributes.get("class", "").split()
        if "sim-step-indicator" in classes:
            self.step_indicators.append(attributes.get("data-step"))
        if "sim-step-content" in classes:
            self.step_contents.append(attributes.get("data-step"))
        if "btn-prev" in classes:
            self.previous_steps.append(attributes.get("data-prev"))


PARSER = SiteParser()
PARSER.feed(HTML)


class SimulatorRegressionTests(unittest.TestCase):
    def test_simulator_has_exactly_three_consistent_steps(self):
        self.assertEqual(PARSER.step_indicators, ["1", "2", "3"])
        self.assertEqual(PARSER.step_contents, ["1", "2", "3"])
        self.assertEqual(PARSER.previous_steps, ["1", "2"])

    def test_receipt_is_updated_when_summary_step_opens(self):
        self.assertIn("if (stepNum === 3)", JAVASCRIPT)
        self.assertNotIn("if (stepNum === 4)", JAVASCRIPT)

    def test_studio_flow_has_no_home_address_dependencies(self):
        stale_ids = {
            "client-street",
            "client-number",
            "client-complement",
            "client-reference",
        }
        self.assertTrue(stale_ids.isdisjoint(PARSER.ids))
        for stale_id in stale_ids:
            self.assertNotIn(stale_id, JAVASCRIPT)

    def test_estimated_prices_do_not_generate_or_request_pix_payment(self):
        self.assertNotIn("generateStaticPix", JAVASCRIPT)
        self.assertNotIn("api.qrserver.com", JAVASCRIPT)
        self.assertNotIn("confirm-pix-checkbox", HTML)
        self.assertNotIn("sim-pix-payment-box", HTML)
        self.assertIn("valor final será confirmado", HTML.lower())


class DateAndMotionRegressionTests(unittest.TestCase):
    def test_minimum_date_uses_local_calendar_components(self):
        self.assertIn("formatLocalDate", JAVASCRIPT)
        self.assertNotIn("toISOString().split('T')[0]", JAVASCRIPT)

    def test_canvas_respects_reduced_motion_preference(self):
        self.assertIn("matchMedia('(prefers-reduced-motion: reduce)')", JAVASCRIPT)
        self.assertIn("cancelAnimationFrame", JAVASCRIPT)


class ContentAndPerformanceRegressionTests(unittest.TestCase):
    def test_static_images_reserve_space_and_use_loading_policy(self):
        self.assertGreater(len(PARSER.images), 0)
        for image in PARSER.images:
            with self.subTest(src=image.get("src")):
                self.assertTrue(image.get("src"))
                self.assertIn("width", image)
                self.assertIn("height", image)
                self.assertIn(image.get("loading"), {"eager", "lazy"})

        hero = next(image for image in PARSER.images if "hero-img" in image.get("class", ""))
        self.assertEqual(hero["loading"], "eager")
        self.assertEqual(hero.get("fetchpriority"), "high")

        below_fold = [image for image in PARSER.images if image is not hero]
        self.assertTrue(all(image["loading"] == "lazy" for image in below_fold))

    def test_old_brand_and_known_copy_errors_are_removed(self):
        combined = f"{HTML}\n{JAVASCRIPT}\n{STYLES}".lower()
        for stale_text in (
            "auranativa",
            "auranativaoficial",
            "a experiência a domicílio",
            "uma selection",
            "restruturação",
        ):
            self.assertNotIn(stale_text, combined)

    def test_local_assets_exist(self):
        sources = re.findall(r'(?:src|href|data)="(assets/[^"]+)"', HTML)
        self.assertTrue(sources)
        for source in sources:
            with self.subTest(source=source):
                self.assertTrue((ROOT / source).exists())


if __name__ == "__main__":
    unittest.main()
