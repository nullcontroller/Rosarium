import { compatibilityFor } from "../data/compatibility-urls.mjs";
import { dxCategories } from "./dx";
const previousRoutes = [
  "",
  "about",
  "sitemap",
  "garden-notes",
  "ai-design",
  "ai-design/applicability",
  "ai-design/responsibility-control",
  "ai-design/architecture",
  "ai-design/knowledge-context",
  "ai-design/evaluation-hitl",
  "ai-design/software-engineering",
  "ai-design/lifecycle-operations",
  "ai-mathematics",
  "ai-theory",
  "ai",
  "career",
  "cases",
  "dx",
  "planning",
  "system-design",
  ...dxCategories.map((category) => `dx/${category.id}`),
  "essays",
  "practices",
  "reference",
];

export const manualRoutes = previousRoutes.filter(route => !compatibilityFor(route));
