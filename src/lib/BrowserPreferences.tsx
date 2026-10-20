import { useState } from "react";
import { AsyncAction } from "./ManagementViews";
import {
  WorkspaceSection,
  WorkspaceField,
  WorkspaceSave,
  WorkspaceFeedback,
  useWorkspaceAction,
  useWorkspaceDraft,
} from "./WorkspaceForms";
export interface BrowserBookmark {
  id: string;
  name: string;
  url: string;
}
export function normalizeBrowserUrl(value: string) {
  try {
    const url = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(value.trim())
        ? value.trim()
        : `https://${value.trim()}`,
    );
    return ["http:", "https:"].includes(url.protocol) && url.hostname
      ? url.href
      : "";
  } catch {
    return "";
  }
}
export function BrowserPreferences({
  bookmarks,
  homeUrl,
  onAdd,
  onRemove,
  onOpen,
  onHomeChange,
}: {
  bookmarks: BrowserBookmark[];
  homeUrl: string;
  onAdd: (bookmark: Omit<BrowserBookmark, "id">) => Promise<void> | void;
  onRemove: (id: string) => Promise<void> | void;
  onOpen: (id: string) => void;
  onHomeChange: (url: string) => Promise<void> | void;
}) {
  const [name, setName] = useState(""),
    [url, setUrl] = useState(""),
    task = useWorkspaceAction();
  const {
    draft: home,
    setDraft: setHome,
    dirty: homeDirty,
    accept: acceptHome,
  } = useWorkspaceDraft(homeUrl);
  return (
    <section className="fp-workspace-form">
      <WorkspaceSection title="浏览与收藏">
        <WorkspaceFeedback {...task} />
        <WorkspaceSection title="添加收藏">
          <WorkspaceField
            label="收藏名称"
            value={name}
            onChange={setName}
            disabled={task.busy}
          />
          <WorkspaceField
            label="网页地址"
            value={url}
            onChange={setUrl}
            disabled={task.busy}
          />
          <button
            type="button"
            className="fp-button fp-primary"
            disabled={task.busy || !url.trim()}
            onClick={() =>
              void task.run(async () => {
                const normalized = normalizeBrowserUrl(url);
                if (!normalized) throw new Error("请填写有效的网页地址。");
                await onAdd({
                  name: name.trim() || new URL(normalized).hostname,
                  url: normalized,
                });
                setName("");
                setUrl("");
              }, "收藏已添加。")
            }
          >
            添加收藏
          </button>
        </WorkspaceSection>
        <WorkspaceSection title="我的收藏">
          {bookmarks.map((bookmark) => (
            <div className="fp-workspace-row" key={bookmark.id}>
              <button
                type="button"
                className="fp-button fp-ghost"
                onClick={() => onOpen(bookmark.id)}
              >
                {bookmark.name}
              </button>
              <AsyncAction
                confirm={`移除“${bookmark.name}”收藏？`}
                onAction={() => onRemove(bookmark.id)}
              >
                移除
              </AsyncAction>
            </div>
          ))}
          {!bookmarks.length && <p>添加常用网页，下次可以快速打开。</p>}
        </WorkspaceSection>
        <WorkspaceSection title="浏览器主页">
          <WorkspaceField
            label="主页地址"
            value={home}
            onChange={setHome}
            disabled={task.busy}
          />
          <WorkspaceSave
            busy={task.busy}
            dirty={homeDirty}
            label="保存主页"
            onClick={() =>
              void task.run(async () => {
                const normalized = normalizeBrowserUrl(home);
                if (!normalized) throw new Error("请填写有效的主页地址。");
                await onHomeChange(normalized);
                acceptHome(normalized);
              }, "主页已更新。")
            }
          />
        </WorkspaceSection>
      </WorkspaceSection>
    </section>
  );
}
