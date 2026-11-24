import fs from "node:fs";
export const reviewTargetsPath = new URL("./review-targets.json", import.meta.url);
export function mergeReviewTargets(existing, additions = []) {
  const targets = [...new Set([...existing, ...additions])];
  if (!targets.length || targets.some(id => typeof id !== "string" || !/^[a-z0-9-]+(?:\/[a-z0-9-]+)+$/.test(id))) throw new Error("Invalid or empty review content IDs");
  return targets;
}
export const readReviewTargets = (additions = []) => mergeReviewTargets(JSON.parse(fs.readFileSync(reviewTargetsPath, "utf8")), additions);
