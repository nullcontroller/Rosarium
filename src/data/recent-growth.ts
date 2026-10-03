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
  summary: string;
  category: string;
  href: string;
  icon?: IconName;
}

// This is the single source of truth for the public update history.
// Add at most one entry per date, summarizing only changes meaningful to readers.
const curatedRecentGrowth = [
  {
    date: "2026-10-03",
    type: "revised",
    title: "Rosariumの記事と情報構造を更新",
    summary:
      "Zenn由来Knowledgeを統合／Case画像を横長に統一／Navigation・実践知・導線を整理／庭に命名由来・Analytics利用説明を追加／IT戦略・業務再設計・Legacy Lifecycleの3記事を公開し、AI活用事例の関連導線を補強／Careerを設計思想の主入口と経験・Caseへのハブに再構成。",
    category: "Rosarium",
    href: "",
    icon: "home",
  },
  {
    date: "2026-09",
    type: "launch",
    title: "Rosarium 公開",
    summary:
      "Applied AI、システム設計、AI数学論、実務事例を横断して整理するPersonal Technical Site「Rosarium」を公開しました。",
    category: "Rosarium",
    href: "",
    icon: "updates",
  },
] satisfies RecentGrowthItem[];

const recentGrowthDates = new Set<string>();
for (const entry of curatedRecentGrowth) {
  if (recentGrowthDates.has(entry.date)) {
    throw new Error(`Recent Growthには同じ日付を複数登録できません: ${entry.date}`);
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
