import type { CollectionEntry } from "astro:content";
import { caseStudies } from "./navigation";

export function analyticsMetadata(pathname: string, title: string, entry?: CollectionEntry<"pages">) {
  const slug = pathname.replace(/^\/Rosarium\/?/, "").replace(/\/$/, "");
  const root = slug.split("/")[0];
  const data = entry?.data;
  const contentType = data
    ? data.section === "cases" ? "case"
      : data.layer === "reference" ? "reference"
      : data.publication_format === "book" || data.series ? "book" : "article"
    : !slug ? "home"
      : root === "about" ? "about"
      : root === "career" ? "career"
      : root === "garden-notes" ? "garden_notes"
      : root === "reference" ? "reference"
      : root === "cases" ? "case"
      : root === "books" || root === "series" ? "book"
      : root === "dx" ? slug.includes("/") ? "theme" : "dx"
      : root === "ai" ? "ai"
      : root === "ai-design" || root === "ai-mathematics" ? "theme" : "index";
  const study = caseStudies.find((study) => slug === study.book || slug.startsWith(`${study.book}/`));
  return {
    page_title: data?.title ?? (title === "Home" ? "Rosarium" : title),
    page_path: pathname,
    content_type: contentType,
    content_domain: contentType === "case" ? "case" : contentType === "career" ? "career" :
      data?.primaryCategory || root === "dx" ? "dx" :
      data || ["ai", "ai-design", "ai-mathematics", "practices", "architecture", "foundations", "knowledge-context", "evaluation-hitl", "software-engineering", "essays"].includes(root) ? "ai" : "site",
    primary_category: data?.primaryCategory ?? data?.design_topic ??
      (data?.layer === "ai-mathematics" ? "ai-mathematics" : data?.layer === "practice" ? "practice" :
        root === "dx" ? slug.split("/")[1] ?? "dx" :
        root === "ai-design" ? slug.split("/")[1] ?? "ai-design" : root || "home"),
    ...(entry ? { article_slug: entry.id } : {}),
    ...(study ? { obsolete_status: study.lifecycle === "obsolete" ? "obsolete" : "active" } : {}),
  };
}
