import { useRef, useState, type ReactNode } from "react";
import { Maximize, RotateCcw, Code, Eye } from "lucide-react";
import { AsyncAction } from "./ManagementViews";
import { CollapseTransition } from "./CollapseTransition";
export * from "./GraphView";
export interface CanvasWorkbenchProps {
  title: string;
  children: ReactNode;
  tools?: ReactNode;
  inspector?: ReactNode;
  source?: string;
  onSourceChange?: (source: string) => void;
  onRun?: () => Promise<void> | void;
  onReset?: () => void;
  onSave?: () => Promise<void> | void;
  loading?: boolean;
  error?: string;
}
/** Rendering engines stay with the host; the workspace owns the shared tools and panels. */
export function CanvasWorkbench({
  title,
  children,
  tools,
  inspector,
  source,
  onSourceChange,
  onRun,
  onReset,
  onSave,
  loading,
  error,
}: CanvasWorkbenchProps) {
  const root = useRef<HTMLElement>(null);
  const [showSource, setShowSource] = useState(false),
    [showInspector, setShowInspector] = useState(false),
    [notice, setNotice] = useState("");
  return (
    <section ref={root} className="fp-workbench" aria-label={title}>
      <header>
        <h3>{title}</h3>
        <div className="fp-pattern-actions">
          {tools}
          {source !== undefined && (
            <button
              type="button"
              aria-pressed={showSource}
              onClick={() => setShowSource((v) => !v)}
            >
              {showSource ? <Eye size={15} /> : <Code size={15} />}{" "}
              {showSource ? "查看内容" : "编辑源码"}
            </button>
          )}
          {inspector && (
            <button
              type="button"
              aria-expanded={showInspector}
              onClick={() => setShowInspector((v) => !v)}
            >
              参数
            </button>
          )}
          {onReset && (
            <button type="button" onClick={onReset}>
              <RotateCcw size={15} />
              重置
            </button>
          )}
          <button
            type="button"
            aria-label="全屏查看"
            onClick={() => {
              if (!root.current?.requestFullscreen) {
                setNotice("当前设备暂不支持全屏。");
                return;
              }
              void root.current
                .requestFullscreen()
                .catch(() => setNotice("暂时无法进入全屏，请重试。"));
            }}
          >
            <Maximize size={15} />
          </button>
        </div>
      </header>
      <CollapseTransition isOpen={showInspector}>
        <div className="fp-workbench-inspector">{inspector}</div>
      </CollapseTransition>
      <div className="fp-workbench-stage" aria-busy={loading}>
        {loading ? (
          <p role="status">正在准备内容…</p>
        ) : showSource ? (
          <label>
            源码
            <textarea
              aria-label="内容源码"
              value={source}
              readOnly={!onSourceChange}
              spellCheck={false}
              onChange={(e) => onSourceChange?.(e.target.value)}
            />
          </label>
        ) : (
          children
        )}
      </div>
      {(error || notice) && (
        <p role={error ? "alert" : "status"}>{error || notice}</p>
      )}
      <div className="fp-pattern-actions">
        {showSource && onRun && (
          <AsyncAction disabled={loading} onAction={onRun}>
            运行
          </AsyncAction>
        )}
        {onSave && (
          <AsyncAction disabled={loading} onAction={onSave}>
            保存到笔记
          </AsyncAction>
        )}
      </div>
    </section>
  );
}
export interface LectureChapter {
  id: string;
  title: string;
  time: number;
  detail?: string;
}
export function ClassroomTimeline({
  chapters,
  currentTime,
  onSeek,
  onAddNote,
}: {
  chapters: LectureChapter[];
  currentTime: number;
  onSeek: (time: number) => void;
  onAddNote?: (time: number) => void;
}) {
  const ordered = [...chapters].sort((a, b) => a.time - b.time);
  const active = ordered.filter((c) => c.time <= currentTime).at(-1)?.id;
  return (
    <section className="fp-classroom">
      <header>
        <h3>课堂章节</h3>
        {onAddNote && (
          <button type="button" onClick={() => onAddNote(currentTime)}>
            记录此刻
          </button>
        )}
      </header>
      {ordered.length ? (
        <ol>
          {ordered.map((chapter) => (
            <li key={chapter.id}>
              <button
                type="button"
                aria-current={active === chapter.id ? "step" : undefined}
                onClick={() => onSeek(chapter.time)}
              >
                <time>
                  {Math.floor(chapter.time / 60)}:
                  {String(Math.floor(chapter.time % 60)).padStart(2, "0")}
                </time>
                <span>
                  <strong>{chapter.title}</strong>
                  {chapter.detail && <small>{chapter.detail}</small>}
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p>还没有课堂章节，可以在观看时添加笔记。</p>
      )}
    </section>
  );
}
export function LectureDock({
  title,
  children,
  collapsed,
  onCollapsedChange,
  onClose,
}: {
  title: string;
  children: ReactNode;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onClose?: () => void;
}) {
  return (
    <aside className="fp-lecture-dock">
      <header>
        <strong>{title}</strong>
        <button
          type="button"
          aria-expanded={!collapsed}
          onClick={() => onCollapsedChange(!collapsed)}
        >
          {collapsed ? "展开播放器" : "收起播放器"}
        </button>
        {onClose && (
          <button type="button" aria-label="关闭播放器" onClick={onClose}>
            ×
          </button>
        )}
      </header>
      <CollapseTransition isOpen={!collapsed}>{children}</CollapseTransition>
    </aside>
  );
}
export interface ScoreItem {
  id: string;
  title: string;
  maximum: number;
  awarded: number;
  subjective?: boolean;
  detail?: ReactNode;
}
export function QuizScoring({
  items,
  onScoreChange,
  onComplete,
}: {
  items: ScoreItem[];
  onScoreChange: (id: string, value: number) => void;
  onComplete?: () => Promise<void> | void;
}) {
  return (
    <section className="fp-pattern-panel">
      <h3>答题复盘</h3>
      <p>
        已得 {items.reduce((sum, i) => sum + i.awarded, 0)} /{" "}
        {items.reduce((sum, i) => sum + i.maximum, 0)} 分
      </p>
      {items.map((item) => (
        <div key={item.id} className="fp-scoring-item">
          <strong>{item.title}</strong>
          <span>
            {item.awarded} / {item.maximum}
          </span>
          {item.detail}
          {item.subjective && (
            <label>
              自评得分
              <input
                aria-label={`${item.title}自评得分`}
                type="range"
                min={0}
                max={item.maximum}
                step={item.maximum <= 10 ? 0.5 : 1}
                value={Math.max(0, Math.min(item.maximum, item.awarded))}
                onChange={(e) => onScoreChange(item.id, Number(e.target.value))}
              />
            </label>
          )}
        </div>
      ))}
      {onComplete && (
        <div className="fp-pattern-actions">
          <AsyncAction onAction={onComplete}>完成复盘</AsyncAction>
        </div>
      )}
    </section>
  );
}
export function QuizSummary({
  correct,
  total,
  score,
  maximum,
  onReview,
  onRetry,
}: {
  correct: number;
  total: number;
  score: number;
  maximum: number;
  onReview: () => void;
  onRetry?: () => void;
}) {
  return (
    <section className="fp-pattern-panel">
      <h3>本次练习</h3>
      <strong className="fp-summary-value">
        {score}
        <small> / {maximum} 分</small>
      </strong>
      <p>
        {total} 道题中答对 {correct} 道
      </p>
      <div className="fp-pattern-actions">
        <button type="button" onClick={onReview}>
          查看解析
        </button>
        {onRetry && (
          <button type="button" onClick={onRetry}>
            再练一次
          </button>
        )}
      </div>
    </section>
  );
}
