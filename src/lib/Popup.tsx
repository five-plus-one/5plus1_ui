import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

export interface PopupProps {
  label: string;
  children: (close: () => void) => ReactNode;
  menu?: boolean;
  icon?: ReactNode;
  trigger?: ReactNode;
  disabled?: boolean;
  className?: string;
  role?: 'menu' | 'dialog' | 'listbox';
}
/** Anchored surface with dismissal, keyboard navigation and viewport bounds. */
export function Popup({ label, children, menu = false, icon, trigger: triggerContent, disabled, className = '', role: suppliedRole }: PopupProps) {
  const [open, setOpen] = useState(false), [exiting, setExiting] = useState(false);
  const dismiss = () => { setExiting(true); setOpen(false); };
  useEffect(() => { if (!exiting) return; const timer = setTimeout(() => setExiting(false), 120); return () => clearTimeout(timer); }, [exiting]);
  const trigger = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const role = suppliedRole || (menu ? 'menu' : 'dialog');
  const [position, setPosition] = useState({ left: 8, top: 8, maxHeight: 400 });
  const close = () => { dismiss(); trigger.current?.focus(); };
  const selector = role === 'listbox' ? '[role="option"]:not(:disabled)' : '[role="menuitem"]:not(:disabled)';
  const focusItem = (last = false) => requestAnimationFrame(() => {
    const items = panel.current?.querySelectorAll<HTMLElement>(selector);
    const selected = panel.current?.querySelector<HTMLElement>('[aria-selected="true"]:not(:disabled)');
    (last ? items?.[items.length - 1] : selected || items?.[0])?.focus();
  });
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const anchor = trigger.current?.getBoundingClientRect(), box = panel.current?.getBoundingClientRect();
      if (!anchor || !box) return;
      const below = window.innerHeight - anchor.bottom - 16, above = anchor.top - 16;
      const upwards = below < Math.min(box.height, 240) && above > below;
      const maxHeight = Math.max(80, upwards ? above : below);
      const next = { left: Math.max(8, Math.min(anchor.left, window.innerWidth - box.width - 8)), top: upwards ? Math.max(8, anchor.top - Math.min(box.height, maxHeight) - 8) : anchor.bottom + 8, maxHeight };
      setPosition(old => old.left === next.left && old.top === next.top && old.maxHeight === next.maxHeight ? old : next);
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place);
    if (panel.current) observer?.observe(panel.current);
    return () => { observer?.disconnect(); window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open]);
  useEffect(() => { if (disabled && open) dismiss(); }, [disabled]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => { const node = event.target as Node; if (!trigger.current?.contains(node) && !panel.current?.contains(node)) dismiss(); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); } };
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('focusin', outside, true);
    document.addEventListener('keydown', escape, true);
    if (role !== 'dialog') focusItem();
    else requestAnimationFrame(() => (panel.current?.querySelector<HTMLElement>('[aria-pressed="true"]:not(:disabled)') || panel.current?.querySelector<HTMLElement>('input:not(:disabled), button:not(:disabled), [tabindex="0"]'))?.focus({preventScroll:true}));
    return () => { document.removeEventListener('pointerdown', outside, true); document.removeEventListener('focusin', outside, true); document.removeEventListener('keydown', escape, true); };
  }, [open]);
  return <span className="fp-dropdown"><button type="button" ref={trigger} disabled={disabled} aria-label={label} aria-expanded={open} aria-controls={open ? id : undefined} aria-haspopup={role}
    className={`fp-popup-trigger${icon ? ' fp-popup-icon' : ''}`} onClick={() => { if (open) dismiss(); else { setExiting(false); setOpen(true); } }}
    onKeyDown={e => { if (role !== 'dialog' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); setOpen(true); focusItem(e.key === 'ArrowUp'); } }}>
    {triggerContent || icon || <><span>{label}</span><ChevronDown size={15} aria-hidden="true" /></>}
  </button>{(open || exiting) && createPortal(<div ref={panel} id={id} role={role} aria-label={label} aria-hidden={exiting || undefined} inert={exiting} data-exiting={exiting || undefined}
    className={`fp-popup-panel ${role === 'menu' ? 'fp-popup-menu' : role === 'listbox' ? 'fp-popup-listbox' : 'fp-popover-content'} ${className}`}
    style={{ position: 'fixed', ...position, overflowY: 'auto', maxWidth: 'calc(100vw - 16px)' }}
    onKeyDown={e => {
      if (role === 'dialog') return;
      if (e.key === 'Tab') { dismiss(); trigger.current?.focus(); return; }
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>(selector) || []);
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = e.key === 'ArrowDown' ? (index + 1) % items.length : e.key === 'ArrowUp' ? (index - 1 + items.length) % items.length : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : -1;
      if (next >= 0) { e.preventDefault(); e.stopPropagation(); items[next]?.focus(); }
    }}>{children(close)}</div>, trigger.current?.closest('dialog') || document.body)}</span>;
}
export function Dropdown({ label, items, icon }: { label: string; icon?: ReactNode; items: { label: string; onClick: () => void; danger?: boolean }[] }) {
  return <Popup label={label} icon={icon} menu>{close => items.map(item => <button type="button" role="menuitem" key={item.label} className={item.danger ? 'fp-error-text' : ''} onClick={() => { close(); item.onClick(); }}>{item.label}</button>)}</Popup>;
}
export function Popover({ label, children }: { label: string; children: ReactNode }) { return <Popup label={label}>{() => children}</Popup>; }
