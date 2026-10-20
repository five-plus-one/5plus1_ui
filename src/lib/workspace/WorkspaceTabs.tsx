import { useRef, type ReactNode } from "react";
import { X, Columns2 } from "lucide-react";
import { ContextMenu } from "../ContextMenu";
export interface WorkspaceTab {
  id: string;
  title: string;
  icon?: ReactNode;
  dirty?: boolean;
  closable?: boolean;
}
export interface WorkspaceTabsProps {
  tabs: WorkspaceTab[];
  activeId?: string;
  paneId?: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onMove?: (id: string, targetPane: string, index: number) => void;
  onSplit?: () => void;
}
export function WorkspaceTabs({
  tabs,
  activeId,
  paneId = "main",
  onSelect,
  onClose,
  onMove,
  onSplit,
}: WorkspaceTabsProps) {
  const root = useRef<HTMLDivElement>(null);
  const drop = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    try {
      const data = JSON.parse(
        event.dataTransfer.getData("application/x-fiveplusone-tab"),
      );
      if (typeof data.id === "string") onMove?.(data.id, paneId, index);
    } catch {
      /* Other dragged content belongs to its host. */
    }
  };
  return (
    <div
      className="fp-workspace-tabs"
      onDragOver={(e) => {
        if (
          onMove &&
          e.dataTransfer.types.includes("application/x-fiveplusone-tab")
        )
          e.preventDefault();
      }}
      onDrop={(e) => drop(e, tabs.length)}
    >
      <div
        ref={root}
        role="tablist"
        aria-label="打开的文档"
        onKeyDown={(e) => {
          const i = tabs.findIndex((t) => t.id === activeId);
          let next = i;
          if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
          else if (e.key === "ArrowLeft")
            next = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = tabs.length - 1;
          else return;
          if (!tabs[next]) return;
          e.preventDefault();
          onSelect(tabs[next].id);
          root.current
            ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
            [next]?.focus();
        }}
      >
        {tabs.map((tab, index) => (
          <ContextMenu
            key={tab.id}
            label={`${tab.title}的操作`}
            items={[
              {
                id: "close",
                label: "关闭",
                disabled: tab.closable === false,
                onSelect: () => onClose(tab.id),
              },
              ...(onMove
                ? [
                    {
                      id: "left",
                      label: "移到最前",
                      onSelect: () => onMove(tab.id, paneId, 0),
                    },
                  ]
                : []),
            ]}
          >
            <div
              className="fp-workspace-tab"
              data-active={activeId === tab.id || undefined}
              draggable={!!onMove}
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "application/x-fiveplusone-tab",
                  JSON.stringify({ id: tab.id, paneId }),
                );
                e.dataTransfer.effectAllowed = "move";
              }}
              onDrop={(e) => {
                e.stopPropagation();
                drop(e, index);
              }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeId === tab.id}
                tabIndex={activeId === tab.id ? 0 : -1}
                onClick={() => onSelect(tab.id)}
              >
                {tab.icon}
                <span>{tab.title}</span>
                {tab.dirty && (
                  <span aria-label="尚未保存" className="fp-tab-dirty">
                    •
                  </span>
                )}
              </button>
              {tab.closable !== false && (
                <button
                  type="button"
                  aria-label={`关闭${tab.title}`}
                  onClick={() => onClose(tab.id)}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </ContextMenu>
        ))}
      </div>
      {onSplit && (
        <button type="button" aria-label="切换分屏" onClick={onSplit}>
          <Columns2 size={16} />
        </button>
      )}
    </div>
  );
}
