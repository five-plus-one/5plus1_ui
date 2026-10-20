import { useMemo, useState, useRef, useLayoutEffect, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Checkbox } from "./index";
import {
  Folder,
  FileText,
  Search,
  LayoutGrid,
  List,
  ArrowUp,
  MoreHorizontal,
  Download,
  Share2,
  Pencil,
  Trash2,
} from "lucide-react";
import { ContextMenu, type ContextMenuItem } from "./ContextMenu";
import { Dropdown } from "./Popup";
import { AnimatedSize } from "./AnimatedSize";
import { SelectField } from "./SelectField";
export interface ExplorerResource {
  id: string;
  parentId?: string | null;
  name: string;
  kind: "folder" | "file";
  size?: number;
  modifiedAt?: string;
  thumbnailUrl?: string;
}
export interface ResourceExplorerProps {
  items: ExplorerResource[];
  folderId?: string | null;
  onFolderChange: (id: string | null) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onOpen: (item: ExplorerResource) => void;
  onAction?: (
    action: "download" | "share" | "rename" | "delete",
    items: ExplorerResource[],
  ) => void;
  onCreateFolder?: () => void;
  onUpload?: (files: File[], folderId: string | null) => void;
  onMove?: (ids: string[], folderId: string | null) => void;
  loading?: boolean;
  error?: string;
}
const bytes = (n?: number) =>
  n === undefined
    ? "—"
    : n < 1024
      ? `${n} B`
      : n < 1048576
        ? `${(n / 1024).toFixed(1)} KB`
        : `${(n / 1048576).toFixed(1)} MB`;
/** Controlled resource navigation and selection; storage and permissions belong to the host. */
export function ResourceExplorer({
  items,
  folderId = null,
  onFolderChange,
  selectedIds,
  onSelectionChange,
  onOpen,
  onAction,
  onCreateFolder,
  onUpload,
  onMove,
  loading,
  error,
}: ResourceExplorerProps) {
  const anchor = useRef<string | null>(null),
    scroll = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{
    x: number;
    y: number;
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [columns, setColumns] = useState(1);
  const [view, setView] = useState<"grid" | "list">("list"),
    [query, setQuery] = useState(""),
    [sort, setSort] = useState("name");
  const folder = items.find((i) => i.id === folderId),
    selected = items.filter((i) => selectedIds.includes(i.id));
  const ancestors: ExplorerResource[] = [];
  let parent = folder;
  const seen = new Set<string>();
  while (parent && !seen.has(parent.id)) {
    seen.add(parent.id);
    ancestors.unshift(parent);
    parent = items.find((i) => i.id === parent?.parentId);
  }
  const visible = useMemo(
    () =>
      items
        .filter(
          (i) =>
            (i.parentId || null) === folderId &&
            i.name.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          a.kind !== b.kind
            ? a.kind === "folder"
              ? -1
              : 1
            : sort === "size"
              ? (b.size || 0) - (a.size || 0)
              : sort === "modified"
                ? (b.modifiedAt || "").localeCompare(a.modifiedAt || "")
                : a.name.localeCompare(b.name, "zh-CN"),
        ),
    [items, folderId, query, sort],
  );
  useLayoutEffect(() => {
    const element = scroll.current;
    if (!element) return;
    const measure = () =>
      setColumns(Math.max(1, Math.floor((element.clientWidth - 8) / 148)));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const perRow = view === "list" ? 1 : columns;
  const virtual = useVirtualizer({
    count: Math.ceil(visible.length / perRow),
    getScrollElement: () => scroll.current,
    estimateSize: () => (view === "list" ? 52 : 156),
    overscan: 8,
    initialRect: { width: 800, height: 480 },
  });
  const windowed = visible.length > 100;
  const rows = virtual.getVirtualItems();
  const displayed = windowed
    ? rows.flatMap((row) =>
        visible.slice(row.index * perRow, (row.index + 1) * perRow),
      )
    : visible;
  useEffect(() => {
    virtual.scrollToOffset(0);
  }, [folderId, query, sort, view]);
  const canMove = (ids: string[], target: string | null) => {
    const seen = new Set<string>();
    while (target) {
      if (ids.includes(target) || seen.has(target)) return false;
      seen.add(target);
      target = items.find((item) => item.id === target)?.parentId || null;
    }
    return true;
  };
  const select = (id: string, range = false, toggle = false) => {
    if (range && anchor.current) {
      const a = visible.findIndex((i) => i.id === anchor.current),
        b = visible.findIndex((i) => i.id === id);
      if (a >= 0 && b >= 0) {
        onSelectionChange(
          visible.slice(Math.min(a, b), Math.max(a, b) + 1).map((i) => i.id),
        );
        return;
      }
    }
    anchor.current = id;
    onSelectionChange(
      toggle
        ? selectedIds.includes(id)
          ? selectedIds.filter((i) => i !== id)
          : [...selectedIds, id]
        : [id],
    );
  };
  const open = (item: ExplorerResource) => {
    if (item.kind === "folder") {
      onFolderChange(item.id);
      onSelectionChange([]);
      setQuery("");
    } else onOpen(item);
  };
  const actions = (targets: ExplorerResource[]): ContextMenuItem[] => [
    {
      id: "open",
      label: "打开",
      icon: <FileText size={15} />,
      disabled: targets.length !== 1,
      onSelect: () => open(targets[0]),
    },
    ...(onAction
      ? [
          { id: "download", label: "下载", icon: <Download size={15} /> },
          { id: "share", label: "分享", icon: <Share2 size={15} /> },
          {
            id: "rename",
            label: "重命名",
            icon: <Pencil size={15} />,
            disabled: targets.length !== 1,
          },
          {
            id: "delete",
            label: "移到回收站",
            icon: <Trash2 size={15} />,
            danger: true,
            separator: true,
          },
        ].map((a) => ({
          ...a,
          onSelect: () =>
            onAction(
              a.id as "download" | "share" | "rename" | "delete",
              targets,
            ),
        }))
      : []),
  ];
  return (
    <section className="fp-resource-explorer" aria-label="文件资源管理器">
      <header>
        <nav aria-label="文件路径">
          <button
            type="button"
            onClick={() => {
              onFolderChange(null);
              setQuery("");
            }}
          >
            全部文件
          </button>
          {ancestors.map((i) => (
            <span key={i.id}>
              {" "}
              /{" "}
              <button
                type="button"
                onClick={() => {
                  onFolderChange(i.id);
                  setQuery("");
                }}
              >
                {i.name}
              </button>
            </span>
          ))}
        </nav>
        <div className="fp-explorer-tools">
          <button
            type="button"
            aria-label="返回上级"
            disabled={!folderId}
            onClick={() => onFolderChange(folder?.parentId || null)}
          >
            <ArrowUp size={16} />
          </button>
          <label className="fp-explorer-search">
            <Search size={15} />
            <input
              aria-label="搜索当前文件夹"
              placeholder="搜索文件"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <SelectField
            label="文件排序"
            value={sort}
            onChange={setSort}
            options={[
              { value: "name", label: "名称" },
              { value: "modified", label: "最近修改" },
              { value: "size", label: "文件大小" },
            ]}
          />
          <button
            type="button"
            aria-label="列表视图"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <List size={16} />
          </button>
          <button
            type="button"
            aria-label="网格视图"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </header>
      <ContextMenu
        label="文件夹操作"
        items={[
          ...(onCreateFolder
            ? [{ id: "new", label: "新建文件夹", onSelect: onCreateFolder }]
            : []),
          {
            id: "select-all",
            label: "全选",
            onSelect: () => onSelectionChange(visible.map((i) => i.id)),
          },
          {
            id: "view",
            label: "视图",
            children: [
              {
                id: "list",
                label: "列表",
                checked: view === "list",
                onSelect: () => setView("list"),
              },
              {
                id: "grid",
                label: "网格",
                checked: view === "grid",
                onSelect: () => setView("grid"),
              },
            ],
          },
        ]}
      >
        <AnimatedSize>
          <div
            ref={scroll}
            style={{
              position: "relative",
              maxHeight: 480,
              overflow: "auto",
              ...(windowed && view === "grid"
                ? {
                    gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`,
                    rowGap: 0,
                  }
                : {}),
            }}
            onPointerDown={(e) => {
              if (
                e.button !== 0 ||
                e.pointerType === "touch" ||
                (e.target as HTMLElement).closest(
                  ".fp-explorer-item,button,input,label",
                )
              )
                return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left + e.currentTarget.scrollLeft,
                y = e.clientY - rect.top + e.currentTarget.scrollTop;
              e.currentTarget.setPointerCapture(e.pointerId);
              setBox({ x, y, left: x, top: y, width: 0, height: 0 });
            }}
            onPointerMove={(e) => {
              if (!box) return;
              const rect = e.currentTarget.getBoundingClientRect(),
                x = e.clientX - rect.left + e.currentTarget.scrollLeft,
                y = e.clientY - rect.top + e.currentTarget.scrollTop;
              const next = {
                ...box,
                left: Math.min(x, box.x),
                top: Math.min(y, box.y),
                width: Math.abs(x - box.x),
                height: Math.abs(y - box.y),
              };
              setBox(next);
              const ids = Array.from(
                e.currentTarget.querySelectorAll<HTMLElement>(
                  "[data-resource-id]",
                ),
              )
                .filter((item) => {
                  const r = item.getBoundingClientRect(),
                    left = r.left - rect.left + e.currentTarget.scrollLeft,
                    top = r.top - rect.top + e.currentTarget.scrollTop;
                  return (
                    left < next.left + next.width &&
                    left + r.width > next.left &&
                    top < next.top + next.height &&
                    top + r.height > next.top
                  );
                })
                .map((item) => item.dataset.resourceId!);
              onSelectionChange(ids);
            }}
            onPointerUp={() => setBox(null)}
            onPointerCancel={() => setBox(null)}
            className={`fp-explorer-content fp-explorer-${view}`}
            aria-busy={loading}
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.target as HTMLElement).closest("input")) return;
              if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
                e.preventDefault();
                onSelectionChange(visible.map((i) => i.id));
              }
              if (e.key === "Escape") onSelectionChange([]);
              if (e.key === "Delete" && selected.length && onAction) {
                e.preventDefault();
                onAction("delete", selected);
              }
            }}
            onDragOver={(e) => {
              if (onUpload || onMove) e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length)
                onUpload?.(Array.from(e.dataTransfer.files), folderId);
              else
                try {
                  const ids = JSON.parse(
                    e.dataTransfer.getData(
                      "application/x-fiveplusone-resources",
                    ),
                  );
                  if (
                    Array.isArray(ids) &&
                    ids.every((id) => typeof id === "string") &&
                    canMove(ids, folderId)
                  )
                    onMove?.(ids, folderId);
                } catch {
                  /* Unrelated drag data is ignored. */
                }
            }}
          >
            {error ? (
              <p role="alert">{error}</p>
            ) : loading ? (
              <p role="status">正在加载文件…</p>
            ) : !visible.length ? (
              <p className="fp-explorer-empty">
                {query ? "没有找到匹配的文件" : "文件夹还是空的"}
              </p>
            ) : (
              <>
                {windowed && (
                  <div
                    aria-hidden="true"
                    style={{
                      height: rows[0]?.start || 0,
                      gridColumn: "1 / -1",
                    }}
                  />
                )}
                {displayed.map((item) => (
                  <ContextMenu
                    key={item.id}
                    label={`${item.name}的操作`}
                    items={actions(
                      selectedIds.includes(item.id) ? selected : [item],
                    )}
                  >
                    <div
                      className="fp-explorer-item"
                      data-resource-id={item.id}
                      style={
                        windowed
                          ? {
                              height: view === "list" ? 52 : 148,
                              marginBottom: view === "grid" ? 8 : 0,
                              boxSizing: "border-box",
                            }
                          : undefined
                      }
                      data-selected={selectedIds.includes(item.id) || undefined}
                      draggable={!!onMove}
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          "application/x-fiveplusone-resources",
                          JSON.stringify(
                            selectedIds.includes(item.id)
                              ? selectedIds
                              : [item.id],
                          ),
                        );
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDoubleClick={(e) => {
                        if (
                          !(e.target as HTMLElement).closest(
                            "button,input,label",
                          )
                        )
                          open(item);
                      }}
                      onClick={(e) => {
                        if (
                          !(e.target as HTMLElement).closest(
                            "button,input,label",
                          )
                        )
                          select(item.id, e.shiftKey, e.ctrlKey || e.metaKey);
                      }}
                      onDragOver={(e) => {
                        if (item.kind === "folder" && onMove) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      onDrop={(e) => {
                        if (item.kind !== "folder") return;
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.files.length)
                          onUpload?.(Array.from(e.dataTransfer.files), item.id);
                        else
                          try {
                            const ids = JSON.parse(
                              e.dataTransfer.getData(
                                "application/x-fiveplusone-resources",
                              ),
                            );
                            if (
                              Array.isArray(ids) &&
                              ids.every((id) => typeof id === "string") &&
                              canMove(ids, item.id)
                            )
                              onMove?.(ids, item.id);
                          } catch {
                            /* Unrelated drag data is ignored. */
                          }
                      }}
                    >
                      <Checkbox
                        label=""
                        aria-label={`选择${item.name}`}
                        checked={selectedIds.includes(item.id)}
                        onClick={(e) => {
                          if (e.shiftKey) {
                            e.preventDefault();
                            select(item.id, true);
                          }
                        }}
                        onChange={() => select(item.id, false, true)}
                      />
                      <button
                        type="button"
                        className="fp-explorer-name"
                        onClick={(e) => {
                          if (e.shiftKey || e.ctrlKey || e.metaKey)
                            select(item.id, e.shiftKey, e.ctrlKey || e.metaKey);
                          else open(item);
                        }}
                      >
                        {item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt="" />
                        ) : item.kind === "folder" ? (
                          <Folder size={view === "grid" ? 36 : 19} />
                        ) : (
                          <FileText size={view === "grid" ? 32 : 19} />
                        )}
                        <span>{item.name}</span>
                      </button>
                      <small>
                        {item.kind === "folder" ? "文件夹" : bytes(item.size)}
                      </small>
                      <time>
                        {item.modifiedAt
                          ? new Date(item.modifiedAt).toLocaleDateString(
                              "zh-CN",
                            )
                          : ""}
                      </time>
                      <Dropdown
                        label={`${item.name}的更多操作`}
                        icon={<MoreHorizontal size={16} />}
                        items={actions(
                          selectedIds.includes(item.id) ? selected : [item],
                        )
                          .filter((a) => !a.disabled)
                          .map((a) => ({
                            label: a.label,
                            danger: a.danger,
                            onClick: () => a.onSelect?.(),
                          }))}
                      />
                    </div>
                  </ContextMenu>
                ))}
                {windowed && (
                  <div
                    aria-hidden="true"
                    style={{
                      height: Math.max(
                        0,
                        virtual.getTotalSize() - (rows.at(-1)?.end || 0),
                      ),
                      gridColumn: "1 / -1",
                    }}
                  />
                )}
              </>
            )}
            {box && (
              <div
                aria-hidden="true"
                className="fp-explorer-selection-box"
                style={{
                  position: "absolute",
                  left: box.left,
                  top: box.top,
                  width: box.width,
                  height: box.height,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        </AnimatedSize>
      </ContextMenu>
      <footer>
        <span>
          {selectedIds.length
            ? `已选择 ${selectedIds.length} 项`
            : `${visible.length} 项`}
        </span>
        {selectedIds.length > 0 && (
          <button type="button" onClick={() => onSelectionChange([])}>
            取消选择
          </button>
        )}
      </footer>
    </section>
  );
}
