import { execFileSync } from "node:child_process";
import fs from "node:fs";
import YAML from "yaml";

const parse = text => {
  const match = text.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)/);
  if (!match) throw new Error("Missing front matter in revision comparison");
  return { data: YAML.parse(match[1]), body: match[2].trim() };
};

/** Dates are editorial declarations; Git supplies content differences, never a date. */
export function revisionDateProblem(before, after, revisionDate) {
  const previous = parse(before), next = parse(after);
  const substantive = previous.body !== next.body || ["title", "summary"].some(key => previous.data[key] !== next.data[key]);
  if (!substantive) return null;
  if (next.data.last_updated < previous.data.last_updated) return "last_updated moved backwards";
  if (next.data.last_updated === previous.data.last_updated && next.data.last_updated !== revisionDate)
    return `Content changed without a revised last_updated (${next.data.last_updated}); verify the actual editorial date`;
  return null;
}

export function checkWorkingRevisionDates(files) {
  const base = process.env.ROSARIUM_REVISION_BASE || "HEAD";
  const revisionDate = process.env.ROSARIUM_REVISION_DATE || new Intl.DateTimeFormat("sv-SE", {timeZone:"Asia/Tokyo"}).format(new Date());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(revisionDate)) throw new Error("Invalid ROSARIUM_REVISION_DATE");
  execFileSync("git", ["rev-parse", "--verify", base], {stdio:"pipe"});
  const problems = [];
  for (const file of files) {
    let before;
    try { before = execFileSync("git", ["show", `${base}:${file}`], {encoding:"utf8", stdio:["ignore","pipe","ignore"]}); }
    catch { continue; } // New articles have no previous revision; normal metadata validation covers them.
    const problem = revisionDateProblem(before, fs.readFileSync(file,"utf8"), revisionDate);
    if (problem) problems.push(`${file}: ${problem}`);
  }
  if (problems.length) {
    const message = "Revision-date review candidates (classify substantive edits separately from typos/anchors):\n" + problems.join("\n");
    if (process.env.ROSARIUM_REVISION_STRICT === "1") throw new Error(message);
    console.warn(message);
  }
  console.log(`Revision-date diff check: ${files.length} manuscripts against ${base}; editorial date ${revisionDate}.`);
}
