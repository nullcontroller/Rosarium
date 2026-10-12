import test from "node:test";
import assert from "node:assert/strict";
import { formatDateJa } from "../src/lib/site.ts";
import { recentGrowthDateLabel } from "../src/data/recent-growth.ts";

test("Japanese date labels preserve known precision without inventing a day", () => {
  for (const [input, expected] of [
    ["2026-02", "2026年2月"],
    ["2026-10-04", "2026年10月4日"],
    ["2026-10-04T12:00:00+09:00", "2026年10月4日"],
    ["2026", "2026年"],
    ["未確認", "未確認"],
  ]) assert.equal(formatDateJa(input), expected);
  assert.equal(recentGrowthDateLabel("2026-02"), "2026年2月");
  assert.equal(recentGrowthDateLabel("2026-10-04"), "2026年10月4日");
});
