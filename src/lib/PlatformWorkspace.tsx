import { useState } from "react";
import { AsyncAction } from "./ManagementViews";
import {
  CapacityEditor,
  AdministratorAccess,
  type DirectoryUser,
} from "./DirectoryWorkspace";
import {
  WorkspaceSection,
  WorkspaceField,
  WorkspaceToggle,
  WorkspaceFeedback,
  WorkspaceSave,
  useWorkspaceAction,
  useWorkspaceDraft,
} from "./WorkspaceForms";
export interface PlatformService {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  keyConfigured?: boolean;
  enabled: boolean;
  models: string[];
}
export interface PlatformPreferences {
  siteName: string;
  accountName: string;
  supportUrl: string;
  providers: PlatformService[];
  documentProcessing: {
    quark: {
      apiKey: string;
      keyConfigured?: boolean;
      scene: "general-ocr" | "formula-recognition" | "table-recognition";
      pagesPerRequest: number;
      enabled: boolean;
    };
  };
}
export function PlatformWorkspace({
  value,
  onSave,
  onConfigureStorage,
}: {
  value: PlatformPreferences;
  onSave: (
    next: PlatformPreferences,
  ) => Promise<PlatformPreferences | void> | PlatformPreferences | void;
  onConfigureStorage?: () => void;
}) {
  const { draft, setDraft, dirty, accept } = useWorkspaceDraft(value),
    task = useWorkspaceAction(),
    quark = draft.documentProcessing.quark;
  const updateService = (index: number, patch: Partial<PlatformService>) =>
    setDraft({
      ...draft,
      providers: draft.providers.map((provider, i) =>
        i === index ? { ...provider, ...patch } : provider,
      ),
    });
  const updateScan = (patch: Partial<typeof quark>) =>
    setDraft({
      ...draft,
      documentProcessing: {
        ...draft.documentProcessing,
        quark: { ...quark, ...patch },
      },
    });
  return (
    <section className="fp-workspace-form">
      <WorkspaceSection
        title="站点与学习服务"
        description="管理站点信息、模型连接和资料识别。"
        actions={
          <WorkspaceSave
            busy={task.busy}
            dirty={dirty}
            onClick={() => {
              if (
                !draft.siteName.trim() ||
                !draft.accountName.trim() ||
                (draft.supportUrl && !/^https?:\/\//.test(draft.supportUrl)) ||
                !Number.isInteger(quark.pagesPerRequest) ||
                quark.pagesPerRequest < 1 ||
                quark.pagesPerRequest > 4 ||
                new Set(draft.providers.map((p) => p.id)).size !==
                  draft.providers.length ||
                draft.providers.some(
                  (p) =>
                    !/^[a-z0-9-]+$/.test(p.id) ||
                    !p.name.trim() ||
                    (p.enabled && !/^https?:\/\//.test(p.baseUrl)),
                )
              ) {
                task.setError("请检查站点名称、服务地址和识别页数。");
                return;
              }
              void task.run(
                async () => accept((await onSave(draft)) || draft),
                "平台设置已保存。",
              );
            }}
          />
        }
      >
        <WorkspaceFeedback {...task} />
        <fieldset disabled={task.busy}>
          <WorkspaceSection title="站点信息">
            <div className="fp-workspace-grid">
              <WorkspaceField
                label="站点名称"
                value={draft.siteName}
                onChange={(siteName) => setDraft({ ...draft, siteName })}
              />
              <WorkspaceField
                label="账号品牌"
                value={draft.accountName}
                onChange={(accountName) => setDraft({ ...draft, accountName })}
              />
              <WorkspaceField
                label="帮助中心地址"
                value={draft.supportUrl}
                onChange={(supportUrl) => setDraft({ ...draft, supportUrl })}
              />
            </div>
            {onConfigureStorage && (
              <button
                type="button"
                className="fp-button fp-secondary"
                onClick={onConfigureStorage}
              >
                配置资料存储
              </button>
            )}
          </WorkspaceSection>
          <WorkspaceSection
            title="模型供应商"
            description="保存密钥后，仅显示配置状态。"
            actions={
              <button
                type="button"
                className="fp-button fp-secondary"
                onClick={() =>
                  setDraft({
                    ...draft,
                    providers: [
                      ...draft.providers,
                      {
                        id: `service-${crypto.randomUUID().slice(0, 8)}`,
                        name: "模型服务",
                        baseUrl: "",
                        apiKey: "",
                        enabled: false,
                        models: [],
                      },
                    ],
                  })
                }
              >
                添加供应商
              </button>
            }
          >
            {draft.providers.map((provider, index) => (
              <WorkspaceSection key={index} title={provider.name || "模型服务"}>
                <div className="fp-workspace-grid">
                  <WorkspaceField
                    label="连接标识"
                    value={provider.id}
                    onChange={(id) => updateService(index, { id })}
                    hint="使用小写字母、数字和连字符。"
                  />
                  <WorkspaceField
                    label="服务名称"
                    value={provider.name}
                    onChange={(name) => updateService(index, { name })}
                  />
                  <WorkspaceField
                    label="服务地址"
                    value={provider.baseUrl}
                    onChange={(baseUrl) => updateService(index, { baseUrl })}
                  />
                  <WorkspaceField
                    label="服务密钥"
                    secret
                    value={provider.apiKey}
                    hint={
                      provider.keyConfigured
                        ? "已配置；留空保留当前密钥。"
                        : undefined
                    }
                    onChange={(apiKey) => updateService(index, { apiKey })}
                  />
                </div>
                <WorkspaceField
                  label="可用模型"
                  multiline
                  value={provider.models.join("\n")}
                  hint="每行填写一个模型名称。"
                  onChange={(text) =>
                    updateService(index, {
                      models: text
                        .split("\n")
                        .map((v) => v.trim())
                        .filter(Boolean),
                    })
                  }
                />
                <WorkspaceToggle
                  label={`启用 ${provider.name}`}
                  checked={provider.enabled}
                  onChange={(enabled) => updateService(index, { enabled })}
                />
                <AsyncAction
                  confirm="移除此供应商？保存后生效。"
                  onAction={() =>
                    setDraft({
                      ...draft,
                      providers: draft.providers.filter((_, i) => i !== index),
                    })
                  }
                >
                  移除供应商
                </AsyncAction>
              </WorkspaceSection>
            ))}
          </WorkspaceSection>
          <WorkspaceSection
            title="扫描识别"
            description="将扫描资料中的文字、表格与公式转为可阅读内容。"
          >
            <WorkspaceToggle
              label="启用扫描识别"
              checked={quark.enabled}
              onChange={(enabled) => updateScan({ enabled })}
            />
            <div className="fp-workspace-grid">
              <WorkspaceField
                label="识别服务密钥"
                secret
                value={quark.apiKey}
                hint={
                  quark.keyConfigured ? "已配置；留空保留当前密钥。" : undefined
                }
                onChange={(apiKey) => updateScan({ apiKey })}
              />
              <WorkspaceField
                label="默认识别方式"
                value={quark.scene}
                options={[
                  { value: "general-ocr", label: "通用识别" },
                  { value: "formula-recognition", label: "公式识别" },
                  { value: "table-recognition", label: "表格识别" },
                ]}
                onChange={(scene) =>
                  updateScan({ scene: scene as typeof quark.scene })
                }
              />
              <WorkspaceField
                label="每批处理页数"
                numeric
                value={quark.pagesPerRequest}
                onChange={(text) =>
                  updateScan({ pagesPerRequest: Number(text) })
                }
              />
            </div>
          </WorkspaceSection>
        </fieldset>
      </WorkspaceSection>
    </section>
  );
}
export function AdministratorDirectory({
  users,
  enabledIds,
  protectedIds,
  onSave,
}: {
  users: DirectoryUser[];
  enabledIds: string[];
  protectedIds: string[];
  onSave: (id: string, enabled: boolean) => Promise<void> | void;
}) {
  const [query, setQuery] = useState("");
  return (
    <section className="fp-workspace-form">
      <WorkspaceSection title="平台管理员">
        <WorkspaceField
          label="搜索管理员账户"
          value={query}
          onChange={setQuery}
        />
        {users
          .filter((user) =>
            `${user.name} ${user.email || ""} ${user.sub}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .map((user) => (
            <AdministratorAccess
              key={`${user.sub}-${enabledIds.includes(user.sub)}`}
              name={user.name}
              enabled={enabledIds.includes(user.sub)}
              protectedUser={protectedIds.includes(user.sub)}
              onSave={(value) => onSave(user.sub, value)}
            />
          ))}
      </WorkspaceSection>
    </section>
  );
}
export function CapacityDirectory({
  entries,
  onSave,
}: {
  entries: { id: string; name: string; used: number; capacity: number }[];
  onSave: (
    id: string,
    gigabytes: number,
    expectedBytes: number,
  ) => Promise<void> | void;
}) {
  const [query, setQuery] = useState("");
  return (
    <section className="fp-workspace-form">
      <WorkspaceSection title="用户存储">
        <WorkspaceField
          label="搜索存储账户"
          value={query}
          onChange={setQuery}
        />
        {entries
          .filter((entry) =>
            entry.name.toLowerCase().includes(query.toLowerCase()),
          )
          .map((entry) => (
            <WorkspaceSection key={entry.id} title={entry.name}>
              <CapacityEditor
                usedBytes={entry.used}
                capacityBytes={entry.capacity}
                onSave={(gb, expected) => onSave(entry.id, gb, expected)}
              />
            </WorkspaceSection>
          ))}
      </WorkspaceSection>
    </section>
  );
}
export function PlatformReset({
  canReset,
  confirmation = "重置课栈平台",
  onReset,
}: {
  canReset: boolean;
  confirmation?: string;
  onReset: () => Promise<void> | void;
}) {
  const [input, setInput] = useState(""),
    task = useWorkspaceAction();
  return (
    <section className="fp-workspace-form">
      <WorkspaceSection
        title="重新配置平台"
        description="重新设置平台服务，已保存的课程、笔记和资料会保留。"
      >
        {canReset ? (
          <>
            <WorkspaceField
              label={`输入“${confirmation}”确认`}
              value={input}
              onChange={setInput}
              disabled={task.busy}
            />
            <button
              type="button"
              className="fp-button fp-secondary"
              disabled={task.busy || input !== confirmation}
              onClick={() => void task.run(onReset, "平台配置已重置。")}
            >
              {task.busy ? "正在重新配置…" : "重置并重新配置"}
            </button>
          </>
        ) : (
          <p>请联系平台负责人进行此项操作。</p>
        )}
        <WorkspaceFeedback {...task} />
      </WorkspaceSection>
    </section>
  );
}
