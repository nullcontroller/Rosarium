import { load } from "cheerio";

// Only explicitly named navigation sections are moved. Prose links stay intact.
const relatedHeading = /^(?:Related Design Principles|Related Design|関連する入口|関連する設計(?:原則|知識)?|関連する記事・設計|関連する内容|関連ページ|関連Reference|次に読む|Explore|Selected Work|Professional Profile)$/;
export function splitRelatedContent(html) {
  const $ = load(html, null, false);
  const related = [];
  for (const node of $.root().children("h2,h3").toArray()) {
    const heading = $(node);
    if (!relatedHeading.test(heading.text().trim())) continue;
    const depth = Number(node.tagName.slice(1));
    const section = [node];
    for (const sibling of heading.nextAll().toArray()) {
      if (/^h[1-6]$/.test(sibling.tagName || "") && Number(sibling.tagName.slice(1)) <= depth) break;
      section.push(sibling);
    }
    const label = heading.text().trim();
    if (label === "Related Design Principles") heading.text("関連する設計原則");
    if (label === "Related Design") heading.text("関連する設計");
    related.push(section.map((item) => $.html(item)).join(""));
    section.forEach((item) => $(item).remove());
  }
  if (related.length) $.root().children().last().filter("hr").remove();
  const relatedHtml = load(related.join(""), null, false);
  // Career cards used to link the same Case in both title and CTA.
  relatedHtml(".career-work").each((_, node) => {
    const card = relatedHtml(node);
    const titleTarget = card.find("h3 a").attr("href");
    card.find("p > a.career-inline-cta").each((_, link) => {
      if (relatedHtml(link).attr("href") === titleTarget) relatedHtml(link).parent().remove();
    });
  });
  const principleSections = [];
  relatedHtml("h2,h3").each((_, node) => {
    const heading = relatedHtml(node);
    if (heading.text().trim() !== "関連する設計原則") return;
    const nodes = [node];
    for (const sibling of heading.nextAll().toArray()) {
      if (/^h[1-3]$/.test(sibling.tagName || "")) break;
      nodes.push(sibling);
    }
    principleSections.push(nodes.map((item) => relatedHtml.html(item)).join(""));
    nodes.forEach((item) => relatedHtml(item).remove());
  });
  const principles = principleSections.join("");
  const afterDesign = relatedHtml.html();
  return { body: $.html(), related: principles + afterDesign, principles, afterDesign };
}
export function relatedTargets(html, pageUrl) {
  const $ = load(html, null, false);
  return new Set($("a[href]").toArray().map((node) => new URL($(node).attr("href"), pageUrl).href));
}

// Explicit prose links are candidates; keep the reading exit small and unique.
export function compactRelatedLinks(html, preferred, pageUrl, fallback) {
  const $ = load(html, null, false);
  const candidates = [
    ...preferred,
    ...$("a[href]").toArray().map((node) => ({ href: $(node).attr("href"), title: $(node).text().trim() })),
    ...fallback,
  ];
  const seen = new Set([new URL(pageUrl).href]);
  const links = [];
  for (const link of candidates) {
    const target = new URL(link.href, pageUrl);
    if (!/^https?:$/.test(target.protocol) || seen.has(target.href) || !link.title) continue;
    seen.add(target.href);
    links.push({ ...link, title: link.title.replace(/\s*→$/, "").trim(), href: target.pathname.startsWith("/Rosarium/") && target.origin === new URL(pageUrl).origin ? target.pathname + target.hash : target.href });
    if (links.length === 4) break;
  }
  return { links, anchors: $("[id]").toArray().map((node) => $(node).attr("id")) };
}

export function careerCaseLinks(html) {
  const $ = load(html, null, false);
  return $(".career-work").toArray().map((node) => ({
    href: $(node).find("h3 a").attr("href"),
    title: $(node).find("h3 a").text().replace(/\s*→$/, "").trim(),
    summary: $(node).find("p:not(.eyebrow)").first().text().split("。")[0] + "。",
  })).filter((link) => link.href).slice(0, 3);
}
