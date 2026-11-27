import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { Script } from 'node:vm';
const root = process.argv[2] || 'dist';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site.webmanifest'), 'utf8'));
const worker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
new Script(worker);
const config = JSON.parse(worker.match(/const CONFIG = (.+);/)[1]);
assert.equal(manifest.name, config.review ? 'Rosarium Review' : 'Rosarium');
assert.equal(manifest.short_name, manifest.name);
assert.equal(manifest.id, config.review ? '/?app=rosarium-review' : '/');
assert.equal(manifest.lang, 'ja');
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.start_url, '/'); assert.equal(manifest.scope, '/');
assert.match(config.version, /^[a-f0-9]{16}$/);
assert.equal(new Set(config.paths).size, config.paths.length);
for (const route of config.paths) {
  assert(!route.includes('design-system-overview') && !route.includes('wiki-overview'));
  assert(fs.existsSync(path.join(root, route.endsWith('.html') ? route : route + 'index.html')), route);
}
for (const icon of manifest.icons) assert(fs.existsSync(path.join(root, icon.src)), icon.src);
assert(!/indexedDB\s*\.|localStorage\s*\.|skipWaiting\s*\(|clients\.claim\s*\(/.test(worker));
assert(config.paths.includes('/'));
console.log(`PWA audit: ${manifest.name}; ${config.paths.length} eligible HTML routes, no private drafts, native waiting lifecycle; worker ${config.version}.`);
