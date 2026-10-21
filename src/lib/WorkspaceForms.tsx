import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SelectField, type SelectOption } from "./SelectField";
import { AnimatedSize } from "./AnimatedSize";

export function WorkspaceSection({
  title,
  description,
  actions,
  children,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="fp-workspace-section">
      {(title || description || actions) && <header>
        <div>
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="fp-workspace-actions">{actions}</div>}
      </header>}
      {children}
    </section>
  );
}
function WorkspaceNumericInput({
  label,
  value,
  onChange,
  disabled,
  required,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  const [text, setText] = useState(String(value)),
    focused = useRef(false),
    latest = useRef(text);
  latest.current = text;
  useEffect(() => {
    if (
      !focused.current ||
      (!(
        typeof value === "number" && Object.is(Number(latest.current), value)
      ) &&
        latest.current !== String(value))
    )
      setText(String(value));
  }, [value]);
  return (
    <input
      aria-label={label}
      className="fp-input"
      type="text"
      inputMode="decimal"
      value={text}
      onFocus={() => {
        focused.current = true;
      }}
      onBlur={() => {
        focused.current = false;
        if (typeof value === "string" || Number.isFinite(value))
          setText(String(value));
      }}
      onChange={(event) => {
        const next = event.target.value;
        latest.current = next;
        setText(next);
        onChange(next);
      }}
      disabled={disabled}
      required={required}
    />
  );
}
export function WorkspaceField({
  label,
  value,
  onChange,
  hint,
  options,
  multiline,
  secret,
  numeric,
  disabled,
  required,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  hint?: string;
  options?: SelectOption[];
  multiline?: boolean;
  secret?: boolean;
  numeric?: boolean;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <label className="fp-workspace-field">
      <span>{label}</span>
      {options ? (
        <SelectField
          label={label}
          value={String(value)}
          options={options}
          onChange={onChange}
          disabled={disabled}
        />
      ) : multiline ? (
        <textarea
          aria-label={label}
          className="fp-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          disabled={disabled}
          required={required}
        />
      ) : numeric ? (
        <WorkspaceNumericInput
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
        />
      ) : (
        <input
          aria-label={label}
          className="fp-input"
          type={secret ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          autoComplete={secret ? "new-password" : undefined}
        />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function WorkspaceToggle({
  label,
  checked,
  onChange,
  description,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className="fp-workspace-toggle">
      <div>
        <strong>{label}</strong>
        {description && <p>{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        disabled={disabled}
        className="fp-switch-label"
        onClick={() => onChange(!checked)}
      >
        <span aria-hidden="true" className={`fp-switch${checked ? ' is-on' : ''}`}><i /></span>
      </button>
    </div>
  );
}
export function SettingsTabs({
  label,
  value,
  onChange,
  items,
  density = "comfortable",
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  items: { id: string; label: string }[];
  density?: "comfortable" | "compact";
}) {
  const id = useId(),
    reduced = useReducedMotion();
  return (
    <div className="fp-settings-tabs" data-density={density} role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          role="tab"
          aria-selected={value === item.id}
          tabIndex={value === item.id ? 0 : -1}
          onClick={() => onChange(item.id)}
          onKeyDown={(e) => {
            const index = items.findIndex((i) => i.id === item.id);
            const next =
              e.key === "ArrowRight"
                ? (index + 1) % items.length
                : e.key === "ArrowLeft"
                  ? (index - 1 + items.length) % items.length
                  : e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? items.length - 1
                      : -1;
            if (next >= 0) {
              e.preventDefault();
              onChange(items[next].id);
              (
                e.currentTarget.parentElement?.children[next] as HTMLElement
              )?.focus();
            }
          }}
        >
          {value === item.id && (
            <motion.span
              className="fp-settings-tab-indicator"
              layoutId={`settings-tab-${id}`}
              transition={{
                duration: reduced ? 0 : 0.18,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            />
          )}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
export function useWorkspaceAction() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const lock = useRef(false),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const run = async (work: () => Promise<void> | void, success = "") => {
    if (lock.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await work();
      if (mounted.current && success) setMessage(success);
      return true;
    } catch (cause) {
      if (mounted.current)
        setError(
          cause instanceof Error ? cause.message : "操作暂未完成，请重试。",
        );
      return false;
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  return { busy, error, message, run, setError, setMessage };
}
export function WorkspaceFeedback({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  return (
    <AnimatedSize
      className={`fp-feedback-size${error || message ? " fp-feedback-visible" : ""}`}
    >
      <div className="fp-workspace-feedback">
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
      </div>
    </AnimatedSize>
  );
}
export function WorkspaceSave({
  busy,
  dirty = true,
  onClick,
  label = "保存更改",
}: {
  busy: boolean;
  dirty?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="fp-button fp-primary"
      disabled={busy || !dirty}
      onClick={onClick}
    >
      {busy ? "正在保存…" : label}
    </button>
  );
}

/** Parent updates replace a clean draft; pending edits survive background refreshes. */
export function useWorkspaceDraft<T>(value: T) {
  const [draft, setDraft] = useState(value),
    [baseline, setBaseline] = useState(() => JSON.stringify(value));
  const source = JSON.stringify(value),
    dirty = JSON.stringify(draft) !== baseline;
  const lastSource = useRef(source);
  useEffect(() => {
    if (source === lastSource.current) return;
    lastSource.current = source;
    if (!dirty) {
      setDraft(value);
      setBaseline(source);
    }
  }, [source, baseline, dirty]);
  const accept = (next: T) => {
    setDraft(next);
    setBaseline(JSON.stringify(next));
  };
  return { draft, setDraft, dirty, accept };
}
