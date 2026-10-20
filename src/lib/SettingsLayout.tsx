import { useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
export interface SettingsCategory { id: string; label: string; icon?: ReactNode; }
export interface SettingsLayoutProps { items: SettingsCategory[]; value: string; onChange: (id: string) => void; onClose: () => void; children: ReactNode; }
export function SettingsLayout({ items, value, onChange, onClose, children }: SettingsLayoutProps) {
  const [query, setQuery] = useState("");
  return <div className="fp-settings-layout">
    <aside><h2>设置</h2><label className="fp-settings-search"><Search size={16} aria-hidden="true"/><input aria-label="搜索设置" placeholder="搜索设置" value={query} onChange={e=>setQuery(e.target.value)}/></label>
      <nav aria-label="设置分类">{items.filter(item=>item.label.includes(query.trim())).map(item=><button type="button" key={item.id} aria-current={value===item.id?"page":undefined} onClick={()=>onChange(item.id)}>{item.icon}<span>{item.label}</span></button>)}</nav>
    </aside>
    <section className="fp-settings-page"><header><h2>{items.find(item=>item.id===value)?.label}</h2><button type="button" className="fp-theme-toggle" aria-label="关闭" onClick={onClose}><X size={20}/></button></header><div className="fp-settings-page-content">{children}</div></section>
  </div>;
}
