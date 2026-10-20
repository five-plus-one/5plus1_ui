import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popup } from './Popup';

export interface SelectOption { value: string; label: string; description?: string; disabled?: boolean; group?: string; color?: string }
export interface SelectFieldProps { value: string; onChange: (value: string) => void; options: SelectOption[]; label: string; disabled?: boolean; placeholder?: string; className?: string; searchable?: boolean }
/** A themed single selection surface with shared dismissal and keyboard behavior. */
export function SelectField({ value, onChange, options, label, disabled, placeholder = '请选择', className = '', searchable = options.length > 8 }: SelectFieldProps) {
  return <span className={`fp-select-field ${className}`}><Popup label={label} role="listbox" disabled={disabled} className="fp-select-options" trigger={<><span className="fp-select-value">{options.find(option => option.value === value)?.color && <i style={{background:options.find(option => option.value === value)?.color}} />}{options.find(option => option.value === value)?.label || placeholder}</span><ChevronDown size={14} aria-hidden="true" /></>}>
    {close => <SelectOptions options={options} value={value} searchable={searchable} onSelect={next => { onChange(next); close(); }} />}

  </Popup></span>;
}

function SelectOptions({ options, value, searchable, onSelect }: { options: SelectOption[]; value:string; searchable:boolean; onSelect:(value:string)=>void }) {
  const [query,setQuery]=useState('');
  const filtered=options.filter(option=>`${option.label} ${option.value} ${option.description||''}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>{searchable&&<div className="fp-select-search"><input aria-label="搜索选项" placeholder="搜索…" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.nativeEvent.isComposing)return;if(e.key==='ArrowDown'){e.preventDefault();e.currentTarget.parentElement?.nextElementSibling?.querySelector<HTMLElement>('[role="option"]:not(:disabled)')?.focus();}if(e.key==='Enter'){e.preventDefault();const choice=filtered.find(option=>!option.disabled);if(choice)onSelect(choice.value);}if(e.key!=='Escape')e.stopPropagation();}} /></div>}<div className="fp-select-scroll">{filtered.map((option,index)=><div role="none" key={option.value}>{option.group&&filtered[index-1]?.group!==option.group&&<div className="fp-select-group">{option.group}</div>}<button type="button" role="option" aria-selected={value===option.value} disabled={option.disabled} tabIndex={-1} onClick={()=>onSelect(option.value)}><span><span className="fp-select-value">{option.color&&<i style={{background:option.color}}/>}{option.label}</span>{option.description&&<small>{option.description}</small>}</span>{value===option.value&&<Check size={14} aria-hidden="true"/>}</button></div>)}{!filtered.length&&<p className="fp-select-empty">没有匹配的选项</p>}</div></>;
}
