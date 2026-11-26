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
