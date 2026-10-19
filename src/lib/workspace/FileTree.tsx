import { useState, useRef, type KeyboardEvent } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { Dropdown } from "../Popup";
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
  namespace = "files",
  onRename,
  onRemove,
  onCreate,
  label = "文件目录",
}: FileTreeProps) {
  let [expanded, setExpanded] = useState(new Set(defaultExpanded));
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
    setExpanded((s) => {
      let n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
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
      else onSelect(node);
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
          onFocus={() => setFocus(node.id)}
          onKeyDown={(e) => key(e, node)}
          onClick={() => {
            setFocus(node.id);
            if (node.kind === "folder") toggle(node.id);
            else onSelect(node);
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
        {node.kind === "folder" && expanded.has(node.id) && (
          <div role="group">{render(node.children || [], depth + 1)}</div>
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
