import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const tokens=readFileSync('src/lib/tokens.css','utf8');
const styles=readFileSync('src/lib/styles.css','utf8');
const declarations=(block:string)=>Object.fromEntries([...block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(match=>[match[1],match[2].trim()]));
const light=declarations(tokens.match(/:root\s*\{([\s\S]*?)\n\}/)![1]);
const dark={...light,...declarations(tokens.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/)![1])};
const button=styles.match(/\.fp-danger\s*\{([\s\S]*?)\}/)![1];
const resolve=(value:string,palette:Record<string,string>):string=>value.startsWith('var(')?resolve(palette[value.slice(4,-1)],palette):value;
function luminance(color:string){let hex=color.slice(1);if(hex.length===3)hex=hex.split('').map(char=>char+char).join('');const channels=[0,2,4].map(offset=>parseInt(hex.slice(offset,offset+2),16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;}
for(const [name,palette] of Object.entries({light,dark}))it(`keeps destructive action text readable in ${name} appearance`,()=>{
 const fg=luminance(resolve(button.match(/\n\s*color:\s*([^;]+);/)![1],palette));
 const bg=luminance(resolve(button.match(/background:\s*([^;]+);/)![1],palette));
 expect((Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)).toBeGreaterThanOrEqual(4.5);
});
