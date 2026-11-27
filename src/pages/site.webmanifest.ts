import type { APIRoute } from "astro";
import { siteDescription } from "../lib/site";
import { pwaEnvironment, pwaManifest } from "../lib/pwa-environment.mjs";
export const prerender = true;
export const GET: APIRoute = () => new Response(
  JSON.stringify(pwaManifest(pwaEnvironment(), siteDescription)),
  { headers: { "Content-Type": "application/manifest+json" } },
);