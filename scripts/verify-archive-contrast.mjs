import fs from 'node:fs';
import assert from 'node:assert/strict';
const css=fs.readFileSync('src/styles/archive-colors.css','utf8');
const light=css.match(/:root \{([\s\S]*?)\}/)[1];
const dark=css.match(/:root\[data-theme="dark"\] \{([\s\S]*?)\}/)[1];
const luminance=hex=>{
 const c=hex.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
 return .2126*c[0]+.7152*c[1]+.0722*c[2];
};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const rows=[];
for(const [mode,block,surface] of [['light',light,'#f5f7f1'],['dark',dark,'#1c282c']]){
 for(const kind of ['obsolete','retired','obsolete-cases']){
  const color=role=>block.match(new RegExp(`--archive-${kind}-${role}: (#[a-f0-9]+);`))[1];
  for(const bg of [surface,color('bg')]){
   for(const role of ['accent','ink','muted','line']){
    const ratio=contrast(color(role),bg);rows.push({mode,kind,role,foreground:color(role),background:bg,ratio});
    assert(ratio>=(role==='line'?3:4.5),`${mode}/${kind}/${role}: ${ratio.toFixed(2)}`);
   }
  }
 }
}
console.log(JSON.stringify({method:'WCAG relative luminance, normal text 4.5:1, UI boundaries 3:1',checks:rows},null,2));
