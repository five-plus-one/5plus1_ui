/** SiblingFiles - 从课栈 layout/SiblingFilesPanel 提取
 *
 * 同级内容快速切换：列出同一分类下的条目，带完成状态图标。
 * 适合"上一篇 / 下一篇"式的浏览，而不必回到文件树。
 */

import { CheckCircle2, Circle, CircleDashed } from "lucide-react";

export type SiblingStatus = "done" | "draft" | "stub";

export interface SiblingItem {
  id: string;
  title: string;
  status?: SiblingStatus;
  detail?: string;
}

export interface SiblingFilesProps {
  items: SiblingItem[];
  activeId?: string | null;
  onSelect: (item: SiblingItem) => void;
  label?: string;
}

const STATUS_ICON = {
  done: CheckCircle2,
  draft: CircleDashed,
  stub: Circle,
} as const;

export function SiblingFiles({
  items,
  activeId,
  onSelect,
  label = "同目录内容",
}: SiblingFilesProps) {
  if (!items.length) return null;
  return (
    <section className="fp-siblings" aria-label={label}>
      <header className="fp-siblings-label">{label}</header>
      <ul className="fp-siblings-list">
        {items.map((item) => {
          const Icon = STATUS_ICON[item.status ?? "stub"];
          return (
            <li key={item.id}>
              <button
                type="button"
                className="fp-sibling"
                data-status={item.status ?? "stub"}
                aria-current={item.id === activeId ? "page" : undefined}
                onClick={() => onSelect(item)}
              >
                <Icon size={14} className="fp-sibling-icon" aria-hidden="true" />
                <span className="fp-sibling-text">
                  {item.title}
                  {item.detail && <small>{item.detail}</small>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
