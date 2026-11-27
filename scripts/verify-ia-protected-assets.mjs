import fs from 'node:fs';import {load} from 'cheerio';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';import {compatibilityFor} from '../src/data/compatibility-urls.mjs';
const baseline=JSON.parse(fs.readFileSync(new URL('./fixtures/ia-protected-baseline.json',import.meta.url),'utf8'));
const hash=v=>createHash('sha256').update(v).digest('hex');const root=process.argv[2]||'dist';
for(const [file,digest] of Object.entries(baseline.sources))assert.equal(hash(fs.readFileSync(file)),digest,`Protected source changed: ${file}`);
let count=0;
for(const [id,expected] of Object.entries(baseline.rendered)){if(compatibilityFor(id))continue;const $=load(fs.readFileSync(`${root}/${id}/index.html`,'utf8'));
assert.equal($('h1').first().text(),expected.title,id);
assert.equal(hash($('.prose').text().replace(/\s+/g,' ').trim()),expected.prose,id+' full prose');
for(const [key,selector,extract] of [['math','.prose .katex-mathml',e=>hash($(e).text())],['images','.prose img',e=>$(e).attr('src')],['code','.prose pre',e=>hash($(e).text())],['tables','.prose table',e=>hash($(e).text().replace(/\s+/g,' '))]])assert.deepEqual($(selector).map((_,e)=>extract(e)).get(),expected[key],id+' '+key);
count++;
}
console.log(`IA protection audit: ${Object.keys(baseline.sources).length} source hashes and ${count} rendered originals; titles, math, diagrams/images, code and tables unchanged.`);
