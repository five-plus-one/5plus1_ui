/** KeZhan 组件提取 - TokenDashboard（积分仪表盘）
 *
 * 原组件功能：
 * - 显示用户积分余额
 * - 加载状态处理
 * - 点击打开计费面板
 *
 * 五加一设计规范重写：
 * - 使用 fp-* 变量
 * - 统一交互模式
 * - 完整可访问性
 */

import { useState, useEffect } from "react";
import { Coins } from "lucide-react";

export interface TokenDashboardProps {
  /** 当前余额（以 token 计） */
  balance?: number;
  /** 是否启用积分系统 */
  enabled?: boolean;
  /** 加载状态 */
  isLoading?: boolean;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义标签 */
  label?: string;
}

export function TokenDashboard({
  balance,
  enabled = true,
  isLoading = false,
  onClick,
  label,
}: TokenDashboardProps) {
  const displayLabel =
    label ||
    (enabled
      ? balance !== undefined
        ? `${(balance / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 })} 积分`
        : "积分"
      : "免费体验");

  return (
    <button
      type="button"
      className="fp-token-dashboard"
      onClick={onClick}
      disabled={isLoading}
      aria-label="查看积分与会员"
    >
      <Coins size={16} aria-hidden="true" />
      <span>{displayLabel}</span>
    </button>
  );
}

/** 带自动加载的版本 */
export function TokenDashboardAuto({
  apiEndpoint = "/api/me/credits",
  onClick,
}: {
  apiEndpoint?: string;
  onClick?: () => void;
}) {
  const [balance, setBalance] = useState<number>();
  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(apiEndpoint)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        if (active) {
          setBalance(d.wallet.balance);
          setEnabled(d.config.enabled);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [apiEndpoint]);

  return (
    <TokenDashboard
      balance={balance}
      enabled={enabled}
      isLoading={isLoading}
      onClick={onClick}
    />
  );
}
