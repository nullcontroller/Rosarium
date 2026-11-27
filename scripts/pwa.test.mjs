import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

async function worker(network) {
  const handlers = {};
  const stores = new Map();
  const caches = { keys: async () => [...stores.keys()], delete: async name => stores.delete(name), open: async name => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return { keys: async () => [...store.keys()].map(url => ({ url })),
      match: async request => store.get(typeof request === 'string' ? request : request.url)?.clone(),
      put: async (request, response) => store.set(typeof request === 'string' ? request : request.url, response.clone()),
      delete: async request => store.delete(typeof request === 'string' ? request : request.url) };
  } };
  const context = { self: { location: new URL('https://rosarium-tech.com'), addEventListener: (type, handler) => handlers[type] = handler }, caches, Response, Headers, URL, Set, Date, fetch: network };
  vm.runInNewContext((await fs.readFile('src/pwa/worker.js', 'utf8')).replace('/* PWA_CONFIG */ { review: false, version: "development", paths: [] }', JSON.stringify({ version: 'test', review: false, paths: ['/visited/'], assets: ['/assets/example.12345678.svg', '/diagrams/example.svg'] })), context);
  return { stores, caches, request: (path, mode = 'navigate') => {
    /** @type {Promise<Response> | undefined} */
    let result;
    handlers.fetch({ request: { url: new URL(path, context.self.location).href, method: 'GET', mode }, respondWith: promise => result = promise });
    return result;
  } };
}
test('HTML uses latest network response, falls back only on failure and marks cached document', async () => {
  let mode = 'one';
  const app = await worker(async () => { if (mode === 'offline') throw Error(); return new Response('<html><body>' + mode + '</body></html>'); });
  assert.match(await (await app.request('/visited/')).text(), /one/);
  mode = 'two';
  assert.match(await (await app.request('/visited/')).text(), /two/);
  mode = 'offline';
  assert.match(await (await app.request('/visited/')).text(), /data-pwa-offline="true">two/);
  assert.equal((await app.request('/never/')).status, 503);
});
test('online 404 removes cached article rather than resurrecting it', async () => {
  let status = 200;
  const app = await worker(async () => { if (!status) throw Error(); return new Response('<body>old', { status }); });
  await app.request('/visited/'); status = 404;
  assert.equal((await app.request('/visited/')).status, 404);
  status = 0;
  assert.equal((await app.request('/visited/')).status, 503);
});
test('external requests, review assets and nonpublic routes are never stored', async () => {
  const app = await worker(async () => new Response('secret'));
  assert.equal(app.request('https://google-analytics.com/g/collect', 'cors'), undefined);
  await app.request('/private-draft/');
  assert.equal(app.request('/diagrams/private-draft.svg', 'cors'), undefined);
  assert.equal(app.stores.size, 0);
});
test('cache entries expire after thirty days', async () => {
  let online = true;
  const app = await worker(async () => { if (!online) throw Error(); return new Response('<body>current'); });
  await app.request('/visited/');
  const store = [...app.stores.values()][0];
  store.get('https://rosarium-tech.com/visited/').headers.set('x-rosarium-cached-at', String(Date.now() - 31 * 86400000));
  online = false;
  assert.equal((await app.request('/visited/')).status, 503);
  assert.equal(store.size, 0);
});
test('storage refusal preserves online browsing', async () => {
  const app = await worker(async () => new Response('<body>live'));
  app.caches.open = async () => { throw new Error('storage denied'); };
  assert.match(await (await app.request('/visited/')).text(), /live/);
});
test('hashed static images use cache first; ordinary diagrams check the network', async () => {
  let calls = 0;
  const app = await worker(async () => { calls++; return new Response(String(calls)); });
  assert.equal(await (await app.request('/assets/example.12345678.svg', 'cors')).text(), '1');
  assert.equal(await (await app.request('/assets/example.12345678.svg', 'cors')).text(), '1');
  assert.equal(await (await app.request('/diagrams/example.svg', 'cors')).text(), '2');
  assert.equal(await (await app.request('/diagrams/example.svg', 'cors')).text(), '3');
});
test('search query navigation falls back to canonical HTML without persisting search terms', async () => {
  let online = true;
  const app = await worker(async () => { if (!online) throw Error(); return new Response('<body>article'); });
  await app.request('/visited/?q=private-search&search=1');
  assert.deepEqual([...app.stores.values()][0].keys().toArray(), ['https://rosarium-tech.com/visited/']);
  online = false;
  assert.match(await (await app.request('/visited/?q=other&search=1')).text(), /data-pwa-offline/);
});
test('Pagefind timestamped entry uses network first and a canonical offline key', async () => {
  let online = true;
  const app = await worker(async () => { if (!online) throw Error(); return new Response('{"languages":{}}'); });
  await app.request('/pagefind/pagefind-entry.json?ts=123', 'cors');
  assert.deepEqual([...app.stores.values()][0].keys().toArray(), ['https://rosarium-tech.com/pagefind/pagefind-entry.json']);
  online = false;
  assert.equal(await (await app.request('/pagefind/pagefind-entry.json?ts=456', 'cors')).text(), '{"languages":{}}');
  assert.equal(app.request('/pagefind/pagefind-entry.json?secret=value', 'cors'), undefined);
});
