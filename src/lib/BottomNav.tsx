/** BottomNav - 从课栈 layout/MobileBottomNav 提取
 *
 * 移动端底部导航：图标 + 文字，当前项有顶部指示条，
 * 自动避让 iOS 安全区。
 */

import type { ReactNode } from "react";

export interface BottomNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  /** 角标数字 */
  badge?: number;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
}

export function BottomNav({
  items,
  value,
  onChange,
  label = "主导航",
}: BottomNavProps) {
  return (
    <nav className="fp-bottom-nav" aria-label={label}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            className="fp-bottom-nav-item"
            aria-current={active ? "page" : undefined}
            onClick={() => onChange(item.id)}
          >
            <span className="fp-bottom-nav-indicator" aria-hidden="true" />
            <span className="fp-bottom-nav-icon">
              {item.icon}
              {item.badge ? (
                <span className="fp-bottom-nav-badge">{item.badge}</span>
              ) : null}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
