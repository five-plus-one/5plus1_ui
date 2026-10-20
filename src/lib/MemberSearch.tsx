import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Users, UserRound, LoaderCircle } from 'lucide-react';
export interface MemberSearchResult { id: string; name: string; detail?: string; avatarUrl?: string; disabled?: boolean }
export type MemberSearchKind = 'user' | 'group';
export interface MemberSearchProps {
  onSearch: (query: string, kind: MemberSearchKind, signal: AbortSignal) => Promise<MemberSearchResult[]>;
  onPick: (member: MemberSearchResult, kind: MemberSearchKind) => void;
  disabled?: boolean;
  excludedIds?: string[];
  debounceMs?: number;
}
/** Search transport, authorization and result privacy are owned by the host. */
export function MemberSearch({ onSearch, onPick, disabled, excludedIds = [], debounceMs = 250 }: MemberSearchProps) {
  const [kind, setKind] = useState<MemberSearchKind>('user'), [query, setQuery] = useState(''), [items, setItems] = useState<MemberSearchResult[]>([]), [open, setOpen] = useState(false), [active, setActive] = useState(0), [status, setStatus] = useState<'idle'|'loading'|'ready'|'error'>('idle'), [error, setError] = useState('');
  const host = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), panel = useRef<HTMLDivElement>(null), latest = useRef(onSearch); latest.current = onSearch;
  const reduced = useReducedMotion();
  const id = useId(), [position, setPosition] = useState({ left: 8, top: 8, width: 300, maxHeight: 280 });
  const results = items.filter(item => !excludedIds.includes(item.id));
  useEffect(()=>{if(open)panel.current?.querySelector<HTMLElement>(`[id="${id}-${active}"]`)?.scrollIntoView?.({block:'nearest'});},[active,open,id]);
  useEffect(() => {
    const controller = new AbortController(); setItems([]); setActive(0); setError('');
    if (!query.trim() || disabled) { setStatus('idle'); return; }
    setStatus('loading');
    const timer = setTimeout(async () => { try { const found = await latest.current(query.trim(), kind, controller.signal); if (!controller.signal.aborted) { setItems(found); setStatus('ready'); } } catch { if (!controller.signal.aborted) { setError('暂时无法查找成员，请重试'); setStatus('error'); } } }, debounceMs);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, kind, disabled, debounceMs]);
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => { const box = input.current?.getBoundingClientRect(); if (!box) return; const below = window.innerHeight-box.bottom-16; const height = Math.min(280, Math.max(100, below < 160 ? box.top-16 : below)); setPosition({left: Math.max(8, Math.min(box.left,window.innerWidth-box.width-8)),top:below<160 ? Math.max(8,box.top-height-6) : box.bottom+6,width:Math.min(box.width,window.innerWidth-16),maxHeight:height}); };
    const outside = (event: Event) => { const target = event.target as Node; if (!host.current?.contains(target) && !panel.current?.contains(target)) setOpen(false); };
    place(); document.addEventListener('pointerdown',outside,true); document.addEventListener('focusin',outside,true); window.addEventListener('resize',place); window.addEventListener('scroll',place,true);
    return () => { document.removeEventListener('pointerdown',outside,true); document.removeEventListener('focusin',outside,true); window.removeEventListener('resize',place); window.removeEventListener('scroll',place,true); };
  }, [open]);
  const pick = (item: MemberSearchResult) => { if (item.disabled) return; onPick(item,kind); setQuery(''); setOpen(false); input.current?.focus(); };
  return <div className="fp-member-search" ref={host}>
    <div className="fp-member-search-kind" aria-label="搜索范围">{(['user','group'] as const).map(value => <button type="button" key={value} disabled={disabled} aria-pressed={kind===value} onClick={() => {setKind(value);setQuery('');setOpen(false);input.current?.focus();}}>{kind===value && <motion.span className="fp-choice-highlight" layoutId={`${id}-kind`} transition={{duration:reduced?0:.18,ease:[.2,0,0,1]}} aria-hidden="true"/>}{value==='user'?<UserRound size={14}/>:<Users size={14}/>}<span>{value==='user'?'用户':'用户组'}</span></button>)}</div>
    <div className="fp-member-search-input"><Search size={16} aria-hidden="true"/><input ref={input} role="combobox" aria-label="搜索成员" aria-autocomplete="list" aria-expanded={open&&!!query.trim()} aria-controls={open&&query.trim()?id:undefined} aria-activedescendant={open&&results[active]?`${id}-${active}`:undefined} disabled={disabled} placeholder={kind==='user'?'搜索姓名、账号或邮箱':'搜索用户组名称'} value={query} onFocus={()=>setOpen(true)} onChange={event=>{setQuery(event.target.value);setOpen(true);}} onKeyDown={event=>{
      if(event.nativeEvent.isComposing)return;
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();setOpen(false);}
      if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();setOpen(true);setActive(index=>{const step=event.key==='ArrowDown'?1:-1;let next=index+step;while(next>=0&&next<results.length&&results[next].disabled)next+=step;return next>=0&&next<results.length?next:index;});}
      if(event.key==='Enter'&&open){event.preventDefault();const item=results[active];if(item)pick(item);}
    }}/>{status==='loading'&&<LoaderCircle size={15} className="fp-spin" aria-hidden="true"/>}</div>
    {open&&!disabled&&query.trim()&&createPortal(<div ref={panel} className="fp-member-results fp-popup-panel" id={id} role="listbox" aria-label="匹配成员" style={{position:'fixed',...position,overflowY:'auto'}}>
      {status==='loading'&&<p role="status">正在查找…</p>}{status==='error'&&<p role="alert">{error}</p>}{status==='ready'&&!results.length&&<p role="status">没有可添加的匹配成员</p>}
      {results.map((item,index)=><button type="button" role="option" aria-selected={index===active} id={`${id}-${index}`} key={item.id} disabled={item.disabled} onMouseEnter={()=>setActive(index)} onMouseDown={event=>event.preventDefault()} onClick={()=>pick(item)}><span className="fp-member-result-avatar" aria-hidden="true">{item.avatarUrl?<img src={item.avatarUrl} alt=""/>:item.name.slice(0,1)}</span><span><strong>{item.name}</strong>{item.detail&&<small>{item.detail}</small>}</span><span className="fp-member-result-action">添加</span></button>)}
    </div>,input.current?.closest('dialog')||document.body)}
  </div>;
}
