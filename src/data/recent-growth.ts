import type { IconName } from "../lib/icons";

export const recentGrowthLabels = {
  launch: "LAUNCH",
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
// Merge same-day UI/UX work into one final reader-facing line.
// Do not record typo, CSS or internal refactoring separately.
const curatedRecentGrowth = [
  {
    date: "2026-10-04",
    type: "revised",
    title: "顧客サポートDXとCareerを更新",
    changes: [
      "顧客サポートDXにインタラクティブ図を追加",
      "CareerとCareer Detailsの役割分担を整理",
      "各ページの入口説明を平易化",
      "表示・導線を整理",
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
      "表示・導線を整理",
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
