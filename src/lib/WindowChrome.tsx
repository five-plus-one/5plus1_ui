/** WindowChrome - 从课栈 window/WindowChrome 提取
 *
 * 浮动窗口标题栏：标题在左，附加操作和窗口控制在右。
 * 仅作为视觉外壳，窗口拖拽通过 onDragStart 交给调用方。
 */

import type { PointerEvent, ReactNode } from "react";
import { Maximize2, Minimize2, X, Minus } from "lucide-react";

export interface WindowChromeProps {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
  children: ReactNode;
  onDragStart?: (event: PointerEvent<HTMLElement>) => void;
  /** 标题栏右侧附加操作 */
  actions?: ReactNode;
  className?: string;
}

export function WindowChrome({
  title,
  icon,
  onClose,
  onMinimize,
  onFullscreen,
  isFullscreen = false,
  children,
  onDragStart,
  actions,
  className,
}: WindowChromeProps) {
  return (
    <div className={`fp-window ${className || ""}`}>
      <header
        className="fp-window-bar"
        onPointerDown={(event) => {
          if (
            event.button === 0 &&
            !(event.target as Element).closest(
              "button,a,input,textarea,select,[data-no-drag]",
            )
          ) onDragStart?.(event);
        }}
        data-draggable={onDragStart ? true : undefined}
      >
        <div className="fp-window-title">
          {icon}
          <span title={title}>{title}</span>
        </div>
        {actions && (
          <div className="fp-window-actions" data-no-drag>
            {actions}
          </div>
        )}
        <div className="fp-window-controls" data-no-drag>
          {onMinimize && (
            <button
              type="button"
              className="fp-window-control"
              aria-label="最小化窗口"
              title="最小化"
              onClick={onMinimize}
            >
              <Minus size={16} />
            </button>
          )}
          {onFullscreen && (
            <button
              type="button"
              className="fp-window-control"
              aria-label={isFullscreen ? "退出全屏" : "全屏"}
              title={isFullscreen ? "退出全屏" : "全屏"}
              onClick={onFullscreen}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
          <button
            type="button"
            className="fp-window-control fp-window-control-close"
            aria-label="关闭窗口"
            title="关闭"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
      </header>
      <div className="fp-window-body">{children}</div>
    </div>
  );
}
