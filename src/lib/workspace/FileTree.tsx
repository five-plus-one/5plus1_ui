import { useState, useRef, type KeyboardEvent, type MouseEvent, type DragEvent } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { Dropdown } from "../Popup";
import { CollapseTransition } from '../CollapseTransition';
export type FileTreeNode = {
  id: string;
  name: string;
  kind: "folder" | "file";
  children?: FileTreeNode[];
  detail?: string;
};
export type FileTreeProps = {
  items: FileTreeNode[];
  selectedId?: string;
  onSelect: (item: FileTreeNode) => void;
  defaultExpanded?: string[];
  expandedIds?: readonly string[];
  onExpandedChange?: (ids: string[]) => void;
  onToggle?: (id: string, expanded: boolean) => void;
  onPrefetch?: (node: FileTreeNode) => void;
  /** Receives modifier keys for opening a tab or a split view. */
  onOpen?: (node: FileTreeNode, event: MouseEvent | KeyboardEvent) => void;
  onMiddleClick?: (node: FileTreeNode, event: MouseEvent) => void;
  onNodeDragStart?: (node: FileTreeNode, event: DragEvent) => void;
  onNodeDrop?: (node: FileTreeNode, event: DragEvent) => void;
  namespace?: string;
  onRename?: (node: FileTreeNode) => void;
  onRemove?: (node: FileTreeNode) => void;
  onCreate?: (parent: FileTreeNode) => void;
  label?: string;
};
export function FileTree({
  items,
  selectedId,
  onSelect,
  defaultExpanded = [],
  expandedIds,
  onExpandedChange,
  onToggle,
  onPrefetch,
  onOpen,
  onMiddleClick,
  onNodeDragStart,
  onNodeDrop,
  namespace = "files",
  onRename,
  onRemove,
  onCreate,
  label = "文件目录",
}: FileTreeProps) {
  let [localExpanded, setExpanded] = useState(new Set(defaultExpanded));
  const expanded = expandedIds === undefined ? localExpanded : new Set(expandedIds);
  let host = useRef<HTMLDivElement>(null);
  let [focus, setFocus] = useState<string | null>(null);
  let visible: FileTreeNode[] = [];
  function flatten(nodes: FileTreeNode[]) {
    nodes.forEach((n) => {
      visible.push(n);
      if (expanded.has(n.id) && n.children) flatten(n.children);
    });
  }
  flatten(items);
  function toggle(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    if (expandedIds === undefined) setExpanded(next);
    onExpandedChange?.([...next]);
    onToggle?.(id, next.has(id));
  }
  function focusNode(id: string) {
    setFocus(id);
    requestAnimationFrame(() =>
      host.current
        ?.querySelector<HTMLElement>(`[data-node="${CSS.escape(id)}"]`)
        ?.focus(),
    );
  }
  function key(e: KeyboardEvent, node: FileTreeNode) {
    let i = visible.findIndex((n) => n.id === node.id);
    if (
      [
        "ArrowDown",
        "ArrowUp",
        "Home",
        "End",
        "ArrowRight",
        "ArrowLeft",
        "Enter",
        " ",
      ].includes(e.key)
    )
      e.preventDefault();
    if (e.key === "ArrowDown")
      focusNode(visible[Math.min(visible.length - 1, i + 1)].id);
    if (e.key === "ArrowUp") focusNode(visible[Math.max(0, i - 1)].id);
    if (e.key === "Home") focusNode(visible[0].id);
    if (e.key === "End") focusNode(visible[visible.length - 1].id);
    if (e.key === "ArrowRight" && node.kind === "folder") {
      if (!expanded.has(node.id)) toggle(node.id);
      else if (node.children?.[0]) focusNode(node.children[0].id);
    }
    if (e.key === "ArrowLeft") {
      if (expanded.has(node.id)) toggle(node.id);
      else {
        function findParent(nodes: FileTreeNode[]): FileTreeNode | undefined {
          for (let n of nodes) {
            if (n.children?.some((c) => c.id === node.id)) return n;
            let p = n.children && findParent(n.children);
            if (p) return p;
          }
        }
        let p = findParent(items);
        if (p) focusNode(p.id);
      }
    }
    if (e.key === "Enter" || e.key === " ") {
      if (node.kind === "folder") toggle(node.id);
      else { onSelect(node); onOpen?.(node, e); }
    }
  }
  function render(nodes: FileTreeNode[], depth = 0) {
    return nodes.map((node) => (
      <div role="none" key={`${namespace}/${node.id}`}>
        <div
          role="treeitem"
          aria-level={depth + 1}
          aria-expanded={
            node.kind === "folder" ? expanded.has(node.id) : undefined
          }
          aria-selected={selectedId === node.id}
          tabIndex={
            (visible.find((n) => n.id === focus)?.id ||
              visible.find((n) => n.id === selectedId)?.id ||
              visible[0]?.id) === node.id ? 0 : -1
          }
          data-node={node.id}
          className="fp-file-tree-row"
          style={{ paddingLeft: 12 + depth * 18 }}
          onFocus={(e) => { if (e.target === e.currentTarget) { setFocus(node.id); onPrefetch?.(node); } }}
          onMouseEnter={() => onPrefetch?.(node)}
          draggable={node.kind === 'file' && !!onNodeDragStart}
          onDragStart={(e) => onNodeDragStart?.(node, e)}
          onDragOver={onNodeDrop ? e => e.preventDefault() : undefined}
          onDrop={onNodeDrop ? e => { e.preventDefault(); onNodeDrop(node, e); } : undefined}
          onAuxClick={e => { if (e.button === 1 && node.kind === 'file' && onMiddleClick) { e.preventDefault(); onMiddleClick(node, e); } }}
          onKeyDown={(e) => key(e, node)}
          onClick={(e) => {
            setFocus(node.id);
            if (node.kind === "folder") toggle(node.id);
            else { onSelect(node); onOpen?.(node, e); }
          }}
        >
          {node.kind === "folder" ? (
            <>
              <ChevronRight
                size={13}
                className={expanded.has(node.id) ? "is-expanded" : ""}
              />
              {expanded.has(node.id) ? (
                <FolderOpen size={16} />
              ) : (
                <Folder size={16} />
              )}
            </>
          ) : (
            <>
              <span style={{ width: 13 }} />
              <FileText size={16} />
            </>
          )}
          <span className="fp-tree-name" title={node.name}>{node.name}</span>
          {(onRename || onRemove || (node.kind === "folder" && onCreate)) && (
            <span
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="fp-tree-actions"
            >
              <Dropdown
                label="操作"
                icon={<MoreHorizontal size={16} aria-hidden="true" />}
                items={[
                  ...(node.kind === "folder" && onCreate
                    ? [{ label: "新建文件", onClick: () => onCreate(node) }]
                    : []),
                  ...(onRename
                    ? [{ label: "重命名", onClick: () => onRename(node) }]
                    : []),
                  ...(onRemove
                    ? [
                        {
                          label: "移除",
                          danger: true,
                          onClick: () => onRemove(node),
                        },
                      ]
                    : []),
                ]}
              />
            </span>
          )}
        </div>
        {node.kind === "folder" && (
          <CollapseTransition isOpen={expanded.has(node.id)}><div role="group">{render(node.children || [], depth + 1)}</div></CollapseTransition>
        )}
      </div>
    ));
  }
  return (
    <div ref={host} className="fp-file-tree" role="tree" aria-label={label}>
      {render(items)}
      {!items.length && <p>还没有文件，添加资料后会显示在这里。</p>}
    </div>
  );
}
