import type { CollectionEntry } from "astro:content";
import { domainReferenceIds } from "../data/knowledge-domains.mjs";
// Reader purpose derived from existing subject tags; Cases are never inferred as planning experience.
export function isPlanningKnowledge(entry: CollectionEntry<"pages">): boolean {
  if (entry.data.section === "cases" || entry.data.kind === "case") return false;
  return domainReferenceIds("planning").includes(entry.id) || entry.data.tags.some(tag => ["it戦略", "システム企画", "ecrs"].includes(tag.toLowerCase()));
}
export const planningPublishedAt = "2026-10-10";
