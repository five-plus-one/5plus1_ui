/** ApprovalCard - 从课栈 chat/ImageGenCard 提取
 *
 * 需要用户明确批准的 AI 操作卡片：展示提示词与将要消耗的资源，
 * 未批准前不执行。用于生图、付费调用等不可自动继续的任务。
 */

import type { ReactNode } from "react";
import { Sparkles, Check, X } from "lucide-react";

export interface ApprovalCardProps {
  title?: string;
  /** 将要执行的内容，例如提示词 */
  prompt?: string;
  /** 关键参数列表 */
  details?: { label: string; value: ReactNode }[];
  /** 费用或资源提示 */
  cost?: ReactNode;
  status?: "idle" | "approved" | "running" | "done" | "cancelled" | "error";
  onApprove: () => void;
  onCancel: () => void;
  /** 完成后显示的结果区域 */
  children?: ReactNode;
}

const STATUS_TEXT: Record<NonNullable<ApprovalCardProps["status"]>, string> = {
  idle: "等待确认",
  approved: "已批准",
  running: "生成中",
  done: "已完成",
  cancelled: "已取消",
  error: "失败",
};

export function ApprovalCard({
  title = "AI 生图",
  prompt,
  details = [],
  cost,
  status = "idle",
  onApprove,
  onCancel,
  children,
}: ApprovalCardProps) {
  const pending = status === "idle";
  return (
    <section className="fp-approval" data-status={status}>
      <header className="fp-approval-head">
        <span className="fp-approval-icon" aria-hidden="true">
          <Sparkles size={16} />
        </span>
        <strong>{title}</strong>
        <span className="fp-approval-status">{STATUS_TEXT[status]}</span>
      </header>
      {prompt && <p className="fp-approval-prompt">{prompt}</p>}
      {details.length > 0 && (
        <dl className="fp-approval-details">
          {details.map((d) => (
            <div key={d.label}>
              <dt>{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {cost && <p className="fp-approval-cost">{cost}</p>}
      {pending ? (
        <div className="fp-approval-actions">
          <button type="button" className="fp-button fp-primary" onClick={onApprove}>
            <Check size={15} aria-hidden="true" />
            批准并继续
          </button>
          <button
            type="button"
            className="fp-button fp-secondary"
            onClick={onCancel}
          >
            <X size={15} aria-hidden="true" />
            取消
          </button>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
