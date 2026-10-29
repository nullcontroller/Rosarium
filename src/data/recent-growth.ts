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
  icon?: IconName;
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
// Do not record content-preserving UI/UX, CSS, layout, navigation placement,
// typo, internal refactoring or internal SEO settings.
// Ask what readers can newly read or understand; this is not a development log.
const curatedRecentGrowth = [
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
      { action: "integrated", text: "統合・再構成。第1回PoC、設計・開発、第2回PoCの問題発見、メタデータ追加と再実施の順に11章を整理。第1回は3機能の実現可能性を確認するフィージビリティ確認に限定。第01〜06章を初期構想として整理し、検索対象制御と回答許可の強化は第08・09章へ分離した。専門判断を資料・回答候補の正式回答への採否判断として具体化し、同じ評価データ・基準・実行条件での文書検索72％から98％と有人振り分け94％から100％への改善を示し、定型750件／月中720件／月の自己解決を前提とする280時間／月の試算を本番実測と区別。独立した本番適用前の課題章を削除し、PoC再実施での評価目標達成を結末とした", contentIds: ["evaluation-hitl/customer-support-qa-poc", "cases/customer-support-ai-dx", "cases/customer-support-ai-dx/poc-evaluation", "cases/customer-support-ai-dx/poc-effect-evaluation", "cases/customer-support-ai-dx/poc-metadata-improvement", "cases/customer-support-ai-dx/executive-summary", "cases/customer-support-ai-dx/responsibility-boundary", "cases/customer-support-ai-dx/knowledge-design", "cases/customer-support-ai-dx/stopping-conditions", "cases/customer-support-ai-dx/customer-experience", "cases/customer-support-ai-dx/human-handoff", "cases/customer-support-ai-dx/design-principles"] },
      "数学とAI理論の入口を分離。条件付き確率・分布の基礎と、生成・誤答・コード生成モデルの仕組みを分け、AI設計と数式リファレンスへの導線を整理した",
    ],
    summaryChanges: ["要件・方式設計を入口に、開発・保守の実務成果へ進める構成に整理", "実務実績、設計・検証シナリオ、今後の方向性を区別", "数学とAI理論を分け、数理の基礎と生成の仕組みを別々に辿れる入口を整備"],
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
      "Rosariumを長期視点で育てる技術ポートフォリオとして運用するため、独自ドメインを取得し、正規URLを rosarium-tech.com へ変更。旧GitHub Pages URLからも新しい入口へ案内"],
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
  }
}
validateRecentGrowth(curatedRecentGrowth);

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
