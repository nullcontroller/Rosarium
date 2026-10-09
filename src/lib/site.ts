export const sections = [
  ["foundations", "AI設計原則", "新しい入口はStart Hereから"],
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
  ["cases", "実践事例", "原則を適用した実務事例"],
  ["essays", "考察", "市場・キャリア・技術への考察"],
] as const;
export const base = "/Rosarium";
export const siteDescription =
  "AIを仕事にどう組み込み、人間とどう分担するかを考える個人の技術サイトです。DX、システム設計、業務設計も扱い、具体的な事例から設計・理論を深めます。";

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
  planning: "何を、なぜ、どこまでシステム化するか。業務課題・価値・目標・対象範囲・投資判断を整理し、要件定義へ業務要求を渡す意思決定領域です。",
  ai: "AIを仕事やシステムへ組み込むために、人とAIの役割、知識と条件、評価、理論、実践を設計の視点から考えます。",
  "ai-design":
    "与えられた業務要求を、AI・人間・既存システムの役割、必要な情報、要件・方式、検証・運用へ具体化する設計領域です。",
  "ai-mathematics":
    "AIの答えはなぜ変わるのか、どこまで制御できるのか。生成の仕組みを確率や数学から理解します。",
  practices:
    "AIを現場で使い続けるために、教え方、情報の渡し方、確認の手順を考えます。導入・教育・開発・組織での実践を扱います。",
  cases:
    "実際の業務課題に対して、何を変え、なぜその設計を選んだかをまとめています。現在の主要事例を掲載しています。",
  books:
    "業務の課題から、設計・確認・改善までを章ごとに追う実務事例です。現在の主要事例から、判断の理由と役割分担を確かめられます。",
  dx: "価値設計、業務変革、選択と廃止、システム変革、継続的価値創出。DXを技術導入ではなく、業務・サービス・システムの変化として考えるための記事を整理しています。",
  reference:
    "用語や数式、評価の基準を、設計中に確認するための資料です。本文を読む際の前提や、判断の根拠を確かめられます。",
  essays:
    "技術や仕事の変化に対して、何を選び、何を問い直すか。実務と学習から得た考察をまとめています。",
  series:
    "一つの問いを複数の記事で掘り下げる連載です。AIへ仕事を任せる判断から、品質保証や組織での使い方まで順に考えます。",
  "start-here":
    "何から読めばよいか迷ったときの入口です。関心のある課題から、設計原則・実践・事例へ進めます。",
  articles:
    "AIを仕事へ組み込む際の判断と仕組みを読む記事一覧です。知りたい課題に合わせて、設計・理論・実践を選べます。",
};
export const introductionForPath = (pathname: string) =>
  pageIntroductions[
    pathname.replace(/^\/Rosarium(?=\/|$)/, "").replace(/^\/+|\/+$/g, "")
  ];
export const fallbackLastUpdated = "2026-09-28";
// Content/structure dates are explicit; shared CSS, analytics and deploys do not change them.
export const staticPageLastUpdated: Record<string, string> = {
  "software-engineering/code-generation-and-work-design": "2026-10-08",
  "software-engineering/code-generation-boundaries": "2026-10-08",
  "practices/ai-generation-and-work-completion": "2026-10-08",
  // Retired Details compatibility redirect; excluded from the sitemap.
  "career/details": "2026-10-04",
  "": "2026-10-08",
  ai: "2026-10-10",
  "ai-design": "2026-10-10",
  "ai-design/applicability": "2026-10-08",
  "ai-design/responsibility-control": "2026-10-08",
  "ai-design/architecture": "2026-10-08",
  "ai-design/knowledge-context": "2026-10-08",
  "ai-design/evaluation-hitl": "2026-10-08",
  "ai-design/software-engineering": "2026-10-08",
  "ai-design/lifecycle-operations": "2026-10-08",
  "ai-mathematics": "2026-10-04",
  books: "2026-10-05",
  cases: "2026-10-10",
  dx: "2026-10-10",
  planning: "2026-10-10",
  "dx/value-design": "2026-10-03",
  "dx/business-transformation": "2026-10-03",
  "dx/selection-retirement": "2026-10-03",
  "dx/system-transformation": "2026-10-04",
  "dx/continuous-value": "2026-10-04",
  essays: "2026-10-07",
  practices: "2026-10-08",
  reference: "2026-10-04",
  series: "2026-10-04",
  "start-here": "2026-10-10",
  architecture: "2026-10-04",
  "knowledge-context": "2026-10-04",
  "software-engineering": "2026-10-04",
  "evaluation-hitl": "2026-10-04",
  foundations: "2026-09-28",
  "foundations/llm-as-probabilistic-model": "2026-09-28",
  career: "2026-10-04",
  "career/profile": "2026-09-28",
  search: "2026-09-28",
  about: "2026-10-10",
  retired: "2026-10-05",
  "retired/obsolete": "2026-10-05",
  "retired/obsolete-cases": "2026-10-05",
  "retired/retired": "2026-10-05",
  "garden-notes": "2026-10-10",
  articles: "2026-10-04",
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
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return `${year}年${month}月${day}日`;
};
export const url = (p = "") =>
  base + "/" + p.replace(/^\/+|\/+$/g, "") + (p ? "/" : "");
export const assetUrl = (p: string) => base + "/" + p.replace(/^\/+|\/+$/g, "");
export const absoluteUrl = (site: URL, p = "") =>
  new URL(/\.[a-z0-9]+$/i.test(p) ? assetUrl(p) : url(p), site).toString();
export const label = (s: string) => s === "planning" ? "企画" : sections.find((x) => x[0] === s)?.[1] ?? s;
export const publishedEntry = (e: {
  data: { status: string; public?: boolean };
}) => e.data.status !== "draft" && e.data.public !== false;
// RETIRED stays available at its URL and the dedicated retired index,
// but is absent from ordinary discovery/feed/sitemap. DELETE is for valueless records only.
export const publicEntry = (e: {
  data: { status: string; public?: boolean; lifecycle?: string };
}) => publishedEntry(e) && e.data.lifecycle !== "retired";
// Ordinary category discovery is ACTIVE-only; historical records use the archive.
export const activeEntry = (e: { data: { status: string; public?: boolean; lifecycle?: string } }) =>
  publishedEntry(e) && (!e.data.lifecycle || e.data.lifecycle === "active");

export const layers = {
  "ai-mathematics": "AI理論",
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
