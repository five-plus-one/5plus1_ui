import { useRef, useState } from 'react';
import { FileText, Search, Check } from 'lucide-react';
export interface PickableAttachment { id:string; name:string; detail?:string; disabled?:boolean }
export interface AttachmentPickerProps { items:PickableAttachment[]; selectedIds:string[]; onChange:(ids:string[])=>void; onConfirm:(ids:string[])=>Promise<void>|void; loading?:boolean; error?:string; onSearch?:(query:string)=>void; onLoadMore?:()=>void; hasMore?:boolean }
export function AttachmentPicker({items,selectedIds,onChange,onConfirm,loading,error,onSearch,onLoadMore,hasMore}:AttachmentPickerProps){
  const [query,setQuery]=useState(''),[busy,setBusy]=useState(false),[failure,setFailure]=useState('');const guard=useRef(false);
  const visible=onSearch?items:items.filter(item=>item.name.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="fp-attachment-picker" aria-label="选择资料"><div className="fp-member-search-input"><Search size={16}/><input aria-label="搜索资料" placeholder="搜索资料名称" value={query} onChange={event=>{setQuery(event.target.value);onSearch?.(event.target.value);}}/></div><div className="fp-attachment-picker-list" aria-busy={loading}>
    {visible.map(item=><button type="button" role="checkbox" aria-checked={selectedIds.includes(item.id)} key={item.id} disabled={item.disabled||busy} onClick={()=>onChange(selectedIds.includes(item.id)?selectedIds.filter(id=>id!==item.id):[...selectedIds,item.id])}><span className="fp-picker-check">{selectedIds.includes(item.id)&&<Check size={13}/>}</span><FileText size={18}/><span><strong>{item.name}</strong>{item.detail&&<small>{item.detail}</small>}</span></button>)}
    {loading&&<p role="status">正在查找资料…</p>}{!loading&&!visible.length&&<p>没有匹配的资料</p>}{hasMore&&onLoadMore&&<button type="button" className="fp-picker-load" disabled={loading||busy} onClick={onLoadMore}>加载更多</button>}
  </div>{(error||failure)&&<p role="alert" className="fp-error-text">{error||failure}</p>}<footer><span>已选择 {selectedIds.length} 项资料</span><button type="button" className="fp-button fp-primary fp-sm" disabled={busy||!selectedIds.length} onClick={async()=>{if(guard.current)return;guard.current=true;setBusy(true);setFailure('');try{await onConfirm(selectedIds);}catch{setFailure('未能添加资料，请重试');}finally{guard.current=false;setBusy(false);}}}>{busy?'正在添加…':'添加资料'}</button></footer></section>;
}
