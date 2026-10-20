import { useState } from "react";
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
export interface EditableAIModel {
  id: string;
  label: string;
  modelType: "text" | "image";
  contextK: number;
  cacheTtlSec: number;
  inputPrice: number;
  outputPrice: number;
  cachedInputPrice?: number;
  cacheWritePrice?: number;
  vision: boolean;
  tools: boolean;
  thinking: boolean;
  thinkingRequired: boolean;
  thinkingLevels: string[];
  apiProtocol: "openai" | "anthropic" | "siliconflow";
  reasoningField?: string;
  thinkingRequestStyle: string;
  imageApiStyle: "auto" | "openai" | "siliconflow";
  sizes: string[];
  maxCount: number;
}
export interface EditableAPIGroup {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  models: EditableAIModel[];
}
export interface AISettings {
  groups: EditableAPIGroup[];
  defaultModel: string;
  excerptModel: string;
  selectionModel: string;
  imageTextModel: string;
  fallbackModel: string;
  defaultThinking: boolean;
  defaultSearch: boolean;
  thinkingEffort: string;
  globalContext: string;
  disabledTools: string[];
  imageEnabled: boolean;
  fontSize?: number;
  fontFamily?: string;
}
export interface AISettingsWorkspaceProps {
  value: AISettings;
  builtInModels?: { id: string; label: string }[];
  tools?: { id: string; label: string; description?: string }[];
  onSave: (value: AISettings) => Promise<void> | void;
  onExportChats?: () => Promise<void> | void;
  onExportSettings?: (value: AISettings) => Promise<void> | void;
}
export const createEditableAIModel = (): EditableAIModel => ({
  id: "",
  label: "",
  modelType: "text",
  contextK: 128,
  cacheTtlSec: 3600,
  inputPrice: 0,
  outputPrice: 0,
  vision: false,
  tools: true,
  thinking: false,
  thinkingRequired: false,
  thinkingLevels: ["low", "medium", "high", "max"],
  apiProtocol: "openai",
  thinkingRequestStyle: "none",
  imageApiStyle: "auto",
  sizes: ["1024x1024"],
  maxCount: 1,
});
export function validateAISettings(value: unknown): value is AISettings {
  if (!value || typeof value !== "object") return false;
  const v = value as AISettings;
  const strings = (items: unknown): items is string[] =>
    Array.isArray(items) &&
    items.length <= 1000 &&
    items.every((item) => typeof item === "string" && item.length <= 2000);
  const price = (n: unknown, optional = false) =>
    (optional && n === undefined) ||
    (typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100000);
  return (
    Array.isArray(v.groups) &&
    v.groups.length <= 100 &&
    new Set(v.groups.map((g) => g?.id)).size === v.groups.length &&
    v.groups.every(
      (g) =>
        g &&
        typeof g === "object" &&
        typeof g.id === "string" &&
        g.id.length <= 128 &&
        typeof g.name === "string" &&
        typeof g.baseUrl === "string" &&
        typeof g.apiKey === "string" &&
        Array.isArray(g.models) &&
        g.models.length <= 1000 &&
        g.models.every(
          (m) =>
            m &&
            typeof m === "object" &&
            typeof m.id === "string" &&
            typeof m.label === "string" &&
            ["text", "image"].includes(m.modelType) &&
            Number.isFinite(m.contextK) &&
            m.contextK > 0 &&
            m.contextK <= 100000 &&
            Number.isFinite(m.cacheTtlSec) &&
            m.cacheTtlSec >= 0 &&
            price(m.inputPrice) &&
            price(m.outputPrice) &&
            price(m.cachedInputPrice, true) &&
            price(m.cacheWritePrice, true) &&
            ["vision", "tools", "thinking", "thinkingRequired"].every(
              (key) => typeof m[key as keyof EditableAIModel] === "boolean",
            ) &&
            strings(m.thinkingLevels) &&
            strings(m.sizes) &&
            typeof m.thinkingRequestStyle === "string" &&
            ["openai", "anthropic", "siliconflow"].includes(m.apiProtocol) &&
            ["auto", "openai", "siliconflow"].includes(m.imageApiStyle) &&
            Number.isInteger(m.maxCount) &&
            m.maxCount > 0 &&
            m.maxCount <= 100,
        ),
    ) &&
    [
      "defaultModel",
      "excerptModel",
      "selectionModel",
      "imageTextModel",
      "fallbackModel",
      "thinkingEffort",
      "globalContext",
    ].every((key) => typeof v[key as keyof AISettings] === "string") &&
    ["defaultThinking", "defaultSearch", "imageEnabled"].every(
      (key) => typeof v[key as keyof AISettings] === "boolean",
    ) &&
    strings(v.disabledTools) &&
    (v.fontSize === undefined ||
      (Number.isFinite(v.fontSize) && v.fontSize >= 10 && v.fontSize <= 32)) &&
    (v.fontFamily === undefined || typeof v.fontFamily === "string")
  );
}
export function replaceAIModelReferences(
  value: AISettings,
  replacements: Record<string, string>,
): AISettings {
  const next = { ...value };
  for (const key of [
    "defaultModel",
    "excerptModel",
    "selectionModel",
    "imageTextModel",
    "fallbackModel",
  ] as const)
    if (Object.hasOwn(replacements, next[key]))
      next[key] = replacements[next[key]];
  return next;
}
export function AISettingsWorkspace({
  value,
  builtInModels = [],
  tools = [],
  onSave,
  onExportChats,
  onExportSettings,
}: AISettingsWorkspaceProps) {
  const { draft, setDraft, dirty, accept } = useWorkspaceDraft(value),
    task = useWorkspaceAction();
  const [tab, setTab] = useState("models"),
    [groupId, setGroupId] = useState(draft.groups[0]?.id || ""),
    [modelIndex, setModelIndex] = useState<number | null>(null);
  const group = draft.groups.find((g) => g.id === groupId),
    model = modelIndex === null ? undefined : group?.models[modelIndex];
  const change = <K extends keyof AISettings>(key: K, next: AISettings[K]) =>
    setDraft({ ...draft, [key]: next });
  const updateGroup = (patch: Partial<EditableAPIGroup>) => {
    const replacements: Record<string, string> = {};
    if (patch.models && group)
      for (const old of group.models)
        if (!patch.models.some((model) => model.id === old.id))
          replacements[`${groupId}:${old.id}`] = "";
    setDraft(
      replaceAIModelReferences(
        {
          ...draft,
          groups: draft.groups.map((g) =>
            g.id === groupId ? { ...g, ...patch } : g,
          ),
        },
        replacements,
      ),
    );
  };
  const updateModel = (patch: Partial<EditableAIModel>) => {
    if (!group || !model) return;
    const replacements =
      patch.id !== undefined && patch.id !== model.id
        ? {
            [`${groupId}:${model.id}`]: patch.id
              ? `${groupId}:${patch.id}`
              : "",
          }
        : {};
    setDraft(
      replaceAIModelReferences(
        {
          ...draft,
          groups: draft.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  models: g.models.map((m, i) =>
                    i === modelIndex ? { ...m, ...patch } : m,
                  ),
                }
              : g,
          ),
        },
        replacements,
      ),
    );
  };
  const allModels = [
      ...builtInModels,
      ...draft.groups.flatMap((g) =>
        g.models
          .filter((m) => m.id)
          .map((m) => ({
            id: `${g.id}:${m.id}`,
            label: `${g.name} · ${m.label || m.id}`,
          })),
      ),
    ],
    choices = [
      { value: "", label: "跟随主对话" },
      ...allModels.map((m) => ({ value: m.id, label: m.label })),
    ];
  const save = () => {
    if (
      !validateAISettings(draft) ||
      draft.groups.some(
        (g) =>
          !g.name.trim() ||
          !/^https?:\/\//.test(g.baseUrl) ||
          g.models.some((m) => !m.id.trim()) ||
          new Set(g.models.map((m) => m.id)).size !== g.models.length,
      )
    ) {
      task.setError("请检查分组地址、模型名称和数值设置。");
      return;
    }
    void task.run(async () => {
      await onSave(draft);
      accept(draft);
    }, "助手设置已保存。");
  };
  return (
    <section className="fp-workspace-form" aria-label="助手完整设置">
      <WorkspaceSection
        title="学习助手设置"
        description="管理模型、学习偏好和技能使用方式。"
        actions={
          <WorkspaceSave busy={task.busy} dirty={dirty} onClick={save} />
        }
      >
        <SettingsTabs
          label="助手设置分区"
          value={tab}
          onChange={setTab}
          items={[
            { id: "models", label: "模型与连接" },
            { id: "defaults", label: "学习偏好" },
            { id: "images", label: "图片创作" },
            { id: "tools", label: "工具" },
            { id: "data", label: "导入与导出" },
          ]}
        />
        <WorkspaceFeedback {...task} />
        <fieldset disabled={task.busy}>
          <AnimatedSize>
            {tab === "models" && (
              <>
                <WorkspaceSection title="对话模型">
                  <WorkspaceField
                    label="默认对话模型"
                    value={draft.defaultModel}
                    options={[
                      { value: "", label: "自动选择" },
                      ...choices.slice(1),
                    ]}
                    onChange={(v) => change("defaultModel", v)}
                  />
                  <div className="fp-workspace-grid">
                    <WorkspaceField
                      label="摘录模型"
                      value={draft.excerptModel}
                      options={choices}
                      onChange={(v) => change("excerptModel", v)}
                    />
                    <WorkspaceField
                      label="划词助手模型"
                      value={draft.selectionModel}
                      options={choices}
                      onChange={(v) => change("selectionModel", v)}
                    />
                  </div>
                </WorkspaceSection>
                <WorkspaceSection
                  title="自定义连接"
                  actions={
                    <button
                      type="button"
                      className="fp-button fp-secondary"
                      onClick={() => {
                        const next = {
                          id: crypto.randomUUID(),
                          name: "新连接",
                          baseUrl: "",
                          apiKey: "",
                          models: [],
                        };
                        change("groups", [...draft.groups, next]);
                        setGroupId(next.id);
                        setModelIndex(null);
                      }}
                    >
                      添加连接
                    </button>
                  }
                >
                  <WorkspaceField
                    label="当前连接"
                    value={groupId}
                    options={draft.groups.map((g) => ({
                      value: g.id,
                      label: g.name,
                    }))}
                    onChange={(v) => {
                      setGroupId(v);
                      setModelIndex(null);
                    }}
                  />
                  {group && (
                    <>
                      <div className="fp-workspace-grid">
                        <WorkspaceField
                          label="连接名称"
                          value={group.name}
                          onChange={(v) => updateGroup({ name: v })}
                        />
                        <WorkspaceField
                          label="服务地址"
                          value={group.baseUrl}
                          onChange={(v) => updateGroup({ baseUrl: v })}
                        />
                        <WorkspaceField
                          label="API 密钥"
                          secret
                          value={group.apiKey}
                          onChange={(v) => updateGroup({ apiKey: v })}
                        />
                      </div>
                      <div className="fp-workspace-item-list">
                        {group.models.map((m, i) => (
                          <button
                            type="button"
                            key={i}
                            aria-pressed={i === modelIndex}
                            onClick={() => setModelIndex(i)}
                          >
                            <strong>{m.label || m.id || "新模型"}</strong>
                            <small>
                              {m.modelType === "image"
                                ? "图片模型"
                                : "文本模型"}{" "}
                              · {m.contextK} K
                            </small>
                          </button>
                        ))}
                      </div>
                      <div className="fp-workspace-actions">
                        <button
                          type="button"
                          className="fp-button fp-secondary"
                          onClick={() => {
                            setModelIndex(group.models.length);
                            updateGroup({
                              models: [
                                ...group.models,
                                createEditableAIModel(),
                              ],
                            });
                          }}
                        >
                          添加模型
                        </button>
                        <AsyncAction
                          confirm={`删除“${group.name}”及其模型？保存后生效。`}
                          onAction={() => {
                            setDraft(
                              replaceAIModelReferences(
                                {
                                  ...draft,
                                  groups: draft.groups.filter(
                                    (g) => g.id !== groupId,
                                  ),
                                },
                                Object.fromEntries(
                                  group.models.map((m) => [
                                    `${groupId}:${m.id}`,
                                    "",
                                  ]),
                                ),
                              ),
                            );
                            setGroupId("");
                            setModelIndex(null);
                          }}
                        >
                          删除连接
                        </AsyncAction>
                      </div>
                    </>
                  )}
                </WorkspaceSection>
                {model && (
                  <WorkspaceSection title={model.label || "编辑模型"}>
                    <div className="fp-workspace-grid">
                      <WorkspaceField
                        label="模型名称"
                        value={model.id}
                        onChange={(v) => updateModel({ id: v })}
                      />
                      <WorkspaceField
                        label="显示名称"
                        value={model.label}
                        onChange={(v) => updateModel({ label: v })}
                      />
                      <WorkspaceField
                        label="模型类型"
                        value={model.modelType}
                        options={[
                          { value: "text", label: "文本" },
                          { value: "image", label: "图片" },
                        ]}
                        onChange={(v) =>
                          updateModel({
                            modelType: v as EditableAIModel["modelType"],
                          })
                        }
                      />
                      <WorkspaceField
                        label="上下文长度（K）"
                        value={model.contextK}
                        numeric
                        onChange={(v) => updateModel({ contextK: Number(v) })}
                      />
                      <WorkspaceField
                        label="缓存有效期（秒）"
                        value={model.cacheTtlSec}
                        numeric
                        onChange={(v) =>
                          updateModel({ cacheTtlSec: Number(v) })
                        }
                      />
                      {(
                        [
                          "inputPrice",
                          "cachedInputPrice",
                          "cacheWritePrice",
                          "outputPrice",
                        ] as const
                      ).map((key, i) => (
                        <WorkspaceField
                          key={key}
                          label={
                            [
                              "输入价格",
                              "缓存读取价格",
                              "缓存写入价格",
                              "输出价格",
                            ][i]
                          }
                          value={model[key] ?? 0}
                          numeric
                          onChange={(v) => updateModel({ [key]: Number(v) })}
                        />
                      ))}
                      <WorkspaceField
                        label="服务协议"
                        value={model.apiProtocol}
                        options={["openai", "anthropic", "siliconflow"].map(
                          (v) => ({ value: v, label: v }),
                        )}
                        onChange={(v) =>
                          updateModel({
                            apiProtocol: v as EditableAIModel["apiProtocol"],
                          })
                        }
                      />
                    </div>
                    {(
                      [
                        "vision",
                        "tools",
                        "thinking",
                        "thinkingRequired",
                      ] as const
                    ).map((key, i) => (
                      <WorkspaceToggle
                        key={key}
                        label={
                          ["理解图片", "使用工具", "支持思考", "始终启用思考"][
                            i
                          ]
                        }
                        checked={model[key]}
                        onChange={(v) => updateModel({ [key]: v })}
                      />
                    ))}
                    <WorkspaceField
                      label="可用思考力度"
                      value={model.thinkingLevels.join(", ")}
                      hint="以逗号分隔。"
                      onChange={(v) =>
                        updateModel({
                          thinkingLevels: v
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                    <div className="fp-workspace-grid">
                      <WorkspaceField
                        label="思考参数格式"
                        value={model.thinkingRequestStyle}
                        options={[
                          "none",
                          "siliconflow",
                          "mimo-thinking",
                          "openai-reasoning-effort",
                          "openrouter-reasoning",
                          "anthropic-thinking",
                        ].map((v) => ({
                          value: v,
                          label: v === "none" ? "自动使用默认格式" : v,
                        }))}
                        onChange={(v) =>
                          updateModel({ thinkingRequestStyle: v })
                        }
                      />
                      <WorkspaceField
                        label="推理内容字段"
                        value={model.reasoningField || ""}
                        onChange={(v) => updateModel({ reasoningField: v })}
                      />
                    </div>
                    {model.modelType === "image" && (
                      <>
                        <WorkspaceField
                          label="图片接口"
                          value={model.imageApiStyle}
                          options={["auto", "openai", "siliconflow"].map(
                            (v) => ({
                              value: v,
                              label: v === "auto" ? "自动识别" : v,
                            }),
                          )}
                          onChange={(v) =>
                            updateModel({
                              imageApiStyle:
                                v as EditableAIModel["imageApiStyle"],
                            })
                          }
                        />
                        <WorkspaceField
                          label="图片尺寸"
                          value={model.sizes.join(", ")}
                          hint="例如 1024x1024，以逗号分隔。"
                          onChange={(v) =>
                            updateModel({
                              sizes: v
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                        <WorkspaceField
                          label="最多生成张数"
                          numeric
                          value={model.maxCount}
                          onChange={(v) => updateModel({ maxCount: Number(v) })}
                        />
                      </>
                    )}
                    <AsyncAction
                      confirm="移除此模型？保存后生效。"
                      onAction={() => {
                        updateGroup({
                          models: group!.models.filter(
                            (_, i) => i !== modelIndex,
                          ),
                        });
                        setModelIndex(null);
                      }}
                    >
                      移除模型
                    </AsyncAction>
                  </WorkspaceSection>
                )}
              </>
            )}
            {tab === "defaults" && (
              <WorkspaceSection title="新对话偏好">
                <WorkspaceToggle
                  label="深度思考"
                  checked={draft.defaultThinking}
                  onChange={(v) => change("defaultThinking", v)}
                />
                <WorkspaceToggle
                  label="联网搜索"
                  checked={draft.defaultSearch}
                  onChange={(v) => change("defaultSearch", v)}
                />
                <WorkspaceField
                  label="默认思考力度"
                  value={draft.thinkingEffort}
                  options={["low", "medium", "high", "max"].map((v, i) => ({
                    value: v,
                    label: ["轻度", "适中", "深入", "充分"][i],
                  }))}
                  onChange={(v) => change("thinkingEffort", v)}
                />
                <WorkspaceField
                  label="补充学习背景"
                  multiline
                  value={draft.globalContext}
                  hint="介绍你的课程、称呼和回答偏好。"
                  onChange={(v) => change("globalContext", v)}
                />
                <div className="fp-workspace-grid">
                  <WorkspaceField
                    label="对话字号"
                    numeric
                    value={draft.fontSize || 15}
                    onChange={(v) => change("fontSize", Number(v))}
                  />
                  <WorkspaceField
                    label="对话字体"
                    value={draft.fontFamily || "inherit"}
                    options={[
                      { value: "inherit", label: "跟随全局" },
                      { value: "sans-serif", label: "清晰黑体" },
                      { value: "serif", label: "阅读衬线" },
                      { value: "monospace", label: "等宽" },
                    ]}
                    onChange={(v) => change("fontFamily", v)}
                  />
                </div>
              </WorkspaceSection>
            )}
            {tab === "images" && (
              <WorkspaceSection title="图片创作">
                <WorkspaceToggle
                  label="开启图片创作"
                  checked={draft.imageEnabled}
                  onChange={(v) => change("imageEnabled", v)}
                />
                <WorkspaceField
                  label="图片创作理解模型"
                  value={draft.imageTextModel}
                  options={choices}
                  onChange={(v) => change("imageTextModel", v)}
                />
                <WorkspaceField
                  label="备用模型"
                  value={draft.fallbackModel}
                  options={choices}
                  onChange={(v) => change("fallbackModel", v)}
                />
              </WorkspaceSection>
            )}
            {tab === "tools" && (
              <WorkspaceSection title="可用工具">
                {tools.map((t) => (
                  <WorkspaceToggle
                    key={t.id}
                    label={t.label}
                    description={t.description}
                    checked={!draft.disabledTools.includes(t.id)}
                    onChange={(v) =>
                      change(
                        "disabledTools",
                        v
                          ? draft.disabledTools.filter((id) => id !== t.id)
                          : [...draft.disabledTools, t.id],
                      )
                    }
                  />
                ))}
                {!tools.length && <p>当前没有可配置的工具。</p>}
              </WorkspaceSection>
            )}
            {tab === "data" && (
              <WorkspaceSection
                title="导入与导出"
                description="配置文件可能包含连接密钥，请妥善保管。"
              >
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
                  导入助手设置
                  <input
                    type="file"
                    hidden
                    aria-label="导入助手设置"
                    accept=".json,application/json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file)
                        void task.run(async () => {
                          if (file.size > 2_000_000)
                            throw new Error("设置文件不能超过 2 MB。");
                          let parsed: unknown;
                          try {
                            parsed = JSON.parse(await file.text());
                          } catch {
                            throw new Error(
                              "无法读取设置文件，请选择有效的 JSON 文件。",
                            );
                          }
                          if (!validateAISettings(parsed))
                            throw new Error("文件内容与助手设置不匹配。");
                          setDraft(parsed);
                          setGroupId(parsed.groups[0]?.id || "");
                          setModelIndex(null);
                        }, "设置已读入，请检查后保存。");
                    }}
                  />
                </label>
                <div className="fp-workspace-actions">
                  {onExportSettings && (
                    <AsyncAction onAction={() => onExportSettings(draft)}>
                      导出助手设置
                    </AsyncAction>
                  )}
                  {onExportChats && (
                    <AsyncAction onAction={onExportChats}>
                      导出对话记录
                    </AsyncAction>
                  )}
                </div>
              </WorkspaceSection>
            )}
          </AnimatedSize>
        </fieldset>
      </WorkspaceSection>
    </section>
  );
}
