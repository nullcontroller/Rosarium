import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { Script } from 'node:vm';
import { pwaEnvironment } from '../src/lib/pwa-environment.mjs';
const root = process.argv[2] || 'dist';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site.webmanifest'), 'utf8'));
const staging = manifest.name === 'Rosarium Staging';
const environment = pwaEnvironment(staging ? { ROSARIUM_DRAFT_PREVIEW: 'staging-no-drafts' } : {});
const worker = fs.readFileSync(path.join(root, environment.worker), 'utf8');
new Script(worker);
const config = JSON.parse(worker.match(/const CONFIG = (.+);/)[1]);
assert.equal(config.review, staging);
assert.equal(manifest.name, environment.name);
assert.equal(manifest.short_name, environment.shortName);
assert.equal(manifest.id, environment.id);
assert.equal(manifest.theme_color, environment.color);
assert.equal(manifest.lang, 'ja');
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.start_url, environment.startUrl); assert.equal(manifest.scope, environment.scope);
assert.match(config.version, /^[a-f0-9]{16}$/);
assert.equal(new Set(config.paths).size, config.paths.length);
for (const route of config.paths) {
  assert(!route.includes('design-system-overview') && !route.includes('wiki-overview'));
  assert(fs.existsSync(path.join(root, route.endsWith('.html') ? route : route + 'index.html')), route);
}
for (const icon of manifest.icons) assert(fs.existsSync(path.join(root, icon.src)), icon.src);
if (staging) {
  assert(!fs.existsSync(path.join(root, 'sw.js')), 'staging must not ship the production worker endpoint');
  assert(fs.readFileSync(path.join(root, 'favicon.svg'),'utf8').includes('#96651C'));
  const ico = fs.readFileSync(path.join(root, 'favicon.ico'));
  assert.equal(ico.readUInt16LE(2), 1); assert.equal(ico.readUInt16LE(4), 1);
  assert.equal(ico[6], 32); assert.equal(ico[7], 32);
  assert.deepEqual(ico.subarray(22), fs.readFileSync('brand/staging/favicon-32x32.png'));
  assert.deepEqual(fs.readFileSync(path.join(root,'apple-touch-icon.png')),fs.readFileSync('brand/staging/apple-touch-icon.png'));
}
else {
  assert(!fs.existsSync(path.join(root, 'sw-staging.js')));
  assert(!fs.existsSync(path.join(root, 'icons/staging')));
  assert(!fs.existsSync(path.join(root, 'favicon.ico')));
}
assert(!/indexedDB\s*\.|localStorage\s*\.|skipWaiting\s*\(|clients\.claim\s*\(/.test(worker));
assert(config.paths.includes('/'));
console.log(`PWA audit: ${manifest.name}; ${config.paths.length} eligible HTML routes, no private drafts, native waiting lifecycle; worker ${config.version}.`);
