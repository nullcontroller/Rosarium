/** Presentation groups only: IDs, URLs, ownership and article bodies do not change. */
export const personalCaseGroups = [
  {
    id: "asset-management-app-a",
    title: "資産管理アプリA",
    contentIds: ["cases/ai-development-management", "cases/asset-management-app-a-architecture"],
  },
];

// Input must already be filtered for publication/review visibility by the caller.
export function groupPersonalCases(entries) {
  const groups = personalCaseGroups.map(group => ({
    ...group,
    entries: group.contentIds.map(id => entries.find(entry => entry.id === id)).filter(Boolean),
  })).filter(group => group.entries.length > 1);
  const groupedIds = new Set(groups.flatMap(group => group.entries.map(entry => entry.id)));
  return { groups, independent: entries.filter(entry => !groupedIds.has(entry.id)) };
}
