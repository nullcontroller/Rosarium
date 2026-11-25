import test from "node:test";
import assert from "node:assert/strict";
import { revisionDateProblem } from "./revision-date-check.mjs";
import { activityDate, updateType } from "../src/lib/growth.ts";
const article = (date, body="本文", extra="") => `---\ntitle: 題名\nsummary: 概要\nlast_updated: '${date}'\n${extra}---\n${body}`;
test("substantive changes require an editorial date, including private drafts", () => {
  assert.match(revisionDateProblem(article("2026-11-24"), article("2026-11-24","変更"),"2026-11-25"), /without/);
  assert.equal(revisionDateProblem(article("2026-11-24"),article("2026-11-25","変更"),"2026-11-25"),null);
  assert.match(revisionDateProblem(article("2026-11-25"),article("2026-11-24","変更"),"2026-11-25"), /backwards/);
});
test("same-day edits and tag-only changes do not force a fabricated date", () => {
  assert.equal(revisionDateProblem(article("2026-11-24"),article("2026-11-24","変更"),"2026-11-24"),null);
  assert.equal(revisionDateProblem(article("2026-11-24"),article("2026-11-24","本文","tags: [AI]\n"),"2026-11-25"),null);
});
test("feed activity and change type use last_updated ahead of legacy dates", () => {
  const entry={data:{last_updated:"2026-11-24",updated_at:"2026-10-19",published_at:"2026-09-23"}};
  assert.equal(activityDate(entry),"2026-11-24"); assert.equal(updateType(entry),"updated");
  assert.equal(updateType({data:{last_updated:"2026-11-25",published_at:"2026-11-25"}}),"new");
});
test('prose wrap-only edits preserve editorial dates but code changes do not', () => {
 assert.equal(revisionDateProblem(article('2026-11-24','文。  \n次。'),article('2026-11-24','文。\n次。'),'2026-11-25'),null);
 assert.match(revisionDateProblem(article('2026-11-24','```\na  \nb\n```'),article('2026-11-24','```\na\nb\n```'),'2026-11-25'),/without/);
});
