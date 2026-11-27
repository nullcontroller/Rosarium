export const BOOKMARK_KEY = "rosarium.bookmarks";
export const LIMITS = Object.freeze({
  bytes: 1024 * 1024,
  items: 2000,
  id: 256,
  title: 400,
  url: 2048,
});
export class BookmarkError extends Error {
  constructor(message) {
    super(message);
    this.name = "BookmarkError";
  }
}
export const identityKey = (item) => JSON.stringify([item.collection, item.id]);
export const emptyBookmarks = () => ({
  schemaVersion: 1,
  site: "rosarium",
  items: [],
});
const fail = (message) => {
  throw new BookmarkError(message);
};
const ownKeys = (value, allowed) =>
  Object.keys(value).every((key) => allowed.includes(key));
const plain = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
export function parseBookmarks(text) {
  if (
    typeof text !== "string" ||
    new TextEncoder().encode(text).length > LIMITS.bytes
  )
    fail("ファイルが大きすぎます。1MB以内にしてください。");
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    fail("保存データまたはJSONが壊れています。既存データは変更していません。");
  }
  if (
    !plain(data) ||
    data.schemaVersion !== 1 ||
    data.site !== "rosarium" ||
    !Array.isArray(data.items) ||
    !ownKeys(data, ["schemaVersion", "site", "items"])
  )
    fail(
      "対応していない保存形式です。schemaVersion 1のRosariumデータを指定してください。",
    );
  if (data.items.length > LIMITS.items)
    fail("項目数が多すぎます。2000件以内にしてください。");
  const items = [],
    seen = new Set();
  for (const item of data.items) {
    if (
      !plain(item) ||
      !ownKeys(item, [
        "collection",
        "id",
        "addedAt",
        "titleSnapshot",
        "urlSnapshot",
      ])
    )
      fail("項目の形式を確認してください。");
    if (
      typeof item.collection !== "string" ||
      !/^[a-z][a-z0-9-]{0,31}$/.test(item.collection) ||
      typeof item.id !== "string" ||
      item.id.length > LIMITS.id ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(item.id)
    )
      fail("記事IDまたはcollectionの形式が正しくありません。");
    if (
      typeof item.addedAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(
        item.addedAt,
      ) ||
      !Number.isFinite(Date.parse(item.addedAt)) ||
      new Date(item.addedAt).toISOString().slice(0, 19) !==
        item.addedAt.slice(0, 19)
    )
      fail("登録日時の形式が正しくありません。");
    if (
      item.titleSnapshot !== undefined &&
      (typeof item.titleSnapshot !== "string" ||
        !item.titleSnapshot.trim() ||
        item.titleSnapshot.length > LIMITS.title)
    )
      fail("タイトルの形式または長さが正しくありません。");
    if (item.urlSnapshot !== undefined) {
      if (
        typeof item.urlSnapshot !== "string" ||
        item.urlSnapshot.length > LIMITS.url
      )
        fail("URLの形式または長さが正しくありません。");
      let u;
      try {
        u = new URL(item.urlSnapshot);
      } catch {
        fail("URLの形式が正しくありません。");
      }
      if (
        u.protocol !== "https:" ||
        u.username ||
        u.password ||
        !(
          u.origin === "https://rosarium-tech.com" ||
          (u.origin === "https://nullcontroller.github.io" &&
            u.pathname.startsWith("/Rosarium/"))
        )
      )
        fail("保存URLはRosarium内のHTTPS URLに限定しています。");
    }
    const clean = {
      collection: item.collection,
      id: item.id,
      addedAt: item.addedAt,
      ...(item.titleSnapshot !== undefined
        ? { titleSnapshot: item.titleSnapshot }
        : {}),
      ...(item.urlSnapshot !== undefined
        ? { urlSnapshot: item.urlSnapshot }
        : {}),
    };
    const key = identityKey(clean);
    if (!seen.has(key)) {
      items.push(clean);
      seen.add(key);
    }
  }
  return { schemaVersion: 1, site: "rosarium", items };
}
export function readBookmarks(storage) {
  let raw;
  try {
    raw = storage.getItem(BOOKMARK_KEY);
  } catch {
    fail(
      "このブラウザーでは保存内容を読み取れません。設定を確認してください。",
    );
  }
  return raw === null ? emptyBookmarks() : parseBookmarks(raw);
}
/** Re-read immediately before every write. setItem failure never triggers a success state. */
export function changeBookmarks(storage, action) {
  const latest = readBookmarks(storage);
  let next;
  if (action.type === "add") {
    if (!action.record?.canAdd)
      fail("この記事は新規登録の対象ではありません。");
    const record = action.record,
      key = identityKey(record);
    next = {
      ...latest,
      items: latest.items.some((item) => identityKey(item) === key)
        ? latest.items
        : [
            ...latest.items,
            {
              collection: record.collection,
              id: record.id,
              addedAt: new Date().toISOString(),
              titleSnapshot: record.title,
              urlSnapshot: new URL(record.url, "https://rosarium-tech.com")
                .href,
            },
          ],
    };
  } else if (action.type === "remove")
    next = {
      ...latest,
      items: latest.items.filter((item) => identityKey(item) !== action.key),
    };
  else if (action.type === "merge") {
    const incoming = parseBookmarks(JSON.stringify(action.data));
    const keys = new Set(latest.items.map(identityKey));
    next = {
      ...latest,
      items: [
        ...latest.items,
        ...incoming.items.filter((item) => {
          const key = identityKey(item);
          if (keys.has(key)) return false;
          keys.add(key);
          return true;
        }),
      ],
    };
  } else fail("対応していない操作です。");
  const serialized = JSON.stringify(next);
  const validated = parseBookmarks(serialized);
  try {
    storage.setItem(BOOKMARK_KEY, serialized);
  } catch {
    fail(
      "保存できませんでした。容量やブラウザー設定を確認してください。既存データは変更していません。",
    );
  }
  return validated;
}
export function resolveBookmark(item, catalog) {
  const record = catalog.records.find(
    (record) => identityKey(record) === identityKey(item),
  );
  if (!record || record.resolution === "unavailable")
    return {
      title: record?.title ?? item.titleSnapshot ?? "保存した記事",
      url: null,
      category: "unavailable",
      categoryLabel: "現在利用できない記事",
      state: "現在利用できない",
    };
  if (record.successor)
    return {
      title: record.successor.title,
      url: record.successor.url,
      category: record.successor.category,
      categoryLabel: record.successor.categoryLabel,
      state: "統合・移転済み",
    };
  return {
    title: record.title,
    url: record.url,
    category: record.category,
    categoryLabel: record.categoryLabel,
    state:
      record.lifecycle === "retired"
        ? "退役記事"
        : record.lifecycle === "obsolete"
          ? "旧記事"
          : "",
  };
}
