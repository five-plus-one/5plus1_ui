import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { normalizeBrowserUrl } from "./BrowserPreferences";
import { WindowChrome } from "./WindowChrome";
import { AsyncAction } from "./ManagementViews";
export interface ShortcutBinding {
  id: string;
  keys: string;
  label: string;
  enabled?: boolean;
  allowInInput?: boolean;
  priority?: number;
  run: () => void;
}
const ShortcutContext = createContext<(binding: ShortcutBinding) => () => void>(
  () => () => {},
);
function matches(event: KeyboardEvent, chord: string) {
  const parts = chord
      .toLowerCase()
      .split("+")
      .map((p) => p.trim()),
    key = parts.at(-1);
  const modifier = (name: string) => parts.includes(name);
  return (
    event.key.toLowerCase() === key &&
    (modifier("mod")
      ? event.ctrlKey || event.metaKey
      : event.ctrlKey === modifier("ctrl") &&
        event.metaKey === modifier("meta")) &&
    event.altKey === modifier("alt") &&
    event.shiftKey === modifier("shift")
  );
}
export function ShortcutProvider({
  children,
  paused = false,
}: {
  children: ReactNode;
  paused?: boolean;
}) {
  const bindings = useRef(new Map<symbol, ShortcutBinding>());
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        paused ||
        event.defaultPrevented ||
        event.isComposing ||
        event.key === "Process"
      )
        return;
      const input =
        event.target instanceof Element &&
        !!event.target.closest(
          "input,textarea,[contenteditable=true],math-field,[role=dialog],[role=menu]",
        );
      const candidates = [...bindings.current.values()].sort(
        (a, b) => (b.priority || 0) - (a.priority || 0),
      );
      for (const binding of candidates) {
        if (
          binding.enabled === false ||
          (input && !binding.allowInInput) ||
          !matches(event, binding.keys)
        )
          continue;
        event.preventDefault();
        binding.run();
        break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [paused]);
  const register = useRef((binding: ShortcutBinding) => {
    const token = Symbol(binding.id);
    bindings.current.set(token, binding);
    return () => {
      bindings.current.delete(token);
    };
  });
  return (
    <ShortcutContext.Provider value={register.current}>
      {children}
    </ShortcutContext.Provider>
  );
}
export function useShortcut(binding: ShortcutBinding) {
  const register = useContext(ShortcutContext);
  useEffect(
    () => register(binding),
    [
      register,
      binding.id,
      binding.keys,
      binding.enabled,
      binding.allowInInput,
      binding.priority,
      binding.run,
    ],
  );
}
export interface ShortcutSetting {
  id: string;
  label: string;
  keys: string;
  enabled: boolean;
}
export function ShortcutSettings({
  items,
  onChange,
  onReset,
}: {
  items: ShortcutSetting[];
  onChange: (id: string, keys: string, enabled: boolean) => void;
  onReset?: () => void;
}) {
  const [query, setQuery] = useState(""),
    [recording, setRecording] = useState<string | null>(null),
    [error, setError] = useState("");
  return (
    <section className="fp-pattern-panel">
      <h3>快捷键</h3>
      <input
        className="fp-pattern-input"
        aria-label="搜索快捷键"
        placeholder="查找操作"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {items
        .filter((i) => i.label.includes(query))
        .map((item) => (
          <div className="fp-shortcut-setting" key={item.id}>
            <span>{item.label}</span>
            <button
              type="button"
              aria-label={`设置${item.label}快捷键`}
              onClick={() => {
                setError("");
                setRecording(item.id);
              }}
              onKeyDown={(e) => {
                if (recording !== item.id) return;
                e.preventDefault();
                e.stopPropagation();
                if (e.key === "Escape") {
                  setRecording(null);
                  return;
                }
                if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;
                const keys = [
                  e.ctrlKey ? "Ctrl" : "",
                  e.metaKey ? "Meta" : "",
                  e.altKey ? "Alt" : "",
                  e.shiftKey ? "Shift" : "",
                  e.key,
                ]
                  .filter(Boolean)
                  .join("+");
                if (
                  items.some(
                    (i) =>
                      i.id !== item.id &&
                      i.enabled &&
                      i.keys.toLowerCase() === keys.toLowerCase(),
                  )
                ) {
                  setError("这个快捷键已被其他操作使用。");
                  return;
                }
                onChange(item.id, keys, item.enabled);
                setRecording(null);
              }}
            >
              {recording === item.id ? "按下新的快捷键…" : item.keys}
            </button>
            <button
              type="button"
              aria-pressed={item.enabled}
              onClick={() => onChange(item.id, item.keys, !item.enabled)}
            >
              {item.enabled ? "已启用" : "已停用"}
            </button>
          </div>
        ))}
      {error && <p role="alert">{error}</p>}
      {onReset && (
        <button type="button" onClick={onReset}>
          恢复默认
        </button>
      )}
    </section>
  );
}
export interface WindowGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}
/** Keep every title-bar control reachable inside its containing workspace. */
export function constrainWindowGeometry(
  geometry: WindowGeometry,
  bounds: { width: number; height: number },
  minimum = { width: 300, height: 200 },
): WindowGeometry {
  const width = Math.min(bounds.width, Math.max(minimum.width, geometry.width));
  const height = Math.min(
    bounds.height,
    Math.max(minimum.height, geometry.height),
  );
  return {
    width,
    height,
    x: Math.max(0, Math.min(bounds.width - width, geometry.x)),
    y: Math.max(0, Math.min(bounds.height - height, geometry.y)),
  };
}
export interface FloatingWindowProps {
  title: string;
  geometry: WindowGeometry;
  onGeometryChange: (value: WindowGeometry) => void;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  children: ReactNode;
  zIndex?: number;
  minWidth?: number;
  minHeight?: number;
  contained?: boolean;
}
export function FloatingWindow({
  title,
  geometry,
  onGeometryChange,
  onClose,
  onMinimize,
  onFocus,
  children,
  zIndex = 40,
  minWidth = 300,
  minHeight = 200,
  contained = false,
}: FloatingWindowProps) {
  const [full, setFull] = useState(false);
  const drag = useRef<{
    mode: "move" | "resize";
    x: number;
    y: number;
    value: WindowGeometry;
  } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<{
    width: number;
    height: number;
  } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const parent = contained ? root.current?.parentElement : null;
      const next = {
        width: parent?.clientWidth || window.innerWidth,
        height: parent?.clientHeight || window.innerHeight,
      };
      setBounds((previous) =>
        previous?.width === next.width && previous.height === next.height
          ? previous
          : next,
      );
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    if (contained && root.current?.parentElement)
      observer?.observe(root.current.parentElement);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [contained]);
  const visibleGeometry = bounds
    ? constrainWindowGeometry(geometry, bounds, {
        width: minWidth,
        height: minHeight,
      })
    : geometry;
  const current = useRef(geometry);
  current.current = visibleGeometry;
  const pointer = (event: React.PointerEvent, mode: "move" | "resize") => {
    if (
      event.button !== 0 ||
      full ||
      (event.target as Element).closest(
        "button,input,textarea,a,[data-no-drag]",
      )
    )
      return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      mode,
      x: event.clientX,
      y: event.clientY,
      value: current.current,
    };
    onFocus?.();
  };
  return (
    <div
      ref={root}
      className="fp-floating-window"
      role="region"
      aria-label={title}
      style={
        full
          ? { position: contained ? "absolute" : "fixed", inset: 8, zIndex }
          : {
              position: contained ? "absolute" : "fixed",
              left: visibleGeometry.x,
              top: visibleGeometry.y,
              width: visibleGeometry.width,
              height: visibleGeometry.height,
              zIndex,
            }
      }
      onPointerDown={onFocus}
      onPointerMove={(event) => {
        const start = drag.current;
        if (!start) return;
        const available = bounds || {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        const dx = event.clientX - start.x,
          dy = event.clientY - start.y;
        onGeometryChange(
          constrainWindowGeometry(
            start.mode === "move"
              ? {
                  ...start.value,
                  x: start.value.x + dx,
                  y: start.value.y + dy,
                }
              : {
                  ...start.value,
                  width: Math.max(
                    minWidth,
                    Math.min(
                      available.width - start.value.x,
                      start.value.width + dx,
                    ),
                  ),
                  height: Math.max(
                    minHeight,
                    Math.min(
                      available.height - start.value.y,
                      start.value.height + dy,
                    ),
                  ),
                },
            available,
            { width: minWidth, height: minHeight },
          ),
        );
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
    >
      <WindowChrome
        title={title}
        onClose={onClose}
        onMinimize={onMinimize}
        onFullscreen={() => setFull((v) => !v)}
        isFullscreen={full}
        onDragStart={(e) => pointer(e, "move")}
      >
        {children}
      </WindowChrome>
      {!full && (
        <div
          className="fp-window-resize"
          role="separator"
          aria-label="调整窗口大小"
          aria-orientation="horizontal"
          tabIndex={0}
          onPointerDown={(e) => pointer(e, "resize")}
          onKeyDown={(e) => {
            if (
              !["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(
                e.key,
              )
            )
              return;
            e.preventDefault();
            onGeometryChange(
              constrainWindowGeometry(
                {
                  ...visibleGeometry,
                  width: Math.max(
                    minWidth,
                    visibleGeometry.width +
                      (e.key === "ArrowRight"
                        ? 16
                        : e.key === "ArrowLeft"
                          ? -16
                          : 0),
                  ),
                  height: Math.max(
                    minHeight,
                    visibleGeometry.height +
                      (e.key === "ArrowDown"
                        ? 16
                        : e.key === "ArrowUp"
                          ? -16
                          : 0),
                  ),
                },
                bounds || {
                  width: window.innerWidth,
                  height: window.innerHeight,
                },
                { width: minWidth, height: minHeight },
              ),
            );
          }}
        />
      )}
    </div>
  );
}
export function BrowserSurface({
  url,
  onNavigate,
  onBack,
  onForward,
  canBack,
  canForward,
  loading,
  error,
  children,
}: {
  url: string;
  onNavigate: (url: string) => void;
  onBack?: () => void;
  onForward?: () => void;
  canBack?: boolean;
  canForward?: boolean;
  loading?: boolean;
  error?: string;
  children: ReactNode;
}) {
  const [draft, setDraft] = useState(url),
    [invalid, setInvalid] = useState("");
  useEffect(() => setDraft(url), [url]);
  return (
    <section className="fp-browser-surface">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const target = normalizeBrowserUrl(draft);
            if (!target) throw Error();
            setInvalid("");
            onNavigate(target);
          } catch {
            setInvalid("请输入有效的网址。");
          }
        }}
      >
        <button
          type="button"
          aria-label="后退"
          disabled={!canBack}
          onClick={onBack}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="前进"
          disabled={!canForward}
          onClick={onForward}
        >
          →
        </button>
        <input
          aria-label="网页地址"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit">前往</button>
      </form>
      {(error || invalid) && <p role="alert">{error || invalid}</p>}
      {loading && <p role="status">正在打开网页…</p>}
      <div>{children}</div>
    </section>
  );
}
export function ImportPanel({
  title = "导入学习资料",
  accept,
  multiple = true,
  onImport,
  children,
}: {
  title?: string;
  accept?: string;
  multiple?: boolean;
  onImport: (files: File[]) => Promise<void> | void;
  children?: ReactNode;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]),
    [error, setError] = useState("");
  const add = (list: File[]) => {
    setError("");
    setFiles(multiple ? list : list.slice(0, 1));
  };
  return (
    <section className="fp-pattern-panel">
      <h3>{title}</h3>
      <div
        className="fp-import-drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          add(Array.from(e.dataTransfer.files));
        }}
      >
        <p>将文件拖到这里，或选择文件。</p>
        <input
          ref={input}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={(e) => {
            add(Array.from(e.target.files || []));
            e.target.value = "";
          }}
        />
        <button type="button" onClick={() => input.current?.click()}>
          选择文件
        </button>
      </div>
      {files.length > 0 && (
        <ul>
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`}>
              <span>{file.name}</span>
              <button
                type="button"
                aria-label={`移除${file.name}`}
                onClick={() =>
                  setFiles((list) => list.filter((_, i) => i !== index))
                }
              >
                移除
              </button>
            </li>
          ))}
        </ul>
      )}
      {children}
      <div className="fp-pattern-actions">
        <AsyncAction
          disabled={!files.length}
          onAction={async () => {
            const batch = files;
            try {
              await onImport(batch);
              setFiles((current) => (current === batch ? [] : current));
            } catch (cause) {
              setError("资料已保留，可以重试。");
              throw cause;
            }
          }}
        >
          开始导入
        </AsyncAction>
      </div>
      {error && <p role="status">{error}</p>}
    </section>
  );
}
export function LazyVisible({
  children,
  fallback = null,
  margin = "240px",
}: {
  children: ReactNode;
  fallback?: ReactNode;
  margin?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [margin]);
  return <div ref={host}>{visible ? children : fallback}</div>;
}
