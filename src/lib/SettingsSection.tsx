/** SettingsSection - 从课栈 layout/SettingsSection 提取
 *
 * 设置页的分组卡片：图标 + 标题 + 摘要，点击展开内容。
 * 与 Accordion 的区别是带有图标容器与摘要行，适合设置面板。
 */

import { type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface SettingsSectionProps {
  title: string;
  icon: ReactNode;
  summary?: ReactNode;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
}

export function SettingsSection({
  title,
  icon,
  summary,
  children,
  open,
  onToggle,
}: SettingsSectionProps) {
  return (
    <section className="fp-settings-section" data-open={open || undefined}>
      <button
        type="button"
        className="fp-settings-head"
        aria-expanded={open}
        aria-label={title}
        onClick={onToggle}
      >
        <span className="fp-settings-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="fp-settings-titles">
          <strong>{title}</strong>
          {summary && <small>{summary}</small>}
        </span>
        <ChevronDown size={16} className="fp-settings-chevron" />
      </button>
      <div className="fp-settings-body" inert={!open} aria-hidden={!open}>
        <div className="fp-settings-inner">{children}</div>
      </div>
    </section>
  );
}
