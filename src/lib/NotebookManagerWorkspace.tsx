import { useState } from "react";
import {
  NotebookPublishing,
  type PublishedNotebook,
  type NotebookDraft,
  type NotebookPublishingProps,
  type NotebookRelease,
} from "./NotebookPublishing";
import { AnimatedSize } from "./AnimatedSize";
import {
  SettingsTabs,
  WorkspaceField,
  WorkspaceSection,
  WorkspaceFeedback,
} from "./WorkspaceForms";

export interface ManagedNotebookDraft extends NotebookDraft {
  notebookId?: string;
}
export interface NotebookManagerWorkspaceProps {
  notebooks: PublishedNotebook[];
  drafts: ManagedNotebookDraft[];
  versions?: Record<string, NotebookRelease[]>;
  loading?: boolean;
  error?: string;
  onPrepare: NotebookPublishingProps["onPrepare"];
  onPublish: NotebookPublishingProps["onPublish"];
  onSetSource?: (
    notebookId: string,
    input: { sourcePrefix: string; syncMode: "review" | "auto" },
  ) => Promise<void> | void;
  onRestore?: (
    notebookId: string,
    releaseId: string,
    expectedRelease: string,
  ) => Promise<void> | void;
  onLoadVersions?: (notebookId: string) => Promise<void> | void;
  onRefresh?: () => Promise<void> | void;
  resolveResourceUrl?: NotebookPublishingProps["resolveResourceUrl"];
}
export function NotebookManagerWorkspace({
  notebooks,
  drafts,
  versions = {},
  loading,
  error,
  onPrepare,
  onPublish,
  onSetSource,
  onRestore,
  onLoadVersions,
  onRefresh,
  resolveResourceUrl,
}: NotebookManagerWorkspaceProps) {
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [selected, setSelected] = useState<string | null>(null);
  const book = notebooks.find((item) => item.id === selected),
    related = drafts.filter((draft) =>
      selected === "new" ? !draft.notebookId : draft.notebookId === selected,
    );
  const visible = notebooks.filter(
    (item) =>
      item.title.toLowerCase().includes(query.trim().toLowerCase()) &&
      (filter === "all" ||
        drafts.some((draft) => draft.notebookId === item.id)),
  );
  const pending = drafts.filter(
    (draft) =>
      !draft.notebookId ||
      !notebooks.some((book) => book.id === draft.notebookId),
  );
  return (
    <section className="fp-workspace-form">
      <WorkspaceSection
        title="笔记本"
        description="整理课程资料，检查更新并发布阅读版本。"
        actions={
          <button
            type="button"
            className="fp-button fp-primary"
            onClick={() => setSelected("new")}
          >
            新建笔记本
          </button>
        }
      >
        <WorkspaceField label="搜索笔记本" value={query} onChange={setQuery} />
        <SettingsTabs
          label="笔记本筛选"
          value={filter}
          onChange={setFilter}
          items={[
            { id: "all", label: "全部笔记本" },
            { id: "pending", label: "有待发布内容" },
          ]}
        />
        <WorkspaceFeedback error={error} />
        {loading ? (
          <p role="status">正在读取笔记本…</p>
        ) : (
          <div className="fp-workspace-item-list">
            {visible.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={selected === item.id}
                onClick={() => setSelected(item.id)}
              >
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {drafts.some((draft) => draft.notebookId === item.id)
                      ? "有内容等待发布"
                      : "课程内容已发布"}
                  </small>
                </span>
                <span>管理</span>
              </button>
            ))}
            {!visible.length && (
              <p>
                {query
                  ? "没有找到匹配的笔记本。"
                  : "选择新建笔记本，开始整理课程。"}
              </p>
            )}
            {pending
              .filter((draft) =>
                draft.title.toLowerCase().includes(query.toLowerCase()),
              )
              .map((draft) => (
                <button
                  type="button"
                  key={draft.id}
                  onClick={() => setSelected("new")}
                >
                  <span>
                    <strong>{draft.title}</strong>
                    <small>首次发布待确认</small>
                  </span>
                </button>
              ))}
          </div>
        )}
        <AnimatedSize>
          {selected && (
            <WorkspaceSection
              title={book?.title || "准备新的笔记本"}
              actions={
                <button
                  type="button"
                  className="fp-button fp-ghost"
                  onClick={() => setSelected(null)}
                >
                  返回笔记本列表
                </button>
              }
            >
              <NotebookPublishing
                key={selected}
                notebook={book}
                drafts={related}
                versions={versions[selected]}
                onPrepare={onPrepare}
                onPublish={onPublish}
                onSetSource={
                  book && onSetSource
                    ? (input) => onSetSource(book.id, input)
                    : undefined
                }
                onRestore={
                  book && onRestore
                    ? (id, expected) => onRestore(book.id, id, expected)
                    : undefined
                }
                onLoadVersions={
                  book && onLoadVersions
                    ? () => onLoadVersions(book.id)
                    : undefined
                }
                onRefresh={onRefresh}
                resolveResourceUrl={resolveResourceUrl}
              />
            </WorkspaceSection>
          )}
        </AnimatedSize>
      </WorkspaceSection>
    </section>
  );
}
