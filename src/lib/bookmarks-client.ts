import {
  BOOKMARK_KEY,
  emptyBookmarks,
  readBookmarks,
  writeBookmarks,
  identityKey,
  resolveBookmark,
} from "./bookmarks.mjs";
type Saved = ReturnType<typeof readBookmarks>;
type Catalog = { schemaVersion: number; site: string; records: any[] };
export function mountBookmarks() {
  const dialog = document.querySelector<HTMLDialogElement>("#bookmark-panel");
  if (!dialog || dialog.dataset.mounted) return;
  dialog.dataset.mounted = "true";
  const panel = dialog,
    openers = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-bookmarks-open]"),
    );
  const toggles = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-bookmark-toggle]"),
  );
  const list = panel.querySelector<HTMLElement>("[data-bookmark-list]")!;
  const feedback = document.querySelector<HTMLElement>(
    "[data-bookmark-message]",
  )!;
  const panelFeedback = panel.querySelector<HTMLElement>(
    "[data-bookmark-panel-message]",
  )!;
  let current: Saved = emptyBookmarks(),
    readable = true,
    catalog: Catalog | undefined,
    loading: Promise<Catalog> | undefined,
    returnFocus: HTMLElement | null = null;
  const notify = (message: string) => {
    feedback.textContent = "";
    panelFeedback.textContent = "";
    (panel.open ? panelFeedback : feedback).textContent = message;
  };
  const error = (reason: unknown) =>
    notify(
      reason instanceof Error
        ? reason.message
        : "操作できませんでした。既存データは変更していません。",
    );
  function refresh() {
    try {
      current = readBookmarks(window.localStorage);
      readable = true;
    } catch (reason) {
      readable = false;
      error(reason);
    }
    for (const button of toggles) {
      const saved = current.items.some(
        (item: any) =>
          identityKey(item) ===
          identityKey({
            collection: button.dataset.bookmarkCollection,
            id: button.dataset.bookmarkId,
          }),
      );
      button.setAttribute("aria-pressed", String(saved));
      button.setAttribute(
        "aria-label",
        saved ? "記事のブックマークを解除" : "記事をブックマークに登録",
      );
      button.title = saved ? "ブックマークを解除" : "ブックマークに登録";
    }
    if (panel.open) renderList();
  }
  async function getCatalog(): Promise<Catalog> {
    if (catalog) return catalog;
    if (!loading)
      loading = fetch("/bookmarks.json", {
        credentials: "omit",
        cache: "no-cache",
      })
        .then(async (response) => {
          if (!response.ok)
            throw new Error(
              "記事情報を読み込めませんでした。後でもう一度お試しください。",
            );
          const data = await response.json();
          if (
            data.schemaVersion !== 1 ||
            data.site !== "rosarium" ||
            !Array.isArray(data.records)
          )
            throw new Error("記事情報の形式を確認できません。");
          catalog = data;
          return data;
        })
        .catch((reason) => {
          loading = undefined;
          throw reason;
        });
    return loading;
  }
  function make<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function renderList() {
    list.replaceChildren();
    if (!readable) {
      list.append(
        make("p", "保存内容を読み取れません。既存データは変更していません。"),
      );
      return;
    }
    if (!current.items.length) {
      list.append(
        make(
          "p",
          "まだブックマークはありません。記事タイトル付近のアイコンから登録できます。",
        ),
      );
      return;
    }
    if (!catalog) {
      list.append(make("p", "記事情報を読み込んでいます。"));
      return;
    }
    const groups = new Map<string, { title: string; items: any[] }>();
    for (const item of [...current.items].sort((a: any, b: any) =>
      b.addedAt.localeCompare(a.addedAt),
    )) {
      const resolved = resolveBookmark(item, catalog);
      if (!groups.has(resolved.category))
        groups.set(resolved.category, {
          title: resolved.categoryLabel,
          items: [],
        });
      groups.get(resolved.category)!.items.push({ item, resolved });
    }
    for (const group of groups.values()) {
      const section = make("section"),
        heading = make("h3", group.title),
        ul = make("ul");
      section.append(heading, ul);
      for (const { item, resolved } of group.items) {
        const li = make("li"),
          info = make("div");
        if (resolved.url && /^\/(?!\/)/.test(resolved.url)) {
          const link = make("a", resolved.title);
          link.href = resolved.url;
          info.append(link);
        } else info.append(make("span", resolved.title));
        if (resolved.state) info.append(make("p", resolved.state));
        const remove = make("button", "解除");
        remove.type = "button";
        remove.setAttribute(
          "aria-label",
          `${resolved.title}のブックマークを解除`,
        );
        remove.dataset.bookmarkRemove = identityKey(item);
        remove.addEventListener("click", async () => {
          remove.disabled = true;
          try {
            current = (
              await writeBookmarks(() => window.localStorage, {
                type: "remove",
                key: identityKey(item),
              })
            ).data;
            refresh();
            notify("ブックマークを解除しました。");
            (
              list.querySelector<HTMLButtonElement>("button") ??
              panel.querySelector<HTMLButtonElement>("[data-bookmarks-close]")
            )?.focus();
          } catch (reason) {
            error(reason);
          } finally {
            remove.disabled = false;
          }
        });
        li.append(info, remove);
        ul.append(li);
      }
      list.append(section);
    }
  }
  for (const opener of openers)
    opener.addEventListener("click", async () => {
      const mobileMenu = opener.closest<HTMLDetailsElement>(
        "[data-mobile-navigation]",
      );
      returnFocus = mobileMenu?.querySelector<HTMLElement>("summary") ?? opener;
      if (mobileMenu) mobileMenu.open = false;
      feedback.textContent = "";
      panelFeedback.textContent = "";
      if (!panel.open) panel.showModal();
      openers.forEach((button) => button.setAttribute("aria-expanded", "true"));
      refresh();
      panel.querySelector<HTMLButtonElement>("[data-bookmarks-close]")?.focus();
      try {
        await getCatalog();
        renderList();
      } catch (reason) {
        error(reason);
      }
    });
  panel
    .querySelector("[data-bookmarks-close]")!
    .addEventListener("click", () => panel.close());
  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      panel.close();
      return;
    }
    if (event.key !== "Tab") return;
    const controls = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href],button:not(:disabled),input:not(:disabled),[tabindex="0"]',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    const first = controls[0],
      last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  panel.addEventListener("close", () => {
    openers.forEach((button) => button.setAttribute("aria-expanded", "false"));
    returnFocus?.focus();
  });
  panel.addEventListener("click", (event) => {
    const r = panel.getBoundingClientRect();
    if (
      event.target === panel &&
      (event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom)
    )
      panel.close();
  });
  for (const button of toggles)
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        const data = await getCatalog(),
          address = {
            collection: button.dataset.bookmarkCollection,
            id: button.dataset.bookmarkId,
          };
        const record = data.records.find(
          (record) => identityKey(record) === identityKey(address),
        );
        const result = await writeBookmarks(
          () => window.localStorage,
          (latest: Saved) =>
            latest.items.some(
              (item: any) => identityKey(item) === identityKey(address),
            )
              ? { type: "remove", key: identityKey(address) }
              : { type: "add", record },
        );
        current = result.data;
        refresh();
        notify(
          result.actionType === "remove"
            ? "ブックマークを解除しました。"
            : "ブックマークを保存しました。",
        );
      } catch (reason) {
        error(reason);
      } finally {
        button.disabled = false;
      }
    });
  window.addEventListener("storage", (event) => {
    if (event.key === BOOKMARK_KEY || event.key === null) refresh();
  });
  refresh();
  [...openers, ...toggles].forEach((button) => (button.disabled = false));
}
