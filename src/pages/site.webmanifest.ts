import type { APIRoute } from "astro";
import { assetUrl, siteDescription, url } from "../lib/site";

export const prerender = true;
const review = Boolean(process.env.ROSARIUM_DRAFT_PREVIEW);

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: review ? "Rosarium Review" : "Rosarium",
      short_name: review ? "Rosarium Review" : "Rosarium",
      id: review ? "/?app=rosarium-review" : "/",
      lang: "ja",
      description: siteDescription,
      start_url: url(),
      scope: url(),
      display: "standalone",
      background_color: "#17383b",
      theme_color: "#17383b",
      icons: [
        {
          src: assetUrl("icons/icon-192.png"),
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: assetUrl("icons/icon-512.png"),
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: assetUrl("icons/icon-maskable-192.png"),
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: assetUrl("icons/icon-maskable-512.png"),
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    }),
    { headers: { "Content-Type": "application/manifest+json" } },
  );
