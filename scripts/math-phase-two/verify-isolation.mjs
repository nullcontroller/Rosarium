import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {load} from 'cheerio';
import YAML from 'yaml';

const slugs=['policy-gradient-learning','preference-learning-dpo','verifiable-reward-reasoning','compute-optimal-scaling','speculative-decoding'];
const fragments=fs.readdirSync('dist/pagefind/fragment').map(f=>{
 const t=gunzipSync(fs.readFileSync('dist/pagefind/fragment/'+f)).toString();
 return JSON.parse(t.slice(t.indexOf('{')));
});
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const publicDiscovery=walk('dist').filter(f=>/\.(html|xml|json)$/.test(f)).map(f=>[f,fs.readFileSync(f,'utf8')]);
const rows=[];
for(const slug of slugs){
 const id='foundations/'+slug,route='/'+id+'/';
 const src=fs.readFileSync('src/content/'+id+'.md','utf8');
 const data=YAML.parse(src.match(/^---\n([\s\S]*?)\n---/)[1]);
 assert.equal(data.status,'draft');assert.equal(data.public,false);assert(!data.published_at);
 assert(!fs.existsSync('dist'+route+'index.html'));
 assert(!fragments.some(f=>f.url.includes(route)),id+': public search');
 for(const [file,html] of publicDiscovery)assert(!html.includes(route),file+': draft discovery leak');
 const $=load(fs.readFileSync('dist-review'+route+'index.html','utf8'));
 assert.equal($('meta[name=robots]').attr('content'),'noindex, follow');
 assert.equal($('main[data-pagefind-ignore]').length,1);
 assert.equal($('.katex-error').length,0);
 assert($('.katex').length>0);
 assert.equal($('h1').text(),data.title);
 assert(!$('figcaption').text().includes('$'),'raw math in caption');
 $('figure img').each((_,img)=>assert(fs.existsSync('public'+$(img).attr('src'))));
 rows.push({id,draft:true,publicPage:false,search:false,discovery:false,reviewNoindex:true,formulas:$('.katex').length,figures:$('figure').length});
}
// Protect all pre-existing manuscripts and published design/UI/history files.
const base='ef791164393813130daf732126bd211c197c625b';
const protectedPaths=execFileSync('git',['ls-tree','-r','--name-only',base,'src/content','src/styles','src/components','src/layouts','src/pages','src/data/recent-growth.ts','src/lib/site.ts'],{encoding:'utf8'}).trim().split('\n');
for(const file of protectedPaths){
 const old=execFileSync('git',['show',base+':'+file]);
 const now=fs.readFileSync(file);
 if (/\.(md|astro|css|ts|mjs|json)$/.test(file)) {
   assert.equal(now.toString().replaceAll('\r\n','\n'),old.toString().replaceAll('\r\n','\n'),'Protected source changed: '+file);
 } else assert.deepEqual(now,old,'Protected source changed: '+file);
}
console.log(JSON.stringify({base,articles:rows,protectedExistingFiles:protectedPaths.length,firstPhaseAndUiUnchanged:true},null,2));
