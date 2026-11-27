/** Shared catalogue selection: identity comes from Collections, never from titles or categories. */
import { compatibilityUrls } from "../data/compatibility-urls.mjs";
import { primaryDomain, domainLabels } from "../data/knowledge-domains.mjs";
export const isBookmarkable = (entry, redirects = compatibilityUrls) =>
  entry.collection === "pages" &&
  entry.data.public !== false &&
  ["published", "stable"].includes(entry.data.status) &&
  (entry.data.lifecycle ?? "active") === "active" &&
  !redirects.some((r) => r.from === `/${entry.id}/`);
export function buildBookmarkCatalog(entries, redirects = compatibilityUrls) {
  const published = entries.filter(
    (e) =>
      e.collection === "pages" &&
      e.data.public !== false &&
      e.data.status !== "draft",
  );
  const byRoute = new Map(published.map((e) => [`/${e.id}/`, e]));
  const redirected = new Map(redirects.map((r) => [r.from, r]));
  const records = published.map((entry) => {
    const route = `/${entry.id}/`,
      redirect = redirected.get(route);
    const target = redirect
      ? byRoute.get(new URL(redirect.to, "https://rosarium-tech.com").pathname)
      : undefined;
    const successor =
      redirect?.disposition === "簡素化" &&
      target &&
      !redirected.has(`/${target.id}/`)
        ? {
            collection: "pages",
            id: target.id,
            title: target.data.title,
            url: `/${target.id}/`,
            category: primaryDomain(target),
            categoryLabel: domainLabels[primaryDomain(target)],
          }
        : undefined;
    return {
      collection: "pages",
      id: entry.id,
      title: entry.data.title,
      url: redirect ? null : route,
      category: primaryDomain(entry),
      categoryLabel: domainLabels[primaryDomain(entry)],
      lifecycle: entry.data.lifecycle ?? "active",
      canAdd: isBookmarkable(entry, redirects),
      resolution: redirect
        ? successor
          ? "integrated"
          : "unavailable"
        : "direct",
      ...(successor ? { successor } : {}),
    };
  });
  // Explicit article targets can resolve legacy saves even when the original manuscript is no longer present.
  for (const redirect of redirects) {
    if (redirect.disposition !== "簡素化" || byRoute.has(redirect.from))
      continue;
    const target = byRoute.get(
      new URL(redirect.to, "https://rosarium-tech.com").pathname,
    );
    if (!target || redirected.has(`/${target.id}/`)) continue;
    records.push({
      collection: "pages",
      id: redirect.from.slice(1, -1),
      title: "保存した記事",
      url: null,
      category: primaryDomain(target),
      categoryLabel: domainLabels[primaryDomain(target)],
      lifecycle: "retired",
      canAdd: false,
      resolution: "integrated",
      successor: {
        collection: "pages",
        id: target.id,
        title: target.data.title,
        url: `/${target.id}/`,
        category: primaryDomain(target),
        categoryLabel: domainLabels[primaryDomain(target)],
      },
    });
  }
  return { schemaVersion: 1, site: "rosarium", records };
}
