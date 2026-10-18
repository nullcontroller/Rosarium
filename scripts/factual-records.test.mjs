import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { recentGrowth } from '../src/data/recent-growth.ts';

test('shutdown article preserves the reported investigation without the withdrawn invented code', () => {
  const source = fs.readFileSync('src/content/software-engineering/engineering-judgment-in-ai-code-review.md', 'utf8');
  const body = source.replace(/^---[\s\S]*?\n---/, '');
  assert(!body.includes('```'), 'This experience article must not regain a fabricated code example');
  assert(!body.includes('作業処理が、終了時の残処理を保存先へ書き出す'));
  for (const fact of ['プラグインについて、不具合調査の依頼を受けた', '候補を絞った', '私自身がコードを読んで', 'リソース解放の呼び出し順序', '初期化と終了処理が整合しているか', '問題箇所の特定につながった']) assert(body.includes(fact), fact);
});

test('daily article revision describes the reported investigation', () => {
  const rows = recentGrowth.filter(entry => entry.date === '2026-10-18');
  assert.equal(rows.length, 1);
  const revision = rows[0].changes.find(change => typeof change !== 'string' && change.contentIds.includes('software-engineering/engineering-judgment-in-ai-code-review'));
  assert.equal(revision.text, '改訂。終了順序の記事を、本人が確認した調査・判断の記録に整理した');
});
