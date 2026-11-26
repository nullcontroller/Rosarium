import test from 'node:test';
import {execFileSync} from 'node:child_process';
test('all archive text and UI boundary token pairs meet their AA contrast thresholds',()=>{
  execFileSync(process.execPath,['scripts/verify-archive-contrast.mjs'],{stdio:'pipe'});
});
