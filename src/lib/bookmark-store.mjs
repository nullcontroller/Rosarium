import {
  BOOKMARK_KEY,
  LIMITS,
  BookmarkError,
  parseBookmarks,
  bookmarkForRecord,
} from "./bookmarks.mjs";
export const BOOKMARK_DB = "rosarium.bookmarks";
export const BOOKMARK_DB_VERSION = 1;
export const MIGRATION_KEY = "legacy-local-storage-v1";
export const BOOKMARK_CHANNEL = "rosarium.bookmarks.changed";
const storageError = (reason) =>
  reason instanceof BookmarkError
    ? reason
    : new BookmarkError(
        reason?.name === "QuotaExceededError"
          ? "保存容量が足りません。既存データは変更していません。"
          : "保存内容を利用できません。ブラウザーの設定を確認し、もう一度お試しください。",
      );
/** IndexedDB is the only authoritative store. Broadcasts contain no bookmark data. */
export function createBookmarkStore(environment = globalThis) {
  let opening, connection, migration;
  /** @type {Set<() => void>} */
  const listeners = new Set();
  let channel;
  try {
    if (typeof environment.BroadcastChannel === "function")
      channel = new environment.BroadcastChannel(BOOKMARK_CHANNEL);
  } catch {}
  if (channel)
    channel.onmessage = (event) => {
      if (event.data?.type === "changed")
        for (const listener of listeners) listener();
    };
  const notify = () => {
    try {
      channel?.postMessage({ type: "changed" });
    } catch {
      /* Visibility/focus refresh remains available. */
    }
  };
  /** @returns {Promise<IDBDatabase>} */
  function open() {
    if (opening) return opening;
    opening = new Promise((resolve, reject) => {
      let request,
        settled = false;
      const fail = (reason) => {
        if (settled) return;
        settled = true;
        reject(storageError(reason));
      };
      try {
        request = environment.indexedDB.open(BOOKMARK_DB, BOOKMARK_DB_VERSION);
      } catch (reason) {
        fail(reason);
        return;
      }
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore("bookmarks", { keyPath: ["collection", "id"] });
        db.createObjectStore("meta", { keyPath: "key" });
      };
      request.onerror = () => fail(request.error);
      request.onblocked = () =>
        fail(
          new BookmarkError(
            "保存領域を開けません。別のRosariumタブを閉じ、もう一度お試しください。",
          ),
        );
      request.onsuccess = () => {
        const db = request.result;
        if (settled) {
          db.close();
          return;
        }
        settled = true;
        connection = db;
        db.onversionchange = () => {
          db.close();
          connection = undefined;
          opening = undefined;
          migration = undefined;
        };
        resolve(db);
      };
    }).catch((reason) => {
      opening = undefined;
      throw reason;
    });
    return opening;
  }
  // Register transaction handlers before queuing requests. Only oncomplete resolves success.
  /** @returns {Promise<any>} */
  function transaction(db, stores, mode, work) {
    return new Promise((resolve, reject) => {
      let tx, result, reason;
      try {
        tx = db.transaction(stores, mode);
      } catch (error) {
        reject(storageError(error));
        return;
      }
      const abort = (error) => {
        reason = error;
        try {
          tx.abort();
        } catch {
          reject(storageError(reason));
        }
      };
      tx.oncomplete = () => resolve(result);
      tx.onabort = () =>
        reject(
          storageError(reason ?? tx.error ?? new Error("Transaction aborted")),
        );
      tx.onerror = () => {
        reason ??= tx.error;
      }; // Do not prevent the default request error/abort.
      try {
        work(
          tx,
          (value) => {
            result = value;
          },
          abort,
        );
      } catch (error) {
        abort(error);
      }
    });
  }
  async function ready() {
    const db = await open();
    if (!migration)
      migration = transaction(
        db,
        ["meta", "bookmarks"],
        "readwrite",
        (tx, done, abort) => {
          const meta = tx.objectStore("meta"),
            items = tx.objectStore("bookmarks"),
            marker = meta.get(MIGRATION_KEY);
          marker.onsuccess = () => {
            try {
              if (marker.result) return;
              // Read legacy bytes only when this serialized transaction has no completion marker.
              const raw = environment.localStorage.getItem(BOOKMARK_KEY);
              const legacy = raw === null ? [] : parseBookmarks(raw).items;
              for (const item of legacy) {
                const existing = items.get([item.collection, item.id]);
                existing.onsuccess = () => {
                  try {
                    if (!existing.result) items.add(item);
                  } catch (reason) {
                    abort(reason);
                  }
                };
              }
              meta.put({
                key: MIGRATION_KEY,
                completedAt: new Date().toISOString(),
                legacyPresent: raw !== null,
              });
            } catch (reason) {
              abort(reason);
            }
          };
          done(undefined);
        },
      ).catch((reason) => {
        migration = undefined;
        throw reason;
      });
    await migration;
    return db;
  }
  return {
    /** @returns {Promise<Array<{collection:string,id:string,addedAt:string,titleSnapshot?:string,urlSnapshot?:string}>>} */
    async read() {
      const db = await ready();
      return transaction(db, ["bookmarks"], "readonly", (tx, done) => {
        const request = tx.objectStore("bookmarks").getAll();
        request.onsuccess = () => done(request.result);
      });
    },
    /** @returns {Promise<{actionType:'add'|'remove'}>} */
    async mutate(action) {
      const db = await ready();
      const result = await transaction(
        db,
        ["bookmarks"],
        "readwrite",
        (tx, done, abort) => {
          const store = tx.objectStore("bookmarks");
          const address =
            action.type === "remove" ? action.address : action.record;
          if (!address || !["add", "remove", "toggle"].includes(action.type))
            throw new BookmarkError("対応していない操作です。");
          const key = [address.collection, address.id],
            request = store.get(key);
          request.onsuccess = () => {
            try {
              if (
                action.type === "remove" ||
                (action.type === "toggle" && request.result)
              ) {
                store.delete(key);
                done({ actionType: "remove" });
                return;
              }
              if (request.result) {
                done({ actionType: "add" });
                return;
              }
              const item = bookmarkForRecord(action.record),
                count = store.count();
              count.onsuccess = () => {
                try {
                  if (count.result >= LIMITS.items) {
                    abort(
                      new BookmarkError(
                        "保存件数の上限に達しました。不要なブックマークを解除してください。",
                      ),
                    );
                    return;
                  }
                  store.add(item);
                  done({ actionType: "add" });
                } catch (reason) {
                  abort(reason);
                }
              };
            } catch (reason) {
              abort(reason);
            }
          };
        },
      );
      notify();
      return result;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    close() {
      channel?.close();
      connection?.close();
      connection = undefined;
      opening = undefined;
      migration = undefined;
      listeners.clear();
    },
  };
}
