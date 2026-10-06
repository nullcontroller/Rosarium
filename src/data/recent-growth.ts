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

export interface RecentGrowthItem {
  date: string;
  type: RecentGrowthType;
  title: string;
  changes: string[];
  category: string;
  icon?: IconName;
}

// Garden Notes summarizes changes as plain text, without navigation links.
// This is the single source of truth for the public update history.
// Keep one entry per date; add each reader-facing change as a short changes item.
// Prioritize new articles/Cases/Books, substantive revisions and content integration.
// Record content retirement, meaningful page restructuring and new reader-facing features.
// Do not record content-preserving UI/UX, CSS, layout, navigation placement,
// typo, internal refactoring or internal SEO settings.
// Ask what readers can newly read or understand; this is not a development log.
const curatedRecentGrowth = [
  {
    date: "2026-10-06",
    type: "integrated",
    title: "価値創造と継続改善の考えを既存知識へ統合",
    changes: [
      "FDEの旧考察に、顧客自身が継続改善できる条件と役割の変化を日付付きで追記",
      "AIによる効率化を価値の高い仕事への時間再配分につなぐ考えを、DXの考察と業務設計へ統合",
      "作る費用が下がるほど選択・維持・統合・終了の判断が重要になる理由を、既存記事で補強",
      "Knowledge Lifecycleと構造を可視化して伝える方針をAboutへ集約し、導入後の定着と見直しを実践知で補強",
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

const recentGrowthDates = new Set<string>();
for (const entry of curatedRecentGrowth) {
  if (recentGrowthDates.has(entry.date)) {
    throw new Error(
      `Recent Growthには同じ日付を複数登録できません: ${entry.date}`,
    );
  }
  recentGrowthDates.add(entry.date);
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
