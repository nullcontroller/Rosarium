import type { CollectionEntry } from "astro:content";

export const aiThemeIds = ["ai-design", "ai-theory", "ai-mathematics", "knowledge-context", "evaluation-hitl", "practices"] as const;
export const AI_RELATED_LIMIT = 3;

// Reuse existing primary classifications; secondary relationships stay internal.
export const aiThemes = [
  {
    id: "ai-design", title: "AI設計", path: "ai-design",
    paragraphs: ["AIを業務へ導入するとき、何を任せ、どこで人が判断するか。人・AI・既存システムの役割と、権限・停止条件を設計します。"],
    questions: ["AIに任せてよい判断はどこまでか。", "人が確認し、実行を承認する箇所はどこか。", "AIと既存システムの責務をどう分けるか。"],
    article: "foundations/applicability-and-delegation", layer: "ai-design", topic: "applicability",
  },
  {
    id: "ai-theory", title: "AI理論", path: "ai-theory",
    paragraphs: ["なぜ回答が変わり、もっともらしい誤答が生まれるのか。数学の履修を前提にせず、モデルと周辺システムの仕組みを理解します。"],
    questions: ["なぜ同じ質問でも回答が変わるのか。", "なぜもっともらしい誤答が生まれるのか。", "モデルと検索・実行・検証の役割はどう違うか。"],
    article: "foundations/hallucination-mechanisms", layer: "ai-theory",
  },
  {
    id: "ai-mathematics", title: "数学", path: "ai-mathematics",
    paragraphs: ["確率・分布・数式からAIの振る舞いを理解します。数学的な定義と、設計に用いる簡略モデルを区別して学びます。"],
    questions: ["条件付き確率は何を表すか。", "Temperatureは確率分布をどう変えるか。", "数式上の性質と、設計用の説明モデルをどう区別するか。"],
    article: "foundations/conditional-probability", layer: "ai-mathematics",
  },
  {
    id: "knowledge-context", title: "ナレッジ / コンテキスト", path: "ai-design/knowledge-context",
    paragraphs: ["RAGにどの知識を持たせ、今回の回答へ何を根拠として渡すか。指示・知識・文脈を分け、情報の範囲と鮮度を設計します。"],
    questions: ["AIは何を参照できる状態で答えているか。", "指示・知識・今回の根拠をどう分けるか。", "RAGで解決できる問題と、残る問題は何か。"],
    article: "knowledge-context/instruction-knowledge-evidence", layer: "ai-design", topic: "knowledge-context",
  },
  {
    id: "evaluation-hitl", title: "評価・ヒューマンレビュー", path: "ai-design/evaluation-hitl",
    paragraphs: ["AIの回答を何で評価し、どこから人が確認するか。回答を控える判断や有人引継ぎも含め、採用・改善の基準を決めます。"],
    questions: ["回答を採用してよいと判断する基準は何か。", "どの条件で自動回答を止め、人へ渡すか。", "失敗の原因をどの工程へ戻して改善するか。"],
    article: "evaluation-hitl/qa-evaluation", layer: "ai-design", topic: "evaluation-hitl",
  },
  {
    id: "practices", title: "実践・開発", path: "practices",
    paragraphs: ["AIを使って開発・保守をどう進めるか。調査から実装まで、必要な情報とレビューを組み合わせ、安全に変更を採用します。"],
    questions: ["AIを使う効果と、確認にかかる負担をどう比べるか。", "変更の影響を確認し、失敗時に戻せるか。", "調査から実装まで、人のレビューをどこへ挟むか。"],
    article: "software-engineering/development-workflow", layer: "ai-design", topic: "software-engineering",
  },
] as const;

export const aiThemeGroups = (entries: CollectionEntry<"pages">[]) => {
  const ids = new Set<string>();
  return aiThemes.map((theme) => {
    const entry = entries.find((entry) => entry.id === theme.article);
    if (!entry || entry.data.lifecycle !== "active" || entry.data.section === "cases" || entry.data.layer !== theme.layer ||
        ("topic" in theme && entry.data.design_topic !== theme.topic) || ids.has(entry.id)) {
      throw new Error(`${theme.id}: representative article must be unique and match its primary classification`);
    }
    ids.add(entry.id);
    const related = [...new Map(entries.filter((candidate) =>
      candidate.id !== entry.id && candidate.data.ai_theme === theme.id &&
      candidate.data.public !== false && candidate.data.lifecycle === "active" &&
      ["published", "stable"].includes(candidate.data.status) &&
      candidate.data.entry_points.includes("ai") && candidate.data.published_at
    ).map((candidate) => [candidate.id, candidate])).values()]
      .sort((a, b) => b.data.published_at!.localeCompare(a.data.published_at!) || a.id.localeCompare(b.id))
      .slice(0, AI_RELATED_LIMIT);
    return { ...theme, articles: [entry], related };
  });
};
