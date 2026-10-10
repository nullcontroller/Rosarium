import test from "node:test";
import assert from "node:assert/strict";
import { load } from "cheerio";
import { pageContents, pageOpening } from "../src/lib/page-contents.mjs";

test("HTML and Markdown headings use the same rule and preserve old fragments", () => {
  const page = pageContents('<h2 id="old">First</h2><h3>Child</h3><h4>Detail</h4><h2>Second</h2>');
  assert.deepEqual(page.headings.map((h) => h.depth), [2, 3, 2]);
  assert.equal(page.headings[0].slug, "old");
  const $ = load(page.html);
  for (const h of page.headings) assert.equal($('[id]').filter((_, n) => $(n).attr('id') === h.slug).length, 1);
});
test("short and excluded pages have no contents; hidden and navigation headings do not count", () => {
  assert.equal(pageContents('<h2>One</h2><h3>Child</h3>').headings.length, 0);
  assert.equal(pageContents('<h2>One</h2><aside><h2>Sidebar</h2></aside><h2 hidden>Hidden</h2>').headings.length, 0);
  assert.equal(pageContents('<h2>One</h2><h2>Two</h2>', {mode:'never'}).headings.length, 0);
});
test("generated ids avoid existing ids and duplicate labels deterministically", () => {
  const html = '<div id="toc-section"></div><h2>Section</h2><h2>Section</h2>';
  assert.deepEqual(pageContents(html).headings.map(h => h.slug), ['toc-section-2', 'toc-section-3']);
  assert.equal(pageContents(pageContents(html).html).html, pageContents(html).html);
});
test("indexes use metadata ids and curated anchors, not title-derived ids", () => {
  const html='<div id="archive-heading"><h1>Archive</h1></div><section><h2 id="category">Category</h2><div id="entry" data-history-id="cases/one"><h3>Case</h3></div></section>';
  const headings=[{depth:2,slug:'archive-heading',text:'Archive'},{depth:3,slug:'entry',text:'Case'}];
  assert.deepEqual(pageContents(html, {headings, mode:'always'}).headings, headings);
  const one='<article data-content-id="articles/one"><h2>First</h2></article><article data-content-id="articles/two"><h2>Second</h2></article>';
  assert.equal(pageContents(one).headings[0].slug,'toc-entry-articles/one');
});
test("Garden Notes remains navigable within a single month and preserves source date anchors", () => {
  const html='<h2 id="month">Month</h2>'+['2026-10-01','2026-10-02'].map(date=>`<article data-growth-entry><time datetime="${date}"></time><h3>Update</h3></article>`).join('');
  assert.equal(pageContents(html).reason,'multiple-list-entries');
  assert.equal(pageContents(html).headings[1].slug,'toc-entry-2026-10-01');
});

test("long single-chapter and h3-only articles retain useful sections without including h4", () => {
  for (const prefix of ['<h2 id="title">Title</h2>', '']) {
    const page = pageContents(prefix+'<h3>First</h3><p>'+"文".repeat(1000)+'</p><h3>Second</h3><h4>Too deep</h4>');
    assert.equal(page.reason, 'long-page-sections');
    assert.equal(page.headings.filter(h => h.depth > 3).length, 0);
    assert.equal(page.headings.filter(h => h.text === 'Too deep').length, 0);
  }
});

test("page opening keeps metadata compact and places shared mobile contents after the title", () => {
  const result = pageOpening('<nav class="breadcrumb"><a href="/ai/">AI</a></nav><article><header class="document-header"><h1>Title</h1></header><h2 id="a">Section</h2></article>', [{depth:2,slug:'a',text:'A & B'}], {title:'Book',chapterCount:1,items:[{href:'/chapter/',title:'Chapter',current:true}]});
  const $ = load(result.html);
  assert.equal($('.breadcrumb').length, 0);
  assert.match(result.breadcrumbHtml, /href="\/ai\/"/);
  assert.equal($('.document-header').next().is('details.book-toc-mobile'), true);
  assert.equal($('[data-page-heading-toc] a').attr('href'), '#a');
  assert.equal($('[data-page-heading-toc] a').text(), 'A & B');
  assert.equal($('a[aria-current="page"]').text(), 'Chapter');
  assert.equal($('h1').text(), 'Title');
  assert.equal($('[data-page-heading-toc]').is('[open]'), false);
});

test("expanded page contents expose Japanese heading links and exclude history", () => {
  const contents = pageContents('<h1>Career</h1><section data-toc-exclude><h2>更新履歴</h2></section><h2 id="何をする人か">何をする人か</h2><h2 id="現在の専門性">現在の専門性</h2>');
  const $ = load(pageOpening(contents.html, contents.headings, undefined, { expanded: true }).html);
  assert($('[data-page-heading-toc]').is('[open]'));
  assert.deepEqual($('[data-page-heading-toc] a').map((_, link) => $(link).attr('href')).get(), ['#何をする人か', '#現在の専門性']);
  assert.equal($('[data-page-heading-toc] a').filter((_, link) => $(link).text() === '更新履歴').length, 0);
});
