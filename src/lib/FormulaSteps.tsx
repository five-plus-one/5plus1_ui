/** FormulaSteps - 从课栈 visualizations/primitives/FormulaSteps 提取
 *
 * 分步公式：展示推导的每一步，可切换为逐步浏览模式。
 * 与 Derivation 的区别是内容按步骤拆分，强调顺序与前后的衔接。
 */

import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Sigma } from "lucide-react";

export interface FormulaStepsProps {
  /** 每一步的内容，建议为普通文本或行内公式 */
  steps: ReactNode[];
  /** 交互模式：逐步显示，默认 false 全部展示 */
  interactive?: boolean;
  label?: string;
}

export function FormulaSteps({
  steps,
  interactive = false,
  label = "推导步骤",
}: FormulaStepsProps) {
  const [index, setIndex] = useState(0);
  if (!steps.length) return null;

  const visible = interactive ? [steps[index]] : steps;

  return (
    <section className="fp-formula" aria-label={label}>
      <header className="fp-formula-head">
        <Sigma size={15} aria-hidden="true" />
        <span>{label}</span>
        {interactive && (
          <span className="fp-formula-count">
            第 {index + 1} / {steps.length} 步
          </span>
        )}
      </header>
      <ol className="fp-formula-list">
        {visible.map((step, i) => (
          <li key={interactive ? index : i}>
            <span className="fp-formula-index">{interactive ? index + 1 : i + 1}</span>
            <div className="fp-formula-body">{step}</div>
          </li>
        ))}
      </ol>
      {interactive && (
        <div className="fp-formula-nav">
          <button
            type="button"
            className="fp-button fp-secondary fp-sm"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            <ChevronLeft size={14} aria-hidden="true" />
            上一步
          </button>
          <button
            type="button"
            className="fp-button fp-secondary fp-sm"
            disabled={index === steps.length - 1}
            onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          >
            下一步
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
