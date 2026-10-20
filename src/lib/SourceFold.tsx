/** SourceFold - 从课栈 chat/WebSourceFold 提取
 *
 * 可折叠的参考资料列表：显示条数与来源，展开后逐条列出标题与站点。
 */

import { useState } from "react";
import { Globe, ChevronRight, Link2 } from "lucide-react";

export interface SourceItem {
  url: string;
  title?: string;
  detail?: string;
}

export interface SourceFoldProps {
  sources: SourceItem[];
  label?: string;
  /** 是否命中缓存 */
  cached?: boolean;
  onOpen?: (source: SourceItem) => void;
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SourceFold({
  sources,
  label = "联网来源",
  cached,
  onOpen,
}: SourceFoldProps) {
  const [open, setOpen] = useState(false);
  if (!sources.length) return null;
  return (
    <section className="fp-source-fold">
      <button
        type="button"
        className="fp-source-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronRight size={14} className="fp-source-chevron" />
        <Globe size={15} aria-hidden="true" />
        <span>
          {label} · {sources.length} 条
          {cached ? " · 缓存" : ""}
        </span>
      </button>
      <div className="fp-source-body" inert={!open} aria-hidden={!open} data-open={open || undefined}>
        <ul className="fp-source-list">
          {sources.map((s, i) => (
            <li key={`${s.url}:${i}`}>
              <button
                type="button"
                className="fp-source-item"
                onClick={() => onOpen?.(s)}
              >
                <span className="fp-source-index">{i + 1}</span>
                <span className="fp-source-title">
                  {s.title || hostOf(s.url)}
                </span>
                <span className="fp-source-host">
                  <Link2 size={12} aria-hidden="true" />
                  {hostOf(s.url)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
