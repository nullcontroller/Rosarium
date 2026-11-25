import type { CollectionEntry } from "astro:content";
import { domainReferenceIds } from "../data/knowledge-domains.mjs";
// Reader purpose derived from existing subject tags; Cases are never inferred as planning experience.
export function isPlanningKnowledge(entry: CollectionEntry<"pages">): boolean {
  if (entry.data.section === "cases" || entry.data.kind === "case") return false;
  return domainReferenceIds("planning").includes(entry.id) || entry.data.tags.some(tag => ["it戦略", "システム企画", "ecrs"].includes(tag.toLowerCase()));
}
export const planningPublishedAt = "2026-10-10";

export const planningQuestions = [
  { title: "経営課題・価値発見・IT戦略", description: "経営課題と現状（As-Is）・目指す業務（To-Be）を結び、利用者・事業・組織にとっての価値とITの役割を考えます。業務分析から業務要求・業務目標を整理し、システム化構想へつなぎます。" },
  { title: "対象・投資・優先順位", description: "システム化する業務と対象外を分け、既存システム、通常のソフトウェア、業務手順や人の役割の変更、作らない選択も比較します。費用・期間・維持責任から優先順位を決め、刷新・維持・縮小・統合・廃止を判断します。" },
  { title: "KPI・成果指標と費用対効果", description: "達成したい業務成果・事業成果と評価条件を定め、導入・運用・教育・保守を含む費用と得られる価値を比較します。利用量だけを成果とせず、継続・改善・撤退を判断します。" },
  { title: "業務・組織の再設計", description: "業務工程、人とシステムの役割、権限、責任、評価、教育を合わせて見直します。技術導入そのものを目的にせず、必要な仕事と実現手段を選びます。" },
  { title: "新技術・PoCの企画判断", description: "AIを使うか使わないかを含め、新技術の採用を目的にせず、不確実性を確かめるPoCが必要か、何が分かれば継続するか、費用と期間の上限を決めます。技術方式・評価データ・合格条件の設計は要件定義・システムアーキテクチャで具体化します。" },
] as const;
