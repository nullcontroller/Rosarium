import { load } from "cheerio";

/** @typedef {{depth: number, slug: string, text: string}} Heading */

/**
 * Extract reading navigation from the rendered body, never from a route name.
 * Existing ids and curated index targets remain authoritative.
 * @param {string} html
 * @param {{headings?: Heading[], mode?: "auto" | "never" | "always"}} options
 */
export function pageContents(html, { headings = [], mode = "auto" } = {}) {
  const $ = load(html, {}, false);
  const excluded = "nav, aside, [hidden], [aria-hidden='true'], [data-toc-exclude]";
  const nodes = $("h2,h3").filter((_, node) => !$(node).closest(excluded).length);
  const majorCount = nodes.filter("h2").length;
  if (mode === "never") return { html, headings: [], majorCount, entryCount: 0, reason: "explicit-exclusion" };

  const readingText = $.root().clone();
  readingText.find("script,style,nav,aside,[hidden],[aria-hidden='true']").remove();
  const longSections = nodes.filter("h3").length >= 2 && readingText.text().replace(/\s/g, "").length >= 1000;
  const used = new Set($("[id]").map((_, node) => $(node).attr("id")).get());
  const uniqueId = (base) => {
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    return id;
  };
  /** @type {Heading[]} */
  const extracted = [];
  const entryIds = new Set();
  nodes.each((_, node) => {
    const heading = $(node);
    const copy = heading.clone();
    copy.find("small,[hidden],[aria-hidden='true']").remove();
    const text = (heading.attr("data-toc-label") ?? copy.text()).replace(/\s+/g, " ").trim();
    if (!text) return;
    const entry = heading.closest("[data-content-id],[data-history-id],[data-growth-entry]");
    const entryId = entry.attr("data-content-id") ?? entry.attr("data-history-id") ?? entry.find("time").first().attr("datetime");
    if (entryId) entryIds.add(entryId);
    let slug = heading.attr("id");
    if (!slug) {
      const labelSlug = text.normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-+|-+$/g, "");
      slug = uniqueId(entryId ? `toc-entry-${entryId}` : `toc-${labelSlug || "section"}`);
      heading.attr("id", slug);
    }
    heading.attr("data-toc-target", "");
    const parentSection = heading.parents("section").first();
    const hasParentHeading = entry.length && parentSection.find("h2").first().get(0) !== node && parentSection.find("h2").length > 0;
    const depth = hasParentHeading ? 3 : node.tagName === "h2" || majorCount === 0 ? 2 : 3;
    extracted.push({ depth, slug, text });
  });

  // Existing metadata-generated index links may point at a card wrapper or h1.
  const ids = new Set($("[id]").map((_, node) => $(node).attr("id")).get());
  const curated = headings.filter((heading) => heading.depth >= 2 && heading.depth <= 3 && ids.has(heading.slug));
  const candidates = curated.length ? curated : extracted;
  const useful = mode === "always" || majorCount >= 2 || entryIds.size >= 2 || longSections;
  const selected = useful ? candidates.map((heading) => ({ ...heading, depth: majorCount === 0 ? 2 : heading.depth })) : [];
  for (const heading of selected) $("[id]").filter((_, node) => $(node).attr("id") === heading.slug).attr("data-toc-target", "");
  return {
    html: $.html(), headings: selected, majorCount, entryCount: entryIds.size,
    reason: selected.length ? (mode === "always" ? "explicit-index" : majorCount >= 2 ? "multiple-h2" : entryIds.size >= 2 ? "multiple-list-entries" : "long-page-sections") : "short-page",
  };
}

/** Place shared reading controls after the title; metadata occupies one prelude. */
export function pageOpening(html, headings = [], bookNavigation, { expanded = false } = {}) {
  const $ = load(html, {}, false);
  const breadcrumb = $(".breadcrumb").first();
  const breadcrumbHtml = breadcrumb.length ? $.html(breadcrumb) : "";
  breadcrumb.remove();
  const controls = [];
  if (bookNavigation?.items.length) {
    const detail = $('<details class="book-toc-mobile"><summary></summary><ol></ol></details>');
    detail.find('summary').text('このBookの目次（全' + bookNavigation.chapterCount + '章）');
    for (const item of bookNavigation.items) {
      const li = $('<li></li>').toggleClass('current', !!item.current);
      const link = $('<a></a>').attr('href', item.href).text(item.title);
      if (item.current) link.attr('aria-current', 'page');
      li.append(link); detail.find('ol').append(li);
    }
    controls.push(detail);
  }
  if (headings.length) {
    const detail = $('<details class="book-toc-mobile" data-page-heading-toc><summary>目次</summary><ol></ol></details>');
    if (expanded) detail.attr("open", "");
    for (const heading of headings) detail.find('ol').append($('<li></li>').toggleClass('sub', heading.depth === 3).append($('<a></a>').attr('href', '#' + heading.slug).text(heading.text)));
    controls.push(detail);
  }
  const opening = $('.page-heading,.document-header,.hero,.document-title-row').first();
  if (opening.length) opening.after(...controls);
  else if (controls.length) $('h1').first().after(...controls);
  return {html: $.html(), breadcrumbHtml};
}
