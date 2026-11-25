import { primaryDomain } from "../data/knowledge-domains.mjs";
import type { CollectionEntry } from "astro:content";

export const aiThemeIds = ["ai-design", "ai-theory", "ai-mathematics", "knowledge-context", "evaluation-hitl", "practices"] as const;
export const AI_RELATED_LIMIT = 5;

export const domainSerialGroups = (entries: CollectionEntry<"pages">[], domain: string) => {
  const visible = entries.filter(entry => entry.data.public !== false &&
    ["published", "stable"].includes(entry.data.status) && entry.data.lifecycle === "active");
  return visible.filter(entry => entry.data.publication_format === "series" &&
    entry.data.order === 0 && entry.data.series && primaryDomain(entry) === domain)
    .sort((a,b) => (b.data.published_at ?? "").localeCompare(a.data.published_at ?? "") || a.id.localeCompare(b.id))
    .map(entry => ({entry, chapterCount:visible.filter(chapter => chapter.data.series === entry.data.series && (chapter.data.order ?? 0) > 0).length}));
};

// Reuse existing primary classifications; secondary relationships stay internal.
export const aiThemes = [
  { id: "ai-mathematics", title: "学習・確率・計算の原理", path: "ai-mathematics", paragraphs: ["条件付き確率から学習損失と生成へ進み、Attentionの計算原理、推論予算、計算効率を読む。"], article: "foundations/conditional-probability", layer: "ai-mathematics" },
  { id: "ai-theory", title: "生成と誤答の原理", path: "ai-theory", paragraphs: ["次のトークンの予測と事実性の違いから、もっともらしい誤答が生じる理由を読む。"], article: "foundations/hallucination-mechanisms", layer: "ai-theory" },
] as const;

const mathReadingOrder = ["language-model-loss", "temperature-design", "attention-information-flow", "test-time-compute-allocation", "attention-efficiency"].map(slug => `foundations/${slug}`);
const readingRank = (id: string) => { const rank = mathReadingOrder.indexOf(id); return rank < 0 ? mathReadingOrder.length : rank; };

export const aiThemeGroups = (entries: CollectionEntry<"pages">[]) => {
  const ids = new Set<string>();
  return aiThemes.map((theme) => {
    const entry = entries.find((entry) => entry.id === theme.article);
    if (!entry || entry.data.lifecycle !== "active" || entry.data.section === "cases" || entry.data.layer !== theme.layer ||
        ids.has(entry.id)) {
      throw new Error(`${theme.id}: representative article must be unique and match its primary classification`);
    }
    ids.add(entry.id);
    const related = [...new Map(entries.filter((candidate) =>
      candidate.id !== entry.id && candidate.data.ai_theme === theme.id &&
      candidate.data.public !== false && candidate.data.lifecycle === "active" &&
      ["published", "stable"].includes(candidate.data.status) &&
      primaryDomain(candidate) === "ai" && candidate.data.published_at
    ).map((candidate) => [candidate.id, candidate])).values()]
      .sort((a, b) => readingRank(a.id) - readingRank(b.id) || b.data.published_at!.localeCompare(a.data.published_at!) || a.id.localeCompare(b.id))
      .slice(0, AI_RELATED_LIMIT);
    return { ...theme, articles: [entry], related };
  });
};

export const aiSerialGroups = (entries: CollectionEntry<"pages">[]) => domainSerialGroups(entries, "ai");
