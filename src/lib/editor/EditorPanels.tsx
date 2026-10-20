import { useRef, useState, type ReactNode } from "react";
import { Clock, RotateCcw, Link2 } from "lucide-react";
import { AnimatedSize } from "../AnimatedSize";
export interface NoteVersion {
  id: string;
  label: string;
  date: string;
  author?: string;
  preview?: ReactNode;
}
export interface VersionHistoryProps {
  versions: NoteVersion[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onRestore: (id: string) => Promise<void> | void;
  loading?: boolean;
  error?: string;
}
export function VersionHistory({
  versions,
  selectedId,
  onSelect,
  onRestore,
  loading,
  error,
}: VersionHistoryProps) {
  const [confirm, setConfirm] = useState<string | null>(null),
    [busy, setBusy] = useState(false),
    [failure, setFailure] = useState("");
  const guard = useRef(false),
    selected = versions.find((v) => v.id === selectedId);
  return (
    <section className="fp-version-history" aria-label="笔记历史">
      <div className="fp-version-list" aria-busy={loading}>
        {loading ? (
          <p role="status">正在读取历史…</p>
        ) : !versions.length ? (
          <p>还没有保存的历史版本。</p>
        ) : (
          versions.map((version) => (
            <button
              type="button"
              key={version.id}
              aria-pressed={version.id === selectedId}
              onClick={() => {
                setConfirm(null);
                setFailure("");
                onSelect(version.id);
              }}
            >
              <Clock size={15} />
              <span>
                <strong>{version.label}</strong>
                <small>
                  {version.date}
                  {version.author && ` · ${version.author}`}
                </small>
              </span>
            </button>
          ))
        )}
      </div>
      <AnimatedSize>
        <div className="fp-version-preview">
          {selected ? (
            <>
              <h3>{selected.label}</h3>
              {selected.preview}
              <div className="fp-pattern-actions">
                {confirm === selected.id ? (
                  <>
                    <span>将当前笔记恢复到此版本？</span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={async () => {
                        if (guard.current) return;
                        guard.current = true;
                        setBusy(true);
                        setFailure("");
                        try {
                          await onRestore(selected.id);
                          setConfirm(null);
                        } catch {
                          setFailure("恢复未能完成，当前内容已保留。");
                        } finally {
                          guard.current = false;
                          setBusy(false);
                        }
                      }}
                    >
                      {busy ? "正在恢复…" : "确认恢复"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirm(null)}
                    >
                      取消
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setConfirm(selected.id)}>
                    <RotateCcw size={15} />
                    恢复此版本
                  </button>
                )}
              </div>
            </>
          ) : (
            <p>选择一个版本查看内容。</p>
          )}
          {(error || failure) && <p role="alert">{error || failure}</p>}
        </div>
      </AnimatedSize>
    </section>
  );
}
export function SaveConflict({
  local,
  remote,
  onResolve,
}: {
  local: ReactNode;
  remote: ReactNode;
  onResolve: (choice: "local" | "remote") => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const guard = useRef(false);
  return (
    <section className="fp-save-conflict" aria-label="处理笔记冲突">
      <h3>笔记有新的修改</h3>
      <p>比较两个版本，选择要继续使用的内容。</p>
      <div className="fp-compare-panes">
        <article>
          <h4>我的修改</h4>
          {local}
        </article>
        <article>
          <h4>最新版本</h4>
          {remote}
        </article>
      </div>
      <div className="fp-pattern-actions">
        {(["local", "remote"] as const).map((choice) => (
          <button
            type="button"
            key={choice}
            disabled={busy}
            onClick={async () => {
              if (guard.current) return;
              guard.current = true;
              setBusy(true);
              setError("");
              try {
                await onResolve(choice);
              } catch {
                setError("暂时无法应用，请重试。");
              } finally {
                guard.current = false;
                setBusy(false);
              }
            }}
          >
            {choice === "local" ? "使用我的修改" : "使用最新版本"}
          </button>
        ))}
      </div>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
export interface Backlink {
  id: string;
  title: string;
  excerpt?: string;
}
export function BacklinksPanel({
  items,
  onOpen,
  loading = false,
}: {
  items: Backlink[];
  onOpen: (id: string) => void;
  loading?: boolean;
}) {
  return (
    <section className="fp-backlinks" aria-label="关联笔记">
      <h3>引用这篇笔记</h3>
      {loading ? (
        <p role="status">正在查找关联…</p>
      ) : items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => onOpen(item.id)}>
                <Link2 size={15} />
                <span>
                  <strong>{item.title}</strong>
                  {item.excerpt && <small>{item.excerpt}</small>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>还没有其他笔记引用这里。</p>
      )}
    </section>
  );
}
export function ImagePasteOptions({
  previewUrl,
  onChoose,
  onCancel,
  busy = false,
  error,
}: {
  previewUrl: string;
  onChoose: (mode: "image" | "recognize") => void;
  onCancel: () => void;
  busy?: boolean;
  error?: string;
}) {
  return (
    <section className="fp-image-paste" aria-label="添加图片">
      <img src={previewUrl} alt="待添加的图片" />
      <div>
        <h3>如何添加这张图片？</h3>
        <p>保留图片，或识别其中的文字与公式。</p>
        <div className="fp-pattern-actions">
          <button
            type="button"
            disabled={busy}
            onClick={() => onChoose("image")}
          >
            插入图片
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onChoose("recognize")}
          >
            识别内容
          </button>
          <button type="button" disabled={busy} onClick={onCancel}>
            取消
          </button>
        </div>
        {busy && <p role="status">正在处理图片…</p>}
        {error && <p role="alert">{error}</p>}
      </div>
    </section>
  );
}
export interface DiffLine {
  kind: "same" | "added" | "removed";
  text: string;
}
export function VersionDiff({ lines }: { lines: DiffLine[] }) {
  return (
    <div className="fp-version-diff" aria-label="版本变化">
      {lines.map((line, index) => (
        <div key={index} data-kind={line.kind}>
          <span
            aria-label={
              line.kind === "added"
                ? "新增"
                : line.kind === "removed"
                  ? "删除"
                  : "保留"
            }
          >
            {line.kind === "added" ? "+" : line.kind === "removed" ? "−" : " "}
          </span>
          <code>{line.text || " "}</code>
        </div>
      ))}
    </div>
  );
}
