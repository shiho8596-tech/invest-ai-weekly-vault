import {test} from 'node:test';
import assert from 'node:assert/strict';
import {marketCards,HTML_POLICY} from '../html-document.js';
test('ネオン版のデータを実行せずSVGチャートに変換',()=>{
 const source="const markets=[{name:'SOXL',pct:'+26.87%',close:'$58.32',hi:'$69.73',lo:'$47.36',v:[45.97,56.2,56.06,66.03,65.53,58.32]}];";
 const result=marketCards(source);
 assert.match(result,/<svg/);assert.match(result,/\+26.87%/);assert.match(result,/HIGH/);assert.match(result,/LOW/);assert.ok(!result.includes('NaN'));assert.ok(!result.includes('<script'));
});
test('HTMLを含むラベルはエスケープし不正な市場データは拒否',()=>{
 assert.equal(marketCards("const markets=[{name:alert('test')}];"),'');
 assert.equal(marketCards('const markets=[{"name":"SOX","pct":"1%","close":"1","hi":"1","lo":"1","v":[1,"x"]}];'),'');
 const result=marketCards('const markets=[{"name":"<img src=x>","pct":"1%","close":"1","hi":"1","lo":"1","v":[1,1]}];');
 assert.match(result,/&lt;img/);assert.ok(!result.includes('<img'));assert.ok(!result.includes('NaN'));
});
test('HTML専用枠はスクリプト・外部通信・フォームを許可しない',()=>{
 for(const directive of ["script-src 'none'","default-src 'none'","connect-src 'none'","form-action 'none'","base-uri 'none'"])assert.ok(HTML_POLICY.includes(directive));
 assert.ok(HTML_POLICY.includes("style-src 'unsafe-inline'"));
});
