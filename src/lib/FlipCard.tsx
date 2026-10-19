/** FlipCard - 从课栈 review/FlipCard 提取
 *
 * 复习闪卡：正面是问题，背面是答案。点击或按 Enter / 空格翻面。
 * 受控组件，翻面有 3D 过渡，尊重减少动态效果偏好。
 */

import { useId, type ReactNode } from "react";

export type FlipCardKind = "excerpt" | "cloze" | "quiz" | "custom" | "qa";

export interface FlipCardProps {
  kind?: FlipCardKind;
  front: ReactNode;
  back: ReactNode;
  flipped: boolean;
  onFlip: () => void;
  /** 背面补充说明，例如评分依据 */
  explanation?: string;
  className?: string;
}

const LABELS: Record<FlipCardKind, [string, string]> = {
  excerpt: ["摘录 · 原文", "回顾 · 要点"],
  cloze: ["填空 · 回忆内容", "答案"],
  quiz: ["题目 · 先思考", "参考答案"],
  custom: ["正面", "背面"],
  qa: ["问题", "答案"],
};

export function FlipCard({
  kind = "qa",
  front,
  back,
  flipped,
  onFlip,
  explanation,
  className,
}: FlipCardProps) {
  const id = useId();
  const [frontLabel, backLabel] = LABELS[kind];
  return (
    <div className={`fp-flip ${className || ""}`} data-flipped={flipped || undefined}>
      <button
        type="button"
        className="fp-flip-stage"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-describedby={id}
        aria-label={flipped ? "翻回正面" : "翻开背面"}
      >
        <div className="fp-flip-face fp-flip-front" aria-hidden={flipped}>
          <span className="fp-flip-label">{frontLabel}</span>
          <div className="fp-flip-content">{front}</div>
          <span className="fp-flip-hint">点击翻面</span>
        </div>
        <div className="fp-flip-face fp-flip-back" aria-hidden={!flipped}>
          <span className="fp-flip-label">{backLabel}</span>
          <div className="fp-flip-content">{back}</div>
          {explanation && <p className="fp-flip-explanation">{explanation}</p>}
        </div>
      </button>
      <span id={id} className="fp-sr-only">
        按下空格或回车翻面，当前显示{flipped ? backLabel : frontLabel}。
      </span>
    </div>
  );
}
