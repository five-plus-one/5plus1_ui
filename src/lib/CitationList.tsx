/** CitationList - 从课栈 chat/NoteCitationCard 提取
 *
 * AI 回答中引用笔记时的折叠列表：显示条数与路径，展开后可逐条打开。
 */

import { useState } from "react";
import { ChevronRight, FileText } from "lucide-react";

export interface CitationHit {
  title: string;
  path: string;
  snippet?: string;
}

export interface CitationListProps {
  hits: CitationHit[];
  label?: string;
  onOpen?: (hit: CitationHit) => void;
  /** 顶部附加操作，例如「查看全部」。 */
  action?: { label: string; onClick: () => void };
}

export function CitationList({
  hits,
  label = "引用笔记",
  onOpen,
  action,
}: CitationListProps) {
  const [open, setOpen] = useState(false);
  if (!hits.length) return null;
  return (
    <section className="fp-citation-list">
      <header className="fp-citation-head">
        <button
          type="button"
          className="fp-citation-toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronRight size={14} className="fp-citation-chevron" />
          <FileText size={15} aria-hidden="true" />
          <span>
            {label} · {hits.length} 条
          </span>
        </button>
        {action && (
          <button
            type="button"
            className="fp-citation-action"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </header>
      <div className="fp-citation-body" data-open={open || undefined}>
        <ul className="fp-citation-hits">
          {hits.map((hit, i) => (
            <li key={`${hit.path}:${i}`}>
              <button
                type="button"
                className="fp-citation-hit"
                onClick={() => onOpen?.(hit)}
              >
                <strong>{hit.title}</strong>
                <span>{hit.path}</span>
                {hit.snippet && <small>{hit.snippet}</small>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
