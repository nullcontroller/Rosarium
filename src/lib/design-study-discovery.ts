import { designStudies } from "../data/design-studies.mjs";

/** Count only registered, currently public studies; the hub is not an article. */
export function visibleDesignStudies<T extends { id: string; data: { status: string; public?: boolean; lifecycle?: string } }>(entries: T[]): T[] {
  return designStudies.flatMap(study => {
    const entry = entries.find(entry => entry.id === study.id);
    return entry && entry.data.public !== false && ["published", "stable"].includes(entry.data.status) &&
      (!entry.data.lifecycle || entry.data.lifecycle === "active") ? [entry] : [];
  });
}
