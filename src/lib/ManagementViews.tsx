import { useRef, useState, type ReactNode } from "react";
import { AnimatedSize } from "./AnimatedSize";
import { SelectField } from "./SelectField";
export function AsyncAction({
  children,
  onAction,
  disabled = false,
  confirm,
}: {
  children: ReactNode;
  onAction: () => Promise<void> | void;
  disabled?: boolean;
  confirm?: string;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [asking, setAsking] = useState(false);
  const guard = useRef(false);
  const run = async () => {
    if (guard.current) return;
    guard.current = true;
    setBusy(true);
    setError("");
    try {
      await onAction();
      setAsking(false);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "操作未能完成，请重试。",
      );
    } finally {
      guard.current = false;
      setBusy(false);
    }
  };
  return (
    <span className="fp-async-action">
      {asking ? (
        <>
          <span>{confirm}</span>
          <button
            type="button"
            className="fp-button fp-secondary fp-sm"
            disabled={busy || disabled}
            onClick={() => void run()}
          >
            {busy ? "正在处理…" : "确认"}
          </button>
          <button
            type="button"
            className="fp-button fp-secondary fp-sm"
            disabled={busy}
            onClick={() => setAsking(false)}
          >
            取消
          </button>
        </>
      ) : (
        <button
          type="button"
          className="fp-button fp-secondary fp-sm"
          disabled={busy || disabled}
          onClick={() => (confirm ? setAsking(true) : void run())}
        >
          {busy ? "正在处理…" : children}
        </button>
      )}
      {error && <span role="alert">{error}</span>}
    </span>
  );
}
export interface ManagementColumn<T> {
  id: string;
  label: string;
  render: (item: T) => ReactNode;
}
export interface ManagementAction<T> {
  id: string;
  label: string;
  run: (item: T) => Promise<void> | void;
  disabled?: (item: T) => boolean;
  confirm?: (item: T) => string;
}
export function ManagementTable<T extends { id: string }>({
  title,
  items,
  columns,
  actions = [],
  loading,
  error,
  toolbar,
  onLoadMore,
  hasMore,
}: {
  title: string;
  items: T[];
  columns: ManagementColumn<T>[];
  actions?: ManagementAction<T>[];
  loading?: boolean;
  error?: string;
  toolbar?: ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
}) {
  return (
    <section className="fp-management" aria-label={title}>
      <header>
        <h3>{title}</h3>
        {toolbar}
      </header>
      {error && <p role="alert">{error}</p>}
      <div className="fp-management-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.id} scope="col">
                  {c.label}
                </th>
              ))}
              {!!actions.length && <th scope="col">操作</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {columns.map((c) => (
                  <td key={c.id} data-label={c.label}>
                    {c.render(item)}
                  </td>
                ))}
                {!!actions.length && (
                  <td data-label="操作">
                    <div className="fp-pattern-actions">
                      {actions.map((action) => (
                        <AsyncAction
                          key={action.id}
                          disabled={action.disabled?.(item) || loading}
                          confirm={action.confirm?.(item)}
                          onAction={() => action.run(item)}
                        >
                          {action.label}
                        </AsyncAction>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <p role="status">正在加载…</p>}
      {!items.length && !loading && <p>这里还没有内容。</p>}
      {hasMore && onLoadMore && (
        <button type="button" disabled={loading} onClick={onLoadMore}>
          加载更多
        </button>
      )}
    </section>
  );
}
export interface LedgerEntry {
  id: string;
  title: string;
  date: string;
  amount: number;
  balance?: number;
  status?: string;
}
export function LedgerView({
  entries,
  loading,
  error,
}: {
  entries: LedgerEntry[];
  loading?: boolean;
  error?: string;
}) {
  return (
    <ManagementTable
      title="收支明细"
      items={entries}
      loading={loading}
      error={error}
      columns={[
        { id: "title", label: "事项", render: (i) => i.title },
        { id: "date", label: "时间", render: (i) => i.date },
        {
          id: "amount",
          label: "变动",
          render: (i) => (
            <span data-positive={i.amount > 0 || undefined}>
              {i.amount > 0 ? "+" : ""}
              {i.amount.toLocaleString()}
            </span>
          ),
        },
        {
          id: "balance",
          label: "余额",
          render: (i) => i.balance?.toLocaleString() ?? "—",
        },
        { id: "status", label: "状态", render: (i) => i.status || "已完成" },
      ]}
    />
  );
}
export function CreditsOverview({
  balance,
  reserved = 0,
  children,
  onTopUp,
}: {
  balance: number;
  reserved?: number;
  children?: ReactNode;
  onTopUp?: () => void;
}) {
  return (
    <section className="fp-pattern-panel">
      <header>
        <h3>我的积分</h3>
        {onTopUp && (
          <button type="button" onClick={onTopUp}>
            补充积分
          </button>
        )}
      </header>
      <strong className="fp-summary-value">{balance.toLocaleString()}</strong>
      <p>可用积分{reserved > 0 && ` · 使用中 ${reserved.toLocaleString()}`}</p>
      {children}
    </section>
  );
}
export interface CapacityItem {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
}
export function CapacityOverview({
  items,
  onManage,
}: {
  items: CapacityItem[];
  onManage?: (id: string) => void;
}) {
  return (
    <section className="fp-pattern-panel">
      <h3>使用情况</h3>
      {items.map((item) => (
        <div className="fp-capacity-row" key={item.id}>
          <div>
            <strong>{item.label}</strong>
            <span>
              {item.used.toLocaleString()} / {item.limit.toLocaleString()}{" "}
              {item.unit}
            </span>
          </div>
          <progress
            aria-label={item.label}
            value={Math.min(item.limit, Math.max(0, item.used))}
            max={Math.max(1, item.limit)}
          />
          {onManage && (
            <button type="button" onClick={() => onManage(item.id)}>
              管理{item.label}
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
export interface AccessInheritance {
  source: string;
  role: string;
  inherited: boolean;
}
export function PermissionSummary({
  items,
  canManage,
  onManage,
}: {
  items: AccessInheritance[];
  canManage?: boolean;
  onManage?: () => void;
}) {
  return (
    <section className="fp-pattern-panel" aria-label="访问权限来源">
      <header>
        <h3>访问权限</h3>
        {canManage && onManage && (
          <button type="button" onClick={onManage}>
            管理权限
          </button>
        )}
      </header>
      {items.length ? (
        <ul>
          {items.map((item, index) => (
            <li key={`${item.source}-${index}`}>
              <strong>{item.source}</strong>
              <span>{item.role}</span>
              <small>{item.inherited ? "来自上级目录" : "单独设置"}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>仅自己可以访问。</p>
      )}
    </section>
  );
}
export interface SettingsField {
  id: string;
  label: string;
  description?: string;
  value: string;
  options?: { value: string; label: string }[];
  secret?: boolean;
  disabled?: boolean;
}
export function SettingsForm({
  title,
  fields,
  onChange,
  onSave,
}: {
  title: string;
  fields: SettingsField[];
  onChange: (id: string, value: string) => void;
  onSave: () => Promise<void> | void;
}) {
  return (
    <section className="fp-pattern-panel">
      <h3>{title}</h3>
      <div className="fp-settings-fields">
        {fields.map((field) => (
          <label key={field.id}>
            <span>{field.label}</span>
            {field.options ? (
              <SelectField
                label={field.label}
                value={field.value}
                options={field.options}
                disabled={field.disabled}
                onChange={(value) => onChange(field.id, value)}
              />
            ) : (
              <input
                aria-label={field.label}
                type={field.secret ? "password" : "text"}
                value={field.value}
                disabled={field.disabled}
                onChange={(e) => onChange(field.id, e.target.value)}
              />
            )}{" "}
            {field.description && <small>{field.description}</small>}
          </label>
        ))}
      </div>
      <div className="fp-pattern-actions">
        <AsyncAction onAction={onSave}>保存设置</AsyncAction>
      </div>
    </section>
  );
}
export interface SetupStep {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  canContinue?: boolean;
}
export function SetupWizard({
  steps,
  step,
  onStepChange,
  onComplete,
}: {
  steps: SetupStep[];
  step: number;
  onStepChange: (step: number) => void;
  onComplete: () => Promise<void> | void;
}) {
  const current = steps[step];
  if (!current)
    return (
      <section className="fp-onboarding">
        <p>暂时没有可用的设置步骤。</p>
      </section>
    );
  return (
    <section className="fp-onboarding">
      <ol aria-label="设置进度">
        {steps.map((item, index) => (
          <li key={item.id} aria-current={index === step ? "step" : undefined}>
            <span>{index + 1}</span>
            {item.title}
          </li>
        ))}
      </ol>
      <AnimatedSize>
        <div>
          <h3>{current.title}</h3>
          {current.description && <p>{current.description}</p>}
          {current.content}
        </div>
      </AnimatedSize>
      <div className="fp-pattern-actions">
        {step < steps.length - 1 ? (
          <button
            type="button"
            disabled={current.canContinue === false}
            onClick={() => onStepChange(step + 1)}
          >
            继续
          </button>
        ) : (
          <AsyncAction
            disabled={current.canContinue === false}
            onAction={onComplete}
          >
            完成设置
          </AsyncAction>
        )}
        <button
          type="button"
          disabled={step === 0}
          onClick={() => onStepChange(step - 1)}
        >
          上一步
        </button>
      </div>
    </section>
  );
}
