import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {designStudies} from '../src/data/design-studies.mjs';
import {relatedCaseDefinitions} from '../src/data/knowledge-domains.mjs';
const root=process.argv[2]??'dist', page=id=>load(fs.readFileSync(path.join(root,id,'index.html'),'utf8'));
for(const study of designStudies){
 for(const id of ['cases/design-studies']){
 const $=page(id),card=$(`[data-content-id="${study.id}"]`);assert.equal(card.length,1,`${id}: ${study.slug}`);
 assert.equal(card.find('[data-design-area]').text(),study.area);
 const parts=card.children('div').last().children().map((_,e)=>$(e).attr('class')).get();assert.deepEqual(parts.slice(0,4),['design-area','content-title','meta content-entry-meta','content-summary']);
 assert.match(card.find('.content-entry-meta').text(),/仮想設計.*最終更新/);
 }
 for(const id of ['cases',...relatedCaseDefinitions.filter(d=>d.id===study.id).flatMap(d=>Object.keys(d.domains))]){
  const $=page(id);
  assert.equal($(`main [data-content-id="${study.id}"], main [data-related-case-id="${study.id}"]`).length,0,`${id}: individual virtual card`);
  assert.equal($('main [data-design-studies-gateway]').length,1,id);
  assert.equal($('main [data-design-studies-gateway] a').attr('href'),'/cases/design-studies/',id);
  assert.equal($('main [data-design-studies-gateway] a').length,1,id);
  assert.equal($('main [data-design-studies-gateway] :is(h2,h3) a').attr('href'),'/cases/design-studies/',id);
  assert(!$('main [data-design-studies-gateway]').text().includes('仮想設計の一覧を見る'),id);
  assert.equal($('main [data-design-study-count]').text(),`${designStudies.length}件`,id);
 }
 const $=page(study.id);assert.equal($('.document-header [data-design-area]').text(),study.area);
 assert.equal($('.document-header h1').length,1);assert.match($('.document-header .meta').text(),/仮想設計/);
}
console.log('Design areas: all six articles and hub retain details; Cases and category references use one shared gateway.');
