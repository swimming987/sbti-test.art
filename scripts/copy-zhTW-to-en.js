const fs = require('fs');
const path = require('path');

function loadJSON(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function writeJSON(p,obj){ fs.writeFileSync(p, JSON.stringify(obj,null,2),'utf8'); }

const DATA = path.join(__dirname,'..','data');
const files = [ 'types-i18n.json', 'dimensions-i18n.json' ];

for(const f of files){
  const p = path.join(DATA,f);
  if(!fs.existsSync(p)){
    console.warn('Skip, not exists:', p);
    continue;
  }
  const obj = loadJSON(p);
  // traverse and copy zh-TW -> en for any nested fields
  function copyTwToEn(node){
    if(node && typeof node === 'object'){
      // if leaf has zh-TW and en keys
      if('zh-TW' in node){
        node['en'] = node['zh-TW'];
      }
      for(const k of Object.keys(node)) copyTwToEn(node[k]);
    }
  }
  copyTwToEn(obj);
  writeJSON(p,obj);
  console.log('Updated', f);
}

console.log('Done. Note: English content copied from zh-TW; please review translations.');
