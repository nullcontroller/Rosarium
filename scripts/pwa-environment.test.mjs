import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { pwaEnvironment, pwaManifest } from '../src/lib/pwa-environment.mjs';

test('production identity resolves to the existing installed app, with unchanged green branding', () => {
  const env = pwaEnvironment({}), manifest = pwaManifest(env, 'description');
  assert.equal(new URL('/', env.origin).href, manifest.id);
  assert.equal(manifest.name, 'Rosarium'); assert.equal(manifest.short_name, 'Rosarium');
  assert.equal(manifest.theme_color, '#17383b'); assert.equal(env.favicon, '/favicon.svg');
  assert.equal(env.worker, '/sw.js'); assert.equal(env.cachePrefix, 'rosarium-pwa-production-');
});
test('staging name, colour, identity, start URL, scope, assets and worker all resolve independently', () => {
  const prod = pwaEnvironment({}), stage = pwaEnvironment({ ROSARIUM_DRAFT_PREVIEW: 'no-private-drafts' });
  assert.equal(stage.name, 'Rosarium Staging'); assert.equal(stage.shortName, 'Rosarium STG');
  assert.equal(stage.color, '#96651C');
  assert.equal(stage.id, new URL('/?app=rosarium-review', stage.origin).href);
  for (const field of ['origin','id','startUrl','scope','icons','favicon','worker','cachePrefix']) assert.notEqual(stage[field], prod[field], field);
});
test('unknown, empty and conflicting explicit build environments fail closed', () => {
  for (const env of [{ ROSARIUM_PWA_ENV: 'unknown' }, { ROSARIUM_PWA_ENV: '' },
    { ROSARIUM_PWA_ENV: 'staging' }, { ROSARIUM_DRAFT_PREVIEW: 'preview', ROSARIUM_PWA_ENV: 'production' }])
    assert.throws(() => pwaEnvironment(env));
});
test('unrecognised and wrong-environment origins never register a service worker', async () => {
  const source = fs.readFileSync('src/components/PwaStatus.astro','utf8').match(/<script define:vars[^>]*>([\s\S]*?)<\/script>/)[1];
  for (const pwa of [pwaEnvironment({}), pwaEnvironment({ ROSARIUM_DRAFT_PREVIEW: 'preview' })]) {
    for (const origin of ['https://unknown.invalid', pwa.staging ? 'https://rosarium-tech.com' : 'https://nullcontroller.tail8bbb3b.ts.net:8450']) {
    let registrations = 0;
    vm.runInNewContext(source, { pwa, location: { origin }, isSecureContext: true,
      document: { body: { dataset: {} }, querySelector: () => ({ hidden: true }) },
      navigator: { serviceWorker: { register() { registrations++; } } } });
    await new Promise(resolve => setImmediate(resolve)); assert.equal(registrations, 0);
    }
  }
});
test('staging SVG is exactly the production geometry with only the documented palette substitutions', () => {
  const palette = JSON.parse(fs.readFileSync('brand/staging-palette.json','utf8'));
  let expected = fs.readFileSync('public/favicon.svg','utf8').replaceAll('\r\n','\n');
  for (const [from,to] of Object.entries(palette.svg)) expected = expected.replaceAll(from,to);
  assert.equal(fs.readFileSync('brand/staging/favicon.svg','utf8').replaceAll('\r\n','\n'), expected);
});
