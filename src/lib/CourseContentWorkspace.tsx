import { useRef, useState, type ReactNode } from "react";
import { Maximize, Minimize, X } from "lucide-react";
import { MarkdownContent, type MarkdownContentProps } from "./MarkdownContent";
import {
  NoteEditorWorkspace,
  type NoteEditorWorkspaceProps,
} from "./NoteEditorWorkspace";
import { CanvasFullscreenPortal } from "./canvas/CanvasFullscreenPortal";
import { AnimatedSize } from "./AnimatedSize";
import {
  SettingsTabs,
  WorkspaceSection,
  WorkspaceFeedback,
  useWorkspaceAction,
} from "./WorkspaceForms";
export interface CourseExample {
  id: string;
  title: string;
  markdown: string;
}
export interface CourseContentWorkspaceProps
  extends Pick<
    NoteEditorWorkspaceProps,
    | "document"
    | "onSave"
    | "autosaveDelay"
    | "versions"
    | "onRestore"
    | "editorProps"
    | "onExportDraft"
  > {
  subject?: string;
  summary?: string;
  examples?: CourseExample[];
  quiz?: ReactNode;
  readOnly?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  actions?: ReactNode;
  contentProps?: Omit<MarkdownContentProps, "markdown">;
  renderedContent?: ReactNode;
}
export function CourseContentWorkspace(props: CourseContentWorkspaceProps) {
  return <CourseContentSession key={props.document.id} {...props} />;
}
function CourseContentSession({
  document,
  onSave,
  autosaveDelay,
  versions,
  onRestore,
  editorProps,
  onExportDraft,
  subject,
  summary,
  examples = [],
  quiz,
  readOnly,
  loading,
  error,
  onRetry,
  actions,
  contentProps,
  renderedContent,
}: CourseContentWorkspaceProps) {
  const [tab, setTab] = useState("content"),
    [editing, setEditing] = useState(false),
    [fullscreen, setFullscreen] = useState(false),
    [example, setExample] = useState(examples[0]?.id || ""),
    guard = useRef<(() => Promise<boolean>) | null>(null),
    task = useWorkspaceAction();
  const switchTab = (next: string) =>
    void task.run(async () => {
      if (editing && guard.current && !(await guard.current()))
        throw new Error("当前修改已保留，请保存后继续。");
      setEditing(false);
      setTab(next);
    });
  const selectedExample =
    examples.find((item) => item.id === example) || examples[0];
  return (
    <section className="fp-workspace-form">
      <CanvasFullscreenPortal
        open={fullscreen}
        onExit={() => setFullscreen(false)}
        label={document.title}
      >
        <div className="fp-course-content">
          <WorkspaceSection
            title={document.title}
            description={[subject, summary].filter(Boolean).join(" · ")}
            actions={
              <>
                {actions}
                <button
                  type="button"
                  className="fp-button fp-ghost"
                  aria-label={fullscreen ? "退出全屏" : "全屏阅读"}
                  onClick={() => setFullscreen(!fullscreen)}
                >
                  {fullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
                </button>
                {fullscreen && (
                  <button
                    type="button"
                    className="fp-button fp-ghost"
                    aria-label="关闭全屏阅读"
                    onClick={() => setFullscreen(false)}
                  >
                    <X size={17} />
                  </button>
                )}
              </>
            }
          >
            <SettingsTabs
              label="课程内容"
              value={tab}
              onChange={switchTab}
              items={[
                { id: "content", label: "正文" },
                ...(examples.length
                  ? [{ id: "examples", label: `例题 ${examples.length}` }]
                  : []),
                ...(quiz ? [{ id: "quiz", label: "练习" }] : []),
              ]}
            />
            <WorkspaceFeedback error={error || task.error} />
            <AnimatedSize>
              {loading ? (
                <p role="status">正在打开课程内容…</p>
              ) : error ? (
                <button
                  type="button"
                  className="fp-button fp-secondary"
                  onClick={onRetry}
                >
                  重新打开
                </button>
              ) : tab === "quiz" ? (
                quiz
              ) : tab === "examples" ? (
                <>
                  <nav className="fp-workspace-actions" aria-label="例题列表">
                    {examples.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className="fp-button fp-secondary"
                        aria-pressed={selectedExample?.id === item.id}
                        onClick={() => setExample(item.id)}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                  {selectedExample && (
                    <MarkdownContent
                      {...contentProps}
                      markdown={selectedExample.markdown}
                    />
                  )}
                </>
              ) : editing ? (
                <NoteEditorWorkspace
                  document={document}
                  onSave={onSave}
                  autosaveDelay={autosaveDelay}
                  versions={versions}
                  onRestore={onRestore}
                  editorProps={editorProps}
                  onExportDraft={onExportDraft}
                  registerNavigationGuard={(next) => {
                    guard.current = next;
                    return () => {
                      guard.current = null;
                    };
                  }}
                />
              ) : (
                (renderedContent ?? (
                  <MarkdownContent
                    {...contentProps}
                    markdown={document.markdown}
                  />
                ))
              )}
            </AnimatedSize>
            {tab === "content" && !readOnly && !loading && !error && (
              <button
                type="button"
                className="fp-button fp-secondary"
                disabled={task.busy}
                onClick={() =>
                  void task.run(async () => {
                    if (editing && guard.current && !(await guard.current()))
                      throw new Error("当前修改已保留，请保存后继续。");
                    setEditing(!editing);
                  })
                }
              >
                {editing ? "完成编辑" : "编辑笔记"}
              </button>
            )}
          </WorkspaceSection>
        </div>
      </CanvasFullscreenPortal>
    </section>
  );
}
