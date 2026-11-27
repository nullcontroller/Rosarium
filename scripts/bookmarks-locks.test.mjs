import test from "node:test";
import assert from "node:assert/strict";
import {
  BOOKMARK_KEY,
  BOOKMARK_LOCK,
  writeBookmarks,
  identityKey,
} from "../src/lib/bookmarks.mjs";
const initial = () => ({ schemaVersion: 1, site: "rosarium", items: [] });
const record = (id) => ({
  collection: "pages",
  id,
  title: id,
  url: `/${id}/`,
  canAdd: true,
});
function fixture() {
  let raw = JSON.stringify(initial()),
    tail = Promise.resolve();
  const calls = [];
  const storage = {
    getItem: () => raw,
    setItem: (k, v) => {
      assert.equal(k, BOOKMARK_KEY);
      raw = v;
    },
  };
  const env = {
    isSecureContext: true,
    navigator: {
      locks: {
        request(name, options, fn) {
          calls.push({ name, options });
          const result = tail.then(fn);
          tail = result.catch(() => {});
          return result;
        },
      },
    },
  };
  return { storage, env, calls, get: () => JSON.parse(raw) };
}
test("all mutation kinds share exclusive lock and re-read only after acquiring it", async () => {
  const f = fixture();
  await Promise.all([
    writeBookmarks(
      () => f.storage,
      { type: "add", record: record("test/a") },
      f.env,
    ),
    writeBookmarks(
      () => f.storage,
      { type: "add", record: record("test/b") },
      f.env,
    ),
  ]);
  assert.equal(f.get().items.length, 2);
  await Promise.all([
    writeBookmarks(
      () => f.storage,
      { type: "remove", key: identityKey(record("test/a")) },
      f.env,
    ),
    writeBookmarks(
      () => f.storage,
      { type: "add", record: record("test/c") },
      f.env,
    ),
  ]);
  assert.deepEqual(
    f.get().items.map((i) => i.id),
    ["test/b", "test/c"],
  );
  assert(
    f.calls.every(
      (c) => c.name === BOOKMARK_LOCK && c.options.mode === "exclusive",
    ),
  );
});
test("toggle decision is made from current data inside the lock, two toggles cancel", async () => {
  const f = fixture(),
    r = record("test/a");
  const toggle = (latest) =>
    latest.items.length
      ? { type: "remove", key: identityKey(r) }
      : { type: "add", record: r };
  await Promise.all([
    writeBookmarks(() => f.storage, toggle, f.env),
    writeBookmarks(() => f.storage, toggle, f.env),
  ]);
  assert.equal(f.get().items.length, 0);
});
test("two explicit additions of same identity are idempotent", async () => {
  const f = fixture(),
    op = { type: "add", record: record("test/a") };
  await Promise.all([
    writeBookmarks(() => f.storage, op, f.env),
    writeBookmarks(() => f.storage, op, f.env),
  ]);
  assert.equal(f.get().items.length, 1);
});
test("failed lock request does not read storage or fall back to unlocked writes", async () => {
  let access = 0;
  await assert.rejects(
    writeBookmarks(
      () => {
        access++;
        throw Error("must not run");
      },
      { type: "add", record: record("test/a") },
      {
        isSecureContext: true,
        navigator: {
          locks: { request: () => Promise.reject(Error("denied")) },
        },
      },
    ),
    /排他制御/,
  );
  assert.equal(access, 0);
});
test("storage failures propagate without unlocked retry", async () => {
  const f = fixture();
  let writes = 0;
  f.storage.setItem = () => {
    writes++;
    throw Error("quota");
  };
  await assert.rejects(
    writeBookmarks(
      () => f.storage,
      { type: "add", record: record("test/a") },
      f.env,
    ),
    /保存できません/,
  );
  assert.equal(writes, 1);
  assert.equal(f.get().items.length, 0);
  await assert.rejects(
    writeBookmarks(
      () => {
        throw Error("denied");
      },
      { type: "add", record: record("test/b") },
      f.env,
    ),
    /denied/,
  );
});
test("missing locks or insecure contexts explicitly use the synchronous fallback", async () => {
  for (const env of [
    { isSecureContext: true, navigator: {} },
    {
      isSecureContext: false,
      navigator: {
        locks: {
          request() {
            throw Error("unreachable");
          },
        },
      },
    },
  ]) {
    const f = fixture();
    await writeBookmarks(
      () => f.storage,
      { type: "add", record: record("test/a") },
      env,
    );
    assert.equal(f.get().items.length, 1);
  }
});
