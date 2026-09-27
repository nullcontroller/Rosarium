import type { APIRoute } from "astro";
import { absoluteUrl, siteDescription } from "../lib/site";

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("Astro.site is required for llms.txt");
  const link = (label: string, path: string) =>
    `- [${label}](${absoluteUrl(site, path)})`;
  const body = [
    "# Rosarium",
    "",
    siteDescription,
    "",
    link("庭", ""),
    link("実践事例", "cases"),
    link("キャリア", "career"),
    link("AI", "ai"),
    link("AI設計", "ai-design"),
    link("AI理論", "ai-mathematics"),
    link("実践知", "practices"),
    link("DX", "dx"),
    link("RSS Feed", "feed.xml"),
    link("JSON Feed", "feed.json"),
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
