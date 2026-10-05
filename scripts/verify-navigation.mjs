import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";

const basePath = "/Rosarium/";
const fallbackLastUpdated = "2026-09-28";
const sitemap = fs.readFileSync("dist/sitemap.xml", "utf8");
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

const routeFromUrl = (value) => {
  const pathname = new URL(value, "https://nullcontroller.github.io").pathname;
  assert.ok(pathname.startsWith(basePath), `Outside base path: ${value}`);
  return pathname.slice(basePath.length).replace(/^\/+|\/+$/g, "");
};
const htmlForRoute = (route) =>
  path.join("dist", ...(route ? route.split("/") : []), "index.html");
// Archive pages are noindex bridges to indexed obsolete content.
for (const route of ["retired", "retired/obsolete", "retired/obsolete-cases", "retired/retired"]) locations.push(`https://nullcontroller.github.io/Rosarium/${route}/`);
const routes = new Set(locations.map(routeFromUrl));
const pages = new Map();

for (const location of locations) {
  const route = routeFromUrl(location);
  const file = htmlForRoute(route);
  assert.ok(fs.existsSync(file), `Sitemap route has no HTML: ${route || "/"}`);
  const $ = load(fs.readFileSync(file, "utf8"));
  const lastUpdated = $('meta[name="last-updated"]').attr("content") ?? "";
  const visibleLastUpdated =
    $(".site-last-updated time, .document-header .content-last-updated time")
      .first()
      .attr("datetime") ?? "";
  assert.match(lastUpdated, /^\d{4}-\d{2}-\d{2}$/, `Missing last_updated: ${route || "/"}`);
  if (!$('meta[name="robots"]').attr("content")?.includes("noindex")) assert.equal(visibleLastUpdated, lastUpdated, `Visible last_updated mismatch: ${route || "/"}`);

  const links = new Set();
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/.test(href)) return;
    let target;
    try {
      target = new URL(href, location);
    } catch {
      return;
    }
    if (target.origin !== new URL(location).origin || !target.pathname.startsWith(basePath)) return;
    const targetRoute = routeFromUrl(target.toString());
    if (routes.has(targetRoute)) links.add(targetRoute);
  });

  const explicitEntryPoints = $('[data-pagefind-meta="entry_point"]')
    .text()
    .split(/\s+/)
    .filter(Boolean);
  const entryPoint = explicitEntryPoints.length
    ? explicitEntryPoints
    : route === ""
      ? ["garden"]
      : route.startsWith("career")
        ? ["career"]
        : route === "dx"
          ? ["dx"]
          : ["ai"];
  pages.set(route, {
    url: location,
    title: $("h1").first().text().trim() || $("title").text().trim(),
    entryPoint,
    lastUpdated,
    links,
  });
}

const distance = new Map([["", 0]]);
const previous = new Map();
const queue = [""];
while (queue.length) {
  const current = queue.shift();
  for (const target of pages.get(current)?.links ?? []) {
    if (distance.has(target)) continue;
    distance.set(target, distance.get(current) + 1);
    previous.set(target, current);
    queue.push(target);
  }
}

const routePath = (route) => {
  if (!distance.has(route)) return [];
  const result = [route];
  while (result.at(-1) !== "") result.push(previous.get(result.at(-1)));
  return result.reverse();
};
const reportPages = [...pages].filter(([route]) => !["retired", "retired/obsolete", "retired/obsolete-cases", "retired/retired"].includes(route)).map(([route, page]) => ({
  url: page.url,
  title: page.title,
  entryPoint: page.entryPoint,
  steps: distance.get(route) ?? null,
  path: routePath(route).map((item) => ({
    url: pages.get(item).url,
    title: pages.get(item).title,
  })),
  orphan: !distance.has(route),
  last_updated: page.lastUpdated,
}));
const orphanPages = reportPages.filter((page) => page.orphan);
const overLimitPages = reportPages.filter((page) => page.steps != null && page.steps > 5);
const maxSteps = Math.max(...reportPages.map((page) => page.steps ?? 0));
const fallbackCount = reportPages.filter((page) => page.last_updated === fallbackLastUpdated).length;
const report = {
  publicPageCount: reportPages.length,
  maxSteps,
  orphanPageCount: orphanPages.length,
  overFiveStepsCount: overLimitPages.length,
  fallbackLastUpdated,
  fallbackCount,
  pages: reportPages,
};

fs.writeFileSync("dist/navigation-audit.json", `${JSON.stringify(report, null, 2)}\n`);
assert.deepEqual(orphanPages.map((page) => page.url), [], "Orphan public pages detected");
assert.deepEqual(overLimitPages.map((page) => page.url), [], "Pages over five navigation steps detected");
console.log(
  `Navigation audit: ${report.publicPageCount} public pages, max ${maxSteps} steps, ${orphanPages.length} orphan pages, ${overLimitPages.length} pages over five steps, ${fallbackCount} fallback dates.`,
);
