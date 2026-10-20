import { useRef, useState, type ReactNode } from "react";
import { AsyncAction } from "./ManagementViews";
import { ContextMenu } from "./ContextMenu";
import { Checkbox } from "./index";
import { AnimatedSize } from "./AnimatedSize";
import { CollapseTransition } from "./CollapseTransition";
import { SelectField } from "./SelectField";
export interface RecycledItem {
  id: string;
  name: string;
  originalPath: string;
  deletedAt: string;
  size?: string;
}
export function RecycleBin({
  items,
  selectedIds,
  onSelectionChange,
  onRestore,
  onDelete,
  loading,
  error,
}: {
  items: RecycledItem[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onRestore: (ids: string[]) => Promise<void> | void;
  onDelete: (ids: string[]) => Promise<void> | void;
  loading?: boolean;
  error?: string;
}) {
  const [busy, setBusy] = useState(false),
    [localError, setLocalError] = useState("");
  const guard = useRef(false);
  const act = async (ids: string[], remove = false) => {
    if (guard.current) return;
    guard.current = true;
    setBusy(true);
    setLocalError("");
    try {
      await (remove ? onDelete(ids) : onRestore(ids));
    } finally {
      guard.current = false;
      setBusy(false);
    }
  };
  return (
    <section className="fp-pattern-panel">
      <header>
        <div>
          <h3>回收站</h3>
          <small>还需要的资料可以恢复到原位置。</small>
        </div>
        <div className="fp-pattern-actions">
          <AsyncAction
            disabled={busy || !selectedIds.length}
            onAction={() => act(selectedIds)}
          >
            恢复所选
          </AsyncAction>
          <AsyncAction
            disabled={busy || !selectedIds.length}
            confirm="永久删除所选资料后将无法恢复，确认继续？"
            onAction={() => act(selectedIds, true)}
          >
            永久删除
          </AsyncAction>
        </div>
      </header>
      {(error || localError) && <p role="alert">{error || localError}</p>}
      {loading ? (
        <p role="status">正在读取回收站…</p>
      ) : items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <ContextMenu
                disabled={busy}
                items={[
                  {
                    id: "restore",
                    label: "恢复",
                    onSelect: () => {
                      void act([item.id]).catch((cause) =>
                        setLocalError(
                          cause instanceof Error
                            ? cause.message
                            : "暂时无法恢复，请重试。",
                        ),
                      );
                    },
                  },
                  {
                    id: "select",
                    label: "选择",
                    onSelect: () => onSelectionChange([item.id]),
                  },
                ]}
              >
                <div className="fp-recycle-row">
                  <Checkbox
                    label=""
                    aria-label={`选择${item.name}`}
                    checked={selectedIds.includes(item.id)}
                    disabled={busy}
                    onChange={() =>
                      onSelectionChange(
                        selectedIds.includes(item.id)
                          ? selectedIds.filter((id) => id !== item.id)
                          : [...selectedIds, item.id],
                      )
                    }
                  />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.originalPath}</small>
                  </span>
                  <time>{item.deletedAt}</time>
                  {item.size && <small>{item.size}</small>}
                </div>
              </ContextMenu>
            </li>
          ))}
        </ul>
      ) : (
        <p>回收站是空的。</p>
      )}
    </section>
  );
}
export interface ReviewRecord {
  id: string;
  title: string;
  subject?: string;
  due: string;
  status: "new" | "learning" | "review";
  detail?: string;
}
export function ReviewDashboard({
  items,
  onReview,
  onPreview,
  loading,
  error,
}: {
  items: ReviewRecord[];
  onReview: (ids: string[]) => void;
  onPreview: (id: string) => void;
  loading?: boolean;
  error?: string;
}) {
  const [filter, setFilter] = useState("all");
  const records = items.filter(
    (item) => filter === "all" || item.status === filter,
  );
  return (
    <section className="fp-pattern-panel">
      <header>
        <div>
          <h3>今日复习</h3>
          <small>{items.length} 条学习记录</small>
        </div>
        <button
          type="button"
          disabled={!records.length || loading}
          onClick={() => onReview(records.map((item) => item.id))}
        >
          开始复习
        </button>
      </header>
      <SelectField
        label="复习范围"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "全部记录" },
          { value: "new", label: "初次学习" },
          { value: "learning", label: "正在巩固" },
          { value: "review", label: "定期复习" },
        ]}
      />
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p role="status">正在整理复习记录…</p>
      ) : (
        <ul>
          {records.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="fp-review-record"
                onClick={() => onPreview(item.id)}
              >
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.subject}
                    {item.detail && ` · ${item.detail}`}
                  </small>
                </span>
                <time>{item.due}</time>
              </button>
            </li>
          ))}
        </ul>
      )}
      {!loading && !records.length && <p>当前范围没有待复习的记录。</p>}
    </section>
  );
}
export interface QuizNavigationItem {
  id: string;
  label: string;
  answered: boolean;
  flagged?: boolean;
}
export function QuizWorkspace({
  title,
  items,
  activeId,
  onNavigate,
  children,
  onSubmit,
  remainingLabel,
}: {
  title: string;
  items: QuizNavigationItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  children: ReactNode;
  onSubmit: () => Promise<void> | void;
  remainingLabel?: string;
}) {
  const answered = items.filter((item) => item.answered).length;
  return (
    <section className="fp-quiz-workspace">
      <header>
        <h3>{title}</h3>
        <span>
          {remainingLabel || `已完成 ${answered} / ${items.length} 题`}
        </span>
      </header>
      <nav aria-label="题目导航">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-current={item.id === activeId ? "step" : undefined}
            data-answered={item.answered || undefined}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
            {item.flagged && <span aria-label="已标记"> ·</span>}
          </button>
        ))}
      </nav>
      <AnimatedSize>{children}</AnimatedSize>
      <div className="fp-pattern-actions">
        <AsyncAction
          confirm={
            answered < items.length
              ? `还有 ${items.length - answered} 题未完成，仍要提交？`
              : "确认提交本次答题？"
          }
          onAction={onSubmit}
        >
          提交答题
        </AsyncAction>
      </div>
    </section>
  );
}
export function SelectionActions({
  items,
}: {
  items: {
    id: string;
    label: string;
    onSelect: () => void;
    disabled?: boolean;
  }[];
}) {
  return (
    <div
      className="fp-selection-actions"
      role="toolbar"
      aria-label="所选内容操作"
    >
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          disabled={item.disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={item.onSelect}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
export function TaskProgress({
  title,
  detail,
  value,
  onCancel,
  children,
}: {
  title: string;
  detail?: string;
  value?: number;
  onCancel?: () => void;
  children?: ReactNode;
}) {
  return (
    <section className="fp-pattern-panel" aria-live="polite">
      <header>
        <strong>{title}</strong>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            取消
          </button>
        )}
      </header>
      {detail && <p>{detail}</p>}
      <progress
        aria-label={title}
        max={100}
        value={
          value === undefined ? undefined : Math.min(100, Math.max(0, value))
        }
      />
      {children}
    </section>
  );
}
export function WorkspaceEmpty({
  title = "打开一份资料，开始学习",
  description = "可以从左侧选择笔记，也可以添加新的资料。",
  actions,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="fp-workspace-empty">
      <h3>{title}</h3>
      <p>{description}</p>
      {actions && <div className="fp-pattern-actions">{actions}</div>}
    </section>
  );
}
export function RunWorkspace({
  title,
  status,
  actions,
  trace,
  children,
  attachments,
}: {
  title: string;
  status?: string;
  actions?: ReactNode;
  trace?: ReactNode;
  children: ReactNode;
  attachments?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="fp-run-workspace">
      <header>
        <div>
          <h3>{title}</h3>
          {status && <p role="status">{status}</p>}
        </div>
        {actions}
      </header>
      {children}
      {attachments && <aside aria-label="相关资料">{attachments}</aside>}
      {trace && (
        <>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            工作记录
          </button>
          <CollapseTransition isOpen={open}>{trace}</CollapseTransition>
        </>
      )}
    </section>
  );
}
export interface RecordingFrame {
  time: number;
  label: string;
}
export function RecordingPlayback({
  title,
  frames,
  time,
  duration,
  playing,
  onTimeChange,
  onPlayingChange,
  children,
}: {
  title: string;
  frames: RecordingFrame[];
  time: number;
  duration: number;
  playing: boolean;
  onTimeChange: (time: number) => void;
  onPlayingChange: (playing: boolean) => void;
  children: ReactNode;
}) {
  return (
    <section className="fp-recording-playback">
      <header>
        <h3>{title}</h3>
        <button type="button" onClick={() => onPlayingChange(!playing)}>
          {playing ? "暂停回放" : "播放回放"}
        </button>
      </header>
      <div>{children}</div>
      <label>
        回放进度
        <input
          type="range"
          min={0}
          max={Math.max(0, duration)}
          step="0.1"
          value={Math.min(duration, Math.max(0, time))}
          onChange={(e) => onTimeChange(Number(e.target.value))}
        />
      </label>
      <nav aria-label="回放关键帧">
        {frames.map((frame, index) => (
          <button
            type="button"
            key={index}
            aria-current={
              frames.filter((f) => f.time <= time).at(-1) === frame
                ? "step"
                : undefined
            }
            onClick={() => onTimeChange(frame.time)}
          >
            {frame.label}
          </button>
        ))}
      </nav>
    </section>
  );
}
