/* Native runtime cache. No IndexedDB, analytics, background sync or precrawl. */
const CONFIG = /* PWA_CONFIG */ { review: false, version: "development", paths: [] };
const PREFIX = `rosarium-pwa-${CONFIG.review ? 'staging' : 'production'}-`;
const CACHE = PREFIX + CONFIG.version;
const PUBLIC = new Set(CONFIG.paths);
const ASSETS = new Set(CONFIG.assets || []);
const AGE = 30 * 24 * 60 * 60 * 1000;
const MAX_ITEMS = 240;
const MAX_BYTES = 32 * 1024 * 1024;
const MAX_RESPONSE = 2 * 1024 * 1024;
const STAMP = 'x-rosarium-cached-at';
function searchEntry(url) {
  return url.pathname === '/pagefind/pagefind-entry.json' &&
    [...url.searchParams.keys()].every(key => key === 'ts');
}

function eligible(url) {
  if (url.origin !== self.location.origin) return false;
  if (url.search) return PUBLIC.has(url.pathname) || searchEntry(url);
  return PUBLIC.has(url.pathname) || url.pathname === '/bookmarks.json' ||
    ASSETS.has(url.pathname) || /^\/(?:_astro|pagefind)\//.test(url.pathname) ||
    url.pathname === '/favicon.svg';
}
function immutable(url) {
  return /^\/_astro\/.+[._-][A-Za-z0-9_-]{8,}\./.test(url.pathname) ||
    /[._-][a-f0-9]{8,}\.(?:png|jpe?g|webp|avif|svg)$/i.test(url.pathname);
}
async function prune(cache) {
  let bytes = 0;
  const entries = [];
  for (const request of await cache.keys()) {
    const response = await cache.match(request);
    const time = Number(response.headers.get(STAMP));
    const size = Number(response.headers.get('x-rosarium-size'));
    if (!time || Date.now() - time > AGE || !Number.isFinite(size)) await cache.delete(request);
    else { bytes += size; entries.push({ request, time, size }); }
  }
  entries.sort((a, b) => a.time - b.time);
  while (entries.length > MAX_ITEMS || bytes > MAX_BYTES) {
    const oldest = entries.shift();
    bytes -= oldest.size;
    await cache.delete(oldest.request);
  }
}
async function save(cache, request, response) {
  if (!response.ok || response.type === 'opaque' || response.redirected ||
    /no-store|private/i.test(response.headers.get('cache-control') || '')) return;
  const bytes = await response.clone().arrayBuffer();
  if (bytes.byteLength > MAX_RESPONSE) return;
  const headers = new Headers(response.headers);
  headers.set(STAMP, String(Date.now()));
  headers.set('x-rosarium-size', String(bytes.byteLength));
  // The stored body is decoded by fetch, so encoded wire lengths are invalid.
  headers.delete('content-encoding'); headers.delete('content-length');
  await cache.put(request, new Response(bytes, { status: response.status, headers }));
  await prune(cache);
}
async function cached(cache, request) {
  try {
    const response = await cache.match(request);
    if (response && Date.now() - Number(response.headers.get(STAMP)) <= AGE) return response;
    if (response) await cache.delete(request);
  } catch { /* Storage refusal must not break ordinary online browsing. */ }
}
function offlinePage() {
  return new Response('<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>オフライン | Rosarium</title><style>body{font:18px/1.7 system-ui;max-width:38rem;margin:10vh auto;padding:24px;color:#17383b;background:#f5f3e9}a{color:inherit}@media(prefers-color-scheme:dark){body{color:#e4ece8;background:#14282b}}</style><h1>オフラインです</h1><p>このページはまだ保存されていません。接続後にもう一度開いてください。</p><p><a href="/">Rosariumへ</a> · <a href="javascript:history.back()">前のページへ戻る</a></p></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
self.addEventListener('install', () => { /* Wait naturally; never force a reload. */ });
self.addEventListener('activate', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  // Activation waits for the old worker's clients to leave. Keep visited
  // resources for offline use, but only if still eligible and within limits.
  for (const name of await caches.keys()) {
    // The old Review app used teal HTML. Discard only that disposable staging
    // cache after natural activation; keep its origin's bookmark DB untouched.
    if (CONFIG.review && name.startsWith('rosarium-pwa-review-')) { await caches.delete(name); continue; }
    if (!name.startsWith(PREFIX) || name === CACHE) continue;
    const previous = await caches.open(name);
    for (const request of await previous.keys()) {
      if (!eligible(new URL(request.url))) continue;
      const response = await cached(previous, request);
      if (response && !(await cache.match(request))) await cache.put(request, response);
    }
    await caches.delete(name);
  }
  await prune(cache);
})()));
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.search && request.mode !== 'navigate' && !searchEntry(url)) return;
  if (!eligible(url)) {
    if (request.mode === 'navigate') event.respondWith(fetch(request, { cache: 'no-cache' }).catch(offlinePage));
    return;
  }
  event.respondWith((async () => {
    // Static HTML is identical across search/analytics query parameters.
    // Preserve the live URL, but never persist search terms as cache keys.
    const key = request.mode === 'navigate' || searchEntry(url) ? new URL(url.pathname, url.origin).href : request;
    let cache;
    try { cache = await caches.open(CACHE); }
    catch {
      return fetch(request, { cache: 'no-cache' }).catch(() => request.mode === 'navigate' ? offlinePage() : Response.error());
    }
    if (immutable(url)) {
      const hit = await cached(cache, key);
      if (hit) return hit;
    }
    try {
      const response = await fetch(request, { cache: 'no-cache' });
      // An online 404/redirect must never resurrect retired content.
      if (!response.ok || response.redirected) await cache.delete(key).catch(() => {});
      else await save(cache, key, response).catch(() => {});
      return response;
    } catch {
      const hit = await cached(cache, key);
      if (hit) {
        if (request.mode === 'navigate') {
          // Mark the document itself; notification cannot race page startup.
          const html = await hit.text();
          return new Response(html.replace('<body', '<body data-pwa-offline="true"'), { headers: hit.headers });
        }
        return hit;
      }
      return request.mode === 'navigate' ? offlinePage() : Response.error();
    }
  })());
});
