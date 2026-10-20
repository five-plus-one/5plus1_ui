import { useEffect, useLayoutEffect, useRef, useState, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, Check } from 'lucide-react';
export interface ContextMenuItem { id: string; label: string; icon?: ReactNode; shortcut?: string; disabled?: boolean; danger?: boolean; checked?: boolean; separator?: boolean; children?: ContextMenuItem[]; onSelect?: () => void }
export interface ContextMenuProps { children: ReactNode; items: ContextMenuItem[] | (() => ContextMenuItem[]); label?: string; disabled?: boolean; tabIndex?: number; onOpen?: (event: React.MouseEvent | React.KeyboardEvent) => boolean | void }
/** Pointer and keyboard context actions share the same focus and dismissal contract. */
export function ContextMenu({ children, items, label = '快捷操作', disabled, tabIndex = 0, onOpen }: ContextMenuProps) {
  const host = useRef<HTMLDivElement>(null), panel = useRef<HTMLDivElement>(null), previous = useRef<HTMLElement | null>(null);
  const [point, setPoint] = useState<{x:number;y:number}|null>(null), [path, setPath] = useState<string[]>([]);
  const id = useId();
  const close = (restore = true) => { setPoint(null); setPath([]); if (restore) previous.current?.focus({preventScroll:true}); };
  const open = (x:number,y:number) => { previous.current = document.activeElement as HTMLElement; setPath([]); setPoint({x,y}); };
  useLayoutEffect(() => {
    if (!point || !panel.current) return;
    const box = panel.current.getBoundingClientRect();
    panel.current.style.left = `${Math.max(8,Math.min(point.x,window.innerWidth-box.width-8))}px`;
    panel.current.style.top = `${Math.max(8,Math.min(point.y,window.innerHeight-box.height-8))}px`;
    panel.current.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus({preventScroll:true});
  }, [point,path]);
  useEffect(() => {
    if (!point) return;
    const outside = (e:Event) => {if (!panel.current?.contains(e.target as Node)) close(false);};
    const escape = (e:KeyboardEvent) => {if(e.key==='Escape'){e.preventDefault();close();}};
    const dismiss = () => close(false);
    document.addEventListener('pointerdown',outside,true); document.addEventListener('keydown',escape,true);
    window.addEventListener('resize',dismiss); window.addEventListener('blur',dismiss);
    window.addEventListener('scroll',outside,true);
    return () => { document.removeEventListener('pointerdown',outside,true); document.removeEventListener('keydown',escape,true);window.removeEventListener('resize',dismiss);window.removeEventListener('blur',dismiss);window.removeEventListener('scroll',outside,true); };
  },[point]);
  let visible=typeof items === 'function' ? items() : items;
  for(const key of path) visible=visible.find(item=>item.id===key)?.children || [];
  return <div ref={host} className="fp-context-host" tabIndex={tabIndex} onContextMenu={e=>{if(disabled||onOpen?.(e)===false)return;e.preventDefault();e.stopPropagation();open(e.clientX,e.clientY);}} onKeyDown={e=>{if(disabled)return;if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){if(onOpen?.(e)===false)return;e.preventDefault();e.stopPropagation();const box=host.current!.getBoundingClientRect();open(box.left+16,box.top+16);}}}>
    {children}{point&&createPortal(<div ref={panel} id={id} role="menu" aria-label={label} className="fp-popup-panel fp-popup-menu fp-context-menu" style={{position:'fixed',left:point.x,top:point.y,maxHeight:'calc(100vh - 16px)',overflowY:'auto'}} onContextMenu={e=>e.preventDefault()} onKeyDown={e=>{
      const buttons=Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')||[]), index=buttons.indexOf(document.activeElement as HTMLButtonElement);
      const next=e.key==='ArrowDown'?(index+1)%buttons.length:e.key==='ArrowUp'?(index-1+buttons.length)%buttons.length:e.key==='Home'?0:e.key==='End'?buttons.length-1:-1;
      if(next>=0){e.preventDefault();buttons[next]?.focus();}
      if(e.key==='ArrowLeft'&&path.length){e.preventDefault();setPath(path.slice(0,-1));}
      if(e.key==='ArrowRight'){const key=(document.activeElement as HTMLElement)?.dataset.item;const item=visible.find(i=>i.id===key);if(item?.children){e.preventDefault();setPath([...path,item.id]);}}
      if(e.key==='Tab')close(false);
    }}>{path.length>0&&<button type="button" role="menuitem" onClick={()=>setPath(path.slice(0,-1))}>‹ 返回</button>}{visible.map(item=><div key={item.id}>{item.separator&&<div role="separator" className="fp-context-separator"/>}<button type="button" role="menuitem" data-item={item.id} disabled={item.disabled} aria-haspopup={item.children?'menu':undefined} className={item.danger?'fp-error-text':''} onClick={()=>{if(item.children)setPath([...path,item.id]);else{close();item.onSelect?.();}}}><span className="fp-context-icon">{item.checked?<Check size={15}/>:item.icon}</span><span>{item.label}</span>{item.children?<ChevronRight size={14}/>:item.shortcut?<kbd>{item.shortcut}</kbd>:null}</button></div>)}</div>,host.current?.closest('dialog')||document.body)}
  </div>;
}
