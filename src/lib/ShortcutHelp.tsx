/** ShortcutHelp - 从课栈 keyboard/ShortcutHelpOverlay 提取
 *
 * 快捷键参考面板：按分类列出组合键与说明，点击遮罩或 Esc 关闭。
 * 同时提供 useShortcutHelp 需要的受控开关。
 */

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Keyboard, X } from "lucide-react";

export interface ShortcutItem {
  /** 组合键，例如 "Ctrl K" 或 "⌘ K" */
  keys: string;
  description: string;
}

export interface ShortcutCategory {
  id: string;
  label: string;
  items: ShortcutItem[];
}

export interface ShortcutHelpProps {
  open: boolean;
  onClose: () => void;
  categories: ShortcutCategory[];
  title?: string;
  /** 面板底部附加说明 */
  footnote?: ReactNode;
}

export function ShortcutHelp({
  open,
  onClose,
  categories,
  title = "快捷键参考",
  footnote,
}: ShortcutHelpProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div className="fp-shortcut-scrim" onPointerDown={onClose}>
      <div
        className="fp-shortcut"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <header className="fp-shortcut-head">
          <Keyboard size={18} aria-hidden="true" />
          <strong>{title}</strong>
          <button
            type="button"
            className="fp-icon-button fp-sm"
            aria-label="关闭快捷键参考"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </header>
        <div className="fp-shortcut-body">
          {categories.map((cat) => (
            <section key={cat.id} className="fp-shortcut-group">
              <h3>{cat.label}</h3>
              <dl>
                {cat.items.map((item) => (
                  <div key={item.keys + item.description}>
                    <dt>
                      {item.keys.split(" ").map((k, i) => (
                        <span key={i} className="fp-kbd">
                          {k}
                        </span>
                      ))}
                    </dt>
                    <dd>{item.description}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
        {footnote && <footer className="fp-shortcut-foot">{footnote}</footer>}
      </div>
    </div>,
    document.body,
  );
}
