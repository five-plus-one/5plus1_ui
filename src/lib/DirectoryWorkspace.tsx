import { useState, type ReactNode } from "react";
import { AsyncAction } from "./ManagementViews";
import { AnimatedSize } from "./AnimatedSize";
import {
  WorkspaceSection,
  WorkspaceField,
  WorkspaceToggle,
  SettingsTabs,
  WorkspaceFeedback,
  WorkspaceSave,
  useWorkspaceAction,
  useWorkspaceDraft,
} from "./WorkspaceForms";
export interface DirectoryUser {
  sub: string;
  name: string;
  email?: string;
  disabled?: boolean;
}
export interface DirectoryGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
}
export interface DirectoryWorkspaceProps {
  users: DirectoryUser[];
  groups: DirectoryGroup[];
  protectedUserIds?: string[];
  onSaveUser: (user: DirectoryUser) => Promise<void> | void;
  onSaveGroup: (group: DirectoryGroup) => Promise<void> | void;
  onDeleteGroup: (id: string) => Promise<void> | void;
  renderUserDetails?: (user: DirectoryUser, close: () => void) => ReactNode;
  onRefresh?: () => Promise<void> | void;
  loading?: boolean;
  error?: string;
}
export function DirectoryWorkspace({
  users,
  groups,
  protectedUserIds = [],
  onSaveUser,
  onSaveGroup,
  onDeleteGroup,
  renderUserDetails,
  onRefresh,
  loading,
  error,
}: DirectoryWorkspaceProps) {
  const [tab, setTab] = useState("users"),
    [query, setQuery] = useState(""),
    [page, setPage] = useState(0),
    [editing, setEditing] = useState<DirectoryGroup | DirectoryUser | null>(
      null,
    );
  const task = useWorkspaceAction();
  const filtered = (
    tab === "users"
      ? users.map((u) => ({
          id: u.sub,
          label: u.name,
          description: u.email || u.sub,
          value: u,
        }))
      : groups.map((g) => ({
          id: g.id,
          label: g.name,
          description: `${g.members.length} 位成员 · ${g.description}`,
          value: g,
        }))
  ).filter((i) =>
    `${i.label} ${i.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil(filtered.length / 20) - 1),
  );
  return (
    <section className="fp-workspace-form" aria-label="用户与用户组">
      <WorkspaceSection
        title="用户与授权"
        description="管理成员资料、用户组和访问权限。"
        actions={
          <>
            <button
              type="button"
              className="fp-button fp-primary"
              disabled={loading}
              onClick={() =>
                setEditing(
                  tab === "users"
                    ? { sub: "", name: "", email: "", disabled: false }
                    : {
                        id: crypto.randomUUID(),
                        name: "",
                        description: "",
                        members: [],
                      },
                )
              }
            >
              {tab === "users" ? "添加用户" : "新建用户组"}
            </button>
            {onRefresh && (
              <button
                type="button"
                className="fp-button fp-secondary"
                disabled={task.busy}
                onClick={() => void task.run(onRefresh)}
              >
                刷新
              </button>
            )}
          </>
        }
      >
        <SettingsTabs
          label="成员类型"
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(0);
            setQuery("");
          }}
          items={[
            { id: "users", label: `用户 ${users.length}` },
            { id: "groups", label: `用户组 ${groups.length}` },
          ]}
        />
        <WorkspaceField
          label="搜索成员"
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(0);
          }}
        />
        <WorkspaceFeedback error={error || task.error} message={task.message} />
        {loading ? (
          <p role="status">正在读取成员…</p>
        ) : (
          <>
            <div className="fp-workspace-item-list">
              {filtered
                .slice(currentPage * 20, currentPage * 20 + 20)
                .map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setEditing(item.value)}
                  >
                    <span className="fp-workspace-avatar">
                      {item.label.slice(0, 1)}
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                    <span>管理</span>
                  </button>
                ))}
            </div>
            {!filtered.length && <p>没有匹配的成员，试试其他关键词。</p>}
            <footer className="fp-workspace-pagination">
              <span>{filtered.length} 项</span>
              <button
                type="button"
                className="fp-button fp-ghost"
                disabled={!currentPage}
                onClick={() => setPage(currentPage - 1)}
              >
                上一页
              </button>
              <span>
                {currentPage + 1} /{" "}
                {Math.max(1, Math.ceil(filtered.length / 20))}
              </span>
              <button
                type="button"
                className="fp-button fp-ghost"
                disabled={(currentPage + 1) * 20 >= filtered.length}
                onClick={() => setPage(currentPage + 1)}
              >
                下一页
              </button>
            </footer>
          </>
        )}
        <AnimatedSize>
          {editing &&
            ("members" in editing ? (
              <GroupEditor
                key={editing.id}
                group={editing}
                users={users}
                onSave={onSaveGroup}
                onDelete={
                  groups.some((g) => g.id === editing.id)
                    ? onDeleteGroup
                    : undefined
                }
                onClose={() => setEditing(null)}
              />
            ) : (
              renderUserDetails?.(editing, () => setEditing(null)) || (
                <UserProfileEditor
                  key={editing.sub || "new"}
                  protectedUser={protectedUserIds.includes(editing.sub)}
                  user={editing}
                  existing={users.some((u) => u.sub === editing.sub)}
                  onSave={onSaveUser}
                  onClose={() => setEditing(null)}
                />
              )
            ))}
        </AnimatedSize>
      </WorkspaceSection>
    </section>
  );
}
export function GroupEditor({
  group,
  users,
  onSave,
  onDelete,
  onClose,
}: {
  group: DirectoryGroup;
  users: DirectoryUser[];
  onSave: (group: DirectoryGroup) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  onClose: () => void;
}) {
  const { draft, setDraft, dirty, accept } = useWorkspaceDraft(group),
    task = useWorkspaceAction(),
    [query, setQuery] = useState("");
  return (
    <WorkspaceSection
      title={draft.name || "新建用户组"}
      actions={
        <AsyncAction
          confirm={dirty ? "放弃尚未保存的更改？" : undefined}
          disabled={task.busy}
          onAction={onClose}
        >
          关闭用户组
        </AsyncAction>
      }
    >
      <fieldset disabled={task.busy}>
        <WorkspaceField
          label="用户组名称"
          value={draft.name}
          onChange={(v) => setDraft({ ...draft, name: v })}
        />
        <WorkspaceField
          label="用户组说明"
          value={draft.description}
          onChange={(v) => setDraft({ ...draft, description: v })}
        />
        <WorkspaceField
          label="搜索候选成员"
          value={query}
          onChange={setQuery}
        />
        <div className="fp-workspace-picker">
          {users
            .filter((u) =>
              `${u.name} ${u.email || ""} ${u.sub}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((u) => (
              <WorkspaceToggle
                key={u.sub}
                label={u.name}
                description={u.email}
                checked={draft.members.includes(u.sub)}
                onChange={(checked) =>
                  setDraft({
                    ...draft,
                    members: checked
                      ? [...draft.members, u.sub]
                      : draft.members.filter((id) => id !== u.sub),
                  })
                }
              />
            ))}
        </div>
        <p>已选 {draft.members.length} 位成员</p>
        <div className="fp-workspace-actions">
          <WorkspaceSave
            busy={task.busy}
            dirty={dirty}
            label="保存用户组"
            onClick={() => {
              if (!draft.name.trim()) {
                task.setError("请填写用户组名称。");
                return;
              }
              void task.run(async () => {
                await onSave(draft);
                accept(draft);
              }, "用户组已保存。");
            }}
          />
          {onDelete && (
            <AsyncAction
              confirm="删除此用户组？通过该组获得的访问权限将失效。"
              onAction={async () => {
                await onDelete(draft.id);
                onClose();
              }}
            >
              删除用户组
            </AsyncAction>
          )}
        </div>
      </fieldset>
      <WorkspaceFeedback {...task} />
    </WorkspaceSection>
  );
}
export function UserProfileEditor({
  user,
  existing = true,
  protectedUser,
  onSave,
  onClose,
}: {
  user: DirectoryUser;
  existing?: boolean;
  protectedUser?: boolean;
  onSave: (user: DirectoryUser) => Promise<void> | void;
  onClose?: () => void;
}) {
  const { draft, setDraft, dirty, accept } = useWorkspaceDraft(user),
    task = useWorkspaceAction();
  return (
    <WorkspaceSection
      title={user.name || "添加用户"}
      actions={
        onClose && (
          <AsyncAction
            confirm={dirty ? "放弃尚未保存的更改？" : undefined}
            disabled={task.busy}
            onAction={onClose}
          >
            关闭用户
          </AsyncAction>
        )
      }
    >
      <fieldset disabled={task.busy}>
        <div className="fp-workspace-grid">
          <WorkspaceField
            label="账号"
            value={draft.sub}
            disabled={existing}
            onChange={(v) => setDraft({ ...draft, sub: v })}
          />
          <WorkspaceField
            label="显示名称"
            value={draft.name}
            onChange={(v) => setDraft({ ...draft, name: v })}
          />
          <WorkspaceField
            label="邮箱"
            value={draft.email || ""}
            onChange={(v) => setDraft({ ...draft, email: v })}
          />
        </div>
        <WorkspaceToggle
          label="停用此用户"
          checked={!!draft.disabled}
          disabled={protectedUser}
          description={protectedUser ? "此账号受到保护。" : "保存后生效。"}
          onChange={(v) => setDraft({ ...draft, disabled: v })}
        />
        <WorkspaceSave
          busy={task.busy}
          dirty={dirty}
          label="保存资料"
          onClick={() => {
            if (!/^[\w-]{1,128}$/.test(draft.sub) || !draft.name.trim()) {
              task.setError("请填写有效的账号和显示名称。");
              return;
            }
            void task.run(async () => {
              await onSave(draft);
              accept(draft);
            }, "用户资料已保存。");
          }}
        />
      </fieldset>
      <WorkspaceFeedback {...task} />
    </WorkspaceSection>
  );
}
export function CapacityEditor({
  usedBytes,
  capacityBytes,
  onSave,
}: {
  usedBytes: number;
  capacityBytes: number;
  onSave: (gigabytes: number, expectedBytes: number) => Promise<void> | void;
}) {
  const {
      draft: capacity,
      setDraft: setCapacity,
      dirty,
      accept,
    } = useWorkspaceDraft(
      String(Math.round((capacityBytes / 1024 ** 3) * 100) / 100),
    ),
    task = useWorkspaceAction();
  return (
    <WorkspaceSection
      title="存储额度"
      description={`已使用 ${(usedBytes / 1024 ** 3).toFixed(2)} GB`}
    >
      <WorkspaceField
        label="总存储额度（GB）"
        numeric
        value={capacity}
        onChange={setCapacity}
        hint="调整额度会保留已上传的资料。"
      />
      <WorkspaceSave
        busy={task.busy}
        dirty={dirty}
        onClick={() => {
          const n = Number(capacity);
          if (!Number.isFinite(n) || n < 1 || n > 102400) {
            task.setError("请输入 1 至 102400 GB 的有效额度。");
            return;
          }
          void task.run(async () => {
            await onSave(n, capacityBytes);
            accept(capacity);
          }, "存储额度已保存。");
        }}
      />
      <WorkspaceFeedback {...task} />
    </WorkspaceSection>
  );
}
export function AdministratorAccess({
  name,
  enabled,
  protectedUser,
  onSave,
}: {
  name: string;
  enabled: boolean;
  protectedUser?: boolean;
  onSave: (enabled: boolean) => Promise<void> | void;
}) {
  const {
    draft: next,
    setDraft: setNext,
    dirty,
    accept,
  } = useWorkspaceDraft(enabled);
  return (
    <WorkspaceSection
      title="平台管理权限"
      description="平台管理员可以管理课程、用户和计费配置。"
    >
      <WorkspaceToggle
        label="允许进入管理中心"
        checked={next}
        disabled={protectedUser}
        description={
          protectedUser ? "当前账号或平台负责人的权限受到保护。" : undefined
        }
        onChange={setNext}
      />
      <AsyncAction
        disabled={protectedUser || !dirty}
        confirm={`确认${next ? "授予" : "收回"} ${name} 的平台管理权限？`}
        onAction={async () => {
          await onSave(next);
          accept(next);
        }}
      >
        保存权限
      </AsyncAction>
    </WorkspaceSection>
  );
}
