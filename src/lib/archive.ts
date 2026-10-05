import type { CollectionEntry } from "astro:content";
export const archiveTitle = "旧記事・退役記事";
export const archiveLifecycles = [
  { id: "obsolete", lifecycle: "obsolete", title: "旧記事", description: "現在は推奨しませんが、当時の前提や判断を参考として残している記事です。" },
  { id: "obsolete-cases", lifecycle: "obsolete", title: "旧事例", description: "現在の推奨構成ではない、過去の実践事例です。" },
  { id: "retired", lifecycle: "retired", title: "退役記事", description: "独立した役割を終え、過去の記録として保存している内容です。" },
] as const;
export const isCaseEntry = (entry: CollectionEntry<"pages">) =>
  entry.data.section === "cases" || entry.data.kind === "case" || entry.data.layer === "case";
export function getArchiveGroup(entry: CollectionEntry<"pages">) {
  if (entry.data.lifecycle === "retired") return "retired";
  if (entry.data.lifecycle === "obsolete") return isCaseEntry(entry) ? "obsolete-cases" : "obsolete";
  return undefined;
}
export function getArchiveCategory(entry: CollectionEntry<"pages">) {
  const d = entry.data;
  if (isCaseEntry(entry)) return "実践事例";
  if (d.section === "essays") return "考察";
  if (d.primaryCategory || d.entry_points.includes("dx")) return "DX";
  if (d.entry_points.includes("ai") || ["ai-design", "ai-mathematics", "practice"].includes(d.layer)) return "AI";
  return "その他";
}

// Books are one archive item; their chapters remain available through chapter navigation.
export const isArchiveEntry = (entry: CollectionEntry<"pages">) =>
  !entry.data.source?.chapter_slug && ["obsolete", "retired"].includes(entry.data.lifecycle);

export function archiveLabel(entries: CollectionEntry<"pages">[], lifecycle: "obsolete" | "retired") {
  if (lifecycle === "retired") return "RETIRED";
  const types = new Set(entries.map((entry) => isCaseEntry(entry) ? "CASE" : "ARTICLE"));
  return types.size === 1 ? `OBSOLETE ${[...types][0]}` : "OBSOLETE";
}

// The archive list and its contents navigation share metadata-based categories.
export const archiveCategoryAnchor = (category: string) => `archive-category-${category}`;
export const getArchiveCategories = (entries: CollectionEntry<"pages">[]) =>
  ["AI", "DX", "実践事例", "考察", "その他"].filter((category) => entries.some((entry) => getArchiveCategory(entry) === category));
