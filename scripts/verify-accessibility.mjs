import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });

let pages = 0;
let images = 0;
for (const file of walk("dist").filter((name) => name.endsWith(".html") && !name.endsWith("google57af630fc0ce16af.html"))) {
  const $ = load(fs.readFileSync(file, "utf8"));
  pages++;
  assert.equal($("html").attr("lang"), "ja", `Document language: ${file}`);
  assert.equal($('.skip[href="#main"]').length, 1, `Skip link: ${file}`);
  assert.equal($("main#main").length, 1, `Main landmark: ${file}`);
  assert.equal($("h1").length, 1, `One page heading: ${file}`);
  assert.equal(
    $("[tabindex]").filter(
      (_, element) => Number($(element).attr("tabindex")) > 0,
    ).length,
    0,
    `Positive tabindex: ${file}`,
  );
  let previousHeading = 0;
  $("main h1,main h2,main h3,main h4,main h5,main h6").each((_, element) => {
    if ($(element).closest("nav,aside,[hidden],[aria-hidden='true']").length) return;
    const level = Number(element.tagName.slice(1));
    assert(previousHeading === 0 || level <= previousHeading + 1, `Heading level skipped: ${file}: ${$(element).text()}`);
    previousHeading = level;
  });
  const ids = $("[id]")
    .map((_, element) => $(element).attr("id"))
    .get();
  assert.equal(new Set(ids).size, ids.length, `Duplicate id: ${file}`);
  $("img").each((_, element) => {
    images++;
    const image = $(element);
    assert.notEqual(image.attr("alt"), undefined, `Image alt: ${file}`);
    if (!String(image.attr("src")).endsWith(".svg")) {
      assert.ok(image.attr("width"), `Image width: ${file}`);
      assert.ok(image.attr("height"), `Image height: ${file}`);
    }
  });
  $("button").each((_, element) => {
    const button = $(element);
    assert.ok(
      button.text().trim() || button.attr("aria-label"),
      `Button accessible name: ${file}`,
    );
  });
  $('a[target="_blank"]').each((_, element) => {
    const rel = new Set(($(element).attr("rel") || "").split(/\s+/));
    assert.ok(
      rel.has("noopener") && rel.has("noreferrer"),
      `External link rel: ${file}`,
    );
  });
}

console.log(
  `Accessibility audit: ${pages} HTML pages and ${images} images verified.`,
);
