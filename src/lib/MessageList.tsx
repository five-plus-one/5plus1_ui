import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowDown } from 'lucide-react';

export interface Message { id: string; role: 'user' | 'assistant' | 'system'; content: string; timestamp?: Date }
export interface MessageListProps<T extends { id: string } = Message> {
  messages: T[];
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  onFollowUpClick?: (question: string) => void;
  followUpQuestions?: string[];
  bottomInset?: number;
  renderMessage?: (message: T) => ReactNode;
  emptyState?: ReactNode;
  hydrated?: boolean;
  /** Switch sessions with a stable component; offsets are restored per session. */
  sessionId?: string;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  hasOlder?: boolean;
  loadingOlder?: boolean;
  onLoadOlder?: () => void;
  virtualize?: boolean;
  estimateSize?: number;
}

export function MessageList<T extends { id: string } = Message>({ messages, isLoading = false, error, onClearError, onFollowUpClick, followUpQuestions = [], bottomInset = 0, renderMessage, emptyState, hydrated = true, sessionId = 'default', scrollContainerRef, hasOlder, loadingOlder, onLoadOlder, virtualize = messages.length > 30, estimateSize = 100 }: MessageListProps<T>) {
  const internalRef = useRef<HTMLDivElement>(null);
  const scrollRef = scrollContainerRef || internalRef;
  const contentRef = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  const [showLatest, setShowLatest] = useState(false);
  const positions = useRef(new Map<string, { top: number; pinned: boolean }>());
  const session = useRef(sessionId);
  const hydratedSession = useRef<string | null>(null);
  const previous = useRef({ first: messages[0]?.id, height: 0, top: 0 });
  const virtualizer = useVirtualizer({ count: messages.length, getScrollElement: () => scrollRef.current, estimateSize: () => estimateSize, getItemKey: index => messages[index].id, overscan: 5, enabled: virtualize });
  const toBottom = () => {
    const el = scrollRef.current;
    if (el) { el.scrollTop = el.scrollHeight; pinned.current = true; setShowLatest(false); }
  };
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (session.current !== sessionId) {
      const old = previous.current;
      positions.current.set(session.current, { top: old.top, pinned: pinned.current });
      session.current = sessionId;
      hydratedSession.current = null;
      previous.current = { first: messages[0]?.id, height: 0, top: 0 };
    }
    if (!hydrated) return;
    if (hydratedSession.current !== sessionId) {
      const saved = positions.current.get(sessionId);
      pinned.current = saved?.pinned ?? true;
      el.scrollTop = pinned.current ? el.scrollHeight : saved?.top || 0;
      hydratedSession.current = sessionId;
    } else if (previous.current.first && messages[0]?.id !== previous.current.first && !pinned.current) {
      el.scrollTop = previous.current.top + el.scrollHeight - previous.current.height;
    } else if (pinned.current) el.scrollTop = el.scrollHeight;
    previous.current = { first: messages[0]?.id, height: el.scrollHeight, top: el.scrollTop };
    setShowLatest(!pinned.current);
  }, [messages, sessionId, hydrated, bottomInset, isLoading]);
  useLayoutEffect(() => {
    const el = scrollRef.current, content = contentRef.current;
    if (!el || !content || typeof ResizeObserver === 'undefined') return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (pinned.current) el.scrollTop = el.scrollHeight;
        previous.current.height = el.scrollHeight;
        previous.current.top = el.scrollTop;
      });
    });
    observer.observe(content);
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [scrollRef]);
  const render = (message: T) => renderMessage ? renderMessage(message) : <MessageBubble message={message as unknown as Message} />;
  return <div className="fp-message-list-container">
    <div ref={scrollRef} className="fp-message-list" role="region" aria-label="对话记录" tabIndex={0}
      onScroll={() => { const el = scrollRef.current!; pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48; setShowLatest(!pinned.current); previous.current.top = el.scrollTop; previous.current.height = el.scrollHeight; positions.current.set(sessionId, { top: el.scrollTop, pinned: pinned.current }); }}>
      <div ref={contentRef} className="fp-message-list-content" style={{ paddingBottom: Math.max(0, Number.isFinite(bottomInset) ? bottomInset : 0), overflowAnchor: 'none' }}>
        {hasOlder && <button type="button" className="fp-history-load" disabled={loadingOlder} onClick={onLoadOlder}>{loadingOlder ? '正在加载…' : '加载更早的消息'}</button>}
        {!hydrated ? <p role="status">正在打开对话…</p> : messages.length === 0 ? emptyState : virtualize ? <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map(row => <div key={row.key} data-index={row.index} ref={virtualizer.measureElement} style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${row.start}px)` }}><div className="fp-message-row">{render(messages[row.index])}</div></div>)}
        </div> : messages.map(message => <div className="fp-message-row" key={message.id}>{render(message)}</div>)}
        {isLoading && <div className="fp-message-loading" role="status">正在回复…</div>}
        {followUpQuestions.length > 0 && <div className="fp-follow-ups" aria-label="继续提问">{followUpQuestions.map(question => <button type="button" key={question} onClick={() => onFollowUpClick?.(question)}>{question}</button>)}</div>}
      </div>
    </div>
    {showLatest && <button type="button" className="fp-message-latest" onClick={toBottom}><ArrowDown size={14} aria-hidden="true" />回到最新</button>}
    {error && <div className="fp-message-error" role="alert"><span>{error}</span>{onClearError && <button type="button" onClick={onClearError}>关闭</button>}</div>}
  </div>;
}
export function MessageBubble({ message }: { message: Message }) {
  return <div className={`fp-message-bubble fp-message-${message.role}`} data-role={message.role}>
    <div className="fp-message-content">{message.content}</div>
    {message.timestamp && <time className="fp-message-time" dateTime={message.timestamp.toISOString()}>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>}
  </div>;
}
