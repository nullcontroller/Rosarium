import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {load} from 'cheerio';
import YAML from 'yaml';

const manifest=JSON.parse(fs.readFileSync('docs/release-preparations/math-two-three-2026-11-26.json','utf8'));
const root=process.argv[2]||'dist';
const page=id=>load(fs.readFileSync(path.join(root,id,'index.html'),'utf8'));
const body=s=>s.replaceAll('\r\n','\n').split('---').slice(2).join('---');
const search=fs.readdirSync('dist/pagefind/fragment').map(f=>{const t=gunzipSync(fs.readFileSync('dist/pagefind/fragment/'+f)).toString();return JSON.parse(t.slice(t.indexOf('{')));});
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
const hub=page('ai-mathematics');
const glossary=page('reference/glossary');
const allIds=glossary('[id]').toArray().map(e=>glossary(e).attr('id'));
assert.equal(allIds.length,new Set(allIds).size,'Duplicate glossary anchors');
const rows=[];let checkedLinks=0;
for(const id of manifest.article_ids){
 const source=fs.readFileSync('src/content/'+id+'.md','utf8');
 const data=YAML.parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
 assert.equal(data.status,'published');assert.equal(data.public,true);assert.equal(data.lifecycle,'active');
 assert.equal(data.published_at,manifest.candidate_date);assert.equal(data.last_updated,manifest.candidate_date);
 const accepted=execFileSync('git',['show',`${manifest.accepted_phase_three}:src/content/${id}.md`],{encoding:'utf8'});
 assert.equal(body(source),body(accepted),id+': approved body changed');
 const $=page(id),route='/'+id+'/';
 assert.equal($('h1').text(),data.title);assert.equal($('title').text(),data.title+' | Rosarium');
 assert.equal($('meta[name=description]').attr('content'),data.summary);
 assert.equal($('meta[property="og:title"]').attr('content'),data.title+' | Rosarium');
 assert.equal($('meta[property="og:description"]').attr('content'),data.summary);
 assert.equal($('link[rel=canonical]').attr('href'),'https://rosarium-tech.com'+route);
 assert.equal($('meta[name=robots]').attr('content'),'index, follow');assert.equal($('.katex-error').length,0);
 assert(hub(`a[href="${route}"]`).length>0,id+': category missing');
 assert.equal(search.filter(f=>new URL(f.url,'https://rosarium-tech.com').pathname===route).length,1,id+': search');
 assert(sitemap.includes('https://rosarium-tech.com'+route),id+': sitemap');
 const json=$('script[type="application/ld+json"]').toArray().map(e=>JSON.parse($(e).text()));
 assert(JSON.stringify(json).includes(data.title));assert(JSON.stringify(json).includes(manifest.candidate_date));
 for(const a of $('article a[href],aside a[href]').toArray()){
  const href=$(a).attr('href');if(!href||/^(https?:|mailto:)/.test(href))continue;
  const target=new URL(href,'https://rosarium-tech.com'+route);
  const file=path.join(root,target.pathname,target.pathname.endsWith('/')?'index.html':'');assert(fs.existsSync(file),id+': '+href);
  if(target.hash){const t=load(fs.readFileSync(file,'utf8'));assert(t('[id]').toArray().some(e=>t(e).attr('id')===decodeURIComponent(target.hash.slice(1))),href);}
  checkedLinks++;
 }
 rows.push({id,published:true,approvedBodyUnchanged:true,category:true,search:true,sitemap:true,formulas:$('.katex-display').length,figures:$('figure').length});
}
const ordered=hub('[data-primary-index] article a[href]').toArray().map(e=>hub(e).attr('href'));
for(const [before,after] of [['attention-information-flow','attention-efficiency'],['policy-gradient-learning','preference-learning-dpo'],['preference-learning-dpo','verifiable-reward-reasoning']])assert(ordered.indexOf('/foundations/'+before+'/')<ordered.indexOf('/foundations/'+after+'/'),before+' prerequisite');
const garden=page('garden-notes');assert.equal(garden('h3').toArray().filter(e=>garden(e).text()==='AI・数理領域を拡充し、学習理論と発展的なモデル構造を体系化').length,1);
assert.equal(hub('meta[name="last-updated"]').attr('content'),manifest.candidate_date);
for(const file of ['src/components/GoogleAnalytics.astro','scripts/browser-analytics.mjs','scripts/analytics-runtime.mjs','scripts/analytics.test.mjs','scripts/verify-analytics.mjs','scripts/verify-review-targets.mjs','AGENTS.md','docs/analytics-operations.md'])assert.equal(fs.readFileSync(file,'utf8').replaceAll('\r\n','\n'),execFileSync('git',['show',`${manifest.ga4_implementation}:${file}`],{encoding:'utf8'}).replaceAll('\r\n','\n'),file+': GA4 change');
assert.equal(manifest.state,'awaiting_author_publish_approval');assert.equal(manifest.actual_publication_date,null);
console.log(JSON.stringify({passed:true,root,candidateDate:manifest.candidate_date,productionDeployed:false,articles:rows,checkedLinks,searchFragments:search.length,ga4SourcePreserved:true,glossaryIdsUnique:true},null,2));
