/** CollapsibleSection - 从课栈 review/CollapsibleSection 提取
 *
 * 标题行 + 高度动画的小节，用于原文、解析等长内容。
 * 与 Accordion 的区别：条目独立、可嵌入任意容器，并支持右侧附加信息。
 */

import { useId, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export interface CollapsibleSectionProps {
  label: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  /** 标题行右侧附加信息，例如字数 */
  meta?: ReactNode;
  className?: string;
}

export function CollapsibleSection({
  label,
  children,
  defaultOpen = false,
  meta,
  className,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={`fp-collapsible ${className || ""}`}>
      <button
        type="button"
        className="fp-collapsible-head"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronRight size={14} className="fp-collapsible-chevron" />
        <span className="fp-collapsible-label">{label}</span>
        {meta != null && <span className="fp-collapsible-meta">{meta}</span>}
      </button>
      <div id={id} className="fp-collapsible-body" inert={!open} aria-hidden={!open} data-open={open || undefined}>
        <div className="fp-collapsible-inner">{children}</div>
      </div>
    </div>
  );
}
