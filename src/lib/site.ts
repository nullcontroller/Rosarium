import { compatibilityFor } from "../data/compatibility-urls.mjs";
export const sections = [
  ["foundations", "AI設計原則", "サイトの目的と読み方は「Rosariumとは？」へ"],
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
  ["practices", "実践知", "導入・教育・適用判断"],
  ["cases", "事例", "専門領域を横断する実務事例・仮想設計"],
  ["essays", "考察", "市場・キャリア・技術への考察"],
] as const;
export const base = "";
export const siteDescription =
  "立林裕太朗の技術ポートフォリオ。ソフトウェア開発・保守の実務を土台に、IT戦略・企画、DX、システム設計、AI・数理の知識と、具体的な問題解決・設計判断を紹介します。";

// Reader-facing introductions are shared by page headings and SEO descriptions.
export const pageIntroductions: Record<string, string> = {
  "software-engineering":
    "コードを作る速さだけでなく、安全に変更を採用できるかを考えます。開発・保守の工程へAIを組み込む方法を扱います。",
  "evaluation-hitl":
    "AIの答えをどこまで機械で評価し、どこから人間が判断するかを決めます。評価・ヒューマンレビューで、採用と改善の基準を設計します。",
  "knowledge-context":
    "AIへ何を指示し、何を根拠に渡し、その場の条件をどう伝えるかを分けます。ナレッジ / コンテキストの役割と更新方法を設計します。",
  architecture:
    "AI・人間・既存システムをどうつなぐかを考えます。処理の流れ、権限、安全性を含むシステムアーキテクチャを設計します。",
  planning: "何を、なぜ、どこまで実現するか。経営課題と価値発見から、IT戦略・業務要求・システム化構想・投資・KPI・対象範囲を考えます。作らない選択と、維持・刷新・統合・廃止を投資と維持責任から判断します。",
  "system-design": "要求をどのようなシステムとして実現するか。機能・非機能要件、アーキテクチャ、処理・データ・連携、品質、移行、保守・運用を設計します。",
  ai: "AIを支える確率・生成原理、学習理論、モデルの計算構造、推論・計算効率、解釈・理論的限界を学びます。",
  "ai-design":
    "与えられた業務要求を、AI・人間・既存システムの役割、必要な情報、要件・方式、検証・運用へ具体化する設計領域です。",
  "ai-mathematics":
    "生成AIの振る舞いを理解するために、確率、分布、数式などの数学的な基礎を整理します。理論上の定義と、実際のAIシステム設計で使う説明モデルを区別して扱います。",
  "ai-theory":
    "次のトークンの予測と事実性の違いから、生成ともっともらしい誤答が生じる原理を理解します。応用システムの設計とは分けて扱います。",
  practices:
    "AIを現場で使い続けるために、教え方、情報の渡し方、確認の手順を考えます。導入・教育・開発・組織での実践を扱います。",
  cases:
    "専門領域を横断する事例集です。実務経験の担当・判断・確認結果と、実務を起点に条件を変えた仮想設計を区別します。",
  books:
    "業務の課題から、設計・確認・改善までを章ごとに追う実務事例です。現在の主要事例から、判断の理由と役割分担を確かめられます。",
  dx: "業務分析、業務変革、組織設計、AIの業務活用、教育、定着と運用改善を扱います。技術の利用量ではなく、仕事全体の変化と成果を考えます。",
  reference:
    "用語や数式、評価の基準を、設計中に確認するための資料です。本文を読む際の前提や、判断の根拠を確かめられます。",
  essays:
    "技術や仕事の変化に対して、何を選び、何を問い直すか。実務と学習から得た考察をまとめています。",
  series:
    "一つの問いを複数の記事で掘り下げる連載です。AIへ仕事を任せる判断から、品質保証や組織での使い方まで順に考えます。",
  articles:
    "AIを仕事へ組み込む際の判断と仕組みを読む記事一覧です。知りたい課題に合わせて、設計・理論・実践を選べます。",
};
export const introductionForPath = (pathname: string) =>
  pageIntroductions[
    pathname.replace(/^\/+|\/+$/g, "")
  ];
export const fallbackLastUpdated = "2026-09-28";
// Page dates are explicit. Home tracks the latest site-wide public change separately.
export const staticPageLastUpdated: Record<string, string> = {
  "cases/customer-support-ai-dx/continuous-improvement": "2026-10-19",
  "software-engineering/code-generation-and-work-design": "2026-10-08",
  "software-engineering/code-generation-boundaries": "2026-10-08",
  "practices/ai-generation-and-work-completion": "2026-10-08",
  "essays/ai-use-and-operation": "2026-11-26",
  "practices/transferring-practices": "2026-11-26",
  // Retired Details compatibility redirect; excluded from the sitemap.
  "career/details": "2026-10-04",
  // Site-wide last public change; independent of Garden Notes and individual page histories.
  "": "2026-11-28",
  sitemap: "2026-11-28",
  ai: "2026-11-27",
  "ai-design": "2026-11-27",
  "ai-design/applicability": "2026-11-27",
  "ai-design/responsibility-control": "2026-11-27",
  "ai-design/architecture": "2026-11-27",
  "ai-design/knowledge-context": "2026-11-27",
  "ai-design/evaluation-hitl": "2026-11-27",
  "ai-design/software-engineering": "2026-11-27",
  "ai-design/lifecycle-operations": "2026-11-27",
  "ai-mathematics": "2026-11-27",
  "ai-theory": "2026-11-27",
  books: "2026-11-28",
  cases: "2026-11-28",
  "cases/design-studies": "2026-11-25",
  dx: "2026-11-27",
  planning: "2026-11-27",
  "system-design": "2026-11-27",
  "dx/value-design": "2026-11-27",
  "dx/business-transformation": "2026-11-27",
  "dx/selection-retirement": "2026-10-08",
  "dx/system-transformation": "2026-11-27",
  "dx/continuous-value": "2026-11-27",
  essays: "2026-11-26",
  practices: "2026-11-27",
  reference: "2026-11-27",
  series: "2026-11-26",
  "start-here": "2026-11-25",
  architecture: "2026-11-27",
  "knowledge-context": "2026-11-27",
  "software-engineering": "2026-11-27",
  "evaluation-hitl": "2026-11-27",
  foundations: "2026-11-27",
  "foundations/llm-as-probabilistic-model": "2026-09-28",
  career: "2026-10-04",
  "career/profile": "2026-09-28",
  search: "2026-09-28",
  about: "2026-11-26",
  retired: "2026-11-28",
  "retired/obsolete": "2026-10-05",
  "retired/obsolete-cases": "2026-10-05",
  "retired/retired": "2026-11-28",
  "garden-notes": "2026-11-28",
  articles: "2026-11-27",
  overview: "2026-09-28",
  updates: "2026-09-28",
  "404.html": "2026-09-28",
  "essays/model-competition-and-ecosystems": "2026-10-03",
  "evaluation-hitl/human-review-capability": "2026-10-03",
  "software-engineering/ai-design-assistance": "2026-10-08",
  "practices/ai-education-principles": "2026-10-08",
  "practices/transferring-ai-practices": "2026-10-08",
  "essays/what-not-to-build-with-ai": "2026-10-08",
  "architecture/agents-tools-and-workflows": "2026-10-08",
  "foundations/generation-and-acceptance": "2026-10-08",
  "cases/understanding-systems-as-capability": "2026-10-08",
  "software-engineering/ai-driven-development": "2026-10-08",
};
export const staticLastUpdatedForPath = (pathname: string) => {
  const route = pathname.replace(base, "").replace(/^\/+|\/+$/g, "");
  return staticPageLastUpdated[route] ?? fallbackLastUpdated;
};
export const formatDateJa = (value: string) => {
  const match = value.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?(?:T.*)?$/);
  if (!match) return value;
  const [, year, month, day] = match;
  return `${year}年${month ? `${Number(month)}月` : ""}${day ? `${Number(day)}日` : ""}`;
};
export const url = (p = "") =>
  compatibilityFor(p)?.to ?? (base + "/" + p.replace(/^\/+|\/+$/g, "") + (p ? "/" : ""));
export const assetUrl = (p: string) => base + "/" + p.replace(/^\/+|\/+$/g, "");
export const absoluteUrl = (site: URL, p = "") =>
  new URL(/\.[a-z0-9]+$/i.test(p) ? assetUrl(p) : url(p), site).toString();
export const label = (s: string) => s === "planning" ? "IT戦略・企画" : s === "system-design" ? "システム設計" : sections.find((x) => x[0] === s)?.[1] ?? s;
export const publishedEntry = (e: {
  data: { status: string; public?: boolean };
}) => e.data.status !== "draft" && e.data.public !== false;
// RETIRED stays available at its URL and the dedicated retired index,
// but is absent from ordinary discovery/feed/sitemap. DELETE is for valueless records only.
export const publicEntry = (e: {
  id?: string; collection?: string; data: { status: string; public?: boolean; lifecycle?: string };
}) => publishedEntry(e) && e.data.lifecycle !== "retired" && (!e.id || e.collection === "career" || !compatibilityFor(e.id));
// Ordinary category discovery is ACTIVE-only; historical records use the archive.
export const activeEntry = (e: { data: { status: string; public?: boolean; lifecycle?: string } }) =>
  publishedEntry(e) && (!e.data.lifecycle || e.data.lifecycle === "active");

export const layers = {
  "ai-mathematics": "数学",
  "ai-theory": "AI理論",
  "ai-design": "AI設計",
  career: "キャリア",
  reference: "Reference",
  practice: "実践知",
  case: "実務事例",
  publication: "公開物",
} as const;
export const layerLabel = (layer: keyof typeof layers) => layers[layer];

export const statusLabel = (status: string) =>
  ({
    stable: "安定版",
    published: "公開",
    archived: "アーカイブ",
    draft: "下書き",
  })[status] ?? status;
