import test from 'node:test';
import assert from 'node:assert/strict';
import {visibleDesignStudies} from '../src/lib/design-study-discovery.ts';
import {designStudies} from '../src/data/design-studies.mjs';
test('gateway count follows public active study metadata, excluding the hub and duplicates',()=>{
 const entry=(id,data={})=>({id,data:{public:true,status:'published',lifecycle:'active',...data}});
 const rows=designStudies.map(study=>entry(study.id));
 assert.equal(visibleDesignStudies([...rows,rows[0],entry('cases/design-studies'),entry('cases/unregistered')]).length,6);
 for(const data of [{public:false},{status:'draft'},{status:'archived'},{lifecycle:'retired'},{lifecycle:'obsolete'}]){
  assert.equal(visibleDesignStudies([entry(designStudies[0].id,data)]).length,0);
 }
 assert.deepEqual(visibleDesignStudies([...rows].reverse()).map(entry=>entry.id),designStudies.map(study=>study.id));
});

test('study relationships are filtered by their source Case without unrelated fallbacks',()=>{
 const entries=designStudies.map(study=>({id:study.id,data:{status:'published',lifecycle:'active'}}));
 assert(designStudies.every(study=>study.sourceCase==='cases/customer-support-ai-dx'));
 assert.equal(visibleDesignStudies(entries,'cases/customer-support-ai-dx').length,6);
 assert.deepEqual(visibleDesignStudies(entries,'cases/ai-technical-investigation'),[]);
 assert.deepEqual(visibleDesignStudies(entries,'cases/future-case'),[]);
 assert.equal(visibleDesignStudies(entries.slice(0,1),'cases/customer-support-ai-dx').length,1);
});

test('another registered source Case remains isolated from existing studies',()=>{
 const future={id:'cases/design-studies/future-study',sourceCase:'cases/future-source'};
 designStudies.push(future);
 try {
  const entries=designStudies.map(study=>({id:study.id,data:{status:'published',lifecycle:'active'}}));
  assert.deepEqual(visibleDesignStudies(entries,'cases/future-source').map(entry=>entry.id),[future.id]);
  assert.equal(visibleDesignStudies(entries,'cases/customer-support-ai-dx').length,6);
 } finally { designStudies.pop(); }
});
