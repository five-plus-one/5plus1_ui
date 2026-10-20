import type { JSONContent } from '@tiptap/core';
/** Images are block nodes. Split legacy inline placements without discarding adjacent text. */
export function normalizeImageBlocks(document: JSONContent): JSONContent {
 const normalize=(node:JSONContent):JSONContent[]=>{
  if(!node.content)return [node];
  const children=node.content.flatMap(normalize);
  if(!['paragraph','heading'].includes(node.type||'')||!children.some(n=>n.type==='image'))return [{...node,content:children}];
  const result:JSONContent[]=[];let run:JSONContent[]=[];let usedId=false;
  const flush=()=>{if(!run.length)return;const attrs={...node.attrs};if(usedId)delete attrs.id;result.push({...node,attrs,content:run});usedId=true;run=[];};
  for(const child of children){if(child.type==='image'){flush();result.push(child);}else run.push(child);}
  flush();return result;
 };
 return normalize(document)[0];
}
