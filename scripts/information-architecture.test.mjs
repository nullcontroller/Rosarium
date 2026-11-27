import assert from 'node:assert/strict';
import test from 'node:test';
import {compatibilityUrls,compatibilityFor} from '../src/data/compatibility-urls.mjs';
import {compatibilityDestination} from './generate-compatibility.mjs';
import {aiKnowledgeGroups} from '../src/data/ai-knowledge-groups.mjs';
import {designStudies,designStudyGroups} from '../src/data/design-studies.mjs';
import {primaryDomain} from '../src/data/knowledge-domains.mjs';
test('all approved compatibility URLs are unique and resolve without chains',()=>{
 assert.equal(compatibilityUrls.length,53);const urls=new Set(compatibilityUrls.map(r=>r.from));assert.equal(urls.size,53);
 for(const r of compatibilityUrls){for(const to of [r.to,...Object.values(r.fragments)])assert(!urls.has(new URL(to,'https://rosarium-tech.com').pathname));assert.equal(compatibilityFor(r.from.slice(1,-1)),r);}
 assert.equal(compatibilityUrls.filter(r=>['他ページへ統合','廃止'].includes(r.disposition)).length,27);
});
test('compatibility preserves query and hash, giving explicit mappings precedence',()=>{
 for(const r of compatibilityUrls){const u=compatibilityDestination(r,new URL('https://rosarium-tech.com'+r.from+'?q=test&lifecycle=obsolete#unknown'));
 assert.equal(u.searchParams.get('q'),'test');assert.equal(u.searchParams.get('lifecycle'),'obsolete');assert.equal(u.hash,new URL(r.to,'https://rosarium-tech.com').hash||'#unknown');
 for(const [hash,to] of Object.entries(r.fragments))assert.equal(compatibilityDestination(r,new URL('https://rosarium-tech.com'+r.from+'#'+encodeURIComponent(hash))).href,new URL(to,'https://rosarium-tech.com').href);
 }
 assert.equal(compatibilityDestination(compatibilityFor('search'),new URL('https://rosarium-tech.com/search/?search=0&q=a')).searchParams.get('search'),'1');
});
test('five AI domains cover all 19 originals exactly once and preserve prerequisite order',()=>{
 assert.equal(aiKnowledgeGroups.length,5);const ids=aiKnowledgeGroups.flatMap(g=>g.ids);assert.equal(ids.length,19);assert.equal(new Set(ids).size,19);
 for(const id of ids)assert.equal(primaryDomain({id,data:{}}),'ai');
 const learning=aiKnowledgeGroups[1].ids;assert(learning.indexOf('foundations/policy-gradient-learning')<learning.indexOf('foundations/preference-learning-dpo'));assert(learning.indexOf('foundations/preference-learning-dpo')<learning.indexOf('foundations/verifiable-reward-reasoning'));
});
test('virtual study IDs are independent of the listing location',()=>{
 assert.equal(designStudies.length,6);for(const s of designStudies)assert.equal(s.id,`cases/design-studies/${s.slug}`);
 const g=designStudyGroups[0];assert.equal(g.listingTarget,'/cases/customer-support-ai-dx/#virtual-designs');assert.equal(g.idBase,'cases/design-studies');
});
