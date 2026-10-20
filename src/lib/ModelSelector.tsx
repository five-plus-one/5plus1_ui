import { Check, ChevronDown, Cpu, Eye, Wrench, Brain } from 'lucide-react';
import { Popup } from './Popup';

export interface ModelInfo {
  id: string;
  label: string;
  /** Context window in tokens, for example 128_000. */
  contextWindow?: number;
  supportsThinking?: boolean;
  supportsVision?: boolean;
  supportsTools?: boolean;
  description?: string;
  disabled?: boolean;
}
export interface ModelGroup { name: string; models: ModelInfo[] }
export interface ModelSelectorProps { value: string; onChange: (modelId: string) => void; groups: ModelGroup[]; disabled?: boolean; label?: string }
export function formatContextWindow(tokens?: number) {
  if (!tokens || tokens <= 0) return '';
  if (tokens >= 1_000_000) return `${+(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${+(tokens / 1_000).toFixed(1)}K`;
  return `${tokens}`;
}
export function ModelSelector({ value, onChange, groups, disabled, label = '选择模型' }: ModelSelectorProps) {
  const model = groups.flatMap(group => group.models).find(item => item.id === value);
  return <span className="fp-model-selector"><Popup label={label} role="listbox" disabled={disabled || !groups.some(group => group.models.length)} className="fp-model-selector-panel"
    trigger={<><Cpu size={16} aria-hidden="true" /><span>{model?.label || value || '选择模型'}</span><ChevronDown size={14} aria-hidden="true" /></>}>
    {close => groups.filter(group => group.models.length).map(group => <div key={group.name} role="group" aria-label={group.name} className="fp-model-group">
      <div className="fp-model-group-label">{group.name}</div>
      {group.models.map(item => <button type="button" role="option" aria-selected={item.id === value} disabled={item.disabled} tabIndex={-1} key={item.id} className="fp-model-item" onClick={() => { close(); onChange(item.id); }}>
        <span className="fp-model-item-copy"><span className="fp-model-item-main"><span className="fp-model-item-label">{item.label}</span><span className="fp-model-item-context">{formatContextWindow(item.contextWindow)}</span></span>
          {item.description && <span className="fp-model-item-description">{item.description}</span>}
          {(item.supportsThinking || item.supportsVision || item.supportsTools) && <span className="fp-model-capabilities">
            {item.supportsThinking && <span><Brain size={12} aria-hidden="true" />推理</span>}
            {item.supportsVision && <span><Eye size={12} aria-hidden="true" />视觉</span>}
            {item.supportsTools && <span><Wrench size={12} aria-hidden="true" />工具</span>}
          </span>}
        </span><Check size={16} className="fp-model-item-check" aria-hidden="true" style={{ visibility: item.id === value ? 'visible' : 'hidden' }} />
      </button>)}
    </div>)}
  </Popup></span>;
}
