import { load } from "cheerio";

// Exclude explicitly named navigation sections from the rendered body.
// Ordinary prose references remain intact; excluded links are never reinserted.
const relatedHeading = /^(?:Related Design Principles|Related Design|今回の実務事例|Case Studies|関連する実践事例|関連事例|関連Case|関連する入口|関連する設計(?:原則|知識)?|関連する記事・設計|関連する内容|関連ページ|関連Reference|次に読む|Explore|Selected Work|Professional Profile)$/;
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

