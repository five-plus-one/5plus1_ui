import { useEffect, useRef, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { AnimatedSize } from "./AnimatedSize";
export interface SearchHit {
  id: string;
  title: string;
  path?: string;
  excerpt?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}
export interface SearchResultsProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string, signal: AbortSignal) => Promise<SearchHit[]>;
  onOpen: (hit: SearchHit) => void;
  placeholder?: string;
  debounceMs?: number;
}
export function SearchResults({
  query,
  onQueryChange,
  onSearch,
  onOpen,
  placeholder = "搜索笔记与资料",
  debounceMs = 220,
}: SearchResultsProps) {
  const [items, setItems] = useState<SearchHit[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [active, setActive] = useState(0),
    [retry, setRetry] = useState(0);
  const generation = useRef(0),
    host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController(),
      run = ++generation.current;
    setItems([]);
    setActive(0);
    setError("");
    setBusy(!!query.trim());
    if (!query.trim()) return () => controller.abort();
    const timer = setTimeout(() => {
      void onSearch(query.trim(), controller.signal)
        .then((results) => {
          if (!controller.signal.aborted && run === generation.current)
            setItems(results);
        })
        .catch(() => {
          if (!controller.signal.aborted) setError("暂时无法搜索，请重试。");
        })
        .finally(() => {
          if (!controller.signal.aborted && run === generation.current)
            setBusy(false);
        });
    }, debounceMs);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, onSearch, debounceMs, retry]);
  const enabled = items.filter((i) => !i.disabled);
  return (
    <section className="fp-search-results">
      <label className="fp-search-query">
        <Search size={17} />
        <input
          aria-label="搜索内容"
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              const next =
                (active +
                  (e.key === "ArrowDown" ? 1 : -1) +
                  Math.max(enabled.length, 1)) %
                Math.max(enabled.length, 1);
              setActive(next);
              host.current
                ?.querySelectorAll<HTMLElement>("button[data-hit]")
                [next]?.scrollIntoView?.({ block: "nearest" });
            }
            if (e.key === "Enter" && enabled[active]) {
              e.preventDefault();
              onOpen(enabled[active]);
            }
          }}
        />
      </label>
      <AnimatedSize>
        <div ref={host} className="fp-search-hits" aria-busy={busy}>
          {busy ? (
            <p role="status">正在搜索…</p>
          ) : error ? (
            <p role="alert">
              {error}
              <button type="button" onClick={() => setRetry((n) => n + 1)}>
                重试
              </button>
            </p>
          ) : !query.trim() ? (
            <p>输入关键词查找内容。</p>
          ) : !items.length ? (
            <p>没有找到匹配的内容。</p>
          ) : (
            items.map((hit) => (
              <button
                type="button"
                key={hit.id}
                data-hit={hit.disabled ? undefined : ""}
                data-active={enabled[active]?.id === hit.id || undefined}
                disabled={hit.disabled}
                onClick={() => onOpen(hit)}
              >
                {hit.icon}
                <span>
                  <strong>{hit.title}</strong>
                  {hit.path && <small>{hit.path}</small>}
                  {hit.excerpt && <span>{hit.excerpt}</span>}
                </span>
              </button>
            ))
          )}
        </div>
      </AnimatedSize>
    </section>
  );
}
