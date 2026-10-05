import type { CollectionEntry } from "astro:content";

// Both the standalone index and the reading panel use the same collection entries.
export const referenceEntries = (entries: CollectionEntry<"pages">[]) => entries
  .filter((entry) => entry.data.layer === "reference" && entry.id !== "foundations/glossary")
  .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));

// Search aliases normalize labels, without creating a separate reference dataset.
export function referenceSearchText(value: string) {
  return value.normalize("NFKC").toLowerCase()
    .replaceAll("コンテキスト", "context").replaceAll("ナレッジ", "knowledge")
    .replaceAll("ヒューマンレビュー", "human review").trim();
}
