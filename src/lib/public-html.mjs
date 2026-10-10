import { load } from "cheerio";

export const normalizeSourceUrl = (value) => {
  try {
    const u = new URL(value);
    return decodeURIComponent(u.origin + u.pathname).replace(/\/$/, "");
  } catch {
    return value;
  }
};
export const hiddenRoutes = [
  "/project",
  "/tools",
  "/authoring",
  "/foundations/wiki-overview",
  "/foundations/design-system-overview",
];
export function publicHtml(html, sourceLinks = new Map()) {
  const $ = load(html, null, false);
  $("[href], [src], [srcset]").each((_, element) => {
    const node = $(element);
    for (const attribute of ["href", "src", "srcset"]) {
      const value = node.attr(attribute);
      if (value === undefined) continue;
      node.attr(attribute, value
        .replace(/https:\/\/(?:nullcontroller\.github\.io|rosarium-tech\.com)\/Rosarium(?=\/|$)/g, "https://rosarium-tech.com")
        .replace(/(^|[\s,])\/Rosarium(?=\/|$)/g, "$1") || "/");
    }
  });
  $("a[href]").each((_, element) => {
    const a = $(element),
      href = a.attr("href");
    const normalized = normalizeSourceUrl(href);
    let target;
    try {
      target = new URL(href, "https://rosarium-tech.com");
    } catch {
      return;
    }
    const isCareer =
      target.hostname === "nullcontroller.github.io" &&
      /^\/career-profile(?:\/|$)/.test(target.pathname);
    const externalSource =
      /(^|\.)github\.com$/.test(target.hostname) ||
      /(^|\.)zenn\.dev$/.test(target.hostname);
    const internalPath = target.pathname
      .replace(/^\/Rosarium/, "")
      .replace(/\/$/, "");
    const hidden =
      ["rosarium-tech.com", "nullcontroller.github.io"].includes(target.hostname) &&
      hiddenRoutes.some(
        (path) => internalPath === path || internalPath.startsWith(path + "/"),
      );
    if (hidden) {
      a.replaceWith(a.contents());
      return;
    }
    if (isCareer) {
      a.attr("href", "/career/");
    } else if (externalSource) {
      const replacement = sourceLinks.get(normalized);
      if (replacement) a.attr("href", replacement);
      else a.replaceWith(a.contents());
    }
  });
  return $.html();
}
