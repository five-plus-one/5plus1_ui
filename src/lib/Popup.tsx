import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

function Popup({label,children,menu=false,icon}:{label:string;children:(close:()=>void)=>ReactNode;menu?:boolean;icon?:ReactNode}) {
  const [open,setOpen]=useState(false);
  const trigger=useRef<HTMLButtonElement>(null), panel=useRef<HTMLDivElement>(null);
  const id=useId();
  const [position,setPosition]=useState({left:0,top:0});
  const close=()=>{setOpen(false);trigger.current?.focus()};
  useLayoutEffect(()=>{
    if(!open)return;
    const place=()=>{
      const anchor=trigger.current?.getBoundingClientRect(), box=panel.current?.getBoundingClientRect();
      if(!anchor||!box)return;
      const below=anchor.bottom+8;
      setPosition({left:Math.max(8,Math.min(anchor.left,window.innerWidth-box.width-8)),top:below+box.height>window.innerHeight-8&&anchor.top>box.height+8?anchor.top-box.height-8:below});
    };
    place();
    window.addEventListener('resize',place);
    window.addEventListener('scroll',place,true);
    const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(place);
    if(panel.current)observer?.observe(panel.current);
    return()=>{observer?.disconnect();window.removeEventListener('resize',place);window.removeEventListener('scroll',place,true)};
  },[open]);
  useEffect(()=>{
    if(!open)return;
    const outside=(event:Event)=>{const node=event.target as Node;if(!trigger.current?.contains(node)&&!panel.current?.contains(node))setOpen(false)};
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close()}};
    document.addEventListener('pointerdown',outside,true);
    document.addEventListener('focusin',outside,true);
    document.addEventListener('keydown',escape,true);
    return()=>{document.removeEventListener('pointerdown',outside,true);document.removeEventListener('focusin',outside,true);document.removeEventListener('keydown',escape,true)};
  },[open]);
  function focusItem(last=false){requestAnimationFrame(()=>{const buttons=panel.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');(last?buttons?.[buttons.length-1]:buttons?.[0])?.focus()})}
  return <span className="fp-dropdown"><button ref={trigger} type="button" className={`fp-popup-trigger${icon?' fp-popup-icon':''}`} aria-label={icon?label:undefined} aria-expanded={open} aria-controls={open?id:undefined} aria-haspopup={menu?'menu':'dialog'} onClick={()=>setOpen(v=>!v)} onKeyDown={e=>{if(menu&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();setOpen(true);focusItem(e.key==='ArrowUp')}}}>{icon||<><span>{label}</span><ChevronDown size={15} aria-hidden="true"/></>}</button>{open&&createPortal(<div ref={panel} id={id} role={menu?'menu':'dialog'} aria-label={label} className={`fp-popup-panel ${menu?'fp-popup-menu':'fp-popover-content'}`} style={{position:'fixed',...position}} onKeyDown={e=>{
    if(!menu)return;
    const buttons=Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')||[]),index=buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next=e.key==='ArrowDown'?(index+1)%buttons.length:e.key==='ArrowUp'?(index-1+buttons.length)%buttons.length:e.key==='Home'?0:e.key==='End'?buttons.length-1:-1;
    if(next>=0){e.preventDefault();e.stopPropagation();buttons[next]?.focus()}
  }}>{children(close)}</div>,trigger.current?.closest('dialog')||document.body)}</span>;
}
export function Dropdown({label,items,icon}:{label:string;icon?:ReactNode;items:{label:string;onClick:()=>void;danger?:boolean}[]}){
  return <Popup label={label} icon={icon} menu>{close=>items.map((item)=><button type="button" role="menuitem" key={item.label} className={item.danger?'fp-error-text':''} onClick={()=>{close();item.onClick()}}>{item.label}</button>)}</Popup>
}
export function Popover({label,children}:{label:string;children:ReactNode}){return <Popup label={label}>{()=>children}</Popup>}
