import { Check, ChevronDown } from 'lucide-react';
import { Popup } from './Popup';

export interface SelectOption { value: string; label: string; description?: string; disabled?: boolean; group?: string; color?: string }
export interface SelectFieldProps { value: string; onChange: (value: string) => void; options: SelectOption[]; label: string; disabled?: boolean; placeholder?: string; className?: string }
/** A themed single selection surface with shared dismissal and keyboard behavior. */
export function SelectField({ value, onChange, options, label, disabled, placeholder = '请选择', className = '' }: SelectFieldProps) {
  return <span className={`fp-select-field ${className}`}><Popup label={label} role="listbox" disabled={disabled} className="fp-select-options" trigger={<><span className="fp-select-value">{options.find(option => option.value === value)?.color && <i style={{background:options.find(option => option.value === value)?.color}} />}{options.find(option => option.value === value)?.label || placeholder}</span><ChevronDown size={14} aria-hidden="true" /></>}>
    {close => options.map((option, index) => <div role="none" key={option.value}>
      {option.group && options[index - 1]?.group !== option.group && <div className="fp-select-group">{option.group}</div>}
      <button type="button" role="option" aria-selected={value === option.value} disabled={option.disabled} tabIndex={-1} onClick={() => { onChange(option.value); close(); }}><span><span className="fp-select-value">{option.color && <i style={{background:option.color}} />}{option.label}</span>{option.description && <small>{option.description}</small>}</span>{value === option.value && <Check size={14} aria-hidden="true" />}</button>
    </div>)}
  </Popup></span>;
}
