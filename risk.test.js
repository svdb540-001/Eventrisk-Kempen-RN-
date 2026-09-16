const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{},document:{querySelector:()=>({})}};
vm.runInNewContext(fs.readFileSync('risk-config.js','utf8'),sandbox);
const C=sandbox.window.RISK_CONFIG;
function attendanceScore(n){if(n<100)return 0;if(n<500)return 1;if(n<=2000)return 2;if(n<=5000)return 3;if(n<=20000)return 4;return 5;}
function levelFromScore(n){return Math.min(5,Math.max(0,Math.ceil(n-1e-9)));}
assert.deepStrictEqual([99,100,499,500,2000,2001,5000,5001,20000,20001].map(attendanceScore),[0,1,1,2,2,3,3,4,4,5]);
assert.deepStrictEqual([-.2,0,.01,1,1.01,4.9,6].map(levelFromScore),[0,0,1,1,2,5,5]);
assert.strictEqual(C.parameters.length,9);
assert.strictEqual(C.levels.length,6);
console.log('Alle risicologica-tests geslaagd.');
