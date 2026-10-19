import type { CollectionEntry } from "astro:content";

export const aiThemeIds = ["ai-design", "ai-theory", "ai-mathematics", "knowledge-context", "evaluation-hitl", "practices"] as const;
export const AI_RELATED_LIMIT = 3;

// Reuse existing primary classifications; secondary relationships stay internal.
export const aiThemes = [
  {
    id: "ai-design", title: "AI設計", path: "ai-design",
    paragraphs: [
      "AIでできることと、AIに任せてよいことを分けて考えます。仕事の目的と誤りの影響から、人・AI・既存システムの役割を決めます。",
      "判断や実行を誰が承認するか、どこで処理を止めるかまで設計します。AIを使わない選択も、この領域で扱います。",
    ],
    questions: ["AIに任せてよい判断はどこまでか。", "人が確認し、実行を承認する箇所はどこか。", "AIと既存システムの責務をどう分けるか。"],
    article: "foundations/applicability-and-delegation", layer: "ai-design", topic: "applicability",
  },
  {
    id: "ai-theory", title: "AI理論", path: "ai-theory",
    paragraphs: [
      "なぜ回答が変わり、もっともらしい誤答が生まれるのか。生成AIの振る舞いを、モデルと周辺システムの仕組みから理解します。",
      "数学の履修を前提にせず、ハルシネーションの発生要因やコード生成支援の構成を整理します。数式を深く確認したい場合は数学へ進めます。",
    ],
    questions: ["なぜ同じ質問でも回答が変わるのか。", "なぜもっともらしい誤答が生まれるのか。", "モデルと検索・実行・検証の役割はどう違うか。"],
    article: "foundations/hallucination-mechanisms", layer: "ai-theory",
  },
  {
    id: "ai-mathematics", title: "数学", path: "ai-mathematics",
    paragraphs: [
      "生成AIの振る舞いを深く理解するため、確率・条件付き確率と分布を整理します。Softmax、Temperature、エントロピーを既存の記事から学べます。",
      "数学的な定義と設計の説明に使う簡略モデルを分けます。式が示す性質を、実システムの品質保証や実測結果へ読み替えません。",
    ],
    questions: ["条件付き確率は何を表すか。", "Temperatureは確率分布をどう変えるか。", "数式上の性質と、設計用の説明モデルをどう区別するか。"],
    article: "foundations/conditional-probability", layer: "ai-mathematics",
  },
  {
    id: "knowledge-context", title: "ナレッジ / コンテキスト", path: "ai-design/knowledge-context",
    paragraphs: [
      "AIに何を指示し、何を知識として持たせ、今回の回答には何を根拠として渡すかを分けます。モデルの性能だけでなく、参照できる情報の範囲と鮮度を考えます。",
      "検索で必要な情報へ届くか、対象や条件に合う情報かを確かめます。ナレッジ / コンテキストを分けることで、更新や失敗原因の確認をしやすくします。",
    ],
    questions: ["AIは何を参照できる状態で答えているか。", "指示・知識・今回の根拠をどう分けるか。", "RAGで解決できる問題と、残る問題は何か。"],
    article: "knowledge-context/instruction-knowledge-evidence", layer: "ai-design", topic: "knowledge-context",
  },
  {
    id: "evaluation-hitl", title: "評価・ヒューマンレビュー", path: "ai-design/evaluation-hitl",
    paragraphs: [
      "AIの回答を何で評価し、どこから人が確認・判断するかを決めます。正答率だけでなく、根拠の提示、回答を控える判断、人への引き継ぎも評価します。",
      "検索・生成・業務効果を分けて測り、失敗を次の改善へ戻します。評価・人による確認を、採用基準と責任の置き方につなげます。",
    ],
    questions: ["回答を採用してよいと判断する基準は何か。", "どの条件で自動回答を止め、人へ渡すか。", "失敗の原因をどの工程へ戻して改善するか。"],
    article: "evaluation-hitl/qa-evaluation", layer: "ai-design", topic: "evaluation-hitl",
  },
  {
    id: "practices", title: "実践・開発", path: "practices",
    paragraphs: [
      "AIを開発や保守へ使うときは、生成の速さだけでなく、変更を安全に採用できるかを考えます。調査・要求整理・実装・文書化を、必要な情報と確認方法から組み立てます。",
      "作業ごとにAIが参照できる情報を見極め、人のレビューを挟みます。運用後の評価や知識更新まで含め、実際の仕事へ適用する方法を扱います。",
    ],
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
