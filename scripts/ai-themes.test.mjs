import test from "node:test";
import assert from "node:assert/strict";
import { aiThemes, aiThemeGroups, AI_RELATED_LIMIT } from "../src/lib/ai.ts";
const entry = (id, data = {}) => ({ id, data: { public: true, lifecycle: "active", status: "published", entry_points: ["ai"], published_at: "2026-10-16", ...data } });
const representatives = () => aiThemes.map(t => entry(t.article, { layer: t.layer, design_topic: t.topic }));
test("AI related links require an explicit theme and public active AI publication", () => {
 const rows = [entry("valid", {ai_theme:"practices"}), ...[
  {public:false}, {status:"draft"}, {status:"archived"}, {lifecycle:"retired"}, {lifecycle:"obsolete"}, {entry_points:["dx"]}, {published_at:null}, {ai_theme:undefined}
 ].map((d,i) => entry(`excluded-${i}`, {ai_theme:"practices",...d}))];
 const groups=aiThemeGroups([...representatives(),...rows,rows[0]]);
 assert.equal(groups.length,5);
 assert.deepEqual(groups.find(g=>g.id==="practices").related.map(e=>e.id),["valid"]);
 assert.deepEqual(groups.map(g=>g.articles[0].id),aiThemes.map(g=>g.article));
});
test("AI related links sort by first publication, cap at three and exclude representative", () => {
 const rows=Array.from({length:5},(_,i)=>entry(`article-${i}`,{ai_theme:"ai-design",published_at:`2026-10-0${i+1}`,updated_at:`2027-01-0${5-i}`}));
 const reps=representatives();reps[0].data.ai_theme="ai-design";
 const group=aiThemeGroups([...reps,...rows]).find(g=>g.id==="ai-design");
 assert.equal(group.related.length,AI_RELATED_LIMIT);
 assert.deepEqual(group.related.map(e=>e.id),["article-4","article-3","article-2"]);
});