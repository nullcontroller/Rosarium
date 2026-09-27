import type { CollectionEntry } from "astro:content";

export type ContentEntryPoint = "ai" | "dx";

export const entryPointDefinitions = {
  ai: { label: "AI", path: "ai" },
  dx: { label: "DX", path: "dx" },
} as const satisfies Record<
  ContentEntryPoint,
  { label: string; path: string }
>;

export const contentEntryPoints = (
  entry: CollectionEntry<"pages">,
): ContentEntryPoint[] => entry.data.entry_points;

export const hasEntryPoint = (
  entry: CollectionEntry<"pages">,
  entryPoint: ContentEntryPoint,
) => contentEntryPoints(entry).includes(entryPoint);
