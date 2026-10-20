import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUp, Square, Paperclip, X, Quote, FileText, LoaderCircle } from 'lucide-react';

export interface ComposerAttachment { id: string; name: string; status?: 'uploading' | 'ready' | 'error'; previewUrl?: string; error?: string }
export interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void | Promise<void>;
  onStop?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  placeholder?: string;
  quotedText?: string;
  onClearQuote?: () => void;
  attachments?: ComposerAttachment[];
  onRemoveAttachment?: (id: string) => void;
  onFiles?: (files: File[]) => void;
  accept?: string;
  /** Model, thinking, search, context usage and product actions. */
  tools?: ReactNode;
  notice?: ReactNode;
  onComposerInsetChange?: (height: number) => void;
  sendOnEnter?: boolean;
}
/** Controlled draft and upload state allow each workspace to retain its own input. */
export function ChatComposer({ value, onChange, onSend, onStop, isLoading, disabled, disabledReason, placeholder = '输入问题，或添加资料…', quotedText, onClearQuote, attachments = [], onRemoveAttachment, onFiles, accept, tools, notice, onComposerInsetChange, sendOnEnter = true }: ChatComposerProps) {
  const host = useRef<HTMLDivElement>(null), textarea = useRef<HTMLTextAreaElement>(null), fileInput = useRef<HTMLInputElement>(null);
  const composing = useRef(false), sending = useRef(false);
  const [pending, setPending] = useState(false), [error, setError] = useState('');
  const busy = isLoading || pending;
  const canSend = !disabled && !busy && !attachments.some(item => item.status === 'uploading' || item.status === 'error') && (!!value.trim() || attachments.length > 0);
  useLayoutEffect(() => { const el = textarea.current; if (el) { el.style.height = '0px'; el.style.height = `${Math.min(200, Math.max(48, el.scrollHeight))}px`; } }, [value]);
  useLayoutEffect(() => {
    if (!host.current || !onComposerInsetChange) return;
    const measure = () => onComposerInsetChange(host.current?.getBoundingClientRect().height || 0);
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(host.current);
    return () => { observer?.disconnect(); onComposerInsetChange(0); };
  }, [onComposerInsetChange]);
  async function send() {
    if (!canSend || sending.current) return;
    sending.current = true; setPending(true); setError('');
    try { await onSend(value.trim()); } catch (cause) { setError(cause instanceof Error ? cause.message : '发送失败，请重试'); }
    finally { sending.current = false; setPending(false); }
  }
  return <div ref={host} className="fp-chat-composer-wrap">
    {notice}
    <div className="fp-chat-composer" data-disabled={disabled || undefined} onDragOver={e => { if (onFiles && !disabled) e.preventDefault(); }} onDrop={e => { if (onFiles && !disabled && e.dataTransfer.files.length) { e.preventDefault(); onFiles(Array.from(e.dataTransfer.files)); } }}>
      {quotedText && <div className="fp-composer-quote"><Quote size={14} aria-hidden="true" /><span>{quotedText}</span>{onClearQuote && <button type="button" aria-label="移除引用" onClick={onClearQuote}><X size={14} /></button>}</div>}
      {attachments.length > 0 && <ul className="fp-composer-attachments" aria-label="已添加的附件">{attachments.map(item => <li key={item.id} data-status={item.status}>
        {item.previewUrl ? <img src={item.previewUrl} alt="" /> : item.status === 'uploading' ? <LoaderCircle size={16} className="fp-spin" /> : <FileText size={16} />}
        <span><span>{item.name}</span>{item.status === 'uploading' && <small>正在上传</small>}{item.status === 'error' && <small role="alert">{item.error || '上传失败，请重新添加'}</small>}</span>
        {onRemoveAttachment && <button type="button" aria-label={`移除${item.name}`} onClick={() => onRemoveAttachment(item.id)}><X size={14} /></button>}
      </li>)}</ul>}
      <textarea ref={textarea} value={value} disabled={disabled} aria-label="消息" placeholder={disabledReason || placeholder} rows={2}
        onChange={e => onChange(e.target.value)} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }}
        onPaste={e => { const files = Array.from(e.clipboardData.files); if (files.length && onFiles && !disabled) { e.preventDefault(); onFiles(files); } }}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !composing.current && !e.nativeEvent.isComposing && e.keyCode !== 229 && (sendOnEnter || e.ctrlKey || e.metaKey)) { e.preventDefault(); void send(); } }} />
      <div className="fp-composer-actions"><div className="fp-composer-tools">
        {onFiles && <><input ref={fileInput} type="file" multiple accept={accept} hidden onChange={e => { const files = Array.from(e.target.files || []); if (files.length) onFiles(files); e.target.value = ''; }} /><button type="button" className="fp-composer-icon" aria-label="添加附件" disabled={disabled} onClick={() => fileInput.current?.click()}><Paperclip size={17} /></button></>}
        {tools}
      </div>{isLoading && onStop ? <button type="button" className="fp-composer-send" aria-label="停止回复" onClick={onStop}><Square size={14} fill="currentColor" /></button> : <button type="button" className="fp-composer-send" aria-label="发送消息" disabled={!canSend} onClick={() => void send()}>{pending ? <LoaderCircle size={16} className="fp-spin" /> : <ArrowUp size={18} />}</button>}</div>
    </div>
    {(error || disabledReason) && <p className={error ? 'fp-error-text' : 'fp-composer-hint'} role={error ? 'alert' : undefined}>{error || disabledReason}</p>}
  </div>;
}
