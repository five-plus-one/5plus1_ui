/** WindowTaskbar - 从课栈 window/WindowTaskbar 提取
 *
 * 已打开窗口的任务栏：图标按钮，当前窗口高亮，超出宽度时收进溢出菜单。
 */

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Popup } from "./Popup";

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
  const root = useRef<HTMLDivElement>(null);
  const [capacity, setCapacity] = useState(max);
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const measure = () => {
      if (element.clientWidth)
        setCapacity(
          Math.max(
            1,
            Math.min(max, Math.floor((element.clientWidth - 46) / 132)),
          ),
        );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [max, windows.length]);
  if (!windows.length) return null;
  const limit = Math.max(1, Math.min(max, capacity));
  const visible = windows.slice(0, limit);
  const overflow = windows.slice(limit);
  return (
    <div ref={root} className="fp-taskbar" role="toolbar" aria-label={label}>
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
        <Popup
          label={`还有 ${overflow.length} 个窗口`}
          menu
          trigger={<span>+{overflow.length}</span>}
        >
          {(close) =>
            overflow.map((window) => (
              <button
                type="button"
                role="menuitem"
                key={window.id}
                onClick={() => {
                  close();
                  onSelect(window.id);
                }}
              >
                {window.icon}
                {window.title}
              </button>
            ))
          }
        </Popup>
      )}
    </div>
  );
}
