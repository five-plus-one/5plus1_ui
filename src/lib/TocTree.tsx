/** TocTree - 从课栈 layout/TocTree 提取
 *
 * 文档标题目录：按层级缩进，点击滚动到对应章节，支持当前章节高亮。
 * 与 FileTree 的区别是用于页内导航，只有标题与层级。
 */

import { useId, type ReactNode } from "react";
import { FileText } from "lucide-react";

export interface TocItemNode {
  id: string;
  text: string;
  level?: number;
  children?: TocItemNode[];
}

export interface TocTreeProps {
  items: TocItemNode[];
  /** 当前章节 id */
  activeId?: string | null;
  onSelect?: (id: string) => void;
  /** 无滚动目标时用于定位，默认按 id 查找元素 */
  scrollContainer?: string;
  label?: string;
  empty?: ReactNode;
}

function flatten(
  nodes: TocItemNode[],
  depth = 0,
): { node: TocItemNode; depth: number }[] {
  return nodes.flatMap((node) => [
    { node, depth },
    ...flatten(node.children || [], depth + 1),
  ]);
}

export function TocTree({
  items,
  activeId,
  onSelect,
  label = "目录",
  empty = "这篇内容还没有小节标题。",
}: TocTreeProps) {
  const rows = flatten(items);
  if (!rows.length)
    return <p className="fp-toc-empty">{empty}</p>;
  return (
    <nav className="fp-toc" aria-label={label}>
      {rows.map(({ node, depth }) => {
        const level = node.level ?? 1;
        return (
          <button
            key={node.id}
            type="button"
            className="fp-toc-row"
            data-level={level}
            data-active={node.id === activeId || undefined}
            style={{ paddingLeft: 8 + depth * 16 }}
            title={node.text}
            aria-current={node.id === activeId ? "location" : undefined}
            onClick={() => {
              onSelect?.(node.id);
              const target = document.getElementById(node.id);
              target?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {level === 1 ? (
              <FileText size={14} aria-hidden="true" />
            ) : (
              <span className="fp-toc-dot" aria-hidden="true" />
            )}
            <span>{node.text}</span>
          </button>
        );
      })}
    </nav>
  );
}
