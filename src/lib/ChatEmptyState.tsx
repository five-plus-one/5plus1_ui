/** ChatEmptyState - 从课栈 chat/ChatEmptyState 提取
 *
 * AI 对话为空时展示：欢迎语、当前学习主题与快捷提问。
 */

import { type ReactNode } from "react";
import { Sparkles } from "lucide-react";

export interface ChatEmptyStateProps {
  /** 例如「数学」「物理」 */
  subjectName?: string;
  /** 当前学习内容 */
  topic?: string;
  /** 快捷提问 */
  prompts?: string[];
  onPrompt?: (prompt: string) => void;
  /** 自定义图标 */
  icon?: ReactNode;
  title?: string;
  description?: string;
}

export function ChatEmptyState({
  subjectName = "学习",
  topic,
  prompts = [],
  onPrompt,
  icon,
  title,
  description,
}: ChatEmptyStateProps) {
  return (
    <div className="fp-chat-empty">
      <span className="fp-chat-empty-icon" aria-hidden="true">
        {icon || <Sparkles size={22} />}
      </span>
      <strong>{title || `我是你的${subjectName}助教`}</strong>
      <p>
        {description ||
          "遇到不懂的概念随时问我，我可以解释公式、出题练习，或者帮你梳理知识点。"}
      </p>
      {topic && (
        <span className="fp-chat-empty-topic">当前学习 · {topic}</span>
      )}
      {prompts.length > 0 && (
        <div className="fp-chat-prompts">
          <span className="fp-chat-prompts-label">试试这样问我</span>
          {prompts.map((p) => (
            <button
              key={p}
              type="button"
              className="fp-chat-prompt"
              onClick={() => onPrompt?.(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
