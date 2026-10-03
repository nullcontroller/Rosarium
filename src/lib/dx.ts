import type { CollectionEntry } from "astro:content";
import { hasEntryPoint } from "./entry-points";

export const dxCategories = [
  {
    id: "value-design",
    title: "価値設計",
    summary:
      "誰にどのような価値を届けるのかを先に定め、業務・サービス・システムを価値から逆算します。",
    scope:
      "顧客価値、業務価値、Value Flow、技術導入より先に価値を考える方法を扱います。",
    featured: ["essays/dx-and-value", "essays/what-not-to-build-with-ai"],
    featuredCases: [],
  },
  {
    id: "business-transformation",
    title: "業務変革",
    summary:
      "現行業務を速くするだけでなく、仕事の流れと人間・AI・既存システムの役割を設計し直します。",
    scope:
      "業務プロセス再設計、全体最適、責任分担、仕事そのものを変える判断を扱います。",
    featured: ["essays/rethink-work-before-ai", "foundations/ai-business-design"],
    featuredCases: ["cases/customer-support-ai-dx"],
  },
  {
    id: "selection-retirement",
    title: "選択と廃止",
    summary:
      "始めることと同時に、残す・変える・統合する・作らない・終えるものを判断します。",
    scope:
      "限られた資源を価値の大きい領域へ集中し、価値の小さい活動や機能を減らす判断を扱います。",
    featured: ["essays/it-strategy-and-not-building", "essays/what-not-to-build-with-ai"],
    featuredCases: ["cases/understanding-systems-as-capability"],
  },
  {
    id: "system-transformation",
    title: "システム変革",
    summary:
      "既存資産を理解して活かしながら、システムを安全に変更・統合・移行・終結します。",
    scope:
      "Legacy Modernization、技術負債、ライフサイクル、全面刷新に限らない変革を扱います。",
    featured: ["essays/legacy-change-and-retirement", "software-engineering/code-generation-and-work-design"],
    featuredCases: ["cases/system-understanding", "cases/three-ai-maintenance"],
  },
  {
    id: "continuous-value",
    title: "継続的価値創出",
    summary:
      "導入を完成とせず、利用・失敗・評価から得た情報を次の設計と改善へ戻します。",
    scope:
      "Evaluation、運用、KPI、継続改善、価値が実際に生まれているかの確認を扱います。",
    featured: ["practices/adoption-governance", "practices/transferring-practices"],
    featuredCases: ["cases/customer-support-ai-dx"],
  },
] as const;

export type DxCategoryId = (typeof dxCategories)[number]["id"];
export type PageEntry = CollectionEntry<"pages">;

const legacyCategoryMap: Record<string, readonly DxCategoryId[]> = {
  "value-business": ["value-design"],
  "business-transformation": ["business-transformation"],
  "system-planning": ["system-transformation"],
  "organization-adoption": ["business-transformation", "continuous-value"],
  "case-study": ["business-transformation"],
};

export const dxCategoryForId = (id: string) =>
  dxCategories.find((category) => category.id === id);

export const dxCategoryIdsForEntry = (entry: PageEntry): DxCategoryId[] => {
  const explicit = entry.data.dx_topics;
  if (explicit?.length) return [...explicit];
  return [...(legacyCategoryMap[entry.data.dx_topic ?? ""] ?? [])];
};

const isDxIndexEntry = (entry: PageEntry) =>
  hasEntryPoint(entry, "dx") &&
  (!entry.data.series || (entry.data.order ?? 0) === 0);

export const dxEntriesForCategory = (
  entries: PageEntry[],
  categoryId: DxCategoryId,
) =>
  entries
    .filter(
      (entry) =>
        isDxIndexEntry(entry) &&
        dxCategoryIdsForEntry(entry).includes(categoryId),
    )
    .sort(
      (a, b) =>
        b.data.last_updated.localeCompare(a.data.last_updated) ||
        a.data.title.localeCompare(b.data.title, "ja"),
    );
