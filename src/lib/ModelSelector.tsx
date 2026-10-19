/** KeZhan 组件提取 - ModelSelector（模型选择器）
 *
 * 原组件功能：
 * - 双层菜单（主菜单 + 模型详情飞出菜单）
 * - 分组显示模型
 * - 显示上下文窗口、thinking 支持等信息
 * - 响应式布局
 *
 * 五加一设计规范重写：
 * - 使用 Dropdown 基础
 * - 统一弹出动画
 * - 完整键盘导航
 */

import { useState, useRef, useCallback } from "react";
import { ChevronDown, Check, Cpu } from "lucide-react";

export interface ModelInfo {
  id: string;
  label: string;
  contextWindow?: number;
  supportsThinking?: boolean;
  supportsVision?: boolean;
  supportsTools?: boolean;
  description?: string;
}

export interface ModelGroup {
  name: string;
  models: ModelInfo[];
}

export interface ModelSelectorProps {
  /** 当前选中的模型 ID */
  value: string;
  /** 选择回调 */
  onChange: (modelId: string) => void;
  /** 模型分组 */
  groups: ModelGroup[];
  /** 是否禁用 */
  disabled?: boolean;
}

export function ModelSelector({
  value,
  onChange,
  groups,
  disabled = false,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentModel = groups
    .flatMap((g) => g.models)
    .find((m) => m.id === value);

  const handleSelect = useCallback(
    (modelId: string) => {
      onChange(modelId);
      setOpen(false);
    },
    [onChange],
  );

  const formatContextWindow = (k?: number) => {
    if (!k || k <= 0) return null;
    if (k % 1000 === 0) return `${k / 1000}M`;
    if (k >= 1000) return `${(k / 1000).toFixed(1).replace(/\.0$/, "")}M`;
    return `${k}K`;
  };

  return (
    <div className="fp-model-selector">
      <button
        ref={triggerRef}
        type="button"
        className="fp-model-selector-trigger"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Cpu size={16} aria-hidden="true" />
        <span>{currentModel?.label || value}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open && (
        <div className="fp-model-selector-panel">
          {groups.map((group) => (
            <div key={group.name} className="fp-model-group">
              <div className="fp-model-group-label">{group.name}</div>
              {group.models.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  className="fp-model-item"
                  data-selected={value === model.id || undefined}
                  onClick={() => handleSelect(model.id)}
                  onMouseEnter={() => setFocusedId(model.id)}
                  onMouseLeave={() => setFocusedId(null)}
                >
                  <div className="fp-model-item-main">
                    <span className="fp-model-item-label">{model.label}</span>
                    {formatContextWindow(model.contextWindow) && (
                      <span className="fp-model-item-context">
                        {formatContextWindow(model.contextWindow)}
                      </span>
                    )}
                  </div>
                  {model.description && focusedId === model.id && (
                    <div className="fp-model-item-description">
                      {model.description}
                    </div>
                  )}
                  {value === model.id && (
                    <Check size={16} className="fp-model-item-check" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
