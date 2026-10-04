import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { runAnalytics } from "./analytics-runtime.mjs";

const source = fs.readFileSync("src/components/GoogleAnalytics.astro", "utf8");
const measurementId = source.match(/const measurementId = "(G-[A-Z0-9]+)";/)?.[1];
assert(measurementId, "GA4 Measurement ID must have a single source");
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const pages = walk("dist").filter((file) => file.endsWith(".html") && !file.endsWith("google57af630fc0ce16af.html"));
const representativeTypes = new Map([
  ["/Rosarium/", "home"], ["/Rosarium/about/", "about"],
  ["/Rosarium/ai/", "ai"], ["/Rosarium/dx/", "dx"],
  ["/Rosarium/ai-design/knowledge-context/", "theme"], ["/Rosarium/dx/value-design/", "theme"],
  ["/Rosarium/essays/rethink-work-before-ai/", "article"],
  ["/Rosarium/foundations/ai-business-design/", "book"],
  ["/Rosarium/cases/customer-support-ai-dx/", "case"],
  ["/Rosarium/career/", "career"], ["/Rosarium/garden-notes/", "garden_notes"],
  ["/Rosarium/reference/", "reference"],
]);
for (const file of pages) {
  const $ = load(fs.readFileSync(file, "utf8"));
  const loaders = $('script[src*="googletagmanager.com/gtag/js"]');
  assert.equal(loaders.length, 0, `${file}: no unconditional Google tag loader`);
  const initializers = $("script[data-analytics-init]");
  assert.equal(initializers.length, 1, `${file}: exactly one guarded initialization`);
  const script = initializers.text();
  const pagePath = new URL($('link[rel="canonical"]').attr("href")).pathname;
  const normal = runAnalytics(script, { location: { pathname: pagePath } });
  const excludedPage = script.includes('"enabled":false') || script.includes('enabled = false') || script.includes('enabled=false');
  if (!normal.initialized) {
    assert(excludedPage, `${file}: only explicitly disabled pages may skip analytics`);
    continue;
  }
  assert.equal(normal.loaders.length, 1, `${file}: production reader loads GA4`);
  assert.equal(normal.loaders[0].async, true);
  assert.equal(new URL(normal.loaders[0].src).searchParams.get("id"), measurementId);
  assert.equal(normal.events.length, 3, `${file}: one js, config and explicit page_view`);
  assert.equal(normal.events[1][0], "config");
  assert.equal(normal.events[1][1], measurementId);
  assert.equal(normal.events[1][2].send_page_view, false);
  assert.equal(normal.events[2][0], "event");
  assert.equal(normal.events[2][1], "page_view");
  const parameters = normal.events[2][2];
  assert(parameters.page_title && parameters.page_path && parameters.content_type && parameters.primary_category);
  assert.equal(parameters.page_path, new URL($('link[rel="canonical"]').attr("href")).pathname);
  assert.equal(parameters.page_location, `https://nullcontroller.github.io${parameters.page_path}`);
  assert(parameters.content_domain);
  if (representativeTypes.has(pagePath)) {
    assert.equal(parameters.content_type, representativeTypes.get(pagePath), `${file}: representative content type`);
    assert.equal(parameters.page_title, $("h1").first().text().trim(), `${file}: stable content title`);
    representativeTypes.delete(pagePath);
  }
  if (pagePath === "/Rosarium/essays/rethink-work-before-ai/") {
    assert.equal(parameters.primary_category, "business-transformation");
    assert.equal(parameters.content_domain, "dx");
    assert.equal(parameters.article_slug, "essays/rethink-work-before-ai");
  }
  if (pagePath.startsWith("/Rosarium/cases/system-understanding/")) assert.equal(parameters.obsolete_status, "obsolete");
  for (const overrides of [{ navigator: { webdriver: true } }, { navigator: { userAgent: "Googlebot/2.1" } }, { location: { hostname: "localhost" } }]) {
    const excluded = runAnalytics(script, overrides);
    assert.equal(excluded.loaders.length, 0, `${file}: excluded clients do not load GA4`);
    assert.equal(excluded.events.length, 0, `${file}: excluded clients do not queue events`);
  }
}
assert.equal(representativeTypes.size, 0, "All representative pages must be verified");
console.log(`Analytics audit: ${pages.length} HTML pages, guarded production loader/config; automation and localhost excluded.`);
