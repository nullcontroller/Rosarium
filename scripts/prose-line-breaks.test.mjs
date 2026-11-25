import test from 'node:test';
import assert from 'node:assert/strict';
import { naturalProseLines } from './prose-line-breaks.mjs';
test('ordinary hard breaks become soft lines without merging paragraphs',()=>{
 assert.equal(naturalProseLines('文。  \n次。\n\n段落。'),'文。\n次。\n\n段落。');
});
test('code, math, quotes and contents subtitles retain meaningful formatting',()=>{
 for(const source of ['```\na  \nb\n```','> 引用  \n> 次','$$\na  \nb\n$$','- [題名](/a/)  \n  副題']) assert.equal(naturalProseLines(source),source);
});
