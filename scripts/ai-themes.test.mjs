import test from "node:test";
import assert from "node:assert/strict";
import { aiThemes, aiThemeGroups, AI_RELATED_LIMIT } from "../src/lib/ai.ts";
const entry = (id, data = {}) => ({ id, data: { public: true, lifecycle: "active", status: "published", entry_points: ["ai"], published_at: "2026-10-16", ...data } });
const representatives = () => aiThemes.map(t => entry(t.article, { layer: t.layer }));
test("AI foundations exclude application systems even when their legacy AI theme matches",()=>{
  const rows=[entry("foundations/temperature-design",{ai_theme:"ai-mathematics"}),entry("software-engineering/code-generation-models",{ai_theme:"ai-theory"})];
  const groups=aiThemeGroups([...representatives(),...rows,rows[0]]);
  assert.equal(groups.length,2);
  assert.deepEqual(groups[0].related.map(e=>e.id),["foundations/temperature-design"]);
  assert.deepEqual(groups[1].related,[]);
  for(const group of groups)assert(group.related.length<=AI_RELATED_LIMIT);
});
test("private, draft, retired, obsolete and undated foundational articles stay out",()=>{
  for(const data of [{public:false},{status:"draft"},{status:"archived"},{lifecycle:"retired"},{lifecycle:"obsolete"},{published_at:null},{ai_theme:undefined}]){
    const groups=aiThemeGroups([...representatives(),entry("foundations/temperature-design",{ai_theme:"ai-mathematics",...data})]);
    assert.deepEqual(groups[0].related,[]);
  }
});
test("mathematics and generation theory have distinct representatives",()=>{
  assert.deepEqual(aiThemes.map(t=>t.article),["foundations/conditional-probability","foundations/hallucination-mechanisms"]);
  assert.equal(new Set(aiThemes.map(t=>t.path)).size,aiThemes.length);
});
