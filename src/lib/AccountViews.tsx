import { AnimatedSize } from "./AnimatedSize";
import { useRef, useState, type ReactNode } from "react";
import { AsyncAction } from "./ManagementViews";
import { ProductNavigation, type NavigationItem } from "./WorkspaceNavigation";
import { SelectField } from "./SelectField";
export interface AccountLayoutProps {
  title: string;
  navigation: NavigationItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  profile?: ReactNode;
  children: ReactNode;
}
export function AccountLayout({
  title,
  navigation,
  activeId,
  onNavigate,
  profile,
  children,
}: AccountLayoutProps) {
  return (
    <section className="fp-account-layout">
      <aside>
        <h2>{title}</h2>
        {profile}
        <ProductNavigation
          items={navigation}
          value={activeId}
          onChange={onNavigate}
          label="账户功能"
        />
      </aside>
      <div className="fp-account-content">{children}</div>
    </section>
  );
}
export function LoginForm({
  onLogin,
  heading = "登录课栈",
  description = "继续整理笔记，与同学一起学习。",
  alternate,
}: {
  onLogin: (account: string, password: string) => Promise<void> | void;
  heading?: string;
  description?: string;
  alternate?: ReactNode;
}) {
  const [account, setAccount] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [visible, setVisible] = useState(false);
  const guard = useRef(false);
  return (
    <section className="fp-pattern-panel fp-login-form">
      <h2>{heading}</h2>
      <p>{description}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (guard.current || !account.trim() || !password) return;
          guard.current = true;
          setBusy(true);
          setError("");
          try {
            await onLogin(account.trim(), password);
          } catch (cause) {
            setError(
              cause instanceof Error
                ? cause.message
                : "登录未能完成，请检查账号和密码。",
            );
          } finally {
            guard.current = false;
            setBusy(false);
          }
        }}
      >
        <label>
          账号
          <input
            aria-label="账号"
            autoComplete="username"
            required
            value={account}
            disabled={busy}
            onChange={(e) => setAccount(e.target.value)}
          />
        </label>
        <label>
          密码
          <div className="fp-password-entry">
            <input
              aria-label="密码"
              autoComplete="current-password"
              required
              type={visible ? "text" : "password"}
              value={password}
              disabled={busy}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              aria-label={visible ? "隐藏密码" : "显示密码"}
              onClick={() => setVisible((v) => !v)}
            >
              {visible ? "隐藏" : "显示"}
            </button>
          </div>
        </label>
        {error && <p role="alert">{error}</p>}
        <div className="fp-pattern-actions">
          <button type="submit" disabled={busy || !account.trim() || !password}>
            {busy ? "正在登录…" : "登录"}
          </button>
        </div>
      </form>
      {alternate}
    </section>
  );
}
export interface ProfileDetail {
  label: string;
  value: ReactNode;
}
export function UserProfile({
  name,
  avatarUrl,
  description,
  details,
  actions,
}: {
  name: string;
  avatarUrl?: string;
  description?: string;
  details: ProfileDetail[];
  actions?: ReactNode;
}) {
  return (
    <section className="fp-pattern-panel">
      <header>
        <div className="fp-profile-heading">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" />
          ) : (
            <span aria-hidden="true">{name.slice(0, 1)}</span>
          )}
          <div>
            <h3>{name}</h3>
            {description && <small>{description}</small>}
          </div>
        </div>
        {actions}
      </header>
      <dl className="fp-detail-list">
        {details.map((detail, index) => (
          <div key={index}>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
export function CreditAdjustment({
  name,
  balance,
  onSubmit,
}: {
  name: string;
  balance: number;
  onSubmit: (amount: number, reason: string) => Promise<void> | void;
}) {
  const [amount, setAmount] = useState(""),
    [reason, setReason] = useState("");
  const value = Number(amount);
  return (
    <section className="fp-pattern-panel">
      <h3>调整{name}的积分</h3>
      <p>当前可用 {balance.toLocaleString()} 积分</p>
      <div className="fp-settings-fields">
        <label>
          调整数量
          <input
            aria-label="调整数量"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <small>正数增加，负数扣减。</small>
        </label>
        <label>
          调整原因
          <input
            aria-label="调整原因"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
      </div>
      <div className="fp-pattern-actions">
        <AsyncAction
          disabled={
            !amount.trim() ||
            !Number.isSafeInteger(value) ||
            value === 0 ||
            !reason.trim() ||
            balance + value < 0
          }
          confirm={`将${value >= 0 ? "增加" : "扣减"} ${Math.abs(value) || 0} 积分，确认继续？`}
          onAction={() => onSubmit(value, reason.trim())}
        >
          确认调整
        </AsyncAction>
      </div>
    </section>
  );
}
export interface Invitation {
  id: string;
  name: string;
  from: string;
  role: string;
  date?: string;
}
function InvitationActions({
  item,
  onRespond,
}: {
  item: Invitation;
  onRespond: (id: string, accept: boolean) => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false);
  const guard = useRef(false);
  const respond = async (accept: boolean) => {
    if (guard.current) return;
    guard.current = true;
    setBusy(true);
    try {
      await onRespond(item.id, accept);
    } finally {
      guard.current = false;
      setBusy(false);
    }
  };
  return (
    <div className="fp-pattern-actions">
      <AsyncAction disabled={busy} onAction={() => respond(true)}>
        接受
      </AsyncAction>
      <AsyncAction disabled={busy} onAction={() => respond(false)}>
        婉拒
      </AsyncAction>
    </div>
  );
}
export function InvitationList({
  items,
  onRespond,
  loading,
  error,
}: {
  items: Invitation[];
  onRespond: (id: string, accept: boolean) => Promise<void> | void;
  loading?: boolean;
  error?: string;
}) {
  return (
    <section className="fp-pattern-panel">
      <h3>协作邀请</h3>
      {error && <p role="alert">{error}</p>}
      <AnimatedSize>
        {loading ? (
          <p role="status">正在读取邀请…</p>
        ) : items.length ? (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.from} 邀请你{item.role}
                    {item.date && ` · ${item.date}`}
                  </small>
                </span>
                <InvitationActions item={item} onRespond={onRespond} />
              </li>
            ))}
          </ul>
        ) : (
          <p>暂时没有待处理的邀请。</p>
        )}
      </AnimatedSize>
    </section>
  );
}
export interface DirectoryOption {
  id: string;
  name: string;
  parentId?: string | null;
  disabled?: boolean;
}
export function DirectoryPicker({
  items,
  value,
  onChange,
  label = "选择目录",
  onConfirm,
}: {
  items: DirectoryOption[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
  onConfirm?: () => Promise<void> | void;
}) {
  const path = (item: DirectoryOption) => {
    const names = [item.name],
      seen = new Set([item.id]);
    let current = item;
    while (current.parentId) {
      const parent = items.find((i) => i.id === current.parentId);
      if (!parent || seen.has(parent.id)) break;
      names.unshift(parent.name);
      seen.add(parent.id);
      current = parent;
    }
    return names.join(" / ");
  };
  return (
    <section className="fp-pattern-panel">
      <h3>{label}</h3>
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        searchable
        options={items.map((item) => ({
          value: item.id,
          label: item.name,
          description: path(item),
          disabled: item.disabled,
        }))}
      />
      {onConfirm && (
        <div className="fp-pattern-actions">
          <AsyncAction
            disabled={!items.some((i) => i.id === value && !i.disabled)}
            onAction={onConfirm}
          >
            选择此目录
          </AsyncAction>
        </div>
      )}
    </section>
  );
}
export interface CommercePlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  current?: boolean;
  disabled?: boolean;
}
export function PlanPicker({
  plans,
  onSelect,
}: {
  plans: CommercePlan[];
  onSelect: (id: string) => void;
}) {
  return (
    <section className="fp-plan-picker" aria-label="选择方案">
      {plans.map((plan) => (
        <article
          className="fp-pattern-panel"
          key={plan.id}
          data-current={plan.current || undefined}
        >
          <h3>{plan.name}</h3>
          <strong className="fp-summary-value">{plan.price}</strong>
          <p>{plan.description}</p>
          <ul>
            {plan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <div className="fp-pattern-actions">
            <button
              type="button"
              disabled={plan.current || plan.disabled}
              onClick={() => onSelect(plan.id)}
            >
              {plan.current ? "当前方案" : "查看方案"}
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
