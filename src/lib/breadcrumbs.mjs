import { load } from "cheerio";

/** Visible page names come from rendered headings, not URL segments or SEO suffixes. */
export const breadcrumbTitle = (html, fallback) => load(html, {}, false)("h1").first().text().trim() || fallback;

/**
 * Resolve only real, visible parents. Callers supply existing navigation/category labels
 * and the public or explicitly selected draft collection, never all private entries.
 * @param {{pathname:string, title:string, entries:any[], labels:Record<string,string>, primaryPath:(entry:any)=>string, archiveGroup:(entry:any)=>string|undefined, designStudyIds:string[]}} options
 */
export function buildBreadcrumbs({ pathname, title, entries, labels, primaryPath, archiveGroup, designStudyIds }) {
  const route = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, "");
  if (!route) return [];
  const result = [{ name: "庭", path: "" }];
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const add = path => {
    if (!path || path === route || result.some(item => item.path === path)) return;
    const name = byId.get(path)?.data.title || labels[path];
    if (name) result.push({name, path});
  };
  const addArea = path => {
    if (["ai-mathematics", "ai-theory"].includes(path)) add("ai");
    if (path === "ai-design") add("system-design");
    if (path === "practices") add("dx");
    add(path);
  };
  const entry = byId.get(route);
  if (route === "cases/design-studies" || designStudyIds.includes(route)) {
    add("cases");
    if (route !== "cases/design-studies") add("cases/design-studies");
  } else if (entry) {
    const archive = archiveGroup(entry);
    if (archive) { add("retired"); add(`retired/${archive}`); }
    else addArea(primaryPath(entry));
    const cover = entry.data.series && entries.find(other => other.data.series === entry.data.series && other.data.order === 0);
    if (cover && cover.id !== route) add(cover.id);
    else if (!archive && primaryPath(entry) === "ai-design" && entry.data.design_topic) add(`ai-design/${entry.data.design_topic}`);
  } else {
    if (route.startsWith("dx/")) add("dx");
    else if (route.startsWith("ai-design/")) { add("system-design"); add("ai-design"); }
    else if (route.startsWith("retired/")) add("retired");
    else if (route.startsWith("career/")) add("career");
    else if (route.startsWith("cases/")) {
      add("cases");
      const parent = entries.filter(item => route.startsWith(item.id + "/")).sort((a,b) => b.id.length - a.id.length)[0];
      if(parent) add(parent.id);
    } else if (["ai-mathematics", "ai-theory"].includes(route)) add("ai");
    else if (["ai-design", "architecture", "knowledge-context", "software-engineering", "evaluation-hitl"].includes(route)) add("system-design");
    else if (route === "practices") add("dx");
  }
  result.push({name: title, path: route});
  return result;
}
