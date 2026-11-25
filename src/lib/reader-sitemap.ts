import type { CollectionEntry } from "astro:content";
import { navigation, readingCategories, designTopics, entryPrimaryPath, caseStudies } from "./navigation";
import { sections, publishedEntry } from "./site";
import { archiveLifecycles, archiveTitle, getArchiveGroup } from "./archive";
import { dxCategories } from "./dx";
import { designStudies, designAreaFor } from "../data/design-studies.mjs";
import { buildBreadcrumbs } from "./breadcrumbs.mjs";
import { manualRoutes } from "./public-routes";
export interface SitemapNode { path: string; title: string; contentId?: string; area?: string; format?: string; children: SitemapNode[]; count: number; }
export function readerSitemap(all: CollectionEntry<"pages">[], career: CollectionEntry<"career">[], redirects: string[] = []) {
  // Deliberately ignores preview selection: drafts never enter the public map.
  const entries = all.filter(entry=>publishedEntry(entry) && !redirects.includes(entry.id));
  const labels: Record<string,string> = Object.fromEntries([
    ...sections.map(([path,title])=>[path,title]), ...readingCategories.map(i=>[i.path,i.title]),
    ...navigation.flat().map(i=>[i.path,i.title]), ...designTopics.map(([id,title])=>[`ai-design/${id}`,title]),
    ...dxCategories.map(i=>[`dx/${i.id}`,i.title]), ...archiveLifecycles.map(i=>[`retired/${i.id}`,i.title]),
    ["retired",archiveTitle], ["reference","Reference"], ["about","Rosariumについて"],
    ["garden-notes","Garden Notes"], ["start-here","はじめに"], ["sitemap","サイトマップ"], ["foundations","設計資料アーカイブ"],
  ]);
  const nodes = new Map<string,SitemapNode>();
  const node = (path: string, title: string) => { if(!nodes.has(path)) nodes.set(path,{path,title,children:[],count:0}); return nodes.get(path)!; };
  const roots = navigation.flat().map(i=>node(i.path,i.title));
  const attach = (child: SitemapNode, parent: SitemapNode) => { if(child!==parent && !parent.children.includes(child)) parent.children.push(child); };
  const ancestry = (path:string,title:string) => buildBreadcrumbs({pathname:path,title,entries,labels,primaryPath:entryPrimaryPath,archiveGroup:getArchiveGroup,designStudyIds:designStudies.map(s=>s.id)});
  const add = (path:string,title:string) => {
    const trail=ancestry(path,title).filter(i=>i.path!=="");
    let parent=nodes.get("")!;
    for(const part of trail){const item=node(part.path,part.name); if(!roots.includes(item)) attach(item,parent); parent=item;}
    return node(path,title);
  };
  // Static routes share their source with the XML sitemap; content titles/paths come only from collections.
  for(const path of [...new Set([...manualRoutes,...sections.map(([path])=>path)])]) if(!roots.some(n=>n.path===path)) {
    if(!labels[path]) throw new Error(`サイトマップのページ名が未定義です: ${path}`);
    add(path,labels[path]);
  }
  for(const group of archiveLifecycles) add(`retired/${group.id}`,group.title);
  for(const entry of [...entries].sort((a,b)=>(a.data.order??999)-(b.data.order??999)||a.id.localeCompare(b.id))) {
    const item=add(entry.id,entry.data.title);item.title=entry.data.title;item.contentId=entry.id;
    item.area=designAreaFor(entry.id);item.format=item.area?"仮想設計":entry.data.publication_format === "book"?"Book":entry.data.publication_format === "series"?"連載":entry.id==="cases/design-studies"?"仮想設計":undefined;
    if(entryPrimaryPath(entry)==="cases" && !item.area && entry.id!=="cases/design-studies") item.format="実務事例"+(item.format?` · ${item.format}`:"");
  }
  for(const entry of career.filter(publishedEntry)){const path=entry.id==="overview"?"career":`career/${entry.id}`; const item=add(path,entry.id==="overview"?labels.career:entry.data.title);item.contentId=`career/${entry.id}`;}
  const priority=[...caseStudies.map(c=>c.book),"cases/design-studies"];
  nodes.get("cases")!.children.sort((a,b)=>(priority.indexOf(a.path)<0?999:priority.indexOf(a.path))-(priority.indexOf(b.path)<0?999:priority.indexOf(b.path)));
  const studyOrder=designStudies.map(study=>study.id);
  nodes.get("cases/design-studies")?.children.sort((a,b)=>studyOrder.indexOf(a.path)-studyOrder.indexOf(b.path));
  const count=(item:SitemapNode):number=>item.count=(item.contentId?1:0)+item.children.reduce((sum,c)=>sum+count(c),0);
  roots.forEach(count);
  return roots;
}
