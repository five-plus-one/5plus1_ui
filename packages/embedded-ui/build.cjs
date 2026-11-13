const fs = require('node:fs');
const path = require('node:path');
const base = __dirname, out = path.join(base, 'dist');
fs.mkdirSync(out, {recursive:true});
for (const [from,to] of [['demo/index.html','index.html'],['index.cjs','embedded-ui.js'],['README.md','README.md']]) {
    fs.copyFileSync(path.join(base,from),path.join(out,to));
}
fs.writeFileSync(path.join(out,'manifest.json'), JSON.stringify({name:'@fiveplusone/embedded-ui',version:'0.1.0',componentCount:3,components:['样式边界','自适应操作栏','即时提示']},null,2)+'\n');
console.log('Embedded UI 0.1.0: 3 components');
