/** KeZhan 专用组件：简化版消息列表
 *
 * 暂时使用简单滚动实现，后续集成虚拟滚动
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

export interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  onFollowUpClick?: (question: string) => void;
  /** 底部内边距（避免被输入框遮挡） */
  bottomInset?: number;
  /** 消息渲染函数 */
  renderMessage?: (message: Message) => React.ReactNode;
}

export function MessageList({
  messages,
  isLoading = false,
  error = null,
  onClearError,
  bottomInset = 0,
  renderMessage,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stickActive, setStickActive] = useState(true);
  const isLoadingRef = useRef(isLoading);

  // 粘底逻辑：检测用户是否手动向上滚动
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkStick = () => {
      const threshold = 50;
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      setStickActive(isNearBottom);
    };

    el.addEventListener("scroll", checkStick, { passive: true });
    return () => el.removeEventListener("scroll", checkStick);
  }, []);

  // 新消息到达或加载状态变化时，如果粘底则滚动到底部
  useEffect(() => {
    if (stickActive || (isLoading && !isLoadingRef.current)) {
      const el = scrollRef.current;
      if (!el) return;
      if (typeof el.scrollTo === "function") {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } else {
        el.scrollTop = el.scrollHeight;
      }
    }
    isLoadingRef.current = isLoading;
  }, [messages.length, isLoading, stickActive]);

  return (
    <div className="fp-message-list-container">
      <div
        ref={scrollRef}
        className="fp-message-list"
        style={{ paddingBottom: `${bottomInset}px` }}
      >
        {messages.map((message) =>
          renderMessage ? (
            <div key={message.id}>{renderMessage(message)}</div>
          ) : (
            <MessageBubble key={message.id} message={message} />
          ),
        )}
      </div>
      {error && (
        <div className="fp-message-error" role="alert">
          <span>{error}</span>
          {onClearError && (
            <button type="button" onClick={onClearError}>
              清除
            </button>
          )}
        </div>
      )}
      {isLoading && (
        <div className="fp-message-loading" aria-live="polite" aria-busy="true">
          AI 正在思考中…
        </div>
      )}
    </div>
  );
}

export function MessageBubble({ message }: { message: Message }) {
  return (
    <div
      className={`fp-message-bubble fp-message-${message.role}`}
      data-role={message.role}
    >
      <div className="fp-message-content">{message.content}</div>
      {message.timestamp && (
        <time className="fp-message-time">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      )}
    </div>
  );
}
