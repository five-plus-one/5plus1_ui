/** AgentTrace - 从课栈 chat/AgentTrace 提取
 *
 * 展示 AI 的推理与工具调用过程：可折叠、可逐步展开，
 * 运行中显示活动指示，失败步骤有独立状态。
 */

import { useState, type ReactNode } from "react";
import { ChevronRight, Check, Loader, AlertCircle, Circle } from "lucide-react";

export type TraceStatus = "pending" | "running" | "done" | "error";

export interface TraceStep {
  id: string;
  title: string;
  detail?: string;
  status: TraceStatus;
  meta?: ReactNode;
}

export interface AgentTraceProps {
  steps: TraceStep[];
  /** 是否正在流式输出：自动展开最后一步 */
  streaming?: boolean;
  /** 总耗时（毫秒） */
  durationMs?: number;
  /** 初始是否展开 */
  defaultOpen?: boolean;
  title?: string;
}

const ICONS: Record<TraceStatus, ReactNode> = {
  pending: <Circle size={14} />,
  running: <Loader size={14} className="fp-spin" />,
  done: <Check size={14} />,
  error: <AlertCircle size={14} />,
};

export function AgentTrace({
  steps,
  streaming = false,
  durationMs,
  defaultOpen = true,
  title = "思考过程",
}: AgentTraceProps) {
  const [open, setOpen] = useState(defaultOpen || streaming);
  const done = steps.filter((s) => s.status === "done").length;
  const failed = steps.some((s) => s.status === "error");

  return (
    <section
      className="fp-trace"
      data-streaming={streaming || undefined}
      aria-label={title}
    >
      <button
        type="button"
        className="fp-trace-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronRight size={15} className="fp-trace-chevron" />
        <strong>{title}</strong>
        <span className="fp-trace-summary">
          {failed
            ? "有步骤失败"
            : streaming
              ? "进行中"
              : `${done} / ${steps.length} 步`}
          {durationMs ? ` · ${(durationMs / 1000).toFixed(1)}s` : ""}
        </span>
      </button>
      <div className="fp-trace-body" data-open={open || undefined}>
        <ol className="fp-trace-steps">
          {steps.map((step) => (
            <li key={step.id} data-status={step.status}>
              <span className="fp-trace-icon" aria-hidden="true">
                {ICONS[step.status]}
              </span>
              <div className="fp-trace-content">
                <div className="fp-trace-title">
                  {step.title}
                  {step.meta && <span className="fp-trace-meta">{step.meta}</span>}
                </div>
                {step.detail && (
                  <p className="fp-trace-detail">{step.detail}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
