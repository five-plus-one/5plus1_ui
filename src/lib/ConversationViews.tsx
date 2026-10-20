import { useState, type ReactNode } from "react";
import { ChevronRight, FileText } from "lucide-react";
import { CollapseTransition } from "./CollapseTransition";
import { AsyncAction } from "./ManagementViews";
export interface MessageSection {
  id: string;
  label: string;
  content: ReactNode;
  kind?: "thinking" | "action" | "source" | "content";
  status?: "running" | "done" | "error";
  defaultOpen?: boolean;
}
function MessageSectionView({ section }: { section: MessageSection }) {
  const [open, setOpen] = useState(
    section.defaultOpen ?? section.kind === "content",
  );
  return (
    <section className="fp-message-section" data-status={section.status}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronRight
          size={14}
          style={{ transform: open ? "rotate(90deg)" : undefined }}
        />
        <strong>{section.label}</strong>
        {section.status && (
          <small>
            {section.status === "running"
              ? "进行中"
              : section.status === "done"
                ? "已完成"
                : "需要处理"}
          </small>
        )}
      </button>
      <CollapseTransition isOpen={open}>
        <div>{section.content}</div>
      </CollapseTransition>
    </section>
  );
}
export function MessageContentView({
  sections,
  actions,
}: {
  sections: MessageSection[];
  actions?: ReactNode;
}) {
  return (
    <article className="fp-message-content-view">
      {sections.map((section) => (
        <MessageSectionView key={section.id} section={section} />
      ))}
      {actions && <footer>{actions}</footer>}
    </article>
  );
}
export function ArtifactCard({
  title,
  description,
  kind = "文档",
  onOpen,
}: {
  title: string;
  description?: string;
  kind?: string;
  onOpen: () => void;
}) {
  return (
    <button type="button" className="fp-artifact-card" onClick={onOpen}>
      <FileText size={24} />
      <span>
        <small>{kind}</small>
        <strong>{title}</strong>
        {description && <span>{description}</span>}
      </span>
      <span aria-hidden="true">↗</span>
    </button>
  );
}
export function ArtifactPreview({
  title,
  children,
  onDownload,
  onSave,
  loading,
  error,
}: {
  title: string;
  children: ReactNode;
  onDownload?: () => void;
  onSave?: () => Promise<void> | void;
  loading?: boolean;
  error?: string;
}) {
  return (
    <section className="fp-artifact">
      <header>
        <h3>{title}</h3>
        <div className="fp-pattern-actions">
          {onDownload && (
            <button type="button" onClick={onDownload}>
              下载
            </button>
          )}
          {onSave && (
            <AsyncAction disabled={loading} onAction={onSave}>
              保存到资料
            </AsyncAction>
          )}
        </div>
      </header>
      {loading ? (
        <p role="status">正在打开内容…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <div className="fp-artifact-content">{children}</div>
      )}
    </section>
  );
}
export interface SkillItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  disabled?: boolean;
}
export function SkillsPanel({
  items,
  onToggle,
}: {
  items: SkillItem[];
  onToggle: (id: string, enabled: boolean) => Promise<void> | void;
}) {
  return (
    <section className="fp-pattern-panel">
      <h3>学习助手能力</h3>
      {items.map((item) => (
        <div className="fp-skill-row" key={item.id}>
          <span>
            <strong>{item.name}</strong>
            <small>{item.description}</small>
          </span>
          <AsyncAction
            disabled={item.disabled}
            onAction={() => onToggle(item.id, !item.enabled)}
          >
            {item.enabled ? "停用" : "启用"}
          </AsyncAction>
        </div>
      ))}
    </section>
  );
}
