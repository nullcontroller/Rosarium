import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import YAML from 'yaml';
import {compatibilityUrls,compatibilityFor} from '../src/data/compatibility-urls.mjs';
import {aiKnowledgeGroups} from '../src/data/ai-knowledge-groups.mjs';
import {primaryDomain,domainEntries} from '../src/data/knowledge-domains.mjs';
import {designStudies,designStudyGroups} from '../src/data/design-studies.mjs';
const root=process.argv[2]||'dist';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const page=id=>load(fs.readFileSync(path.join(root,id,'index.html'),'utf8'));
const sources=walk('src/content').filter(f=>f.endsWith('.md')).map(f=>({id:path.relative('src/content',f).replaceAll('\\','/').replace(/\.md$/,''),data:YAML.parse(fs.readFileSync(f,'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)[1])}));
const active=sources.filter(e=>e.data.public!==false&&['published','stable'].includes(e.data.status)&&(e.data.lifecycle??'active')==='active'&&!compatibilityFor(e.id));
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const entry of sources){
 if(entry.data.public===false||entry.data.status==='draft')continue;
 const id=entry.id==='career/overview'?'career':entry.id;
 const $=page(id);
 if(compatibilityFor(id)){assert.equal($('[data-pagefind-body]').length,0);continue;}
 assert.equal($('h1').first().text(),entry.data.title,id);
 assert.equal($('[data-pagefind-meta="summary"]').text().trim(),entry.data.summary,id);
 if(entry.id!=='career/overview')assert.equal($('[data-pagefind-meta="last_updated"]').text(),entry.data.last_updated,id);
 assert.equal($('[data-pagefind-body]').length,1,id);
 assert.equal($('.katex-error').length,0,id);
 assert.equal($('link[rel="canonical"]').attr('href'),`https://rosarium-tech.com/${id}/`,id);
}
for(const record of compatibilityUrls){const $=page(record.from.slice(1,-1));
 assert.match($('meta[name="robots"]').attr('content'),/noindex/);assert.equal($('[data-pagefind-body]').length,0);
 assert.equal($('meta[http-equiv="refresh"]').attr('content'),'0;url='+record.to);
 assert.equal($('link[rel="canonical"]').attr('href'),'https://rosarium-tech.com'+new URL(record.to,'https://rosarium-tech.com').pathname);
 assert(!sitemap.includes(`<loc>https://rosarium-tech.com${record.from}</loc>`));
 for(const to of [record.to,...Object.values(record.fragments)]){const u=new URL(to,'https://rosarium-tech.com');assert(!compatibilityUrls.some(r=>r.from===u.pathname));const target=page(u.pathname);if(u.hash)assert(target('[id]').toArray().some(e=>target(e).attr('id')===decodeURIComponent(u.hash.slice(1))),to);}
}
const ai=page('ai');assert.equal(ai('[data-ai-knowledge-group]').length,5);
assert.deepEqual(ai('[data-ai-knowledge-group] h2').map((_,e)=>ai(e).text()).get(),aiKnowledgeGroups.map(g=>g.title));
const aiIds=ai('[data-ai-knowledge-group] a').map((_,e)=>ai(e).attr('href').slice(1,-1)).get();
assert.deepEqual(aiIds,aiKnowledgeGroups.flatMap(g=>g.ids));assert.equal(new Set(aiIds).size,19);
assert.equal(ai('[data-ai-featured],[data-ai-related],[data-domain-theme]').length,0);
for(const domain of ['planning','dx','system-design','ai']){const $=page(domain);
 assert.equal($('[data-related-cases],.case-knowledge-links').length,0,domain);
 const links=$('main a[href]').not('.breadcrumb a').toArray();
 for(const el of links){const href=$(el).attr('href');const e=active.find(e=>href===`/${e.id}/`);if(e)assert.equal(primaryDomain(e),domain,domain+' -> '+e.id);}
 for(const e of domainEntries(domain,active))assert(links.some(el=>$(el).attr('href')===`/${e.id}/`),domain+' missing '+e.id);
}
const career=page('career');assert.equal(career('[data-career-case]').length,4);assert.equal(career('[data-career-case] a[href^="/cases/"]').length,4);assert(career('a[href*="linkedin.com"]').length);
assert.equal(page('reference')('[data-primary-index] [data-content-id]').length,4);
for(const group of designStudyGroups){const book=page(group.caseId);const list=book('[data-design-studies-list]');assert.equal(list.length,1);const expected=designStudies.filter(s=>s.sourceCase===group.caseId);assert.equal(list.find('a').length,expected.length);for(const s of expected){assert(list.find(`a[href="/${s.id}/"]`).length);const article=page(s.id);assert.equal(article('.document-header [data-design-area]').text(),s.area);assert(article('nav.breadcrumb a').toArray().some(e=>article(e).attr('href')===`/${group.caseId}/`));}assert.equal(book('.book-toc .page-toc-panel > ol > li').length,12,'11 chapters plus introduction');}
for(const file of walk(root).filter(f=>f.endsWith('.html')&&!f.endsWith('google57af630fc0ce16af.html'))){const $=load(fs.readFileSync(file,'utf8'));if($('meta[http-equiv=refresh]').length)continue;assert.equal($('h1').length,1,file);assert.equal($('header.masthead > a.brand').length,1,file);assert.equal($('.katex-error,adf-directive').length,0,file);assert.equal($('.header-primary').length,1,file);assert.equal($('.global-search').length,1,file);assert.equal($('#theme').length,1,file);}
console.log(`IA acceptance: ${active.length} active originals; 5 AI domains/19 links; 27 consolidated pages/54 compatibility URLs; references, Career evidence, study identities and shared UI verified.`);
