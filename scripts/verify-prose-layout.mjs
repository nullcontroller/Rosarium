import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { proseLineBreaks } from './prose-line-breaks.mjs';
const walk = d => fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
let sources=0, retained=0;
for(const file of walk('src/content').filter(f=>f.endsWith('.md'))){
 const body=fs.readFileSync(file,'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'');
 const result=proseLineBreaks(body); sources++; retained+=result.retained.length;
 assert.equal(result.unnecessary.length,0,`${file}: ordinary prose hard break`);
}
let pages=0;
if(process.argv[2]) for(const file of walk(process.argv[2]).filter(f=>f.endsWith('.html'))){
 const $=load(fs.readFileSync(file,'utf8')); pages++;
 $('main br').each((_,el)=>{
 const br=$(el);
 const protectedBlock=br.closest('blockquote,table,pre,code,svg,.katex').length;
 const titleSubtitle=br.closest('li').find('a').length && /ai-essence/.test(file);
 assert.ok(protectedBlock||titleSubtitle,`${file}: ordinary prose HTML br`);
 });
}
console.log(`Prose layout: ${sources} sources, ${retained} structural breaks preserved, ${pages} HTML pages checked`);
