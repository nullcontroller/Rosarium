// Pure layout policy: no route parsing or client state belongs here.
export const readingSections = new Set([
  "ai", "articles", "ai-design", "ai-mathematics", "practices", "books", "series", "essays",
]);
const collectionSections = new Set([
  "ai-design", "ai-mathematics", "ai", "practices", "cases", "articles", "dx",
  "books", "series", "essays", "overview", "reference", "updates",
]);
/** @param {{ogType: string, section?: string}} page */
export function pageEntityType({ ogType, section }) {
  return ogType === "article" ? "TechArticle"
    : ogType === "profile" ? "ProfilePage"
    : collectionSections.has(section || "") || section?.startsWith("dx/") ? "CollectionPage" : "WebPage";
}
/** @param {{showRightSidebar: boolean, showReference: boolean, headingCount: number, chapterCount: number}} page */
export function rightSidebarPolicy({ showRightSidebar, showReference, headingCount, chapterCount }) {
  const hasPageToc = !!chapterCount || headingCount > 0;
  return { hasPageToc, referenceSidebar: showRightSidebar && (hasPageToc || showReference) };
}
