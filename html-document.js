import {esc} from './core.js';

// Read this review template's chart data as data, never as JavaScript.
export function marketCards(source){
 const literal=source.match(/\bconst\s+markets\s*=\s*(\[[\s\S]*?\]);/);
 if(!literal||literal[1].length>100000)return '';
 try{
  const data=JSON.parse(literal[1].replace(/'([^'\\]*)'/g,(_,v)=>JSON.stringify(v)).replace(/([{,]\s*)([a-zA-Z_$][\w$]*)\s*:/g,'$1"$2":'));
  if(!Array.isArray(data)||data.length>20)return '';
  return data.map(m=>{
   if(!m||!['name','pct','close','hi','lo'].every(k=>typeof m[k]==='string'&&m[k].length<150)||!Array.isArray(m.v)||m.v.length<2||m.v.length>100||!m.v.every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<1e15))throw Error('Invalid chart');
   const lo=Math.min(...m.v),range=Math.max(...m.v)-lo||1;
   const points=m.v.map((n,i)=>`${(5+i*260/(m.v.length-1)).toFixed(2)},${(52-(n-lo)/range*40).toFixed(2)}`).join(' ');
   return `<div class="card"><div class="ticker">${esc(m.name)}</div><div class="pct">${esc(m.pct)}</div><div class="close">${esc(m.close)}</div><svg class="spark" viewBox="0 0 270 60" preserveAspectRatio="none" role="img" aria-label="終値推移"><path d="M5 55H265" stroke="#1c4534"/><polyline points="${points}" fill="none" stroke="#35ffb6" stroke-width="2.7" stroke-linejoin="round" stroke-linecap="round"/></svg><div class="days"><span>前金</span><span>月</span><span>火</span><span>水</span><span>木</span><span>金</span></div><div class="stats"><div><span>HIGH</span><b>${esc(m.hi)}</b></div><div><span>LOW</span><b>${esc(m.lo)}</b></div></div><div class="foot">${m.name==='SOXL'?'ETF純資産額：未確認':'時価総額：指数固有の値なし'}</div></div>`;
  }).join('');
 }catch{return '';}
}

export const HTML_POLICY="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";

export function htmlDocument(source,doc=document){
 const template=doc.createElement('template');template.innerHTML=source;
 const charts=template.content.querySelector('#markets');
 if(charts&&!charts.textContent.trim()&&!charts.children.length)charts.innerHTML=marketCards(source);
 // Keep CSS, classes, SVG and layout in the isolated document. Remove active
 // content as well as blocking it with CSP and an iframe without permissions.
 template.content.querySelectorAll('script,meta,base,link,iframe,frame,frameset,object,embed').forEach(el=>el.remove());
 template.content.querySelectorAll('*').forEach(el=>{for(const attr of [...el.attributes])if(/^on/i.test(attr.name)||['srcdoc','autofocus','formaction','action'].includes(attr.name.toLowerCase()))el.removeAttribute(attr.name);});
 // The standalone file's copy/download buttons are superseded by the app.
 for(const id of ['copy','save']){const el=template.content.querySelector(`#${id}`);if(el?.closest('.actions'))el.closest('.actions').remove();}
 template.content.querySelector('#status')?.remove();
 return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${esc(HTML_POLICY)}"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html{overflow-wrap:anywhere}body{margin:0}img,svg{max-width:100%}table{max-width:100%}</style></head><body>${template.innerHTML}</body></html>`;
}
