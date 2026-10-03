import type { CollectionEntry } from "astro:content";
import { label } from "./site";
import { iconForPath } from "./icons";
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
    summary: "LLMや生成AIの振る舞いを理解するための数学・理論。",
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
      summary: "AIを業務やシステムへ組み込むための設計・理論・実践知。",
      icon: iconForPath("articles"),
      sections: [
        "ai",
        "articles",
        "ai-design",
        "ai-mathematics",
        "practices",
      ],
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
      path: "reference",
      title: "Reference",
      summary: "用語・数式・参照資料",
      icon: iconForPath("reference"),
    },
  ],
];
export const designTopics = [
  ["applicability", "AI適用判断", "適用可否と委任レベル"],
  [
    "responsibility-control",
    "責任境界・制御",
    "生成・受理・実行の分離とGuardrail",
  ],
  [
    "architecture",
    "Architecture",
    "全体構成・Tool / Workflow・Security / Governance",
  ],
  [
    "knowledge-context",
    "Knowledge / Context",
    "指示・知識・根拠の責務と情報設計",
  ],
  ["evaluation-hitl", "Evaluation / HITL", "評価・回帰検証・採否判断"],
  [
    "software-engineering",
    "Software Engineering",
    "コード生成・保守・複数AIの設計",
  ],
  [
    "lifecycle-operations",
    "Lifecycle / Operations",
    "変更・再評価・監視・継続運用",
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
export const caseStudies = [
  {
    book: "cases/system-understanding",
    topics: ["QA / RAG", "Knowledge再構築"],
    challenge:
      "仕様書が不足し、UI・ソースコード・既存資料へ知識が分散していた。",
    designSummary:
      "仕様と操作を再構築し、人向けの可視化とRAGで検索できるKnowledgeを分けて設計した。",
    result:
      "問い合わせ・仕様確認と、安全な変更に再利用できる理解基盤として整理した。",
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
      "既存ソフトウェアの暗号方式変更で、仕様理解・影響調査・異常系設計を同時に進める必要があった。",
    designSummary:
      "複数AIを仕様調査、コード探索、実装支援へ分担し、生成物を人間がレビューできる中間成果物として扱った。",
    result: "外部委託を不要にし、従来想定比で工期を約7割短縮した。",
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
      "すべての問い合わせへ人間が介在し、定型的な確認・検索と専門判断が同じ業務フローに混在していた。",
    designSummary:
      "顧客価値から業務を再設計し、AIの適用範囲、Knowledge制御、停止条件、人間への引継ぎ、評価・改善を一続きで設計した。",
    result:
      "自己解決と専門対応を安全につなぐ設計モデルとして整理し、試算値と公開実績を明確に分離した。",
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
