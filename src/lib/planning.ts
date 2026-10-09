import type { CollectionEntry } from "astro:content";
// Reader purpose derived from existing subject tags; Cases are never inferred as planning experience.
export function isPlanningKnowledge(entry: CollectionEntry<"pages">): boolean {
  if (entry.data.section === "cases" || entry.data.kind === "case") return false;
  return entry.data.tags.some(tag => ["it戦略", "システム企画", "ecrs"].includes(tag.toLowerCase()));
}
export const planningQuestions = [
  { title: "課題・価値・目標", description: "現状（As-Is）と目指す業務（To-Be）を比較し、誰のどの課題を解決するか、目的・期待価値・KPI・効果目標を定めます。" },
  { title: "対象・投資・優先順位", description: "システム化する業務と対象外を分け、既存の仕組みや運用変更も比較します。費用・期間・維持責任から優先順位を決め、刷新・統合・廃止を判断します。" },
  { title: "新技術・PoCの企画判断", description: "新技術の採用を目的にせず、不確実性を確かめるPoCが必要か、何が分かれば継続するか、費用と期間の上限を決めます。技術方式・評価データ・合格条件の設計は要件定義・SAで具体化します。" },
  { title: "要件定義への引渡し", description: "対象業務、目的、業務目標、範囲と対象外、制約、優先順位、未確定事項を渡します。業務要求を技術名へ置き換えず、実現可能性を確認した結果は企画へ戻します。" },
] as const;
