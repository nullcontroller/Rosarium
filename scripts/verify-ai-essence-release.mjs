import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import YAML from 'yaml';
import { load } from 'cheerio';
import { recentGrowth, growthPublishedTargets } from '../src/data/recent-growth.ts';
import { contentHistory } from '../src/data/content-history.ts';

const manifest = JSON.parse(fs.readFileSync('.github/releases/ai-essence-approved.json', 'utf8'));
const live = process.argv.includes('--live');
const ids = manifest.pages.map(p => p.id);
const record = recentGrowth.find(r => r.date === manifest.date);
assert.equal(recentGrowth.filter(r => r.date === manifest.date).length, 1);
assert.deepEqual(growthPublishedTargets(record), ids);
assert.equal(record.summaryChanges.length, 6);
for (const p of manifest.pages) {
  const raw = fs.readFileSync(`src/content/${p.id}.md`, 'utf8').replaceAll('\r\n', '\n');
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const data = YAML.parse(fm[1]);
  assert.equal(crypto.createHash('sha256').update(raw.slice(fm[0].length)).digest('hex'), p.bodyHash, p.id);
  assert.equal(data.status, 'published'); assert.equal(data.public, true);
  assert.equal(data.published_at, manifest.date); assert.equal(data.last_updated, manifest.date);
  assert(contentHistory(p.id, data).some(e => e.date === manifest.date), p.id);
  const response = live ? await fetch(`https://rosarium-tech.com/${p.id}/?release=20261125`, {cache:'no-store'}) : null;
  if (response) assert.equal(response.status, 200, p.id);
  const $ = load(response ? await response.text() : fs.readFileSync(`dist/${p.id}/index.html`, 'utf8'));
  assert.equal($('h1').text(), p.title);
  assert(!$('meta[name="robots"]').attr('content')?.includes('noindex'), p.id);
  assert.equal($('[data-publication-planned]').length, 0);
  assert.equal($('.content-last-updated time').attr('datetime'), manifest.date);
  assert.equal($('main[data-pagefind-ignore]').length, 0);
  assert($('article[data-pagefind-body]').length > 0, p.id);
  const json = $('script[type="application/ld+json"]').map((_,el)=>$(el).text()).get().join('');
  assert(json.includes(manifest.date), p.id);
  for(const file of ['sitemap.xml','feed.json']) {
    const text = live ? await (await fetch(`https://rosarium-tech.com/${file}?release=20261125`, {cache:'no-store'})).text() : fs.readFileSync(`dist/${file}`,'utf8');
    assert(text.includes(p.id), `${file}: ${p.id}`);
  }
}
const privateIds = ['essays/what-is-ai','essays/cognitive-surrender',...['inquiry-analysis','metadata-batch','qualification-testing','data-migration','rag-security','document-lifecycle'].map(s=>`cases/design-studies/${s}`)];
for(const id of privateIds) {
 const text=fs.readFileSync(`src/content/${id}.md`,'utf8'); const data=YAML.parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
 assert.equal(data.status,'draft'); assert.equal(data.public,false); assert(!fs.existsSync(`dist/${id}/index.html`));
}
const fragments = fs.readdirSync('dist/pagefind/fragment').map(file => {
  const text = gunzipSync(fs.readFileSync(`dist/pagefind/fragment/${file}`)).toString('utf8');
  return {file, data: JSON.parse(text.slice(text.indexOf('{')))};
});
for(const p of manifest.pages) {
  const fragment = fragments.find(f => f.data.url === `/${p.id}/`);
  assert(fragment, `Search index missing: ${p.id}`);
  if(live) {
    const response = await fetch(`https://rosarium-tech.com/pagefind/fragment/${fragment.file}?release=20261125`, {cache:'no-store'});
    assert.equal(response.status,200);
    const text = gunzipSync(Buffer.from(await response.arrayBuffer())).toString('utf8');
    assert.equal(JSON.parse(text.slice(text.indexOf('{'))).url, `/${p.id}/`);
  }
}
for(const id of privateIds)assert(!fragments.some(f=>f.data.url===`/${id}/`), `Private search leak: ${id}`);
for(const file of ['index.html','garden-notes/index.html']) {
 const html=live ? await (await fetch(`https://rosarium-tech.com/${file.replace('index.html','')}?release=20261125`, {cache:'no-store'})).text() : fs.readFileSync(`dist/${file}`,'utf8');
 const $=load(html); for(const id of ids)assert($(`a[href="/${id}/"]`).length>0, `${file}: ${id}`);
 assert(html.includes(record.title));
 for(const id of privateIds)assert(!html.includes(`/${id}/`));
}
console.log(`Verified ${live?'production':'local'} approved release: seven unchanged manuscripts, dates, indexing eligibility, navigation and publication history; eight drafts remain private.`);
