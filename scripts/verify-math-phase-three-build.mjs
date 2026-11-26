import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import YAML from 'yaml';
import {load} from 'cheerio';

const baseline='411cb937b6ab05a0c167da54bc959ce428395bdf';
const slugs=['in-context-learning','mixture-of-experts','state-space-sequence-models','diffusion-language-models'];
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const read=f=>fs.readFileSync(f,'utf8').replaceAll('\r\n','\n');
const changed=[];
const searchFragments=fs.readdirSync('dist/pagefind/fragment').map(file=>{
  const text=gunzipSync(fs.readFileSync(path.join('dist/pagefind/fragment',file))).toString('utf8');
  return JSON.parse(text.slice(text.indexOf('{')));
});
for(const slug of slugs){
  const id=`foundations/${slug}`;
  const md=read(`src/content/${id}.md`);
  const data=YAML.parse(md.match(/^---\n([\s\S]*?)\n---/)[1]);
  assert.equal(data.status,'draft');assert.equal(data.public,false);assert(!data.published_at);
  assert(!fs.existsSync(`dist/${id}/index.html`),id);
  assert(!searchFragments.some(fragment=>new URL(fragment.url,'https://rosarium-tech.com').pathname===`/${id}/`),`Search leak: ${id}`);
  const $=load(read(`dist-review/${id}/index.html`));
  assert.equal($('main h1').text(),data.title);
  assert.equal($('title').text(),`${data.title} | Rosarium`);
  assert.equal($('meta[name="description"]').attr('content'),data.summary);
  assert.equal($('meta[property="og:title"]').attr('content'),`${data.title} | Rosarium`);
  assert.equal($('meta[property="og:description"]').attr('content'),data.summary);
  assert.equal($('meta[property="og:url"]').attr('content'),`https://rosarium-tech.com/${id}/`);
  assert.equal($('meta[name="robots"]').attr('content'),'noindex, follow');
  assert.equal($('.katex-error').length,0,id);
  assert.equal($('figure.diagram').length,2,id);
  assert($('.katex-display').length>5,id);
  for(const img of $('figure img').toArray())assert(fs.existsSync(path.join('dist-review',$(img).attr('src'))),id);
  for(const file of ['sitemap.xml','rss.xml','feed.json','index.html','ai/index.html','ai-mathematics/index.html'])assert(!read(`dist/${file}`).includes(`/${id}/`),`${file}: leaked ${id}`);
  for(const file of walk('dist/pagefind').filter(f=>f.endsWith('.pf_meta')||f.endsWith('.pf_index')||f.endsWith('.json')))assert(!read(file).includes(id),file);
  const structured=$('script[type="application/ld+json"]').toArray().map(e=>JSON.parse($(e).text()));
  assert(JSON.stringify(structured).includes(data.title));
  assert(JSON.stringify(structured).includes(data.summary));
  assert.equal($('link[rel="canonical"]').attr('href'),`https://rosarium-tech.com/${id}/`);
  changed.push({id,noindex:true,normalBuildAbsent:true,figures:2,mathBlocks:$('.katex-display').length});
}
const original=execFileSync('git',['ls-tree','-r','--name-only',baseline,'src/content'],{encoding:'utf8'}).trim().split('\n').filter(f=>f.endsWith('.md'));
for(const f of original.filter(f=>f!=='src/content/reference/glossary.md')){
  assert.equal(read(f),execFileSync('git',['show',`${baseline}:${f}`],{encoding:'utf8'}).replaceAll('\r\n','\n'),`Existing manuscript changed: ${f}`);
}
for(const f of ['src/data/recent-growth.ts','src/styles/global.css','src/styles/archive-colors.css','src/components/ArchiveList.astro','src/components/ThemeTitleLink.astro','src/pages/index.astro','src/content/career/overview.md','src/content/cases/specification-debt-review.md']){
  assert.equal(read(f),execFileSync('git',['show',`${baseline}:${f}`],{encoding:'utf8'}).replaceAll('\r\n','\n'),f);
}
const glossary=load(read('dist-review/reference/glossary/index.html'));
const ids=glossary('[id]').toArray().map(e=>glossary(e).attr('id'));
assert.equal(new Set(ids).size,ids.length,'Duplicate glossary anchors');
for(const anchor of ['in-context-learning','mixture-of-experts','state-space-model','diffusion-model','elbo','parallel-scan'])assert(ids.includes(anchor),anchor);
const oldGlossary=execFileSync('git',['show',`${baseline}:src/content/reference/glossary.md`],{encoding:'utf8'});
for(const id of [...oldGlossary.matchAll(/<span id="([^"]+)"/g)].map(m=>m[1]))assert(ids.includes(id),id);
console.log(JSON.stringify({passed:true,baseline,articles:changed,decompressedSearchFragments:searchFragments.length,protectedOriginalManuscripts:original.length-1,gardenNotesUnchanged:true,existingUIUnchanged:true,allOldGlossaryAnchorsPreserved:true},null,2));
