import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Menu, X, Copy, List } from "lucide-react";
import { MarkdownContent, type MarkdownContentProps } from "./MarkdownContent";
import { AnimatedSize } from "./AnimatedSize";
import { WorkspaceFeedback, useWorkspaceAction } from "./WorkspaceForms";
export interface SharedReadingEntry {
  id: string;
  title: string;
  group?: string;
}
export interface ReadingHeading {
  id: string;
  title: string;
  level: number;
}
export interface SharedReadingPageProps {
  title: string;
  markdown: string;
  entries?: SharedReadingEntry[];
  selectedId?: string;
  onNavigate?: (id: string) => void;
  headings?: ReadingHeading[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  access?: "granted" | "sign-in" | "denied";
  onSignIn?: () => void;
  toolbar?: ReactNode;
  footer?: ReactNode;
  onCopyReference?: (reference: {
    title: string;
    text: string;
    heading?: string;
  }) => Promise<void> | void;
  contentProps?: Omit<MarkdownContentProps, "markdown">;
}
export function SharedReadingPage({
  title,
  markdown,
  entries = [],
  selectedId,
  onNavigate,
  headings = [],
  loading,
  error,
  onRetry,
  access = "granted",
  onSignIn,
  toolbar,
  footer,
  onCopyReference,
  contentProps,
}: SharedReadingPageProps) {
  const [drawer, setDrawer] = useState<"notes" | "contents" | null>(null),
    [active, setActive] = useState(""),
    task = useWorkspaceAction(),
    uid = useId().replace(/:/g, ""),
    [query, setQuery] = useState("");
  const lastFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!drawer) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(null);
    };
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
      document.body.style.overflow = overflow;
      lastFocus.current?.focus({ preventScroll: true });
    };
  }, [drawer]);
  useEffect(() => {
    if (!headings.length || typeof IntersectionObserver === "undefined") return;
    const root = document.getElementById(uid);
    if (!root) return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (items) => {
        for (const item of items) {
          if (item.isIntersecting)
            visible.set(item.target.id, item.boundingClientRect.top);
          else visible.delete(item.target.id);
        }
        const first = [...visible].sort((a, b) => a[1] - b[1])[0];
        if (first) setActive(first[0]);
      },
      { rootMargin: "-10% 0px -65% 0px" },
    );
    for (const heading of root.querySelectorAll("h2[id],h3[id],h4[id]"))
      observer.observe(heading);
    return () => observer.disconnect();
  }, [uid, markdown, headings.length, loading, access]);
  useEffect(() => {
    setDrawer(null);
    setActive("");
  }, [selectedId]);
  const nav = (
    <>
      <h2>笔记目录</h2>
      <input
        className="fp-input"
        aria-label="搜索分享笔记"
        value={query}
        placeholder="搜索笔记"
        onChange={(event) => setQuery(event.target.value)}
      />
      <nav aria-label="分享笔记">
        {entries
          .filter((item) =>
            `${item.title} ${item.group || ""}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .map((entry, index, filtered) => (
            <div key={entry.id}>
              {entry.group &&
                (index === 0 || filtered[index - 1].group !== entry.group) && (
                  <h3>{entry.group}</h3>
                )}
              <button
                type="button"
                className="fp-shared-note"
                aria-current={selectedId === entry.id ? "page" : undefined}
                onClick={() => {
                  onNavigate?.(entry.id);
                  setDrawer(null);
                }}
              >
                {entry.title}
              </button>
            </div>
          ))}
      </nav>
    </>
  );
  const contents = (
    <>
      <h2>本页目录</h2>
      <nav aria-label="本页目录">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            aria-current={active === heading.id ? "location" : undefined}
            style={{
              paddingInlineStart: Math.max(0, heading.level - 1) * 12 + 12,
            }}
            onClick={(event) => {
              event.preventDefault();
              document
                .getElementById(uid)
                ?.querySelector<HTMLElement>(`[id="${CSS.escape(heading.id)}"]`)
                ?.scrollIntoView({
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                  block: "start",
                });
              setActive(heading.id);
              setDrawer(null);
            }}
          >
            {heading.title}
          </a>
        ))}
      </nav>
    </>
  );
  return (
    <div className="fp-shared-reading">
      <header className="fp-shared-header">
        <a href="https://fiveplus.one/" aria-label="五加一主页">
          <img
            src="https://go.r-l.ink/ico"
            alt="五加一"
            width={28}
            height={28}
          />
        </a>
        <strong>{title}</strong>
        <div className="fp-workspace-actions">
          {toolbar}
          {onSignIn && access !== "granted" && (
            <button
              type="button"
              className="fp-button fp-primary"
              onClick={onSignIn}
            >
              登录
            </button>
          )}
        </div>
      </header>
      <div className="fp-shared-mobile-bar">
        <button
          type="button"
          className="fp-button fp-secondary"
          onClick={(event) => {
            lastFocus.current = event.currentTarget;
            setDrawer("notes");
          }}
        >
          <Menu size={16} />
          笔记
        </button>
        <button
          type="button"
          className="fp-button fp-secondary"
          onClick={(event) => {
            lastFocus.current = event.currentTarget;
            setDrawer("contents");
          }}
        >
          <List size={16} />
          目录
        </button>
      </div>
      {drawer && (
        <div
          className="fp-shared-drawer-backdrop"
          onClick={() => setDrawer(null)}
        >
          <aside
            className="fp-shared-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={drawer === "notes" ? "笔记目录" : "本页目录"}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const nodes = [
                ...event.currentTarget.querySelectorAll<HTMLElement>(
                  "button,a,input",
                ),
              ];
              const first = nodes[0],
                last = nodes.at(-1);
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }}
          >
            <button
              type="button"
              autoFocus
              className="fp-shared-close"
              aria-label="关闭目录"
              onClick={() => setDrawer(null)}
            >
              <X size={18} />
            </button>
            {drawer === "notes" ? nav : contents}
          </aside>
        </div>
      )}
      <div className="fp-shared-layout">
        <aside className="fp-shared-navigation">{nav}</aside>
        <main id={uid}>
          <AnimatedSize>
            {loading ? (
              <p role="status" className="fp-workspace-empty">
                正在打开笔记…
              </p>
            ) : error ? (
              <div className="fp-workspace-empty" role="alert">
                <p>{error}</p>
                {onRetry && (
                  <button
                    type="button"
                    className="fp-button fp-secondary"
                    onClick={onRetry}
                  >
                    重试
                  </button>
                )}
              </div>
            ) : access !== "granted" ? (
              <div className="fp-workspace-empty">
                <h1>
                  {access === "sign-in" ? "登录后阅读" : "这篇笔记尚未向你分享"}
                </h1>
                <p>
                  {access === "sign-in"
                    ? "登录账户，继续查看分享内容。"
                    : "请联系分享者获取访问权限。"}
                </p>
                {access === "sign-in" && onSignIn && (
                  <button
                    type="button"
                    className="fp-button fp-primary"
                    onClick={onSignIn}
                  >
                    登录并继续
                  </button>
                )}
              </div>
            ) : (
              <>
                <h1>{title}</h1>
                {onCopyReference && (
                  <button
                    type="button"
                    className="fp-button fp-secondary"
                    disabled={task.busy}
                    onClick={() =>
                      void task.run(
                        () =>
                          onCopyReference({
                            title,
                            text: (() => {
                              const selection = window.getSelection();
                              return selection?.anchorNode &&
                                document
                                  .getElementById(uid)
                                  ?.contains(selection.anchorNode)
                                ? selection.toString() || title
                                : title;
                            })(),
                            heading: active || undefined,
                          }),
                        "引用已复制",
                      )
                    }
                  >
                    <Copy size={15} />
                    复制引用
                  </button>
                )}
                <WorkspaceFeedback {...task} />
                <MarkdownContent {...contentProps} markdown={markdown} />
                {footer}
              </>
            )}
          </AnimatedSize>
        </main>
        <aside className="fp-shared-contents">{contents}</aside>
      </div>
    </div>
  );
}
export interface ReleaseNoticeProps {
  available: boolean;
  onRefresh: () => Promise<void> | void;
  onDismiss?: () => void;
  beforeRefresh?: () => Promise<boolean>;
}
export function ReleaseNotice({
  available,
  onRefresh,
  onDismiss,
  beforeRefresh,
}: ReleaseNoticeProps) {
  const task = useWorkspaceAction();
  return (
    <AnimatedSize>
      {available && (
        <aside className="fp-release-notice" aria-label="应用更新">
          <div>
            <strong>新版本已就绪</strong>
            <p>更新后继续使用最新功能。</p>
            <WorkspaceFeedback {...task} />
          </div>
          <div className="fp-workspace-actions">
            <button
              type="button"
              className="fp-button fp-primary"
              disabled={task.busy}
              onClick={() =>
                void task.run(async () => {
                  if (beforeRefresh && !(await beforeRefresh())) {
                    task.setMessage("请先保存当前内容。");
                    return;
                  }
                  await onRefresh();
                })
              }
            >
              {task.busy ? "正在更新…" : "立即更新"}
            </button>
            {onDismiss && (
              <button
                type="button"
                className="fp-shared-close"
                aria-label="稍后更新"
                onClick={onDismiss}
              >
                <X size={17} />
              </button>
            )}
          </div>
        </aside>
      )}
    </AnimatedSize>
  );
}

export interface ReleaseUpdateOptions {
  currentVersion: string;
  checkVersion: (signal: AbortSignal) => Promise<string>;
  interval?: number;
  enabled?: boolean;
  onError?: (error: unknown) => void;
}
/** Checks the host release token while the page is visible; requests stop on unmount. */
export function useReleaseUpdate({
  currentVersion,
  checkVersion,
  interval = 60000,
  enabled = true,
  onError,
}: ReleaseUpdateOptions) {
  const [version, setVersion] = useState(currentVersion),
    [dismissed, setDismissed] = useState("");
  const callbacks = useRef({ checkVersion, onError });
  callbacks.current = { checkVersion, onError };
  useEffect(() => {
    if (!enabled) return;
    let pending: AbortController | null = null,
      alive = true;
    const check = async () => {
      if (pending || document.visibilityState === "hidden") return;
      const abort = new AbortController();
      pending = abort;
      try {
        const latest = await callbacks.current.checkVersion(abort.signal);
        if (alive && !abort.signal.aborted && latest) setVersion(latest);
      } catch (error) {
        if (!abort.signal.aborted) callbacks.current.onError?.(error);
      } finally {
        if (pending === abort) pending = null;
      }
    };
    const wake = () => void check();
    const timer = setInterval(wake, Math.max(1000, interval));
    window.addEventListener("focus", wake);
    document.addEventListener("visibilitychange", wake);
    wake();
    return () => {
      alive = false;
      pending?.abort();
      clearInterval(timer);
      window.removeEventListener("focus", wake);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [currentVersion, interval, enabled]);
  return {
    available: version !== currentVersion && version !== dismissed,
    version,
    dismiss: () => setDismissed(version),
  };
}
