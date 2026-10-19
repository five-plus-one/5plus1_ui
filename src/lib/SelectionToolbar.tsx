/** SelectionToolbar - 从课栈 notes/SelectionPopover 提取
 *
 * 划词后出现的浮动工具栏：靠近选区显示，支持键盘焦点，
 * 点击外部或按 Esc 收起，位置在视口内自动收敛。
 */

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface SelectionAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  /** 危险操作用不同颜色 */
  danger?: boolean;
}

export interface SelectionToolbarProps {
  /** 选区矩形（来自 window.getSelection().getRangeAt(0).getBoundingClientRect()） */
  anchor: { x: number; y: number; width?: number } | null;
  actions: SelectionAction[];
  onClose: () => void;
  /** 选中文本预览，显示在工具栏左侧 */
  preview?: string;
}

export function SelectionToolbar({
  anchor,
  actions,
  onClose,
  preview,
}: SelectionToolbarProps) {
  const panel = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!anchor || !panel.current) {
      setPos(null);
      return;
    }
    const box = panel.current.getBoundingClientRect();
    const left = Math.max(
      8,
      Math.min(anchor.x - box.width / 2, window.innerWidth - box.width - 8),
    );
    const above = anchor.y - box.height - 8;
    const top = above > 8 ? above : anchor.y + 12;
    setPos({ left, top });
  }, [anchor]);

  useEffect(() => {
    if (!anchor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown, true);
    };
  }, [anchor, onClose]);

  if (!anchor || typeof window === "undefined") return null;

  return createPortal(
    <div
      ref={panel}
      className="fp-selection-toolbar"
      role="toolbar"
      aria-label="选区操作"
      style={{
        left: pos?.left ?? anchor.x,
        top: pos?.top ?? anchor.y - 44,
        visibility: pos ? "visible" : "hidden",
      }}
    >
      {preview && (
        <span className="fp-selection-preview" title={preview}>
          {preview.slice(0, 24)}
          {preview.length > 24 ? "…" : ""}
        </span>
      )}
      {actions.map((a) => (
        <button
          key={a.id}
          type="button"
          className="fp-selection-action"
          data-danger={a.danger || undefined}
          onClick={() => {
            a.onClick();
            onClose();
          }}
        >
          {a.icon}
          {a.label}
        </button>
      ))}
    </div>,
    document.body,
  );
}
