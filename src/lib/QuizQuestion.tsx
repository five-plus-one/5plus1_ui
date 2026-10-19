/** QuizQuestion - 从课栈 quiz/QuizQuestion 提取
 *
 * 答题卡：题号、题型与难度、题干、选项；作答与复盘两种模式。
 * 复盘模式显示正误与解析，选项用状态色区分。
 */

import { type ReactNode } from "react";
import { Check, X, Lightbulb } from "lucide-react";

export type QuizDifficulty = "basic" | "medium" | "hard";

export interface QuizOption {
  id: string;
  text: ReactNode;
  correct?: boolean;
}

export interface QuizQuestionProps {
  index: number;
  total: number;
  kind?: string;
  difficulty?: QuizDifficulty;
  prompt: ReactNode;
  options: QuizOption[];
  /** 已选选项 id；多选用数组 */
  selected?: string | string[] | null;
  onSelect?: (id: string) => void;
  /** answer：作答中；review：显示答案与解析 */
  mode?: "answer" | "review";
  /** 解析文本，复盘时显示 */
  explanation?: ReactNode;
  /** 用掉提示时显示提示内容 */
  hint?: ReactNode;
}

const DIFFICULTY: Record<QuizDifficulty, string> = {
  basic: "基础",
  medium: "中等",
  hard: "提高",
};
const LETTERS = "ABCDEFGHIJ";

export function QuizQuestion({
  index,
  total,
  kind = "单项选择",
  difficulty = "basic",
  prompt,
  options,
  selected,
  onSelect,
  mode = "answer",
  explanation,
  hint,
}: QuizQuestionProps) {
  const chosen = Array.isArray(selected) ? selected : selected ? [selected] : [];
  return (
    <article className="fp-quiz" data-mode={mode}>
      <header className="fp-quiz-meta">
        <strong>
          第 {index + 1} / {total} 题
        </strong>
        <span className="fp-quiz-chip">{kind}</span>
        <span className="fp-quiz-chip">{DIFFICULTY[difficulty]}</span>
      </header>
      <div className="fp-quiz-prompt">{prompt}</div>
      <ol className="fp-quiz-options">
        {options.map((option, i) => {
          const isChosen = chosen.includes(option.id);
          const showCorrect = mode === "review" && option.correct;
          const showWrong = mode === "review" && isChosen && !option.correct;
          return (
            <li key={option.id}>
              <button
                type="button"
                className="fp-quiz-option"
                data-selected={isChosen || undefined}
                data-correct={showCorrect || undefined}
                data-wrong={showWrong || undefined}
                aria-pressed={isChosen}
                disabled={mode === "review" || !onSelect}
                onClick={() => onSelect?.(option.id)}
              >
                <span className="fp-quiz-letter">{LETTERS[i]}</span>
                <span className="fp-quiz-text">{option.text}</span>
                {showCorrect && <Check size={16} aria-label="正确答案" />}
                {showWrong && <X size={16} aria-label="选择错误" />}
              </button>
            </li>
          );
        })}
      </ol>
      {mode === "review" && explanation && (
        <div className="fp-quiz-explanation">
          <Lightbulb size={15} aria-hidden="true" />
          <div>{explanation}</div>
        </div>
      )}
      {hint && (
        <div className="fp-quiz-hint">
          <Lightbulb size={15} aria-hidden="true" />
          <div>{hint}</div>
        </div>
      )}
    </article>
  );
}
