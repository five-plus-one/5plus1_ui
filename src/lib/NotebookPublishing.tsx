import { useState } from "react";
import { MarkdownContent } from "./MarkdownContent";
import { AsyncAction } from "./ManagementViews";
import { AnimatedSize } from "./AnimatedSize";
import {
  WorkspaceSection,
  WorkspaceField,
  SettingsTabs,
  WorkspaceFeedback,
  WorkspaceSave,
  useWorkspaceAction,
  useWorkspaceDraft,
} from "./WorkspaceForms";
export interface PublishedNotebook {
  id: string;
  title: string;
  sourcePrefix: string;
  currentRelease: string;
  syncMode: "review" | "auto";
  checkedAt?: string;
}
export interface NotebookDraft {
  id: string;
  title: string;
  sections: number;
  resources: number;
  structureChanged: boolean;
  items: { id: string; title: string; kind: string; content: string }[];
}
export interface NotebookRelease {
  id: string;
  createdAt: string;
  label?: string;
}
export interface NotebookPublishingProps {
  notebook?: PublishedNotebook;
  drafts?: NotebookDraft[];
  versions?: NotebookRelease[];
  onPrepare: (input: {
    notebookId?: string;
    sourcePrefix: string;
    manifest?: unknown;
  }) => Promise<NotebookDraft>;
  onPublish: (
    draftId: string,
    expectedRelease?: string,
  ) => Promise<void> | void;
  onSetSource?: (input: {
    sourcePrefix: string;
    syncMode: "review" | "auto";
  }) => Promise<void> | void;
  onRestore?: (
    releaseId: string,
    expectedRelease: string,
  ) => Promise<void> | void;
  onLoadVersions?: () => Promise<void> | void;
  onRefresh?: () => Promise<void> | void;
  resolveResourceUrl?: (url: string) => string;
}
export function NotebookPublishing(props: NotebookPublishingProps) {
  return (
    <NotebookPublishingSession key={props.notebook?.id || "new"} {...props} />
  );
}
function NotebookPublishingSession({
  notebook,
  drafts = [],
  versions = [],
  onPrepare,
  onPublish,
  onSetSource,
  onRestore,
  onLoadVersions,
  onRefresh,
  resolveResourceUrl,
}: NotebookPublishingProps) {
  const [tab, setTab] = useState("update");
  const {
    draft: sourceSettings,
    setDraft: setSourceSettings,
    dirty: sourceDirty,
    accept: acceptSource,
  } = useWorkspaceDraft({
    sourcePrefix: notebook?.sourcePrefix || "",
    syncMode: notebook?.syncMode || "review",
  });
  const source = sourceSettings.sourcePrefix,
    mode = sourceSettings.syncMode,
    setSource = (sourcePrefix: string) =>
      setSourceSettings({ ...sourceSettings, sourcePrefix }),
    setMode = (syncMode: "review" | "auto") =>
      setSourceSettings({ ...sourceSettings, syncMode });
  const [manifest, setManifest] = useState<unknown>(),
    [filename, setFilename] = useState(""),
    [preview, setPreview] = useState<NotebookDraft | null>(null),
    [active, setActive] = useState("");
  const task = useWorkspaceAction(),
    item = preview?.items.find((i) => i.id === active) || preview?.items[0];
  const prepare = () =>
    void task.run(async () => {
      if (!source.trim()) throw new Error("请填写资料来源目录。");
      const result = await onPrepare({
        notebookId: notebook?.id,
        sourcePrefix: source.trim(),
        manifest,
      });
      setPreview(result);
      setActive(result.items[0]?.id || "");
    }, "内容已准备好，请检查后发布。");
  return (
    <section className="fp-workspace-form" aria-label="笔记本发布">
      <WorkspaceSection
        title={notebook?.title || "新建笔记本"}
        description="预览课程内容，为读者发布新的阅读版本。"
        actions={
          onRefresh && (
            <button
              type="button"
              className="fp-button fp-secondary"
              disabled={task.busy}
              onClick={() => void task.run(onRefresh)}
            >
              刷新
            </button>
          )
        }
      >
        <SettingsTabs
          label="笔记本管理"
          value={tab}
          onChange={(v) => {
            setTab(v);
            if (v === "history" && onLoadVersions)
              void task.run(onLoadVersions);
          }}
          items={[
            { id: "update", label: "预览与发布" },
            { id: "source", label: "来源与更新" },
            { id: "history", label: "发布历史" },
          ]}
        />
        <WorkspaceFeedback {...task} />
        <fieldset disabled={task.busy}>
          <AnimatedSize>
            {tab === "update" && (
              <>
                <WorkspaceSection title="准备课程资料">
                  <WorkspaceField
                    label="资料来源目录"
                    value={source}
                    onChange={(value) => {
                      setSource(value);
                      setPreview(null);
                    }}
                    hint="选择已经上传的课程资料目录。"
                  />
                  <label
                    className="fp-workspace-upload"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.currentTarget.querySelector("input")?.click();
                      }
                    }}
                  >
                    <strong>{filename || "选择目录清单"}</strong>
                    <span>JSON 文件，最大 2 MB</span>
                    <input
                      hidden
                      type="file"
                      aria-label="选择目录清单"
                      accept=".json,application/json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (!file) return;
                        setManifest(undefined);
                        setFilename("");
                        setPreview(null);
                        void task.run(async () => {
                          if (file.size > 2_000_000)
                            throw new Error("清单文件不能超过 2 MB。");
                          let parsed: unknown;
                          try {
                            parsed = JSON.parse(await file.text());
                          } catch {
                            throw new Error(
                              "无法读取清单，请选择有效的 JSON 文件。",
                            );
                          }
                          setManifest(parsed);
                          setFilename(file.name);
                          setPreview(null);
                        });
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="fp-button fp-secondary"
                    onClick={prepare}
                  >
                    {task.busy ? "正在检查…" : "检查并预览"}
                  </button>
                </WorkspaceSection>
                {drafts.length > 0 && (
                  <WorkspaceSection title="待发布内容">
                    <div className="fp-workspace-item-list">
                      {drafts.map((d) => (
                        <button
                          type="button"
                          key={d.id}
                          onClick={() => {
                            setPreview(d);
                            setActive(d.items[0]?.id || "");
                          }}
                        >
                          <strong>{d.title}</strong>
                          <small>
                            {d.sections} 个章节 · {d.resources} 份资料
                          </small>
                        </button>
                      ))}
                    </div>
                  </WorkspaceSection>
                )}
                {preview && (
                  <WorkspaceSection
                    title={preview.title}
                    description={`${preview.sections} 个章节 · ${preview.resources} 份资料${preview.structureChanged ? " · 目录有调整" : ""}`}
                  >
                    <div className="fp-workspace-split">
                      <nav
                        className="fp-workspace-item-list"
                        aria-label="草稿章节"
                      >
                        {preview.items.map((i) => (
                          <button
                            key={i.id}
                            type="button"
                            aria-pressed={i.id === item?.id}
                            onClick={() => setActive(i.id)}
                          >
                            {i.title}
                          </button>
                        ))}
                      </nav>
                      <article>
                        {item ? (
                          <MarkdownContent
                            markdown={item.content}
                            resolveResourceUrl={resolveResourceUrl}
                          />
                        ) : (
                          <p>此草稿还没有可预览的章节。</p>
                        )}
                      </article>
                    </div>
                    <AsyncAction
                      disabled={!preview.items.length}
                      confirm={`将“${preview.title}”发布给读者？`}
                      onAction={async () => {
                        await onPublish(preview.id, notebook?.currentRelease);
                        setPreview(null);
                        task.setMessage("发布完成，读者可以看到新内容。");
                      }}
                    >
                      确认发布
                    </AsyncAction>
                    <button
                      type="button"
                      className="fp-button fp-ghost"
                      onClick={() => setPreview(null)}
                    >
                      返回修改
                    </button>
                  </WorkspaceSection>
                )}
              </>
            )}
            {tab === "source" && (
              <WorkspaceSection title="资料来源与更新方式">
                <WorkspaceField
                  label="来源目录"
                  value={source}
                  onChange={(value) => {
                    setSource(value);
                    setPreview(null);
                  }}
                />
                <WorkspaceField
                  label="发布方式"
                  value={mode}
                  options={[
                    {
                      value: "review",
                      label: "确认后发布",
                      description: "先预览内容，再决定发布时间。",
                    },
                    {
                      value: "auto",
                      label: "自动发布",
                      description: "正文变化自动更新，目录调整仍需确认。",
                    },
                  ]}
                  onChange={(v) => setMode(v as "review" | "auto")}
                />
                {onSetSource && (
                  <WorkspaceSave
                    busy={task.busy}
                    dirty={sourceDirty}
                    onClick={() =>
                      void task.run(async () => {
                        if (!source.trim()) throw new Error("请填写来源目录。");
                        const next = {
                          sourcePrefix: source.trim(),
                          syncMode: mode,
                        };
                        await onSetSource(next);
                        acceptSource(next);
                      }, "来源与更新方式已保存。")
                    }
                  />
                )}
              </WorkspaceSection>
            )}
            {tab === "history" && (
              <WorkspaceSection title="发布历史">
                {versions.map((version) => (
                  <div key={version.id} className="fp-workspace-row">
                    <div>
                      <strong>
                        {version.label ||
                          new Date(version.createdAt).toLocaleString("zh-CN")}
                      </strong>
                      <p>
                        {version.id === notebook?.currentRelease
                          ? "当前阅读版本"
                          : "历史阅读版本"}
                      </p>
                    </div>
                    {onRestore &&
                      notebook &&
                      version.id !== notebook.currentRelease && (
                        <AsyncAction
                          confirm="恢复此版本？后续更新将等待你确认。"
                          onAction={async () => {
                            await onRestore(
                              version.id,
                              notebook.currentRelease,
                            );
                            task.setMessage("阅读版本已恢复。");
                          }}
                        >
                          恢复版本
                        </AsyncAction>
                      )}
                  </div>
                ))}
                {!versions.length && <p>暂无发布历史。</p>}
              </WorkspaceSection>
            )}
          </AnimatedSize>
        </fieldset>
      </WorkspaceSection>
    </section>
  );
}
