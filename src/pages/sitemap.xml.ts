import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import {
  absoluteUrl,
  publicEntry,
  staticLastUpdatedForPath,
} from "../lib/site";
import { dxCategories } from "../lib/dx";

const manualRoutes = [
  "",
  "about",
  "garden-notes",
  "ai-design",
  "ai-design/applicability",
  "ai-design/responsibility-control",
  "ai-design/architecture",
  "ai-design/knowledge-context",
  "ai-design/evaluation-hitl",
  "ai-design/software-engineering",
  "ai-design/lifecycle-operations",
  "ai-mathematics",
  "ai",
  "career",
  "cases",
  "dx",
  ...dxCategories.map((category) => `dx/${category.id}`),
  "essays",
  "practices",
  "reference",
  "start-here",
];

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '\"': "&quot;",
      })[character]!,
  );

export const GET: APIRoute = async ({ site }) => {
  const entries = await getCollection("pages", publicEntry);
  const careerEntries = await getCollection("career", publicEntry);
  const routes = new Map<string, string | undefined>();
  for (const route of manualRoutes)
    routes.set(route, staticLastUpdatedForPath(route));
  for (const entry of entries)
    routes.set(
      entry.id,
      entry.data.last_updated,
    );

  for (const entry of careerEntries)
    routes.set(entry.id === "overview" ? "career" : `career/${entry.id}`, entry.data.last_updated);

  const body = [...routes.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([route, lastmod]) => {
      if (!site)
        throw new Error("Astro.site is required for sitemap generation");
      const loc = absoluteUrl(site, route);
      return `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${escapeXml(String(lastmod).slice(0, 10))}</lastmod>` : ""}</url>`;
    })
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    },
  );
};
