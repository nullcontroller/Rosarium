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

export type RecentGrowthChange = string | { text: string; contentIds: string[] };
export const growthChangeText = (change: RecentGrowthChange) => typeof change === "string" ? change : change.text;
export const growthChangeTargets = (change: RecentGrowthChange) => typeof change === "string" ? [] : change.contentIds;

export interface RecentGrowthItem {
  date: string;
  type: RecentGrowthType;
  title: string;
  changes: RecentGrowthChange[];
  category: string;
  icon?: IconName;
}

// Content revisions link by entry id; displayed titles come from content metadata.
// UI-only changes remain plain text and do not create content links.
// This is the single source of truth for the public update history.
// Keep one entry per date; add each reader-facing change as a short changes item.
// Prioritize new articles/Cases/Books, substantive revisions and content integration.
// Record content retirement, meaningful page restructuring and new reader-facing features.
// Do not record content-preserving UI/UX, CSS, layout, navigation placement,
// typo, internal refactoring or internal SEO settings.
// Ask what readers can newly read or understand; this is not a development log.
const curatedRecentGrowth = [
  {
    date: "2026-10-08",
    type: "revised",
    title: "AI業務設計の知識を改訂し、責任・効率・委任・判断・運用を整理",
    changes: [
      { text: "改訂。手戻りした実務経験をもとに、レビューしやすさ・理解・説明・合意と、工数・経過時間を区別したAI導入評価を整理した", contentIds: ["foundations/ai-business-design/evaluating-business-efficiency"] },
      { text: "改訂。責任・承認・人間への引き継ぎを中心に、確認工程を持つ業務の設計を整理した", contentIds: ["foundations/ai-business-design/delegation-and-responsibility"] },
      { text: "改訂。一般知識への質問と業務固有の情報を使う委任の違いを、情報不足時の経路から整理した", contentIds: ["foundations/ai-business-design/asking-versus-delegating"] },
      { text: "改訂。価値・リスク・検証可能性・権限・復旧から、必要な最小の委任範囲を選ぶ観点を整理した", contentIds: ["foundations/applicability-and-delegation"] },
      { text: "改訂。根拠不足や説明できない場合に、停止・移管・役割縮小を選ぶ条件を整理した", contentIds: ["foundations/ai-business-design/explainable-delegation"] },
      { text: "改訂。AI出力を判断する人間の知識・情報・時間・権限と、運用から学び直す必要性を整理した", contentIds: ["foundations/ai-business-design/human-judgment-capability"] },
      { text: "改訂。AIを業務で使いこなすために設計する問いの全体像を整理した", contentIds: ["practices/ai-adoption-and-effective-use"] },
      { text: "改訂。運用結果から継続・改善・縮小・統合・終了を選ぶ条件と、引き継ぎの責任を整理した", contentIds: ["practices/adoption-governance"] },
      { text: "改訂。責任境界と人間による確認の評価を、業務全体の効率評価へ接続した", contentIds: ["evaluation-hitl/responsibility-and-hitl"] },
      { text: "改訂。判断能力を学習目標へ落とし、採用・棄却・保留を説明する練習と運用からの学習を整理した", contentIds: ["practices/education-and-capability"] },
    ],
    category: "Rosarium",
    icon: "updates",
  },
  {
    date: "2026-10-07",
    type: "new",
    title: "AI業務運用の記事と仕様書レビューの実務事例を公開・改訂",
    changes: [
      { text: "新規公開。長期保守された仕様書群と現在の実装をAIで横断調査し、人間が変更前後を確認して仕様判断するレビュー設計を整理した", contentIds: ["cases/specification-debt-review"] },
      { text: "新規公開。AI利用の民主化と業務運用能力の差を、業務設計・責任・評価・組織変化の観点から整理した", contentIds: ["essays/ai-use-and-operation"] },
      { text: "改訂。AIを業務で使いこなす条件を、情報・検証・権限・責任と、改善・縮小・統合・終了の実務設計として整理した", contentIds: ["practices/ai-adoption-and-effective-use"] },
    ],
    category: "Rosarium",
    icon: "updates",
  },
  {
    date: "2026-10-06",
    type: "revised",
    title: "価値創造・FDE・AI時代の設計判断に関する記事を改訂",
    changes: [
      { text: "改訂。FDEを含むAI専門職の役割分化と、顧客自身が継続改善できる仕組みを設計する役割について、日付付きの追記で整理した", contentIds: ["essays/ai-roles-beyond-fde"] },
      { text: "改訂。AIによる効率化を、価値の高い仕事への時間再配分につなげる考えを整理した", contentIds: ["essays/dx-and-value"] },
      { text: "改訂。AI・人間・既存システムの責任分界と業務設計を、効率化後の時間再配分も含めて整理した", contentIds: ["foundations/ai-business-design"] },
      { text: "改訂。生成コスト低下後に重要になる選択・維持・統合・終了判断について整理した", contentIds: ["essays/what-not-to-build-with-ai"] },
      { text: "改訂。IT戦略における非構築判断と資源配分について整理した", contentIds: ["essays/it-strategy-and-not-building"] },
      { text: "改訂。コード生成の高速化に加え、既存システムの理解・維持・統合・終了を支える設計判断について追記した", contentIds: ["software-engineering/code-generation-and-work-design"] },
      { text: "改訂。AI導入後の定着と、運用結果に基づく継続的な見直しについて整理した", contentIds: ["practices/adoption-governance"] },
    ],
    category: "Rosarium",
    icon: "updates",
  },
  {
    date: "2026-10-05",
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
