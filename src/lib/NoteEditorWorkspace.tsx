import { useCallback, useEffect, useRef, useState } from "react";
import {
  MarkdownEditor,
  type MarkdownEditorProps,
} from "./editor/MarkdownEditor";
import { VersionHistory, type NoteVersion } from "./editor/EditorPanels";
import { AnimatedSize } from "./AnimatedSize";
import { WorkspaceFeedback, WorkspaceSection } from "./WorkspaceForms";

export interface EditableNote {
  id: string;
  title: string;
  markdown: string;
  revision: string;
}
export interface NoteEditorWorkspaceProps {
  document: EditableNote;
  onSave: (note: EditableNote, signal: AbortSignal) => Promise<EditableNote>;
  autosaveDelay?: number;
  readOnly?: boolean;
  editorProps?: Omit<
    MarkdownEditorProps,
    "markdown" | "documentKey" | "onChange" | "editable"
  >;
  versions?: NoteVersion[];
  onRestore?: (
    id: string,
    expectedRevision: string,
    signal: AbortSignal,
  ) => Promise<EditableNote>;
  onExportDraft?: (note: EditableNote) => void;
  registerNavigationGuard?: (guard: () => Promise<boolean>) => () => void;
  onDirtyChange?: (dirty: boolean) => void;
}
/** A document boundary keeps asynchronous saves and pending text attached to their note. */
export function NoteEditorWorkspace(props: NoteEditorWorkspaceProps) {
  return <NoteSession key={props.document.id} {...props} />;
}
function NoteSession({
  document,
  onSave,
  autosaveDelay = 1600,
  readOnly,
  editorProps,
  versions = [],
  onRestore,
  onExportDraft,
  registerNavigationGuard,
  onDirtyChange,
}: NoteEditorWorkspaceProps) {
  const [draft, setDraft] = useState(document),
    [baseline, setBaseline] = useState(document.markdown),
    [state, setState] = useState<"clean" | "saving" | "saved" | "error">(
      "clean",
    ),
    [error, setError] = useState(""),
    [remote, setRemote] = useState<EditableNote | null>(null),
    [history, setHistory] = useState(false),
    [selected, setSelected] = useState(versions[0]?.id);
  const [restoring, setRestoring] = useState(false),
    restoreLock = useRef(false);
  const dirty = draft.markdown !== baseline,
    latest = useRef(draft),
    saveRef = useRef(onSave),
    controller = useRef<AbortController | null>(null),
    flight = useRef<Promise<boolean> | null>(null),
    alive = useRef(true),
    accepted = useRef(document.revision);
  latest.current = draft;
  saveRef.current = onSave;
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      controller.current?.abort();
    };
  }, []);
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => {
    if (document.revision === accepted.current) return;
    if (dirty || flight.current) setRemote(document);
    else {
      accepted.current = document.revision;
      setDraft(document);
      setBaseline(document.markdown);
    }
  }, [document, dirty]);
  const save = useCallback((): Promise<boolean> => {
    if (flight.current) return flight.current;
    if (readOnly || remote) return Promise.resolve(!dirty);
    const snapshot = latest.current,
      abort = new AbortController();
    controller.current = abort;
    setState("saving");
    setError("");
    const pending = (async () => {
      try {
        const saved = await saveRef.current(snapshot, abort.signal);
        if (abort.signal.aborted || !alive.current) return false;
        if (saved.id !== snapshot.id)
          throw new Error("保存的笔记不匹配，请重试。");
        accepted.current = saved.revision;
        setBaseline(saved.markdown);
        setDraft((current) =>
          current.markdown === snapshot.markdown
            ? saved
            : { ...current, revision: saved.revision },
        );
        setState("saved");
        return true;
      } catch (cause) {
        if (alive.current && !abort.signal.aborted) {
          setState("error");
          setError(
            cause instanceof Error
              ? cause.message
              : "保存未完成，当前内容已保留。",
          );
        }
        return false;
      } finally {
        flight.current = null;
      }
    })();
    flight.current = pending;
    return pending;
  }, [readOnly, remote, dirty]);
  useEffect(() => {
    if (
      !dirty ||
      readOnly ||
      remote ||
      state === "error" ||
      state === "saving" ||
      autosaveDelay <= 0
    )
      return;
    const timeout = setTimeout(() => void save(), autosaveDelay);
    return () => clearTimeout(timeout);
  }, [dirty, draft.markdown, readOnly, remote, state, autosaveDelay, save]);
  useEffect(
    () =>
      registerNavigationGuard?.(async () => {
        if (!dirty) return true;
        if (!(await save())) return false;
        return latest.current.markdown === draft.markdown;
      }),
    [registerNavigationGuard, dirty, save, draft.markdown],
  );
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  return (
    <section
      className="fp-workspace-form"
      onKeyDown={(event) => {
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === "s"
        ) {
          event.preventDefault();
          if (dirty) void save();
        }
      }}
    >
      <WorkspaceSection
        title={draft.title}
        actions={
          <>
            <span role="status">
              {readOnly
                ? "只读"
                : state === "saving"
                  ? "正在保存…"
                  : dirty
                    ? "有待保存的更改"
                    : "已保存"}
            </span>
            {versions.length > 0 && (
              <button
                type="button"
                className="fp-button fp-secondary"
                aria-expanded={history}
                onClick={() => setHistory(!history)}
              >
                版本历史
              </button>
            )}
            {onExportDraft && (
              <button
                type="button"
                className="fp-button fp-secondary"
                onClick={() => onExportDraft(draft)}
              >
                导出笔记
              </button>
            )}
            {!readOnly && (
              <button
                type="button"
                className="fp-button fp-primary"
                disabled={!dirty || state === "saving" || !!remote || restoring}
                onClick={() => void save()}
              >
                保存
              </button>
            )}
          </>
        }
      >
        <WorkspaceFeedback error={error} />
        <AnimatedSize>
          {remote && (
            <div className="fp-workspace-subsection" role="alert">
              <strong>这篇笔记有新的版本</strong>
              <p>
                当前编辑内容已保留，请先导出需要保留的内容，再选择继续使用的版本。
              </p>
              <div className="fp-workspace-actions">
                <button
                  type="button"
                  className="fp-button fp-secondary"
                  onClick={() => {
                    accepted.current = remote.revision;
                    setDraft(remote);
                    setBaseline(remote.markdown);
                    setRemote(null);
                    setError("");
                    setState("clean");
                  }}
                >
                  读取最新版本
                </button>
                <button
                  type="button"
                  className="fp-button fp-secondary"
                  onClick={() => {
                    accepted.current = remote.revision;
                    setDraft((current) => ({
                      ...current,
                      revision: remote.revision,
                    }));
                    setRemote(null);
                    setState("clean");
                  }}
                >
                  继续编辑当前内容
                </button>
              </div>
            </div>
          )}
        </AnimatedSize>
        <MarkdownEditor
          {...editorProps}
          documentKey={document.id}
          markdown={draft.markdown}
          editable={!readOnly && !restoring}
          onChange={(markdown) => {
            setDraft((current) => ({ ...current, markdown }));
            if (state !== "saving") setState("clean");
          }}
        />
        <AnimatedSize>
          {history && (
            <VersionHistory
              versions={versions}
              selectedId={selected}
              onSelect={setSelected}
              onRestore={async (id) => {
                if (!onRestore) throw new Error("暂时无法恢复此版本。");
                if (restoreLock.current) return;
                restoreLock.current = true;
                setRestoring(true);
                try {
                  const snapshot = latest.current;
                  if (dirty && !(await save()))
                    throw new Error("请先保存当前更改。");
                  if (latest.current.markdown !== snapshot.markdown)
                    throw new Error("请先保存当前更改。");
                  const abort = new AbortController();
                  controller.current = abort;
                  const restored = await onRestore(
                    id,
                    latest.current.revision,
                    abort.signal,
                  );
                  if (!alive.current || abort.signal.aborted) return;
                  if (restored.id !== document.id)
                    throw new Error("恢复的笔记不匹配，请重试。");
                  accepted.current = restored.revision;
                  setDraft(restored);
                  setBaseline(restored.markdown);
                  setState("saved");
                } finally {
                  restoreLock.current = false;
                  if (alive.current) setRestoring(false);
                }
              }}
            />
          )}
        </AnimatedSize>
      </WorkspaceSection>
    </section>
  );
}
