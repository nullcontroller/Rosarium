import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import { newPublications } from '../src/lib/new-publications.mjs';
const date = '2026-11-28';
const content = (id, data = {}) => ({id, data:{status:'published',public:true,lifecycle:'active',published_at:date,...data}});
test('new publications include independent articles and only Book/series overviews, once', () => {
 const article=content('article');
 assert.deepEqual(newPublications(date,[article,article,content('book',{series:'book',order:0}),content('chapter',{series:'book',order:1}),content('series',{series:'serial',order:0}),content('episode',{series:'serial',order:2})]).map(e=>e.id),['article','book','series']);
});
test('updates, retired/integrated, private, draft and unknown-date contents do not appear',()=>{
 assert.deepEqual(newPublications(date,[content('update',{published_at:'2026-11-27',last_updated:date}),content('retired',{lifecycle:'retired'}),content('integrated',{lifecycle:'integrated'}),content('private',{public:false}),content('draft',{status:'draft'}),content('unknown',{published_at:undefined}),content('fallback',{publication_date_basis:'fallback'})]),[]);
 assert.deepEqual(newPublications('2026-11-29',[content('article')]),[]);
});
test('28 November displays the integrated Book overview without its source or seven chapters',()=>{
 const root='cases/asset-management-app-a-architecture';
 const ids=[root,...fs.readdirSync(`src/content/${root}`).map(n=>`${root}/${n.replace(/\.md$/,'')}`),'cases/ai-development-management'];
 const entries=ids.map(id=>({id,data:YAML.parse(fs.readFileSync(`src/content/${id}.md`,'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)[1])}));
 assert.deepEqual(newPublications(date,entries).map(e=>e.id),[root]);
 const source=fs.readFileSync('src/components/GrowthEntry.astro','utf8');
 assert.match(source,/articleLinks.length > 0/);
 assert.match(source,/<summary>新規公開<\/summary>/);
 assert.doesNotMatch(source,/関連ページ|data-growth-related|showPublicationLinks/);
});
