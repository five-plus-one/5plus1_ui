/** WindowTaskbar - 从课栈 window/WindowTaskbar 提取
 *
 * 已打开窗口的任务栏：图标按钮，当前窗口高亮，超出宽度时收进溢出菜单。
 */

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface TaskbarWindow {
  id: string;
  title: string;
  icon?: ReactNode;
  active?: boolean;
}

export interface WindowTaskbarProps {
  windows: TaskbarWindow[];
  onSelect: (id: string) => void;
  /** 最多直接显示的窗口数 */
  max?: number;
  label?: string;
}

export function WindowTaskbar({
  windows,
  onSelect,
  max = 5,
  label = "已打开的窗口",
}: WindowTaskbarProps) {
  if (!windows.length) return null;
  const visible = windows.slice(0, max);
  const overflow = windows.slice(max);
  return (
    <div className="fp-taskbar" role="toolbar" aria-label={label}>
      {visible.map((w) => (
        <button
          key={w.id}
          type="button"
          className="fp-taskbar-item"
          aria-pressed={w.active}
          title={w.title}
          onClick={() => onSelect(w.id)}
        >
          <span className="fp-taskbar-dot" aria-hidden="true" />
          {w.icon}
          <span className="fp-taskbar-title">{w.title}</span>
        </button>
      ))}
      {overflow.length > 0 && (
        <details className="fp-taskbar-more">
          <summary aria-label={`还有 ${overflow.length} 个窗口`}>
            <ChevronDown size={14} />
            +{overflow.length}
          </summary>
          <div className="fp-taskbar-more-list">
            {overflow.map((w) => (
              <button key={w.id} type="button" onClick={() => onSelect(w.id)}>
                {w.icon}
                {w.title}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
