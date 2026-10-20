import { useState, type ReactNode } from "react";
import { BookOpen, Search } from "lucide-react";
import { ContextMenu, type ContextMenuItem } from "./ContextMenu";
export interface NavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  detail?: string;
  disabled?: boolean;
}
export function ProductNavigation({
  items,
  value,
  onChange,
  label = "产品导航",
}: {
  items: NavigationItem[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
}) {
  return (
    <nav className="fp-product-navigation" aria-label={label}>
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          aria-current={item.id === value ? "page" : undefined}
          disabled={item.disabled}
          onClick={() => onChange(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
          {item.detail && <small>{item.detail}</small>}
        </button>
      ))}
    </nav>
  );
}
export interface BookshelfItem {
  id: string;
  title: string;
  subtitle?: string;
  coverUrl?: string;
  detail?: string;
  progress?: number;
  group?: string;
}
export function Bookshelf({
  items,
  onOpen,
  actions,
  loading,
  error,
  onCreate,
}: {
  items: BookshelfItem[];
  onOpen: (id: string) => void;
  actions?: (item: BookshelfItem) => ContextMenuItem[];
  loading?: boolean;
  error?: string;
  onCreate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const visible = items.filter((item) =>
    `${item.title} ${item.subtitle || ""} ${item.group || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <section className="fp-bookshelf">
      <header>
        <h3>我的笔记本</h3>
        {onCreate && (
          <button type="button" onClick={onCreate}>
            新建笔记本
          </button>
        )}
      </header>
      <label className="fp-search-query">
        <Search size={16} />
        <input
          aria-label="搜索笔记本"
          value={query}
          placeholder="搜索笔记本"
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p role="status">正在读取笔记本…</p>
      ) : (
        <div className="fp-bookshelf-grid">
          {visible.map((item) => (
            <ContextMenu
              key={item.id}
              disabled={!actions}
              items={() => actions?.(item) || []}
              label={`${item.title}的操作`}
            >
              <button
                type="button"
                className="fp-book"
                onClick={() => onOpen(item.id)}
              >
                {item.coverUrl ? (
                  <img src={item.coverUrl} alt="" />
                ) : (
                  <span className="fp-book-cover">
                    <BookOpen size={25} />
                  </span>
                )}
                <strong>{item.title}</strong>
                {item.subtitle && <small>{item.subtitle}</small>}
                {item.detail && <small>{item.detail}</small>}
                {item.progress !== undefined && (
                  <progress
                    aria-label={`${item.title}的学习进度`}
                    value={Math.min(100, Math.max(0, item.progress))}
                    max={100}
                  />
                )}
              </button>
            </ContextMenu>
          ))}
        </div>
      )}
      {!visible.length && !loading && (
        <p>
          {query
            ? "没有找到匹配的笔记本。"
            : "创建一本笔记本，开始整理学习内容。"}
        </p>
      )}
    </section>
  );
}
export function MobileTopBar({
  title,
  onBack,
  actions,
}: {
  title: string;
  onBack?: () => void;
  actions?: ReactNode;
}) {
  return (
    <header className="fp-mobile-topbar">
      {onBack && (
        <button type="button" aria-label="返回" onClick={onBack}>
          ‹
        </button>
      )}
      <strong>{title}</strong>
      <div>{actions}</div>
    </header>
  );
}
