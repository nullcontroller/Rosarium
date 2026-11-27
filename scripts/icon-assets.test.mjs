import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pwaEnvironment, pwaManifest } from '../src/lib/pwa-environment.mjs';

const pngSize = (buffer) => [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];

test("site icon assets have valid SVG and expected PNG dimensions", async () => {
  const svg = await readFile("public/favicon.svg", "utf8");
  assert.match(svg, /viewBox="0 0 64 64"/);
  assert(!svg.includes("<text"));
  const expected = new Map([
    ["public/icons/icon-192.png", [192, 192]],
    ["public/icons/icon-512.png", [512, 512]],
    ["public/icons/icon-maskable-192.png", [192, 192]],
    ["public/icons/icon-maskable-512.png", [512, 512]],
    ["public/icons/apple-touch-icon.png", [180, 180]],
    ["public/icons/favicon-32x32.png", [32, 32]],
  ]);
  for (const [path, size] of expected) {
    const png = await readFile(path);
    assert.deepEqual(pngSize(png), size, path);
  }
});

test("manifest endpoint uses the shared, origin-bound environment metadata", async () => {
  const source = await readFile("src/pages/site.webmanifest.ts", "utf8");
  assert(source.includes('pwaManifest(pwaEnvironment(), siteDescription)'));
  for (const env of [{}, { ROSARIUM_DRAFT_PREVIEW: 'staging-no-drafts' }]) {
    const settings = pwaEnvironment(env), manifest = pwaManifest(settings, 'description');
    assert.equal(manifest.display, 'standalone'); assert.equal(manifest.lang, 'ja');
    assert.equal(new URL(manifest.start_url).origin, settings.origin);
    assert.equal(new URL(manifest.scope).origin, settings.origin);
    assert.equal(new URL(manifest.id).origin, settings.origin);
    assert(manifest.icons.every(icon => icon.src.startsWith(settings.icons)));
    assert.equal(manifest.icons.filter(icon => icon.purpose === 'maskable').length, 2);
  }
});
