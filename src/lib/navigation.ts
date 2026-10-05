import type { CollectionEntry } from "astro:content";
import { label } from "./site";
import { iconForPath } from "./icons";
import { archiveTitle } from "./archive";
import { dxCategories } from "./dx";
export type Entry = CollectionEntry<"pages">;

export type NavigationItem = {
  path: string;
  title: string;
  summary: string;
  icon: ReturnType<typeof iconForPath>;
  question?: string;
  hash?: string;
  sections?: readonly string[];
  children?: readonly NavigationItem[];
};

export const readingCategories = [
  {
    path: "ai-design",
    title: "AI設計",
    question: "AIを仕事やシステムにどう組み込む？",
    summary: "AIを業務やシステムへ組み込むための設計原則。",
    icon: iconForPath("ai-design"),
  },
  {
    path: "ai-mathematics",
    title: "AI理論",
    question: "生成AIはなぜそう振る舞う？",
    summary:
      "AIの答えが変わる理由と、制御できる範囲を数学・理論から理解します。",
    icon: iconForPath("ai-mathematics"),
  },
  {
    path: "practices",
    title: "実践知",
    question: "AIを仕事や開発でどう使う？",
    summary: "AIを実務・開発・組織で使うための実践知。",
    icon: iconForPath("practices"),
  },
  {
    path: "cases",
    title: "実践事例",
    question: "実際の課題にどう適用した？",
    summary: "実務での課題、設計判断、実装、結果をまとめた事例。",
    icon: iconForPath("cases"),
  },
] as const satisfies readonly NavigationItem[];

export const navigation: readonly (readonly NavigationItem[])[] = [
  [
    {
      path: "",
      title: "庭",
      summary: "Rosariumの入口",
      icon: iconForPath(""),
    },
  ],
  [
    {
      path: "ai",
      title: "AI",
      summary: "AIを仕事へ組み込む設計・実践。",
      icon: iconForPath("articles"),
      sections: ["ai", "articles", "ai-design", "ai-mathematics", "practices"],
    },
    {
      path: "dx",
      title: "DX",
      summary: "価値・業務変革・システム企画を扱う領域。",
      icon: iconForPath("dx"),
      sections: ["dx", ...dxCategories.map((category) => `dx/${category.id}`)],
    },
    {
      path: "cases",
      title: "実践事例",
      summary: "実務での課題、設計判断、実装、結果をまとめた事例。",
      icon: iconForPath("cases"),
      sections: ["cases"],
    },
  ],
  [
    {
      path: "retired",
      title: archiveTitle,
      summary: "旧記事・役割を終えた記事",
      icon: iconForPath("retired"),
    },
  ],
];
export const designTopics = [
  [
    "applicability",
    "AI適用判断",
    "AIでできるかだけでなく、任せるべきかを判断します。影響・確認のしやすさ・戻せるかから任せ方を決めます。",
  ],
  [
    "responsibility-control",
    "責任境界・制御",
    "AIの提案を誰が確認し、誰が実行を承認するかを決めます。責任の境界と、危険な処理を止めるGuardrailを設計します。",
  ],
  [
    "architecture",
    "システムアーキテクチャ",
    "AI・人間・既存システムをどうつなぐかを考えます。処理の流れ、権限、安全性を含むシステムアーキテクチャを設計します。",
  ],
  [
    "knowledge-context",
    "ナレッジ / コンテキスト",
    "AIへ何を指示し、何を根拠に渡し、その場の条件をどう伝えるかを分けます。ナレッジ / コンテキストの役割と更新方法を設計します。",
  ],
  [
    "evaluation-hitl",
    "評価・ヒューマンレビュー",
    "AIの答えをどこまで機械で評価し、どこから人間が判断するかを決めます。評価・ヒューマンレビューで、採用と改善の基準を設計します。",
  ],
  [
    "software-engineering",
    "ソフトウェア開発",
    "コードを作る速さだけでなく、安全に変更を採用できるかを考えます。開発・保守の工程へAIを組み込む方法を扱います。",
  ],
  [
    "lifecycle-operations",
    "ライフサイクル・運用",
    "導入後に何を監視し、変更時に何を確認し、いつ停止するかを考えます。ライフサイクル・運用として改善・移行・終了まで設計します。",
  ],
] as const;
export const topicLabel = (key?: string) =>
  designTopics.find((x) => x[0] === key)?.[1];
export const contentCategory = (e: Entry) =>
  e.data.layer === "ai-design"
    ? topicLabel(e.data.design_topic)!
    : e.data.layer === "ai-mathematics"
      ? "モデル・確率・振る舞い"
      : e.data.layer === "reference"
        ? "用語・参照資料"
        : e.data.layer === "practice"
          ? "業務・開発プロセス"
          : label(e.data.section);
export const layerPath = (layer: string) =>
  ({
    "ai-design": "ai-design",
    "ai-mathematics": "ai-mathematics",
    practice: "practices",
    case: "cases",
    publication: "ai",
    career: "career",
    reference: "reference",
  })[layer] || "start-here";
export const publicationType = (e: Entry) =>
  ({ article: "Article", book: "Book", series: "連載", essay: "Essay" })[
    e.data.publication_format || "article"
  ];
export const isPublication = (e: Entry) =>
  !!e.data.publication_format ||
  (e.data.layer === "publication" && (!e.data.series || e.data.order === 0));
export const publicationTiming = (e: Entry) => {
  if (e.data.published_at)
    return {
      label: "公開",
      value: e.data.published_at.slice(0, 10),
      datetime: e.data.published_at,
    };
  const month = e.data.source?.publication_month;
  const match = month?.match(/^(\d{4})-(\d{2})$/);
  if (match)
    return {
      label: "公開",
      value: `${match[1]}年${Number(match[2])}月`,
    };
  return { label: "公開", value: "公開時期未確認" };
};
export const publicationStatus = (e: Entry) =>
  e.data.publication_status
    ? ({ ongoing: "連載中", published: "公開" } as const)[
        e.data.publication_status
      ]
    : undefined;
export const publicationDate = (e: Entry) => publicationTiming(e).value;
export const topicPublications: Record<string, string[]> = {
  applicability: [
    "essays/rethink-work-before-ai",
    "practices/transferring-practices",
    "practices/transferring-ai-practices",
    "practices/adoption-governance",
    "practices/ai-adoption-and-effective-use",
    "foundations/ai-business-design",
    "foundations/generation-and-acceptance",
    "essays/dx-and-value",
    "cases/customer-support-ai-dx",
  ],
  "responsibility-control": [
    "foundations/generation-and-acceptance",
    "essays/trust-in-ai-generated-content",
    "foundations/ai-business-design",
    "cases/customer-support-ai-dx",
  ],
  architecture: [
    "architecture/agents-tools-and-workflows",
    "foundations/ai-business-design",
    "cases/three-ai-maintenance",
  ],
  "knowledge-context": [
    "knowledge-context/context-before-model-performance",
    "cases/system-understanding",
    "cases/customer-support-ai-dx",
  ],
  "evaluation-hitl": [
    "foundations/generation-and-acceptance",
    "essays/trust-in-ai-generated-content",
    "cases/system-understanding",
    "cases/customer-support-ai-dx",
  ],
  "software-engineering": [
    "software-engineering/ai-driven-development",
    "software-engineering/code-generation-and-work-design",
    "cases/three-ai-maintenance",
  ],
  "lifecycle-operations": [
    "essays/it-strategy-and-not-building",
    "essays/legacy-change-and-retirement",
    "cases/system-understanding",
    "cases/three-ai-maintenance",
    "cases/customer-support-ai-dx",
    "essays/what-not-to-build-with-ai",
  ],
};
export const relatedPublications = (all: Entry[], topic?: string) =>
  (topicPublications[topic || ""] || [])
    .map((id) => all.find((e) => e.id === id))
    .filter((e): e is Entry => !!e && isPublication(e));
// OBSOLETE retains reference value but is no longer the recommended configuration.
// RETIRED has ended its role and is excluded from normal discovery paths.
type CaseStudy = {
  book: string;
  referenceNote?: string;
  topics: string[];
  challenge: string;
  designSummary: string;
  result: string;
  chapters: string[];
  design: string[];
};
const caseStudyEntries: CaseStudy[] = [
  {
    book: "cases/system-understanding",
    referenceNote: "旧AI環境を前提とした参考事例",
    topics: ["QA / RAG", "ナレッジ再構築"],
    challenge:
      "仕様書だけでは内部仕様を追えず、知識が長期担当者に依存していた。",
    designSummary:
      "コード・UI・実動作を突き合わせて仕様を復元し、人とAIがそれぞれ使いやすい形に整理した。",
    result:
      "問い合わせ対応、仕様確認、変更判断に再利用できる状態へ変えた。",
    chapters: [
      "cases/system-understanding/recovering-code-structure",
      "cases/system-understanding/human-and-ai-knowledge",
      "cases/system-understanding/rag-implementation",
      "cases/system-understanding/qa-evaluation",
    ],
    design: [
      "knowledge-context/human-and-ai-documentation",
      "evaluation-hitl/qa-evaluation",
    ],
  },
  {
    book: "cases/three-ai-maintenance",
    topics: ["AIオーケストレーション", "既存ソフトウェア開発・改善"],
    challenge:
      "コード、過去資料、仕様検討に必要な情報が分散し、一つのAIだけでは保守判断に必要な情報が揃わなかった。",
    designSummary:
      "コードはGitHub Copilot、過去資料はMicrosoft 365 Copilot、仕様検討はGPTを中心に使い分け、人が確認して結果をつないだ。",
    result: "コード調査から影響確認、背景調査、仕様検討、実装支援まで、AIを使える範囲を広げた。",
    chapters: [
      "cases/three-ai-maintenance/cryptography-and-failure-modes",
      "cases/three-ai-maintenance/structuring-failure-handling",
      "cases/three-ai-maintenance/sharing-current-specifications",
      "cases/three-ai-maintenance/results-and-reflections",
    ],
    design: [
      "software-engineering/multi-ai-orchestration",
      "evaluation-hitl/responsibility-and-hitl",
    ],
  },
  {
    book: "cases/customer-support-ai-dx",
    topics: ["Applied AI / DX", "RAG / HITL / UX"],
    challenge:
      "定型的な確認や検索にも人手が掛かり、専門判断が必要な問い合わせと同じ流れで対応していた。",
    designSummary:
      "ナレッジ / RAGと生成AIを組み合わせ、回答条件を満たさない場合は人へ引き継ぐ構成にした。",
    result:
      "AIで回答できる問い合わせと、人が判断すべき問い合わせを分けて運用できるように設計した。",
    chapters: [
      "cases/customer-support-ai-dx/responsibility-boundary",
      "cases/customer-support-ai-dx/poc-evaluation",
      "cases/customer-support-ai-dx/knowledge-design",
      "cases/customer-support-ai-dx/human-handoff",
    ],
    design: [
      "foundations/applicability-and-delegation",
      "evaluation-hitl/responsibility-and-hitl",
      "knowledge-context/instruction-knowledge-evidence",
    ],
  },
];
export const caseStudies = caseStudyEntries;

export const mathematicsReadingIds = [
  "foundations/conditional-probability",
  "foundations/temperature-design",
  "foundations/hallucination-mechanisms",
  "software-engineering/code-generation-models",
] as const;

export const publicationTopic = (e: Entry) =>
  e.data.layer === "ai-mathematics" ? "AI理論" : label(e.data.section);

export const publicationTopics = (entry: Entry) => [
  ...new Set([
    publicationTopic(entry),
    ...designTopics
      .filter(([key]) => topicPublications[key]?.includes(entry.id))
      .map(([, title]) => title),
    ...(entry.data.tags.some((tag) => ["aiエージェント", "mcp"].includes(tag))
      ? ["AI Agent"]
      : []),
    ...(entry.data.tags.includes("キャリア") ? ["キャリア"] : []),
  ]),
];

// Displayed 00 is an introduction; order remains the sequence for navigation.
export const bookChapterNumber = (entry: Entry) => {
  const number = entry.data.title.match(/^(\d{2})\.\s/);
  return number ? Number(number[1]) : (entry.data.order ?? 0);
};
