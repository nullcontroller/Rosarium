import type { CollectionEntry } from "astro:content";
import { url } from "./site";
import { caseStudies, designTopics } from "./navigation";
import { aiDesignTopicGuides, aiDesignTopicOrder } from "./ai-design";

export type ReadingPath =
  "ai-design" | "ai-mathematics" | "practices" | "cases";

export type ReadingGroup = {
  title: string;
  links: { id: string; title: string; href: string; current: boolean }[];
  current: boolean;
};

type Entry = CollectionEntry<"pages">;

// Canonical classification and discovery paths are intentionally separate.
// One canonical article may be reachable from more than one reading path.
export const readingGroups: Record<
  ReadingPath,
  readonly { title: string; ids: readonly string[] }[]
> = {
  "ai-design": [
    ...aiDesignTopicOrder.map((topic) => ({
      title: designTopics.find(([key]) => key === topic)![1],
      ids: aiDesignTopicGuides[topic].readingOrder,
    })),
    {
      title: "業務設計・考察",
      ids: [
        "foundations/ai-business-design",
        "architecture/agents-tools-and-workflows",
        "essays/what-not-to-build-with-ai",
      ],
    },
  ],
  "ai-mathematics": [
    {
      title: "確率と生成",
      ids: [
        "foundations/conditional-probability",
        "foundations/temperature-design",
      ],
    },
    {
      title: "誤りと制御",
      ids: [
        "foundations/hallucination-mechanisms",
        "foundations/layered-hallucination-controls",
        "foundations/guardrail-models",
      ],
    },
    {
      title: "生成モデルと変化",
      ids: ["software-engineering/code-generation-models"],
    },
  ],
  practices: [
    {
      title: "導入・教育・定着",
      ids: [
        "practices/adoption-governance",
        "practices/ai-adoption-and-effective-use",
        "practices/education-and-capability",
        "practices/ai-education-principles",
        "practices/transferring-practices",
        "practices/transferring-ai-practices",
      ],
    },
    {
      title: "プロンプト・ナレッジ運用",
      ids: [
        "knowledge-context/prompt-structure",
        "knowledge-context/prompt-failure-modes",
        "knowledge-context/qa-operations",
        "knowledge-context/context-before-model-performance",
        "knowledge-context/human-and-ai-documentation",
      ],
    },
    {
      title: "開発・保守",
      ids: [
        "software-engineering/development-workflow",
        "software-engineering/code-maintenance-context",
        "software-engineering/multi-ai-orchestration",
        "cases/three-ai-maintenance",
        "essays/what-not-to-build-with-ai",
        "cases/understanding-systems-as-capability",
      ],
    },
    {
      title: "評価・ヒューマンレビュー",
      ids: [
        "evaluation-hitl/datasets-and-regression",
        "evaluation-hitl/responsibility-and-hitl",
        "foundations/generation-and-acceptance",
        "essays/trust-in-ai-generated-content",
      ],
    },
    {
      title: "組織・キャリア",
      ids: ["essays/ai-career-market", "essays/ai-roles-beyond-fde"],
    },
  ],
  cases: [
    {
      title: "",
      ids: caseStudies.map((study) => study.book),
    },
  ],
};

export function readingNavigation(
  entries: Entry[],
  path: ReadingPath,
  currentId?: string,
): ReadingGroup[] {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  return readingGroups[path].map((group) => ({
    title: group.title,
    current: group.ids.includes(currentId || ""),
    links: group.ids.filter((id) => byId.has(id) && byId.get(id)?.data.lifecycle === "active" && (path === "cases" || byId.get(id)?.data.section !== "cases")).map((id) => {
      const entry = byId.get(id);
      if (!entry) throw new Error(`Missing reading navigation entry: ${id}`);
      return {
        id,
        title: entry.data.title,
        href: url(id),
        current: id === currentId,
      };
    }),
  })).filter((group) => group.links.length > 0);
}

export function readingEntries(entries: Entry[], path: ReadingPath): Entry[] {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  return [...new Set(readingGroups[path].flatMap((group) => group.ids))].filter((id) => byId.has(id) && byId.get(id)?.data.lifecycle === "active").map(
    (id) => {
      const entry = byId.get(id);
      if (!entry) throw new Error(`Missing reading entry: ${id}`);
      return entry;
    },
  ).filter((entry) => path === "cases" || entry.data.section !== "cases");
}

export function readingPathForEntry(
  entry: Entry,
  entries: Entry[],
): ReadingPath | undefined {
  const canonical: ReadingPath | undefined =
    entry.data.layer === "ai-design"
      ? "ai-design"
      : entry.data.layer === "ai-mathematics"
        ? "ai-mathematics"
        : entry.data.layer === "practice"
          ? "practices"
          : undefined;
  if (canonical) return canonical;

  const parentId = entry.data.series
    ? entries.find(
        (candidate) =>
          candidate.data.series === entry.data.series &&
          (candidate.data.order ?? -1) === 0,
      )?.id
    : undefined;
  const ids = [entry.id, parentId].filter(Boolean) as string[];
  return (Object.keys(readingGroups) as ReadingPath[]).find((path) =>
    readingGroups[path].some((group) =>
      ids.some((id) => group.ids.includes(id)),
    ),
  );
}
