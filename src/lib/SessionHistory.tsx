/** SessionHistory - 从课栈 chat/ChatHistoryOverlay 提取
 *
 * 对话历史面板：按类型分组，支持选择、删除（二次确认）与新建。
 */

import { useState } from "react";
import { Clock, Trash2, MessageSquare, Plus, X } from "lucide-react";

export interface SessionItem {
  id: string;
  title: string;
  detail?: string;
  time?: string;
}

export interface SessionGroup {
  id: string;
  label: string;
  items: SessionItem[];
}

export interface SessionHistoryProps {
  groups: SessionGroup[];
  activeId?: string;
  onSelect: (groupId: string, sessionId: string) => void;
  onCreate?: (groupId: string) => void;
  onDelete?: (groupId: string, sessionId: string) => void;
  onClose?: () => void;
}

export function SessionHistory({
  groups,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  onClose,
}: SessionHistoryProps) {
  const [tab, setTab] = useState(groups[0]?.id);
  const [confirm, setConfirm] = useState<string | null>(null);
  const current = groups.find((g) => g.id === tab) || groups[0];

  return (
    <div className="fp-session-history">
      <header className="fp-session-history-head">
        <Clock size={16} aria-hidden="true" />
        <strong>历史记录</strong>
        {onClose && (
          <button
            type="button"
            className="fp-icon-button fp-sm"
            aria-label="关闭历史记录"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        )}
      </header>
      <nav className="fp-session-tabs" role="tablist" aria-label="记录类型">
        {groups.map((g) => (
          <button
            key={g.id}
            role="tab"
            type="button"
            aria-selected={g.id === current?.id}
            onClick={() => setTab(g.id)}
          >
            {g.label}
            <span>{g.items.length}</span>
          </button>
        ))}
      </nav>
      {onCreate && current && (
        <button
          type="button"
          className="fp-session-create"
          onClick={() => onCreate(current.id)}
        >
          <Plus size={15} aria-hidden="true" />
          新建{current.label.replace(/记录$/, "")}
        </button>
      )}
      <ul className="fp-session-list">
        {(current?.items || []).map((item) => (
          <li key={item.id} data-active={item.id === activeId || undefined}>
            <button
              type="button"
              className="fp-session-item"
              onClick={() => onSelect(current!.id, item.id)}
              aria-current={item.id === activeId || undefined}
            >
              <MessageSquare size={15} aria-hidden="true" />
              <span>
                <strong>{item.title}</strong>
                {item.detail && <small>{item.detail}</small>}
              </span>
              {item.time && <time>{item.time}</time>}
            </button>
            {onDelete && (
              confirm === item.id ? (
                <span className="fp-session-confirm">
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(current!.id, item.id);
                      setConfirm(null);
                    }}
                  >
                    删除
                  </button>
                  <button type="button" onClick={() => setConfirm(null)}>
                    取消
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="fp-session-delete"
                  aria-label={`删除 ${item.title}`}
                  onClick={() => setConfirm(item.id)}
                >
                  <Trash2 size={14} />
                </button>
              )
            )}
          </li>
        ))}
        {!current?.items.length && (
          <li className="fp-session-empty">还没有记录，开始第一次对话吧。</li>
        )}
      </ul>
    </div>
  );
}
