import type { CollectionEntry } from "astro:content";
export const archiveLifecycles = [
  { lifecycle: "obsolete", title: "旧記事", description: "現在の推奨ではありませんが、当時の前提や判断に参考価値があります。" },
  { lifecycle: "retired", title: "退役記事", description: "独立コンテンツとしての役割を終え、過去の思考や設計判断の記録として保存しています。" },
] as const;
export function getArchiveCategory(entry: CollectionEntry<"pages">) {
  const d = entry.data;
  if (d.section === "cases" || d.kind === "case" || d.layer === "case") return "実践事例";
  if (d.section === "essays") return "考察";
  if (d.primaryCategory || d.entry_points.includes("dx")) return "DX";
  if (d.entry_points.includes("ai") || ["ai-design", "ai-mathematics", "practice"].includes(d.layer)) return "AI";
  return "その他";
}

// Books are one archive item; their chapters remain available through chapter navigation.
export const isArchiveEntry = (entry: CollectionEntry<"pages">) =>
  !entry.data.source?.chapter_slug && ["obsolete", "retired"].includes(entry.data.lifecycle);
