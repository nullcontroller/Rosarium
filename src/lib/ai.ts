// Legacy metadata vocabulary; retained for unchanged manuscript validation, not navigation.
export const aiThemeIds = ["ai-design", "ai-theory", "ai-mathematics", "knowledge-context", "evaluation-hitl", "practices"] as const;
import { primaryDomain } from "../data/knowledge-domains.mjs";
import type { CollectionEntry } from "astro:content";


export const domainSerialGroups = (entries: CollectionEntry<"pages">[], domain: string) => {
  const visible = entries.filter(entry => entry.data.public !== false &&
    ["published", "stable"].includes(entry.data.status) && entry.data.lifecycle === "active");
  return visible.filter(entry => entry.data.publication_format === "series" &&
    entry.data.order === 0 && entry.data.series && primaryDomain(entry) === domain)
    .sort((a,b) => (b.data.published_at ?? "").localeCompare(a.data.published_at ?? "") || a.id.localeCompare(b.id))
    .map(entry => ({entry, chapterCount:visible.filter(chapter => chapter.data.series === entry.data.series && (chapter.data.order ?? 0) > 0).length}));
};

export const aiSerialGroups = (entries: CollectionEntry<"pages">[]) => domainSerialGroups(entries, "ai");
