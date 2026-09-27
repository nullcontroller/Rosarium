import type { CollectionEntry } from "astro:content";

export type ContentTheme = "ai" | "dx";
export type DxTopic = NonNullable<CollectionEntry<"pages">["data"]["dx_topic"]>;

export const themeDefinitions = {
  ai: { label: "AI", path: "articles" },
  dx: { label: "DX", path: "dx" },
} as const satisfies Record<ContentTheme, { label: string; path: string }>;

export const dxTopics = [
  {
    key: "value-business",
    label: "価値・事業",
    summary: "技術導入から始めず、生み出す価値と、やること・やめることを考えます。",
  },
  {
    key: "business-transformation",
    label: "業務変革",
    summary: "AI・人間・既存システムの役割を決め、業務全体の変化として設計します。",
  },
  {
    key: "system-planning",
    label: "システム企画",
    summary: "価値と業務要件から、責任境界・全体構成・必要なAI技術へ落とし込みます。",
  },
  {
    key: "organization-adoption",
    label: "組織への導入・展開",
    summary: "教育、定着、評価、別の業務への横展開を、組織の変化として考えます。",
  },
  {
    key: "case-study",
    label: "実践事例",
    summary: "AIを使った業務・開発・既存システム改善を、課題と結果から読みます。",
  },
] as const satisfies readonly { key: DxTopic; label: string; summary: string }[];

export const contentThemes = (entry: CollectionEntry<"pages">): ContentTheme[] =>
  entry.data.themes;

export const hasTheme = (
  entry: CollectionEntry<"pages">,
  theme: ContentTheme,
) => contentThemes(entry).includes(theme);
