import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import YAML from 'yaml';
import {recentGrowth} from '../src/data/recent-growth.ts';

const baseline='38ccce9fb4329e472281e4a8f8c1fb69d3d0d217';
const id='software-engineering/engineering-judgment-in-ai-code-review';
const read=f=>fs.readFileSync(f,'utf8').replaceAll('\r\n','\n');
const old=f=>execFileSync('git',['show',`${baseline}:${f}`],{encoding:'utf8'}).replaceAll('\r\n','\n');
const metadata=t=>YAML.parse(t.match(/^---\n([\s\S]*?)\n---/)[1]);
const body=t=>t.replace(/^---\n[\s\S]*?\n---/,'');

test('only the approved investigation article is retired and its original manuscript remains intact',()=>{
 const files=execFileSync('git',['ls-tree','-r','--name-only',baseline,'src/content'],{encoding:'utf8'}).trim().split('\n').filter(f=>f.endsWith('.md'));
 const changed=files.filter(f=>(metadata(read(f)).lifecycle??'active')!==(metadata(old(f)).lifecycle??'active'));
 assert.deepEqual(changed,[`src/content/${id}.md`]);
 const source=read(changed[0]),before=old(changed[0]);
 assert(source.endsWith(body(before)),'Preserve the complete original body after the archive notice');
 assert.equal(metadata(source).published_at,metadata(before).published_at);
 assert(source.includes('品質不足ではなく'));
 assert(source.includes('[「複数のソフトウェアにまたがる障害調査の設計」](/cases/ai-technical-investigation/)'));
});

test('the Book and its chapters remain byte-equivalent after newline normalization',()=>{
 const files=execFileSync('git',['ls-tree','-r','--name-only',baseline,'src/content/cases/ai-technical-investigation.md','src/content/cases/ai-technical-investigation'],{encoding:'utf8'}).trim().split('\n');
 for(const f of files)assert.equal(read(f),old(f),f);
});

test('November 27 retirement is additive and prior publication and revision events remain',()=>{
 const day=recentGrowth.filter(e=>e.date==='2026-11-27');assert.equal(day.length,1);
 assert.equal(day[0].title,'障害調査に関する既存実務事例をBookへ集約');
 assert.deepEqual(day[0].changes[0].contentIds,[id]);assert.equal(day[0].changes[0].action,'retired');
 for(const date of ['2026-10-16','2026-10-18'])assert(recentGrowth.find(e=>e.date===date).changes.some(c=>typeof c!=='string'&&c.contentIds.includes(id)));
 assert.equal(recentGrowth.find(e=>e.date==='2026-11-26').topics.length,10);
});
