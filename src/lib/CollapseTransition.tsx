/** KeZhan 专用组件：动画折叠容器
 *
 * 基于高度过渡实现平滑的展开/折叠动画
 * 用于文件树子节点、设置面板等场景
 */

import { useEffect, useRef, useState } from "react";

export interface CollapseTransitionProps {
  isOpen: boolean;
  children: React.ReactNode;
  /** 动画时长（ms，默认 260） */
  duration?: number;
  /** 缓动函数（默认 cubic-bezier(0.2, 0, 0, 1)） */
  easing?: string;
}

export function CollapseTransition({
  isOpen,
  children,
  duration = 260,
  easing = "cubic-bezier(0.2, 0, 0, 1)",
}: CollapseTransitionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(isOpen ? "auto" : 0);
  const [overflow, setOverflow] = useState(isOpen ? "visible" : "hidden");

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      // 展开：0 → scrollHeight → auto
      setOverflow("hidden");
      setHeight(0);
      requestAnimationFrame(() => {
        setHeight(el.scrollHeight);
      });
      const timer = setTimeout(() => {
        setHeight("auto");
        setOverflow("visible");
      }, duration);
      return () => clearTimeout(timer);
    } else {
      // 折叠：auto → scrollHeight → 0
      setHeight(el.scrollHeight);
      setOverflow("hidden");
      requestAnimationFrame(() => {
        setHeight(0);
      });
    }
  }, [isOpen, duration]);

  return (
    <div
      className="fp-collapse-transition"
      style={{
        height: height === "auto" ? "auto" : `${height}px`,
        overflow,
        transition: height === "auto" ? "none" : `height ${duration}ms ${easing}`,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
