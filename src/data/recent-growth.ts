import type { IconName } from "../lib/icons";

export const recentGrowthLabels = {
  launch: "LAUNCH",
  integrated: "INTEGRATED",
  retired: "RETIRED",
  new: "NEW",
  updated: "UPDATED",
  expanded: "EXPANDED",
  revised: "REVISED",
} as const;

export type RecentGrowthType = keyof typeof recentGrowthLabels;

export type RecentGrowthChange = string | { text: string; contentIds: string[]; action?: "published" | "revised" | "integrated" | "retired" };
export const growthChangeText = (change: RecentGrowthChange) => typeof change === "string" ? change : change.text;
export const growthChangeTargets = (change: RecentGrowthChange) => typeof change === "string" ? [] : change.contentIds;

export interface RecentGrowthItem {
  date: string;
  type: RecentGrowthType;
  title: string;
  changes: RecentGrowthChange[];
  category: string;
  topic?: string;
  summaryChanges?: string[];
  showPublicationLinks?: boolean;
  topics?: { title: string; summary: string; details?: string[]; links?: { path: string; title: string }[] }[];
  icon?: IconName;
  relatedLinks?: { path: string; title: string }[];
}

/** Titles linked from Garden Notes must be explicitly recorded as new publications. */
export const growthPublishedTargets = (entry: RecentGrowthItem): string[] =>
  entry.changes.flatMap(change => typeof change === "string" || change.action !== "published" ? [] : change.contentIds);

// Content revisions link by entry id; displayed titles come from content metadata.
// UI-only changes remain plain text and do not create content links.
// Detailed changes feed article histories; Garden Notes shows counts and links for new publications.
// Legacy records without identifiable targets retain a short summary without invented counts.
// Keep one entry per date; add each reader-facing change as a short changes item.
// Prioritize new articles/Cases/Books, substantive revisions and content integration.
// Record content retirement, meaningful page restructuring and new reader-facing features.
// Routine cosmetic fixes and internal maintenance are not individual history items.
// A substantive reader-facing navigation/accessibility revision may be recorded as a whole.
// Ask what readers can newly read or understand; this is not a development log.
const informationArchitectureChanges = [
  "顧客サポートDX Bookの説明・図解とキャリアの紹介を実務に基づく内容へ統一し、PoCの課題分析からRAG管理システムの構築・再評価までを追いやすくした",
  "トップページの重複した事例紹介を削除し、代表事例を残して「はじめに」への入口を追加した",
  "AI入口の説明と重複見出しを減らし、既存テーマの代表記事と記事一覧を見つけやすくした",
  "DX入口は5分類を維持し、各テーマで考えることと最初に読む記事を簡潔に示した",
  "企画入口を「何を、なぜ、どこまでシステム化するか」から関連記事へ進む構成にし、今後の方向性の説明と分けた",
  "実践事例一覧の重複した紹介を整理し、事例ごとの見出し階層を修正した",
  "記事ヘッダーを種別・タイトル・概要・最終更新日に絞り、内部管理値やタグの重複表示を省いた",
  "記事カードでは主題に合う分類を示し、実務事例・技術解説・論考などの種別を共通の基準で表示した",
  "検索結果をタイトル・概要・種別・最終更新日で読み比べられる表示にした",
  "検索や関連記事で使うタグを「生成AI」「AI活用」に統一し、表記の揺れを整理した",
  "スマートフォンのヘッダーを省スペース化し、主要ページと検索へ折りたたみメニューから移動できるようにした",
  "トップページは本文の幅に応じて1列・2列を切り替え、タブレットやPCのヘッダーでも文字や操作が重ならないようにした",
  "記事の見出し階層を整え、図解リンクと補助パネルをキーボードで操作した際の移動・フォーカス復帰を改善した",
];
const curatedRecentGrowth = [
{
  date: "2026-11-26",
  type: "revised",
  title: "障害調査の実務事例を全面改訂し、Bookとして体系化",
  category: "Rosarium",
  icon: "updates",
  showPublicationLinks: false,
  topics: [{
    title: "AI・数理領域を拡充し、学習理論と発展的なモデル構造を体系化",
    summary: "学習理論と計算資源の最適化から、文脈適応・条件付き計算・系列処理・拡散生成へ進む新規9記事を整備。",
    details: ["強化学習、選好学習、RLVRなどの学習理論を追加", "スケーリング則と投機的復号の数理的原理を解説", "In-Context Learning、MoE、SSM、拡散言語モデルの計算機構を解説", "数式の導出、成立条件、図解、再現可能なPython検算を整備"],
    links: [{ path: "ai-mathematics", title: "AI・数理" }],
  }, {
    title: "AIと数学の接続と専門用語の説明を強化",
    summary: "AIの具体的な問題から数式へ進む説明構造を整え、共通用語集と本文中の定義を充実。",
    links: [{ path: "ai-mathematics", title: "AI・数理" }, { path: "reference/glossary", title: "基本用語集" }],
  }, {
    title: "専門領域の入口を整理し、企画判断の詳細を既存解説へ統合",
    summary: "カテゴリの概要から記事・関連事例へ進む順序を整え、企画判断の詳細は既存のシステム設計解説へ集約。",
    links: [{ path: "planning", title: "IT戦略・企画" }],
  }, {
    title: "AI・数理の基礎理論を強化 ― 学習・Attention・推論の数理",
    summary: "条件付き確率、Temperature、ハルシネーション、ガードレールの既存4記事を数理的に補強し、学習・Attention・推論の原理を解説。",
    details: [
      "条件付き確率、Temperature、ハルシネーション、ガードレールの既存4記事を数理的に補強",
      "言語モデルの損失関数とAttentionの計算原理を体系化",
      "推論時計算の予算配分とAttentionの計算効率を解説",
      "数式の途中導出、成立条件、図解、再現可能なPython検算を整備",
    ],
    links: [{ path: "ai", title: "AI・数理" }],
  }, {
    title: "既存論考の退役・統合による知識体系の整理",
    summary: "DXの学習過程を記録した論考1件を退役。AI活用能力に関する論考を連載第6回へ、AI活用の横展開に関する論考を連載第3回へ統合。",
    links: [{ path: "essays/ai-essence", title: "AI活用の本質を問う" }, { path: "retired/retired", title: "退役記事" }],
  }, {
    title: "仕様書レビューの実務事例を改訂し、AIと人間の役割分担を図解",
    summary: "文書の参照方式の比較と選定理由を追加し、AIの候補提示、人間の根拠確認・判断・最終修正をフローチャートで明示。タイトルと概要を、仕様書と実装の不整合・品質保証・技術判断を中心に整理。",
    links: [{ path: "cases/specification-debt-review", title: "仕様書の横断レビュー" }],
  }, {
    title: "キャリアページの代表実績を簡潔に整理し、専門性と成果を把握しやすく改善",
    summary: "実務事例を専門領域・成果・担当・評価条件の共通構造へ整理し、詳しい判断過程は個別事例へ集約。",
    links: [{ path: "career", title: "Career" }],
  }, {
    title: "トップページの主要導線を改善し、Rosariumの紹介ページを統合",
    summary: "作者のキャリア・事例・Rosariumの紹介を同格のナビゲーションカードにし、「はじめに」を「Rosariumとは？」へ統合。目的・制作背景・専門領域・読み方・編集方針を整理。",
    links: [{ path: "about", title: "Rosariumとは？" }],
  }, {
    title: "障害調査の実務事例を全面改訂し、Bookとして体系化",
    summary: "複数のソフトウェアにまたがる障害調査を全9章で詳述。仮説・判断・実施事項・結果を分離し、技術判断の過程を明確化。システム構成、仮説検証、調査範囲、責務分担を14図で可視化。著者の稼働工数2人日で残存メモリリークの解決に導いた経緯を記述。",
    details: [
      "複数のソフトウェアにまたがる障害調査を全9章で詳述",
      "仮説・判断・実施事項・結果を分離し、技術判断の過程を明確化",
      "システム構成、仮説検証、調査範囲、責務分担を14図で可視化",
      "著者の稼働工数2人日で残存メモリリークの解決に導いた経緯を記述",
    ],
    links: [{ path: "cases/ai-technical-investigation", title: "複数のソフトウェアにまたがる障害調査の設計" }],
  }],
  changes: [
    { action: "published", text: "学習理論と発展的なモデル構造を扱うAI・数理の新規9記事を公開", contentIds: ["foundations/policy-gradient-learning", "foundations/preference-learning-dpo", "foundations/verifiable-reward-reasoning", "foundations/compute-optimal-scaling", "foundations/speculative-decoding", "foundations/in-context-learning", "foundations/mixture-of-experts", "foundations/state-space-sequence-models", "foundations/diffusion-language-models"] },
    { action: "revised", text: "AIの問題と数学を接続する説明構造と用語説明を強化", contentIds: ["software-engineering/code-generation-models", "reference/glossary", "reference/mathematical-reference"] },
    { action: "revised", text: "企画判断の詳細を既存のシステム設計解説へ統合", contentIds: ["architecture/requirements-to-system-method"] },
    { action: "revised", text: "条件付き確率、Temperature、ハルシネーション、ガードレールを数理的に補強", contentIds: ["foundations/conditional-probability", "foundations/temperature-design", "foundations/hallucination-mechanisms", "foundations/guardrail-models"] },
    { action: "published", text: "学習損失・Attention・推論時計算の予算配分・Attentionの計算効率を公開", contentIds: ["foundations/language-model-loss", "foundations/attention-information-flow", "foundations/test-time-compute-allocation", "foundations/attention-efficiency"] },
    { action: "retired", text: "DXの学習過程を記録した考察を、後続の専門記事で知見が発展したため退役。本文とURLを保存", contentIds: ["essays/dx-and-value"] },
    { action: "integrated", text: "AI活用能力に関する考察を連載第6回へ統合。旧本文・履歴を保存し、旧URLから統合先へ誘導", contentIds: ["essays/ai-use-and-operation"] },
    { action: "integrated", text: "AI活用の横展開の知見を連載第3回へ統合。旧本文・履歴を保存し、旧URLから統合先へ誘導", contentIds: ["practices/transferring-practices"] },
    { action: "revised", text: "承認済み統合元の固有知見を適切な節へ移管し、連載目次を更新", contentIds: ["essays/ai-case-sharing-and-judgment", "essays/ai-capability-and-organization", "essays/ai-essence"] },
    { action: "revised", text: "仕様書レビューの実務事例を改訂し、AIと人間の役割分担を図解", contentIds: ["cases/specification-debt-review"] },
    { action:"revised", text:"キャリアページの代表実績を簡潔に整理し、専門性と成果を把握しやすく改善。障害調査の著者自身の稼働工数2人日、残存リーク解消、比較評価の限界も明示", contentIds:["career/overview"] },
    "トップページの主要導線を改善し、Rosariumの紹介ページを統合",
    { action: "revised", text: "既存の障害調査実務事例を全9章・14図のBookへ全面改訂。仮説・判断・実施事項・結果と責務分担を分け、著者自身の稼働工数2人日で残存リークの解決に導いた経緯を記述。比較データがなく工数削減効果は不明", contentIds: ["cases/ai-technical-investigation", "cases/ai-technical-investigation/background", "cases/ai-technical-investigation/initial-investigation", "cases/ai-technical-investigation/shared-library-investigation", "cases/ai-technical-investigation/crash-resolution", "cases/ai-technical-investigation/memory-leak-investigation"] },
    { action: "published", text: "同じBookへ初期調査範囲、情報提供、結果評価、生成AIへの指示の4章を新設", contentIds: ["cases/ai-technical-investigation/investigation-scope", "cases/ai-technical-investigation/investigation-input", "cases/ai-technical-investigation/findings-and-evaluation", "cases/ai-technical-investigation/reusable-method"] },
  ],
},
{
  "date": "2026-11-25",
  topics: [
    { title: "連載「AI活用の本質を問う」全6回を公開", summary: "操作・運用・改善から、知的協働、判断知識、総工数、事業成果、組織設計までを考察。", links: [{ path: "essays/ai-essence", title: "連載「AI活用の本質を問う」全6回を公開" }] },
    { title: "発展ケーススタディ全6記事を公開", summary: "実務経験を起点に、要求定義から運用・保守までを検討する仮想設計。設計領域を一覧と記事冒頭に明示。", links: [{ path: "cases/design-studies", title: "発展ケーススタディ全6記事を公開" }] },
    { title: "IT戦略・企画とシステム設計を整備", summary: "専門知識と事例を横断して参照できる導線へ再編。", links: [{ path: "planning", title: "IT戦略・企画" }, { path: "system-design", title: "システム設計" }] },
    { title: "Careerの方針と閲覧導線を改訂", summary: "ITストラテジストとシステムアーキテクトを軸とする志向を明確化し、共通左サイドバーを復活。", links: [{ path: "career", title: "Careerの方針と閲覧導線を改訂" }] },
    { title: "サイト全体の読みやすさを改善", summary: "不要な強制改行を撤廃し、主要更新をトピック別に表示。" },
    { title: "専門領域の責務と記事分類を再整理", summary: "AI・数理とDXの責務を再定義し、AI活用・応用システム設計の記事を専門領域ごとに再整理。" },
    { title: "知識体系を俯瞰できるサイトマップを新設", summary: "専門領域の役割・問い・関係と、関心に応じた読み分けを案内。", links: [{ path: "sitemap", title: "サイトマップ" }] },
    { title: "共通ヘッダーの配置と識別性を改善", summary: "ロゴ・操作と主要ナビを二段に分離。項目間の分散を抑え、区切り線と選択・ホバー・フォーカス表示を整えた。" },
  ],
  "type": "new",
  "title": "連載「AI活用の本質を問う」全6回を公開",
  "relatedLinks": [{ "path": "ai", "title": "AIの連載を読む" }, { "path": "essays", "title": "考察の一覧" }, { "path": "dx/continuous-value", "title": "継続的価値創出" }, { "path": "planning", "title": "IT戦略・企画" }, { "path": "system-design", "title": "システム設計" }],
  "category": "Rosarium",
  "icon": "updates",
  "summaryChanges": [
    "AI活用を「操作・運用・改善」の三段階から考察",
    "効率化ツールとしてのAI活用の限界と、人間とAIの知的協働について考察",
    "AI成功事例の共有と、再利用可能な判断知識の違いを整理",
    "AI利用による工数削減と検証コスト、技術進化を踏まえた学習の価値を考察",
    "AI導入の成功条件と、業務改善・事業成果の関係を整理",
    "ECRSを踏まえ、AI時代における業務・役割・権限・評価・教育の再設計について考察",
    "IT戦略・企画とシステム設計を整備し、専門知識と事例の横断導線を再編",
    "実務経験を起点とした仮想設計の発展ケーススタディ6記事と一覧を新規公開",
    "ITストラテジストとシステムアーキテクトを軸とするキャリア方針を明確化し、Careerの共通ナビゲーションを整備",
    "発展ケーススタディの設計領域を一覧・記事冒頭・関連事例で明示",
    "サイト全体の文章表示を見直し、不要な強制改行を撤廃。画面幅に応じた自然な折り返しへ統一",
    "AI・数理とDXの責務を再定義し、AI活用・応用システム設計の記事を専門領域ごとに再整理",
    "共通ヘッダーを二段構成に整理し、項目間隔・区切り線・選択表示と画面幅に応じた識別性を改善"
  ],
  "changes": [
    "Rosarium全体の知識体系を俯瞰できるサイトマップを新設",
    "サイトマップを専門領域の役割と関係を説明する案内へ再設計",
    "AI・数理とDXの責務を再定義し、AI活用・応用システム設計の記事を専門領域ごとに再整理",
    "共通ヘッダーをロゴ・操作と主要ナビの二段構成に整理。項目間隔・区切り線・選択・ホバー・フォーカス表示を整え、画面幅に応じた識別性を改善",
    "発展ケーススタディの設計領域を一覧・記事冒頭・関連事例で明示",
    {
      "action": "published",
      "text": "新規公開。連載『AI活用の本質を問う』のシリーズ目次と全6回を公開",
      "contentIds": [
        "essays/ai-essence",
        "essays/ai-operation-management-improvement",
        "essays/ai-intellectual-collaboration",
        "essays/ai-case-sharing-and-judgment",
        "essays/ai-verification-cost-and-learning",
        "essays/ai-adoption-success-and-value",
        "essays/ai-capability-and-organization"
      ]
    },
    { action: "published", text: "新規公開。実務経験を起点とする発展ケーススタディの一覧1ページと仮想設計6記事を公開", contentIds: ["cases/design-studies", "cases/design-studies/inquiry-analysis", "cases/design-studies/metadata-batch", "cases/design-studies/qualification-testing", "cases/design-studies/data-migration", "cases/design-studies/rag-security", "cases/design-studies/document-lifecycle"] },
    { action: "revised", text: "改訂。顧客サポートDXの目次と関連する5章に、実務実績と区別した発展ケースへの導線を追加", contentIds: ["cases/customer-support-ai-dx", "cases/customer-support-ai-dx/why-ai", "cases/customer-support-ai-dx/knowledge-design", "cases/customer-support-ai-dx/poc-metadata-improvement", "cases/customer-support-ai-dx/human-handoff", "cases/customer-support-ai-dx/stopping-conditions"] },
    "サイト全体の文章表示を見直し、不要な強制改行を撤廃。画面幅に応じた自然な折り返しへ統一",
    "サイト全体にパンくずリストを整備し、現在の閲覧位置と上位カテゴリへの導線を改善した",
    "AI入口に連載目次と回数・概要を掲載し、公開済み連載へカテゴリ内から進める導線を追加した。旧連載URLもこの入口へ案内する",
    { action: "revised", text: "改訂。Career末尾の関連資料一覧を整理し、LinkedInプロフィールへの案内を残した。ITストラテジストとシステムアーキテクトを軸とするキャリア方針を明確化し、共通の左サイドバーを復活", contentIds: ["career/overview"] },
    "企画の入口を「IT戦略・企画」へ広げ、「システム設計」を追加。既存記事のURLを保ち、業務・投資の判断と要求を実現する設計の読み分けを整えた",
    "「実践事例」を「事例」に統一し、IT戦略・企画とシステム設計などの専門知識から、関連性を示した共通の事例枠で正本へ進める構成に再編した",
    "IT戦略・企画の入口からFDEの説明を省き、専門知識と関連事例に集中できる構成にした",
    { action: "revised", text: "改訂。仕様書横断レビューの規模表記を、元のWord仕様書（約3万文字・68ページ）と移行後のMarkdown（68ファイル）に区別し、概要と紹介文を統一した", contentIds: ["cases/specification-debt-review"] },
    "HomeとCareerの専門性・実務事例への導線を整理し、更新履歴をトピック別の主要更新と詳細・訂正の記録に分離。Homeの固定高の内部スクロールを撤廃した"
  ]
},
  {
    date: "2026-11-24", type: "revised", title: "実務事例の説明と、記事を探して読む入口を改訂",
    changes: [
      {
        action: "revised",
        text: "改訂。顧客サポートDXを実務に基づく設計・構築・PoCの記録として整理。初回評価、課題分析、RAG管理システムと属性管理、改善方式の再評価を本文・概要・図解で整合させ、有人引継ぎと設計判断の説明を見直した",
        contentIds: [
          "cases/customer-support-ai-dx",
          "cases/customer-support-ai-dx/executive-summary",
          "cases/customer-support-ai-dx/why-ai",
          "cases/customer-support-ai-dx/responsibility-boundary",
          "cases/customer-support-ai-dx/poc-evaluation",
          "cases/customer-support-ai-dx/human-handoff",
          "cases/customer-support-ai-dx/customer-experience",
          "cases/customer-support-ai-dx/poc-effect-evaluation",
          "cases/customer-support-ai-dx/knowledge-design",
          "cases/customer-support-ai-dx/stopping-conditions",
          "cases/customer-support-ai-dx/poc-metadata-improvement",
          "cases/customer-support-ai-dx/design-principles",
        ],
      },
      {
        action: "revised",
        text: "改訂。顧客サポートDXの担当経験とPoCの確認結果を実務事例として紹介し、本番の業務効果が未測定であることと区別した。専門性の重複を整理し、クラッシュ・メモリリーク調査への導線と担当チームとの責任分担を明確にした",
        contentIds: ["career/overview"],
      },
      ...informationArchitectureChanges.slice(1),
      "案内ページでも、実務事例・仮想設計ケーススタディ・研究と考察の区別を明確にした",
    ],
    summaryChanges: [
      "顧客サポートDXのPoC・設計判断・図解とCareerの実務説明を整理",
      "AI・DX・企画・実践事例の入口と、記事・検索結果の表示を改善",
      "モバイルナビゲーション、画面幅への対応、キーボード操作を改善",
    ],
    relatedLinks: [
      { path: "cases/customer-support-ai-dx", title: "生成AI / RAGによる顧客サポートDX" },
      { path: "ai", title: "AIの記事を探す" },
      { path: "dx", title: "DXの記事を探す" },
      { path: "planning", title: "企画の記事を探す" },
      { path: "cases", title: "実践事例を見る" },
      { path: "career", title: "作者のキャリア" },
      { path: "start-here", title: "はじめに" },
      { path: "about", title: "Rosariumとは？" },
    ],
    category: "Rosarium", icon: "updates",
  },
  {
    date: "2026-10-30", type: "new", title: "AIシステムへの投資判断に関する論考を追加",
    changes: [
      { action: "published", text: "新規公開。標準AI環境を基準に、価値と総コスト、技術進化への追随、人間の介在から追加開発を判断する論考を追加", contentIds: ["essays/ai-investment-value-cost-evolution"] },
    ],
    category: "Rosarium", icon: "updates",
  },
  {
    date: "2026-10-29", type: "new", title: "生成AIによる技術調査のCaseを全5章で整理",
    changes: [
      { action: "published", text: "新規公開。一般的なAI回答への情報追加、同期制御の不備のコード確認、証拠の引き継ぎ、残存メモリリークの版間比較を通じ、調査の判断過程と担当チームによる修正・検証を記述した", contentIds: ["cases/ai-technical-investigation"] },
    ],
    summaryChanges: ["クラッシュとメモリリークの調査を時系列で振り返り、仮説と確認済みの結果を区別", "私の調査支援と担当チームの修正・検証から責任境界を整理"],
    category: "Rosarium", icon: "updates",
  },
  {
    date: "2026-10-19", type: "revised", title: "代表設計事例と、数学・AI理論の入口を整理",
    changes: [
      { action: "revised", text: "改訂。顧客サポートQAを代表設計事例の先頭に置き、仕様書レビュー・保守開発の確認済み成果を設計力の裏付けとして配置。Careerの強みと今後の方向性、各事例の成果と比較条件を整理した", contentIds: ["career/overview", "cases/specification-debt-review", "cases/three-ai-maintenance"] },
      { action: "integrated", text: "統合・再構成。顧客サポートDXを11章で整理。【訂正】PoCの時系列と評価指標は、第1回PoCで絞込み前の方式を評価して回答正答率72％を確認し、RAG管理システムの新規設計・構築と節単位のメタデータ管理を経て、第2回PoCで回答正答率96％と目標達成を確認した経緯へ訂正。残る4％は本来自動回答できる案件の有人移管であり、誤回答ではない。逆質問・回答生成の98％と有人振り分け94％から100％は別指標の見積もりとして扱う。720件／月の自己解決を前提とする280時間／月は条件付き試算で、本番評価は未実施。個別機能の実装範囲と未検証の運用課題を区別する", contentIds: ["evaluation-hitl/customer-support-qa-poc", "cases/customer-support-ai-dx", "cases/customer-support-ai-dx/poc-evaluation", "cases/customer-support-ai-dx/poc-effect-evaluation", "cases/customer-support-ai-dx/poc-metadata-improvement", "cases/customer-support-ai-dx/executive-summary", "cases/customer-support-ai-dx/responsibility-boundary", "cases/customer-support-ai-dx/knowledge-design", "cases/customer-support-ai-dx/stopping-conditions", "cases/customer-support-ai-dx/customer-experience", "cases/customer-support-ai-dx/human-handoff", "cases/customer-support-ai-dx/design-principles"] },
      "数学とAI理論の入口を分離。条件付き確率・分布の基礎と、生成・誤答・コード生成モデルの仕組みを分け、AI設計と数式リファレンスへの導線を整理した",
    ],
    summaryChanges: ["要件・方式設計を入口に、開発・保守の実務成果へ進める構成に整理", "実務で確認した範囲と、今後の方向性を分けて紹介", "数学とAI理論を分け、数理の基礎と生成の仕組みを別々に辿れる入口を整備"],
    category: "Rosarium", icon: "updates",
  },
  {
    date: "2026-10-18", type: "revised", title: "顧客サポートDXを代表設計事例として整理",
    changes: [
      { action: "revised", text: "改訂。顧客サポートDXを代表設計事例として先頭に置き、Book冒頭の業務要求・担当範囲・方式判断・到達点とCareerの実績紹介を整理した。新規QAの二段階制御とPoCによる方式改善を中心に、本編と検証詳細の補完記事を分け、効果試算を本番実測と区別した。初回PoCの目標未達・誤自動回答を原因分析と二段階制御の改善へつなげ、再検証結果を明確にした", contentIds: ["cases/customer-support-ai-dx", "career/overview", "cases/customer-support-ai-dx/executive-summary", "cases/customer-support-ai-dx/why-ai", "cases/customer-support-ai-dx/responsibility-boundary", "cases/customer-support-ai-dx/poc-evaluation", "cases/customer-support-ai-dx/knowledge-design", "cases/customer-support-ai-dx/stopping-conditions", "cases/customer-support-ai-dx/human-handoff", "cases/customer-support-ai-dx/design-principles", "cases/customer-support-ai-dx/customer-experience"] },
      { action: "published", text: "公開。顧客サポートDXのPoC詳細を補完記事へ分離し、失敗分析・二段階制御・別々の評価指標・効果試算を整理。本編第03章はPoCによる方式判断へ集中した", contentIds: ["evaluation-hitl/customer-support-qa-poc"] },
      { action: "revised", text: "改訂。終了順序の記事を、本人が確認した調査・判断の記録に整理した", contentIds: ["software-engineering/engineering-judgment-in-ai-code-review"] },
    ],
    summaryChanges: [
      "顧客サポートDXを代表設計事例としてHome・Cases・Careerの先頭に配置",
      "業務要求・担当範囲・方式判断・到達点を整理し、PoCによる方式改善を独立記事で詳述",
      "終了順序の記事を、本人が確認した調査・判断の記録に整理",
    ],
    category: "Rosarium", icon: "updates",
  },
  {
    date: "2026-10-16", type: "new", title: "AIを使う技術判断と、効率化後の余力の配分を整理",
    changes: [
      { action: "published", text: "新規公開。リソースの所有権・寿命・依存関係から不整合を見つけ、検証可能な仮説へ変える調査手順を整理した", contentIds: ["software-engineering/engineering-judgment-in-ai-code-review"] },
      { action: "published", text: "新規公開。効率化後の余力を配分する主体、業務の調整、使途ごとの成果指標と見直し条件を整理した", contentIds: ["essays/from-ai-efficiency-to-value"] },
      { action: "integrated", text: "統合。AIを業務で使いこなすための判断項目を実践知の入口へ集約した", contentIds: ["practices/ai-adoption-and-effective-use"] },
    ],
    category: "Rosarium", icon: "updates",
  },
  {
    date: "2026-10-12", type: "revised", title: "システム方式設計と実践事例の説明を整理",
    changes: [
      { action: "revised", text: "改訂。公開済みのレガシー保守の成果と、過去の参考事例の位置付けを明確にした", contentIds: ["career/overview"] },
      { action: "published", text: "新規公開。業務要求から機能要件・技術方式・責任分担を導き、PoCで採否を判断する方法を整理した", contentIds: ["architecture/requirements-to-system-method"] },
      { action: "revised", text: "改訂。方式検証の仮説・評価分担・試算と実測の区別、属性による検索対象制御と記事間の接続を補強した", contentIds: ["architecture/reference-architecture", "evaluation-hitl/qa-evaluation"] },
      { action: "revised", text: "改訂。企画部門の改善提案を受けた方式設計として、業務要求から機能分担・検索対象制御・有人引継ぎを具体化し、目標実現への見込みを提示した。図解と回答可否の分岐、調査結果を引き継ぐ有人対応を整理した。後の改訂ではPoCの検証詳細を本編から分離した", contentIds: ["cases/customer-support-ai-dx", "cases/customer-support-ai-dx/executive-summary", "cases/customer-support-ai-dx/why-ai", "cases/customer-support-ai-dx/responsibility-boundary", "cases/customer-support-ai-dx/poc-evaluation", "cases/customer-support-ai-dx/knowledge-design", "cases/customer-support-ai-dx/stopping-conditions", "cases/customer-support-ai-dx/customer-experience", "cases/customer-support-ai-dx/human-handoff", "cases/customer-support-ai-dx/design-principles"] },
    ],
    summaryChanges: [
      "Careerでレガシー保守の成果と担当範囲を整理",
      "顧客サポートQAの方式設計・有人引継ぎを改訂",
      "業務要求からシステム方式を導く記事を新規公開",
      "参照アーキテクチャとQA評価の記事を改訂",
    ],
    category: "Rosarium", icon: "updates",
  },
  {
    date: "2026-10-11",
    type: "revised",
    title: "Careerの専門性と将来方向を明確化",
    changes: [
      { action: "revised", text: "改訂。Career全体を再構成し、「何をする人か」を箇条書き化、現在の専門性とスキルセットを統合した。Windows向け業務ユーティリティの長期経験、C#・Python、Applied AI、要件定義・システム設計を具体化し、今後深めたいITストラテジスト的領域への志向とFDE非志向を明示した", contentIds: ["career/overview"] },
    ],
    category: "Rosarium",
    icon: "career",
  },
  {
    date: "2026-10-10", type: "revised", title: "企画領域・専門性を整理し、独自ドメインで長期育成へ",
    changes: [{ action: "revised", text: "改訂。企画で与えられた業務目標と、要件定義・SAで判断するシステム要件・実現方式の境界を明確にした", contentIds: ["cases/customer-support-ai-dx", "cases/customer-support-ai-dx/executive-summary", "cases/customer-support-ai-dx/design-principles"] },
      "システム企画の領域を新設し、価値発見・業務要求と要件定義・システムアーキテクチャの境界を整理した",
      { action: "revised", text: "改訂。現在の専門性、代表実績、今後深めたい企画・価値発見を分離し、Careerを実務の証拠へ進む入口として再構成した", contentIds: ["career/overview"] },
      "Rosariumを長期視点で育てる技術ポートフォリオとして運用するため、独自ドメインを取得し、正規URLを rosarium-tech.com へ変更。旧GitHub Pages URLからも新しい入口へ案内"],
    summaryChanges: ["システム企画の領域を新設", "Careerを1件大幅改訂", "Caseを3件改訂",
      "独自ドメインrosarium-tech.comへ移行し、旧URLから案内"],
    category: "Rosarium", icon: "updates",
  },
  {
    date: "2026-10-09",
    topic: "コンテキスト設計に関する",
    type: "revised",
    title: "問いに必要な情報から調査経路を選ぶ考え方を改訂",
    changes: [
      { action: "revised", text: "改訂。人間とAIが持つコンテキスト・応答特性・検証可能性から調査主体を選び、不足する情報に応じて切り替える考え方を追加した", contentIds: ["knowledge-context/context-before-model-performance"] },
    ],
    category: "Rosarium",
    icon: "updates",
  },
  {
    date: "2026-10-08",
    topic: "AI設計に関する",
    type: "revised",
    title: "AI設計の知識と実践事例を改訂し、責任・評価・構成・委任・運用を整理",
    changes: [
      { action: "revised", text: "改訂。機能と実装を分離し、保持する条件と引き継ぎ先から廃止を設計する観点を整理した", contentIds: ["essays/legacy-change-and-retirement"] },
      { action: "revised", text: "改訂。情報量と安全性を区別し、制約による保証の範囲を明確にした", contentIds: ["foundations/guardrail-models"] },
      { action: "revised", text: "改訂。判断基準を業務の知識として管理し、実行時の条件へ渡す役割を明確にした", contentIds: ["knowledge-context/prompt-structure"] },
      { action: "integrated", text: "統合。AI教育を原則と実践に分けるで、設計原則と具体例を合わせて読めるようにした", contentIds: ["practices/ai-education-principles"] },
      { action: "integrated", text: "統合。AI活用を別の業務へ横展開するで、設計原則と具体例を合わせて読めるようにした", contentIds: ["practices/transferring-ai-practices"] },
      { action: "integrated", text: "統合。IT戦略では「何を作らないか」も設計するで、設計原則と具体例を合わせて読めるようにした", contentIds: ["essays/what-not-to-build-with-ai"] },
      { action: "integrated", text: "統合。AI出力の責任境界とHITLで、設計原則と具体例を合わせて読めるようにした", contentIds: ["foundations/generation-and-acceptance"] },
      { action: "integrated", text: "統合。理解しにくいレガシーシステムを、変更判断できる状態へ変えるで、設計原則と具体例を合わせて読めるようにした", contentIds: ["cases/understanding-systems-as-capability"] },
      { action: "revised", text: "改訂。共有経験と業務ごとの情報・品質・影響の違いから、再利用する条件を具体化した", contentIds: ["practices/transferring-practices"] },
      { action: "revised", text: "改訂。AIによる生成候補の増加と、維持する負担を踏まえた非構築判断を整理した", contentIds: ["essays/it-strategy-and-not-building"] },
      { action: "revised", text: "改訂。責任・承認・人間への引き継ぎを中心に、確認工程を持つ業務の設計を整理した", contentIds: ["foundations/ai-business-design/delegation-and-responsibility"] },
      { action: "revised", text: "改訂。手戻りした実務経験をもとに、レビューしやすさ・理解・説明・合意と、工数・経過時間を区別したAI導入評価を整理した", contentIds: ["foundations/ai-business-design/evaluating-business-efficiency"] },
      { action: "revised", text: "改訂。一般知識への質問と業務固有の情報を使う委任の違いを、情報不足時の経路から整理した", contentIds: ["foundations/ai-business-design/asking-versus-delegating"] },
      { action: "revised", text: "改訂。根拠不足や説明できない場合に、停止・移管・役割縮小を選ぶ条件を整理した", contentIds: ["foundations/ai-business-design/explainable-delegation"] },
      { action: "revised", text: "改訂。AI出力を判断する人間の知識・情報・時間・権限と、運用から学び直す必要性を整理した", contentIds: ["foundations/ai-business-design/human-judgment-capability"] },
      { action: "revised", text: "改訂。価値・リスク・検証可能性・権限・復旧から、必要な最小の委任範囲を選ぶ観点を整理した", contentIds: ["foundations/applicability-and-delegation"] },
      { action: "revised", text: "改訂。責任境界と人間による確認の評価を、業務全体の効率評価へ接続した", contentIds: ["evaluation-hitl/responsibility-and-hitl"] },
      { action: "revised", text: "改訂。AIを業務で使いこなすために設計する問いの全体像を整理した", contentIds: ["practices/ai-adoption-and-effective-use"] },
      { action: "revised", text: "改訂。運用結果から継続・改善・縮小・統合・終了を選ぶ条件と、引き継ぎの責任を整理した", contentIds: ["practices/adoption-governance"] },
      { action: "revised", text: "改訂。判断能力を学習目標へ落とし、採用・棄却・保留を説明する練習と運用からの学習を整理した", contentIds: ["practices/education-and-capability"] },
      { action: "revised", text: "改訂。AIの候補を既存システムへ渡す際の検証・承認・実行と、失敗時の状態確認を整理した", contentIds: ["architecture/reference-architecture"] },
      { action: "revised", text: "改訂。成果物・根拠・状態・版を渡す契約に焦点を絞り、人間レビューと工程制御への接続を整理した", contentIds: ["architecture/prompts-as-interfaces"] },
      { action: "revised", text: "改訂。単一Agentにも必要な情報・道具・権限・状態・停止条件を具体化し、受け渡し契約と工程制御を分けた", contentIds: ["software-engineering/multi-ai-orchestration"] },
      { action: "revised", text: "改訂。誤答を業務へ流さない対策の配置に焦点を絞り、検索・回答拒否・検出器の評価へ接続した", contentIds: ["foundations/layered-hallucination-controls"] },
      { action: "revised", text: "改訂。回答の失敗を原因工程の担当者へ戻し、知識の改善と変更時の再評価につなぐ運用を整理した", contentIds: ["knowledge-context/qa-operations"] },
      { action: "integrated", text: "統合。コード生成の利用場所という整理を、AIへのコード変更の委任・検証・反映権限・復旧の設計へ統合した", contentIds: ["software-engineering/code-generation-boundaries"] },
      { action: "integrated", text: "統合。コード生成と設計支援を分ける説明を、変更の委任と開発工程全体の評価へ統合した", contentIds: ["software-engineering/code-generation-and-work-design"] },
      { action: "integrated", text: "統合。ストレージ整理の経験を、AIと既存ツールの役割・権限・工程設計へ統合した", contentIds: ["architecture/agents-tools-and-workflows"] },
      { action: "integrated", text: "統合。AI・人間・成果物をつなぐ考え方を、開発工程の委任・検証・反映権限の設計へ統合した", contentIds: ["software-engineering/ai-driven-development"] },
      { action: "revised", text: "改訂。保守の委任に必要な情報・検証・復旧条件と、コードを判断基準にする範囲を整理した", contentIds: ["software-engineering/code-maintenance-context"] },
      { action: "revised", text: "改訂。コード変更ごとの委任範囲と、試作・正式反映の権限分離、検証・確認負荷・復旧条件を具体化した", contentIds: ["software-engineering/development-workflow"] },
      { action: "revised", text: "改訂。分割されたMarkdown仕様書をPythonで統合し、Copilotによる横断レビューと現在のコードを正本とする照合、人間の最終判断・修正を組み合わせた実務を追記。約3時間で一連のレビューと修正を完了した事例を追加。", contentIds: ["cases/specification-debt-review"] },
    ],
    category: "Rosarium",
    icon: "updates",
  },
  {
    date: "2026-10-07",
    type: "new",
    title: "AI業務運用の記事と仕様書レビューの実務事例を公開・改訂",
    changes: [
      { action: "published", text: "新規公開。長期保守された仕様書群と現在の実装をAIで横断調査し、人間が変更前後を確認して仕様判断するレビュー設計を整理した", contentIds: ["cases/specification-debt-review"] },
      { action: "published", text: "新規公開。AI利用の民主化と業務運用能力の差を、業務設計・責任・評価・組織変化の観点から整理した", contentIds: ["essays/ai-use-and-operation"] },
      { action: "revised", text: "改訂。AIを業務で使いこなす条件を、情報・検証・権限・責任と、改善・縮小・統合・終了の実務設計として整理した", contentIds: ["practices/ai-adoption-and-effective-use"] },
    ],
    category: "Rosarium",
    icon: "updates",
  },
  {
    date: "2026-10-06",
    topic: "価値創造・AI設計に関する",
    type: "revised",
    title: "価値創造・FDE・AI時代の設計判断に関する記事を改訂",
    changes: [
      { action: "revised", text: "改訂。FDEを含むAI専門職の役割分化と、顧客自身が継続改善できる仕組みを設計する役割を整理した", contentIds: ["essays/ai-roles-beyond-fde"] },
      { action: "revised", text: "改訂。AIによる効率化を、価値の高い仕事への時間再配分につなげる考えを整理した", contentIds: ["essays/dx-and-value"] },
      { action: "revised", text: "改訂。AI・人間・既存システムの責任分界と業務設計を、効率化後の時間再配分も含めて整理した", contentIds: ["foundations/ai-business-design"] },
      { action: "revised", text: "改訂。生成コスト低下後に重要になる選択・維持・統合・終了判断について整理した", contentIds: ["essays/what-not-to-build-with-ai"] },
      { action: "revised", text: "改訂。IT戦略における非構築判断と資源配分について整理した", contentIds: ["essays/it-strategy-and-not-building"] },
      { action: "revised", text: "改訂。コード生成の高速化に加え、既存システムの理解・維持・統合・終了を支える設計判断について追記した", contentIds: ["software-engineering/code-generation-and-work-design"] },
      { action: "revised", text: "改訂。AI導入後の定着と、運用結果に基づく継続的な見直しについて整理した", contentIds: ["practices/adoption-governance"] },
    ],
    category: "Rosarium",
    icon: "updates",
  },
  {
    date: "2026-10-05",
    summaryChanges: ["過去の記事・事例を整理し、現在の知識と過去の記録を区別して参照できるようにした"],
    type: "integrated",
    title: "知識のライフサイクルと閲覧・参照機能を整理",
    changes: [
      "過去のZenn記事と事例をACTIVE・OBSOLETE・RETIREDで整理し、旧記事・旧事例・退役記事として参照できるようにした",
      "検索でライフサイクルを確認・絞り込み、現在の知識と過去の記録を区別して探せるようにした",
      "記事を離れずに用語・数式・参考資料を確認できるようにし、右補助領域で目次とリファレンスを切り替えられるようにした",
      "Desktop・Mobile双方のナビゲーションと補助領域を整理し、読み方に合わせて利用できるようにした",
      "ユーザー向け表記を日本語・カタカナ中心に整理し、長文やカード本文の改行を見直した",
    ],
    category: "Rosarium",
    icon: "updates",
  },
  {
    date: "2026-10-04",
    summaryChanges: ["実務事例・キャリア・DXの内容を改訂し、サイトの紹介と更新履歴を公開"],
    type: "revised",
    title: "主要事例とCareerを更新",
    changes: [
      "主要事例の可視化をSVGベースに統一",
      "レガシーシステム理解と複数AI保守の事例を全面改訂",
      "旧AI環境の事例をOBSOLETEとして分離",
      "DXのテーマ構成と記事分類を再整理",
      "Career DetailsをCareerへ統合し、キャリア情報を整理",
      "各ページの入口説明を平易化",
      "Rosariumの目的と運営思想を説明するページを追加",
      "Garden Notesの詳細ページを追加",
    ],
    category: "Rosarium",
    icon: "home",
  },
  {
    date: "2026-10-03",
    summaryChanges: ["AI関連の知識とキャリア情報を改訂"],
    type: "revised",
    title: "Rosariumの記事と情報構造を更新",
    changes: [
      "Zenn由来Knowledgeを統合",
      "Careerを設計思想の入口と経験・Caseへのハブに再構成",
      "庭に命名由来を追加",
      "Analytics利用説明を追加",
    ],
    category: "Rosarium",
    icon: "home",
  },
  {
    date: "2026-09",
    summaryChanges: ["AI・システム設計・実務事例を扱うRosariumを公開"],
    type: "launch",
    title: "Rosarium 公開",
    changes: [
      "Applied AI・システム設計・AI数学論・実務事例を扱うRosariumを公開",
    ],
    category: "Rosarium",
    icon: "updates",
  },
] satisfies RecentGrowthItem[];

export function validateRecentGrowth(entries: RecentGrowthItem[]) {
  const dates = new Set<string>();
  for (const entry of entries) {
    if (dates.has(entry.date)) throw new Error("Recent Growthには同じ日付を複数登録できません: " + entry.date);
    dates.add(entry.date);
    const targets = new Set<string>();
    for (const change of entry.changes) for (const id of growthChangeTargets(change)) {
      if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)+$/.test(id)) throw new Error("Garden Notes requires an internal content id: " + id);
      if (targets.has(id)) throw new Error("Duplicate Garden Notes content link: " + id);
      targets.add(id);
    }
    const topicTitles = new Set<string>();
    for (const topic of entry.topics ?? []) {
      if (!topic.title.trim() || !topic.summary.trim()) throw new Error("Invalid Garden Notes topic: " + topic.title);
      const topicPaths = new Set<string>();
      for (const link of topic.links ?? []) {
        if (!link.title.trim() || !/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(link.path)) throw new Error("Invalid Garden Notes topic link: " + link.path);
        if (topicPaths.has(link.path)) throw new Error("Duplicate Garden Notes topic link: " + link.path);
        topicPaths.add(link.path);
      }
      if (topicTitles.has(topic.title)) throw new Error("Duplicate Garden Notes topic: " + topic.title);
      topicTitles.add(topic.title);
    }
    const relatedPaths = new Set<string>();
    for (const link of entry.relatedLinks ?? []) {
      if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(link.path) || !link.title.trim()) throw new Error("Invalid Garden Notes related page: " + link.path);
      if (relatedPaths.has(link.path)) throw new Error("Duplicate Garden Notes related page: " + link.path);
      relatedPaths.add(link.path);
    }
  }
}
validateRecentGrowth(curatedRecentGrowth);

/** Check explicit editorial records, never filesystem or commit timestamps. */
export function validateRecordedRevisionDates(
  entries: RecentGrowthItem[],
  content: Map<string, { last_updated?: string; status?: string; public?: boolean }>,
) {
  for (const entry of entries) for (const change of entry.changes) {
    if (typeof change === "string" || change.action !== "revised") continue;
    for (const id of change.contentIds) {
      const data = content.get(id);
      if (!data) throw new Error("Revision target missing: " + id);
      if (data.status === "draft" || data.public === false) throw new Error("Nonpublic revision in Garden Notes: " + id);
      if (!data.last_updated || data.last_updated < entry.date) {
        throw new Error(`last_updated precedes recorded revision: ${id} (${data.last_updated} < ${entry.date})`);
      }
    }
  }
}

export const recentGrowth = curatedRecentGrowth.sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const recentGrowthDateLabel = (date: string) => {
  const match = date.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) return date;
  const [, year, month, day] = match;
  return day
    ? `${year}年${Number(month)}月${Number(day)}日`
    : `${year}年${Number(month)}月`;
};

export const recentGrowthMonth = (date: string) => {
  const match = date.match(/^(\d{4})-(\d{2})/);
  return match ? `${match[1]}年${Number(match[2])}月` : date;
};

/** Counts unique content targets, not change bullets. Details remain in article histories. */
export function growthSummary(entry: RecentGrowthItem, isCase: (id: string) => boolean): string[] {
  if (entry.summaryChanges) return entry.summaryChanges;
  const counts = new Map<string, number>();
  for (const change of entry.changes) {
    if (typeof change === "string" || !change.action) continue;
    for (const id of change.contentIds) {
      const kind = isCase(id) ? "Case" : "記事";
      const action = { published: "新規公開", revised: "改訂", integrated: "統合", retired: "退役" }[change.action];
      const key = `${kind}|${action}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts].map(([key, count]) => {
    const [kind, action] = key.split("|");
    return `${entry.topic ?? ""}${kind}を${count}件${action}`;
  });
}
