import test from 'node:test';
import assert from 'node:assert/strict';
import {archiveReason,archiveDestination} from '../src/lib/archive-presentation.ts';

test('archive reason is an unchanged first sentence, not an invented summary',()=>{
 assert.equal(archiveReason('役割を終了した。過去の記録を保存する。'),'役割を終了した。');
 assert.equal(archiveReason('句点のない原文'),'句点のない原文');
 assert.equal(archiveReason(undefined),'');
});
test('archive destination uses only a literal existing redirect, not guessed links',()=>{
 assert.equal(archiveDestination('const destination = url("essays/target");'),'essays/target');
 assert.equal(archiveDestination('const destination = url("essays/target") + "#section";'),undefined);
 assert.equal(archiveDestination('const destination = url(dynamic);'),undefined);
 assert.equal(archiveDestination(''),undefined);
});
