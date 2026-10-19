import React, {
  useState,
  useRef,
  useEffect,
  useId,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import "./styles.css";
export const cx = (...s: (string | false | undefined)[]) =>
  s.filter(Boolean).join(" ");
export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  type = "button",
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}) {
  return (
    <button
      {...p}
      type={type}
      disabled={p.disabled || loading}
      className={cx("fp-button", `fp-${variant}`, `fp-${size}`, className)}
      aria-busy={loading}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
}
export function IconButton({
  label,
  children,
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <Button
      variant="ghost"
      {...p}
      className={cx("fp-icon-button", p.className)}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}
export function Input({
  className,
  ...p
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={cx("fp-input", className)} />;
}
export function Textarea(p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={cx("fp-input", p.className)} />;
}
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactElement<{
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  }>;
}) {
  let id = useId();
  return (
    <div className="fp-field">
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children, {
        id,
        "aria-describedby": `${id}-help`,
        "aria-invalid": !!error,
      })}
      {(error || hint) && (
        <small id={`${id}-help`} className={error ? "fp-error-text" : ""}>
          {error || hint}
        </small>
      )}
    </div>
  );
}
export function Checkbox({
  label,
  ...p
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="fp-check">
      <input {...p} type="checkbox" />
      {label}
    </label>
  );
}
export function Radio({
  label,
  ...p
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="fp-check">
      <input {...p} type="radio" />
      {label}
    </label>
  );
}
export function Switch({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="fp-switch-label"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span>{label}</span>
      <span className={cx("fp-switch", checked && "is-on")}>
        <i />
      </span>
    </button>
  );
}
export function Select({
  options,
  ...p
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
}) {
  return (
    <select {...p} className={cx("fp-input", p.className)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  className,
  ...p
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  let [inner, setInner] = useState<number | undefined>(() =>
    defaultValue === undefined ? undefined : Number(defaultValue),
  );
  let current = value !== undefined ? Number(value) : inner;
  let lo = Number(min);
  let hi = Number(max);
  let fill =
    current === undefined || hi === lo
      ? 0
      : ((current - lo) / (hi - lo)) * 100;
  return (
    <label className={cx("fp-slider", className)}>
      {label}
      <input
        {...p}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          setInner(Number(e.target.value));
          p.onChange?.(e);
        }}
        style={{
          ...p.style,
          ["--fp-slider-fill" as string]: `${Math.min(100, Math.max(0, fill))}%`,
        }}
      />
    </label>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "error" | "accent";
}) {
  return <span className={`fp-badge fp-tone-${tone}`}>{children}</span>;
}
export function Chip({
  children,
  selected,
  onClick,
  onRemove,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}) {
  return (
    <span className={cx("fp-chip", selected && "is-selected")}>
      <button type="button" onClick={onClick} aria-pressed={selected}>
        {children}
      </button>
      {onRemove && (
        <button
          type="button"
          aria-label={`移除 ${typeof children === "string" ? children : "项目"}`}
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </span>
  );
}
export function Avatar({
  name,
  src,
  size = 36,
}: {
  name: string;
  src?: string;
  size?: number;
}) {
  return (
    <span className="fp-avatar" style={{ width: size, height: size }}>
      {src ? <img src={src} alt={name} /> : name.slice(0, 1)}
    </span>
  );
}
export function AvatarGroup({ names }: { names: string[] }) {
  return (
    <div className="fp-avatar-group">
      {names.map((n) => (
        <Avatar key={n} name={n} />
      ))}
    </div>
  );
}
export function Divider() {
  return <hr className="fp-divider" />;
}
export function Card({
  children,
  className,
  ...p
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...p} className={cx("fp-card", className)}>
      {children}
    </div>
  );
}
export function Alert({
  title,
  children,
  tone = "accent",
}: {
  title: string;
  children?: ReactNode;
  tone?: "accent" | "success" | "warning" | "error";
}) {
  return (
    <div
      className={`fp-alert fp-tone-${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <span className="fp-alert-dot" />
      <div>
        <strong>{title}</strong>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}
export function Spinner({ size = 22 }: { size?: number }) {
  return (
    <span
      role="status"
      aria-label="正在处理"
      className="fp-spinner"
      style={{ width: size, height: size }}
    />
  );
}
export function Skeleton({
  width = "100%",
  height = 16,
}: {
  width?: string;
  height?: number;
}) {
  return (
    <div className="fp-skeleton" style={{ width, height }} aria-hidden="true" />
  );
}
export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="fp-progress-wrap">
      {label && (
        <div className="fp-between">
          <span>{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
      )}
      <div
        className="fp-progress"
        role="progressbar"
        aria-label={label || "完成进度"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, Math.max(0, value))}
      >
        <i style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
export function Tabs({
  items,
  value,
  onChange,
}: {
  items: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  let ref = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const labels = items.map((item) => item.label).join("\u0000");
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const update = () => {
      const active = host.querySelector<HTMLElement>('[aria-selected="true"]');
      if (active)
        setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };
    update();
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(host);
    host
      .querySelectorAll("button")
      .forEach((button) => observer?.observe(button));
    return () => observer?.disconnect();
  }, [value, labels]);
  return (
    <div
      ref={ref}
      className="fp-tabs"
      role="tablist"
      onKeyDown={(e) => {
        let i = items.findIndex((x) => x.value === value);
        let n =
          e.key === "ArrowRight"
            ? (i + 1) % items.length
            : e.key === "ArrowLeft"
              ? (i - 1 + items.length) % items.length
              : e.key === "Home"
                ? 0
                : e.key === "End"
                  ? items.length - 1
                  : -1;
        if (n >= 0) {
          e.preventDefault();
          onChange(items[n].value);
          (ref.current?.children[n] as HTMLElement)?.focus();
        }
      }}
    >
      {items.map((i) => (
        <button
          role="tab"
          aria-selected={i.value === value}
          tabIndex={i.value === value ? 0 : -1}
          key={i.value}
          onClick={() => onChange(i.value)}
        >
          {i.label}
        </button>
      ))}
      <span
        className="fp-tab-indicator"
        aria-hidden="true"
        style={{
          width: indicator.width,
          transform: `translateX(${indicator.left}px)`,
        }}
      />
    </div>
  );
}
export function SegmentedControl(p: Parameters<typeof Tabs>[0]) {
  return (
    <div className="fp-segmented">
      <Tabs {...p} />
    </div>
  );
}
export function Accordion({
  items,
}: {
  items: { title: string; content: ReactNode }[];
}) {
  return (
    <div className="fp-accordion">
      {items.map((i) => (
        <details key={i.title}>
          <summary>
            {i.title}
            <span>＋</span>
          </summary>
          <div>{i.content}</div>
        </details>
      ))}
    </div>
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="当前位置" className="fp-breadcrumbs">
      {items.map((i, n) => (
        <React.Fragment key={i.label}>
          {n > 0 && <span>/</span>}
          {i.href ? (
            <a href={i.href}>{i.label}</a>
          ) : (
            <span aria-current="page">{i.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  return (
    <nav className="fp-row" aria-label="分页">
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        上一页
      </Button>
      <span className="fp-muted">
        {page} / {total}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >
        下一页
      </Button>
    </nav>
  );
}
export function Steps({
  items,
  current,
}: {
  items: string[];
  current: number;
}) {
  return (
    <ol className="fp-steps">
      {items.map((i, n) => (
        <li
          key={i}
          aria-current={n === current ? "step" : undefined}
          className={n <= current ? "is-active" : ""}
        >
          <span>{n < current ? "✓" : n + 1}</span>
          {i}
        </li>
      ))}
    </ol>
  );
}
export function Tooltip({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  return (
    <span className="fp-tooltip">
      {children}
      <span role="tooltip">{text}</span>
    </span>
  );
}
export { Dropdown, Popover } from "./Popup";
export const brandLogoUrl = "https://go.r-l.ink/ico";
export function BrandLogo({size=32, decorative=false}:{size?:number;decorative?:boolean}) {
  return <img src={brandLogoUrl} alt={decorative ? "" : "五加一"} width={size} height={size} className="fp-brand-logo" />;
}
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  drawer = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  drawer?: boolean;
}) {
  let ref = useRef<HTMLDialogElement>(null);
  let id = useId();
  useEffect(() => {
    let el = ref.current;
    if (open && !el?.open) el?.showModal();
    if (!open && el?.open) el.close();
  }, [open]);
  if (typeof window === "undefined") return null;
  return createPortal(
    <dialog
      ref={ref}
      className={cx("fp-dialog", drawer && "fp-drawer")}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          let r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <header>
        <h2 id={id}>{title}</h2>
        <IconButton label="关闭" onClick={onClose}>
          ×
        </IconButton>
      </header>
      <div className="fp-dialog-body">{children}</div>
      {footer && <footer>{footer}</footer>}
    </dialog>,
    document.body,
  );
}
export function Drawer(p: Omit<Parameters<typeof Dialog>[0], "drawer">) {
  return <Dialog {...p} drawer />;
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="fp-empty">
      <div className="fp-empty-symbol">＋</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    let t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [message, onClose]);
  return (
    <div className="fp-toast" role="status">
      <span>✓</span>
      {message}
      <IconButton label="关闭提示" onClick={onClose}>
        ×
      </IconButton>
    </div>
  );
}
export function Table({
  columns,
  rows,
  caption,
}: {
  columns: string[];
  rows: ReactNode[][];
  caption?: string;
}) {
  return (
    <div className="fp-table-scroll">
      <table className="fp-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, n) => (
            <tr key={n}>
              {r.map((c, m) => (
                <td key={m}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function DescriptionList({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="fp-descriptions">
      {items.map((i) => (
        <div key={i.label}>
          <dt>{i.label}</dt>
          <dd>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
export function Timeline({
  items,
}: {
  items: { title: string; description: string }[];
}) {
  return (
    <ol className="fp-timeline">
      {items.map((i) => (
        <li key={i.title}>
          <strong>{i.title}</strong>
          <p>{i.description}</p>
        </li>
      ))}
    </ol>
  );
}
export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="fp-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}
export function FileUpload({
  onFiles,
  accept,
  multiple = true,
}: {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}) {
  let [names, setNames] = useState<string[]>([]);
  function receive(files: FileList | null) {
    let a = Array.from(files || []);
    setNames(a.map((f) => f.name));
    onFiles(a);
  }
  return (
    <label
      className="fp-upload"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        receive(e.dataTransfer.files);
      }}
    >
      <span className="fp-upload-icon">↥</span>
      <strong>选择文件，或拖放到这里</strong>
      <small>
        {names.length ? names.join("、") : "资料会保留在你的设备上"}
      </small>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => receive(e.target.files)}
      />
    </label>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "搜索内容",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="fp-search-input">
      <span aria-hidden="true">⌕</span>
      <Input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <IconButton label="清除搜索" onClick={() => onChange("")}>
          ×
        </IconButton>
      )}
    </div>
  );
}
export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div className="fp-number">
      <IconButton
        label={`减少${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </IconButton>
      <Input
        aria-label={label}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(Math.min(max, Math.max(min, Number(e.target.value))))
        }
      />
      <IconButton
        label={`增加${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        ＋
      </IconButton>
    </div>
  );
}
export function DatePicker(p: InputHTMLAttributes<HTMLInputElement>) {
  return <Input {...p} type="date" />;
}
export function TimePicker(p: InputHTMLAttributes<HTMLInputElement>) {
  return <Input {...p} type="time" />;
}
export function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="fp-row">
      {label}
      <input
        aria-label={label}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <code>{value}</code>
    </label>
  );
}
export function Rating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="fp-rating" role="group" aria-label="评价">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          aria-label={`${i} 星`}
          aria-pressed={i === value}
          onClick={() => onChange(i)}
          className={i <= value ? "is-active" : ""}
        >
          ★
        </button>
      ))}
    </div>
  );
}
export function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div className="fp-meter">
      <meter min={0} max={100} value={value} aria-label={label} />
      <span>
        {label} · {value}%
      </span>
    </div>
  );
}
export function CodeBlock({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}) {
  let [copied, setCopied] = useState(false);
  return (
    <div className="fp-code">
      <header>
        <span>{language}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? "已复制" : "复制"}
        </Button>
      </header>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="fp-kbd">{children}</kbd>;
}
export function Link({
  children,
  ...p
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...p} className={cx("fp-link", p.className)}>
      {children}
    </a>
  );
}
export function Tree({
  items,
}: {
  items: { label: string; children?: string[] }[];
}) {
  return (
    <div className="fp-tree">
      {items.map((i) =>
        i.children ? (
          <details key={i.label} open>
            <summary>{i.label}</summary>
            {i.children.map((c) => (
              <div key={c}>{c}</div>
            ))}
          </details>
        ) : (
          <div key={i.label}>{i.label}</div>
        ),
      )}
    </div>
  );
}
export function Navigation({
  items,
  value,
  onChange,
}: {
  items: { value: string; label: string; icon?: ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <nav className="fp-navigation">
      {items.map((i) => (
        <button
          key={i.value}
          aria-current={value === i.value ? "page" : undefined}
          onClick={() => onChange(i.value)}
        >
          {i.icon}
          {i.label}
        </button>
      ))}
    </nav>
  );
}
export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="fp-toolbar" role="group" aria-label="内容操作">
      {children}
    </div>
  );
}
export function Callout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="fp-callout">
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
export function Citation({
  title,
  detail,
  onClick,
}: {
  title: string;
  detail: string;
  onClick?: () => void;
}) {
  return (
    <button className="fp-citation" onClick={onClick}>
      <span>↗</span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
    </button>
  );
}
export function AIMessage({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: ReactNode;
}) {
  return (
    <article className={`fp-message fp-message-${role}`}>
      <strong>{role === "user" ? "你" : "五加一 AI"}</strong>
      <div>{children}</div>
    </article>
  );
}
export function AIComposer({
  onSend,
  disabled = false,
}: {
  onSend: (v: string) => void;
  disabled?: boolean;
}) {
  let [value, setValue] = useState("");
  return (
    <form
      className="fp-composer"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) {
          onSend(value.trim());
          setValue("");
        }
      }}
    >
      <Textarea
        aria-label="向 AI 提问"
        placeholder="从一个想法开始…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <footer>
        <span>让想法继续生长</span>
        <Button size="sm" disabled={disabled || !value.trim()} type="submit">
          发送 ↑
        </Button>
      </footer>
    </form>
  );
}
export function TaskStatus({
  title,
  steps,
  running,
  onToggle,
}: {
  title: string;
  steps: string[];
  running: boolean;
  onToggle: () => void;
}) {
  return (
    <Card>
      <div className="fp-between">
        <strong>{title}</strong>
        <Badge tone={running ? "accent" : "neutral"}>
          {running ? "进行中" : "已暂停"}
        </Badge>
      </div>
      <Timeline
        items={steps.map((s, n) => ({
          title: s,
          description:
            n === steps.length - 1
              ? running
                ? "正在进行"
                : "等待继续"
              : "已完成",
        }))}
      />
      <Button variant="secondary" size="sm" onClick={onToggle}>
        {running ? "暂停整理" : "继续整理"}
      </Button>
    </Card>
  );
}
export function ResultCard({
  title,
  description,
  onApply,
}: {
  title: string;
  description: string;
  onApply: () => void;
}) {
  return (
    <Card>
      <Badge tone="success">已完成</Badge>
      <h3>{title}</h3>
      <p className="fp-muted">{description}</p>
      <Button onClick={onApply}>应用到笔记 ↗</Button>
    </Card>
  );
}
export function FileCard({
  name,
  detail,
  onOpen,
}: {
  name: string;
  detail: string;
  onOpen: () => void;
}) {
  return (
    <button className="fp-file-card" onClick={onOpen}>
      <span>▤</span>
      <span>
        <strong>{name}</strong>
        <small>{detail}</small>
      </span>
      <span>↗</span>
    </button>
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="fp-page-header">
      <div>
        {eyebrow && <span className="fp-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}
export function Container({
  children,
  className,
  ...p
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...p} className={cx("fp-container", className)}>
      {children}
    </div>
  );
}
export function Stack({
  children,
  gap,
  direction = "column",
}: {
  children: ReactNode;
  gap?: number;
  direction?: "row" | "column";
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        gap: gap ?? (direction === "row" ? 12 : 24),
        flexWrap: direction === "row" ? "wrap" : undefined,
      }}
    >
      {children}
    </div>
  );
}
export function Grid({
  children,
  minWidth = 240,
}: {
  children: ReactNode;
  minWidth?: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit,minmax(min(${minWidth}px,100%),1fr))`,
        gap: 20,
      }}
    >
      {children}
    </div>
  );
}
export function ScrollArea({
  children,
  height = 240,
}: {
  children: ReactNode;
  height?: number;
}) {
  return (
    <div
      className="fp-scroll-area"
      tabIndex={0}
      style={{ maxHeight: height, overflow: "auto" }}
    >
      {children}
    </div>
  );
}
export function AspectRatio({
  children,
  ratio = 16 / 9,
}: {
  children: ReactNode;
  ratio?: number;
}) {
  return (
    <div style={{ aspectRatio: ratio, overflow: "hidden" }}>{children}</div>
  );
}
export function Combobox({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  let id = useId();
  return (
    <div className="fp-field">
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        list={`${id}-list`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <datalist id={`${id}-list`}>
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </div>
  );
}
export function MultiSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <fieldset className="fp-multiselect">
      <legend>{label}</legend>
      {options.map((o) => (
        <Chip
          key={o}
          selected={value.includes(o)}
          onClick={() =>
            onChange(
              value.includes(o) ? value.filter((v) => v !== o) : [...value, o],
            )
          }
        >
          {o}
        </Chip>
      ))}
    </fieldset>
  );
}
export function PasswordInput({
  label = "密码",
  ...p
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  let [show, setShow] = useState(false);
  return (
    <div className="fp-password">
      <Input {...p} aria-label={label} type={show ? "text" : "password"} />
      <IconButton
        label={show ? "隐藏密码" : "显示密码"}
        onClick={() => setShow(!show)}
        type="button"
      >
        {show ? "隐藏" : "显示"}
      </IconButton>
    </div>
  );
}
export function Banner({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="fp-banner" role="status">
      <span>{children}</span>
      {onClose && (
        <IconButton label="关闭通知" onClick={onClose}>
          ×
        </IconButton>
      )}
    </div>
  );
}
export function Calendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  let base = value ? new Date(value + "T12:00:00") : new Date();
  let [month, setMonth] = useState(
    new Date(base.getFullYear(), base.getMonth(), 1),
  );
  let year = month.getFullYear(),
    m = month.getMonth();
  let start = new Date(year, m, 1).getDay(),
    days = new Date(year, m + 1, 0).getDate();
  return (
    <div className="fp-calendar">
      <header>
        <IconButton
          label="上个月"
          onClick={() => setMonth(new Date(year, m - 1, 1))}
        >
          ‹
        </IconButton>
        <strong>
          {year} 年 {m + 1} 月
        </strong>
        <IconButton
          label="下个月"
          onClick={() => setMonth(new Date(year, m + 1, 1))}
        >
          ›
        </IconButton>
      </header>
      <div className="fp-calendar-grid">
        {"日一二三四五六".split("").map((d) => (
          <span key={d}>{d}</span>
        ))}
        {Array.from({ length: start }, (_, i) => (
          <span key={"s" + i} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          let date = `${year}-${String(m + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
          return (
            <button
              key={date}
              aria-label={date}
              aria-pressed={value === date}
              onClick={() => onChange(date)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export function ResizablePanel({
  first,
  second,
}: {
  first: ReactNode;
  second: ReactNode;
}) {
  let [width, setWidth] = useState(50);
  let parent = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={parent}
      className="fp-resizable"
      style={{
        gridTemplateColumns: `minmax(0,${width}fr) 10px minmax(0,${100 - width}fr)`,
      }}
    >
      <div>{first}</div>
      <div
        role="separator"
        aria-label="调整面板宽度"
        aria-orientation="vertical"
        aria-valuenow={Math.round(width)}
        aria-valuemin={25}
        aria-valuemax={75}
        tabIndex={0}
        onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            setWidth(
              e.key === "Home"
                ? 25
                : e.key === "End"
                  ? 75
                  : Math.max(
                      25,
                      Math.min(75, width + (e.key === "ArrowRight" ? 5 : -5)),
                    ),
            );
          }
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            let r = parent.current!.getBoundingClientRect();
            setWidth(
              Math.max(
                25,
                Math.min(75, ((e.clientX - r.left) / r.width) * 100),
              ),
            );
          }
        }}
      />
      <div>{second}</div>
    </div>
  );
}
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            确认移除
          </Button>
        </>
      }
    >
      <p>{description}</p>
    </Dialog>
  );
}
export function CommandMenu({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: { label: string; onSelect: () => void }[];
}) {
  let [q, setQ] = useState("");
  let [active, setActive] = useState(0);
  let filtered = items.filter((i) =>
    i.label.toLowerCase().includes(q.toLowerCase()),
  );
  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
    }
  }, [open]);
  return (
    <Dialog open={open} onClose={onClose} title="快速前往">
      <div
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((active + 1) % Math.max(1, filtered.length));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive(
              (active - 1 + filtered.length) % Math.max(1, filtered.length),
            );
          }
          if (e.key === "Enter" && filtered[active]) {
            e.preventDefault();
            filtered[active].onSelect();
            onClose();
          }
        }}
      >
        <SearchInput
          value={q}
          onChange={(v) => {
            setQ(v);
            setActive(0);
          }}
          placeholder="搜索页面与组件"
        />
        <div className="fp-command-results">
          {filtered.map((i, n) => (
            <button
              key={i.label}
              className={n === active ? "is-active" : ""}
              onClick={() => {
                i.onSelect();
                onClose();
              }}
            >
              {i.label}
              <span>↵</span>
            </button>
          ))}
          {!filtered.length && <p>没有匹配的结果，试试其他关键词。</p>}
        </div>
      </div>
    </Dialog>
  );
}
export function NotificationList({
  items,
  onRead,
}: {
  items: { id: string; title: string; detail: string; read?: boolean }[];
  onRead: (id: string) => void;
}) {
  return (
    <div className="fp-notifications">
      {items.map((i) => (
        <button key={i.id} onClick={() => onRead(i.id)}>
          <span className={cx("fp-notification-dot", !i.read && "is-unread")} />
          <span>
            <strong>{i.title}</strong>
            <small>{i.detail}</small>
          </span>
          <span>{i.read ? "已读" : "查看"}</span>
        </button>
      ))}
    </div>
  );
}
export function BarChart({
  items,
  label,
}: {
  items: { label: string; value: number }[];
  label: string;
}) {
  let max = Math.max(1, ...items.map((i) => i.value));
  return (
    <figure className="fp-chart" aria-label={label}>
      <figcaption>{label}</figcaption>
      {items.map((i) => (
        <div key={i.label}>
          <span>{i.label}</span>
          <i style={{ width: `${(i.value / max) * 70}%` }} />
          <strong>{i.value}</strong>
        </div>
      ))}
    </figure>
  );
}
export function ImagePreview({ src, alt }: { src: string; alt: string }) {
  let [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="fp-image-button"
        onClick={() => setOpen(true)}
        aria-label={`放大${alt}`}
      >
        <img src={src} alt={alt} />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={alt}>
        <img style={{ width: "100%" }} src={src} alt={alt} />
      </Dialog>
    </>
  );
}
export function ErrorState({
  title = "暂时无法显示内容",
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry: () => void;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={<Button onClick={onRetry}>重新加载</Button>}
    />
  );
}
export function Footer({ children }: { children: ReactNode }) {
  return <footer className="fp-footer">{children}</footer>;
}
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="fp-sr-only">{children}</span>;
}
export { default as PdfPreview } from "./workspace/PdfPreview";
export { default as HorizontalScrollbar } from "./workspace/HorizontalScrollbar";
export * from "./workspace/ResourcePreview";
export * from "./workspace/FileTree";
export * from "./workspace/CollaborativeEditor";
export { MessageList, MessageBubble, type Message, type MessageListProps } from "./MessageList";
export { CollapseTransition, type CollapseTransitionProps } from "./CollapseTransition";
export { AgentTrace, type AgentTraceProps, type TraceStep, type TraceStatus } from "./AgentTrace";
export { FlipCard, type FlipCardProps, type FlipCardKind } from "./FlipCard";
export { SelectionToolbar, type SelectionToolbarProps, type SelectionAction } from "./SelectionToolbar";
export { SyncStatus, type SyncStatusProps, type PendingSync } from "./SyncStatus";
export { ModelSelector, type ModelSelectorProps, type ModelInfo, type ModelGroup } from "./ModelSelector";
export { TokenDashboard, TokenDashboardAuto, type TokenDashboardProps } from "./TokenDashboard";
export { CollapsibleSection, type CollapsibleSectionProps } from "./CollapsibleSection";
export { AttachmentGrid, type AttachmentGridProps, type AttachmentItem } from "./AttachmentGrid";
export { QuizQuestion, type QuizQuestionProps, type QuizOption, type QuizDifficulty } from "./QuizQuestion";
export { EmbedFallback, type EmbedFallbackProps } from "./EmbedFallback";
export { MediaLightbox, type MediaLightboxProps } from "./MediaLightbox";
export { SettingsSection, type SettingsSectionProps } from "./SettingsSection";
export { ChatEmptyState, type ChatEmptyStateProps } from "./ChatEmptyState";
export { SourceFold, type SourceFoldProps, type SourceItem } from "./SourceFold";
export { SessionHistory, type SessionHistoryProps, type SessionGroup, type SessionItem } from "./SessionHistory";
export { ContentImage, type ContentImageProps } from "./ContentImage";
export { WindowChrome, type WindowChromeProps } from "./WindowChrome";
export { FilterSelect, type FilterSelectProps, type FilterOption, type FilterGroup } from "./FilterSelect";
export { AcademicYearSwitcher, type AcademicYearSwitcherProps, type AcademicYear } from "./AcademicYearSwitcher";
export {
  KeyPoint,
  ConceptCard,
  CompareTable,
  CauseEffect,
  Derivation,
  type KeyPointProps,
  type ConceptCardProps,
  type CompareTableProps,
  type CauseEffectProps,
  type CauseEffectItem,
  type DerivationProps,
} from "./NoteBlocks";
export { CitationList, type CitationListProps, type CitationHit } from "./CitationList";
export { ApprovalCard, type ApprovalCardProps } from "./ApprovalCard";
export { TocTree, type TocTreeProps, type TocItemNode } from "./TocTree";
export { SiblingFiles, type SiblingFilesProps, type SiblingItem, type SiblingStatus } from "./SiblingFiles";
export { FormulaSteps, type FormulaStepsProps } from "./FormulaSteps";
export { DistributionChart, type DistributionChartProps, type DistributionKind } from "./DistributionChart";
export { VideoPlayer, type VideoPlayerProps } from "./VideoPlayer";
export { ShortcutHelp, type ShortcutHelpProps, type ShortcutCategory, type ShortcutItem } from "./ShortcutHelp";
export { BottomNav, type BottomNavProps, type BottomNavItem } from "./BottomNav";
export { ImageGallery, type ImageGalleryProps, type GalleryImage } from "./ImageGallery";
export { WindowTaskbar, type WindowTaskbarProps, type TaskbarWindow } from "./WindowTaskbar";
export * from "./themes";
import "./workspace/preview.css";
import "./workspace/workspace.css";
import "./product-themes.css";

