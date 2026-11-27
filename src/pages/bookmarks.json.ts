import { getCollection } from "astro:content";
import { buildBookmarkCatalog } from "../lib/bookmark-catalog.mjs";
export const GET = async () =>
  new Response(
    JSON.stringify(buildBookmarkCatalog(await getCollection("pages"))),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    },
  );
