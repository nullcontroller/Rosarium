import type { CollectionEntry } from "astro:content";
import { hasEntryPoint } from "./entry-points";

export const dxCategories = [
  {
    id: "value-design",
    title: "価値設計",
    summary:
      "新しい技術を使うことと、価値を生むことは同じではありません。誰のどんな困りごとを減らすのかを先に定め、業務・サービス・システムを逆算します。AIも、その価値を届けるための手段の一つとして選びます。",
    scope: "顧客価値、業務価値、技術導入より先に価値を考える方法を扱います。",
    questions: [
      "誰に、どんな変化を届けたいか。",
      "技術を入れたことと、価値が生まれたことをどう区別するか。",
      "業務・サービス・システムのどこを変える必要があるか。",
    ],
  },
  {
    id: "business-transformation",
    title: "業務変革",
    summary:
      "現行業務を速くする前に、その作業が本当に必要かを確かめます。ECRSの観点で削除・統合・順序変更・簡素化を考え、残る仕事を人・AI・既存システムへどう分けるかを設計します。個々の作業速度ではなく、仕事全体の流れを見直す領域です。",
    scope: "業務プロセスの再設計、全体最適、役割と責任の分担を扱います。",
    questions: [
      "なくす・まとめる・順序を変える・単純にする余地はあるか。",
      "残る仕事は、人・AI・既存システムの誰が担うか。",
      "確認や差し戻しを含め、仕事全体が良くなるか。",
    ],
  },
  {
    id: "selection-retirement",
    title: "選択と廃止",
    summary:
      "作ることだけが設計ではありません。残す・変える・統合する・作らない・終わらせることも、価値と維持責任から判断します。生成コストが下がるほど、何を作らず、何を残さないかを選ぶ意味が大きくなります。",
    scope:
      "限られた資源を価値のある活動へ向け、維持・変更・廃止までを判断します。",
    questions: [
      "新しく作る以外の方法で、目的を満たせないか。",
      "維持責任まで含めても、残す価値があるか。",
      "何を統合し、どの条件で終わらせるか。",
    ],
  },
  {
    id: "system-transformation",
    title: "システム変革",
    summary:
      "既存システムは、全面刷新だけで変えるものではありません。現行仕様と依存関係を理解し、継続保守・移行・統合を進めながら、変更しやすさ（Changeability）を確保します。Legacy Modernizationを、必要なら安全に終わらせるところまで含めて考えます。",
    scope: "既存資産の理解、変更容易性、継続保守、移行・統合・終了を扱います。",
    questions: [
      "何を理解すれば、変更の影響を判断できるか。",
      "全面刷新せずに、依存や変更箇所を減らせないか。",
      "使い続ける間の保守と、最後の移行・終了をどう両立するか。",
    ],
  },
  {
    id: "continuous-value",
    title: "継続的価値創出",
    summary:
      "導入したことを完成とは捉えず、実際の利用と失敗から改善を続けます。品質・工数・確認負荷を見て、仕組みが価値を生んでいるかを確かめます。評価や現場の学びを次の設計へ戻し、別の業務へ広げるときも成立条件を見直します。",
    scope: "導入・定着、評価、知識更新、横展開を継続的な改善へつなぎます。",
    questions: [
      "利用が増えたことと、業務が良くなったことをどう分けるか。",
      "失敗や有人対応の結果を、どの改善へ戻すか。",
      "別の業務へ広げるとき、何を再検証するか。",
    ],
  },
] as const;

export type DxCategoryId = (typeof dxCategories)[number]["id"];
export type PageEntry = CollectionEntry<"pages">;
export const dxCategoryForId = (id: string) =>
  dxCategories.find((category) => category.id === id);

// These introductions state the theme first, then its design scope.
// Keep the complete summary as the SEO source; separate those two units in prose.
export const dxIntroductionParagraphs = (summary: string): string[] => {
  const boundary = summary.indexOf("。");
  return boundary < 0 ? [summary] : [summary.slice(0, boundary + 1), summary.slice(boundary + 1)].filter(Boolean);
};

// Primary: the one shelf where the article's central question belongs.
// Secondary: related questions used for discovery, never for duplicate primary listings.
export const dxCategoryIdsForEntry = (entry: PageEntry): DxCategoryId[] =>
  entry.data.primaryCategory
    ? [entry.data.primaryCategory, ...entry.data.secondaryCategories]
    : [];

export const dxEntriesForCategory = (
  entries: PageEntry[],
  categoryId: DxCategoryId,
) =>
  entries
    .filter(
      (entry) =>
        hasEntryPoint(entry, "dx") &&
        entry.data.lifecycle !== "retired" &&
        entry.data.primaryCategory === categoryId &&
        (!entry.data.series || (entry.data.order ?? 0) === 0),
    )
    .sort(
      (a, b) =>
        b.data.last_updated.localeCompare(a.data.last_updated) ||
        a.data.title.localeCompare(b.data.title, "ja"),
    );

export const dxFeaturedArticles = (
  entries: PageEntry[],
  categoryId: DxCategoryId,
) => {
  const featured = dxEntriesForCategory(entries, categoryId).filter(
    (entry) => entry.data.section !== "cases" && entry.data.lifecycle === "active" && entry.data.featuredInCategory,
  );
  if (!featured.length || featured.length > 2)
    throw new Error(
      `${categoryId}: select one or two primary-category articles`,
    );
  return featured;
};
