import { useState } from "react";
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

export interface EditableCommercePlan {
  id: string;
  name: string;
  days: number;
  priceYuan: number;
  credits: number;
  discount: number;
  enabled: boolean;
}
export interface ModelRate {
  input: number;
  cachedInput: number;
  output: number;
}
export interface CommerceSettings {
  enabled: boolean;
  creditsPerYuan: number;
  costMultiplier?: number;
  replyCredits?: number;
  gateway: string;
  pid: string;
  secret: string;
  serviceRates: {
    quarkOcrRequest: number;
    documentOrganization: number;
    webSearch: number;
  };
  modelRates?: Record<string, ModelRate>;
  rateOverrides?: string[];
  plans: EditableCommercePlan[];
  pricingSyncedAt?: string;
  pricingGroup?: string;
  pricingExchangeRate?: number;
  pricingGroupRatio?: number;
}
export interface CommerceWorkspaceProps {
  value: CommerceSettings;
  onSave: (
    value: CommerceSettings,
  ) => Promise<CommerceSettings | void> | CommerceSettings | void;
  onSyncPrices?: (reset: string[]) => Promise<CommerceSettings>;
  readOnly?: boolean;
}
const money = (value: number) => Number.isFinite(value) && value >= 0;
export function validateCommerceSettings(
  value: CommerceSettings,
): string | undefined {
  if (
    !(value.creditsPerYuan > 0 && value.creditsPerYuan <= 10000) ||
    !((value.costMultiplier ?? 1) > 0 && (value.costMultiplier ?? 1) <= 100)
  )
    return "请填写有效的积分比例和成本倍率。";
  if (Object.values(value.serviceRates).some((n) => !money(n) || n > 10000))
    return "请填写有效的资料处理价格。";
  if (
    Object.entries(value.modelRates || {}).some(
      ([name, rate]) =>
        !name.trim() ||
        Object.values(rate).some((n) => !money(n) || n > 100000),
    )
  )
    return "请检查模型名称和价格。";
  if (
    new Set(value.plans.map((p) => p.id)).size !== value.plans.length ||
    value.plans.length > 30 ||
    value.plans.some(
      (p) =>
        !p.name.trim() ||
        !Number.isInteger(p.days) ||
        p.days < 1 ||
        p.days > 3660 ||
        !money(p.priceYuan) ||
        p.priceYuan <= 0 ||
        p.priceYuan > 10000 ||
        !money(p.credits) ||
        p.credits > 1000000 ||
        !(p.discount >= 0 && p.discount <= 1),
    )
  )
    return "请检查会员名称、天数、价格及折扣。";
  if (
    value.enabled &&
    (!/^https?:\/\//.test(value.gateway) || !value.pid.trim())
  )
    return "启用支付前，请填写支付网关和商户号。";
}
export function CommerceWorkspace({
  value,
  onSave,
  onSyncPrices,
  readOnly,
}: CommerceWorkspaceProps) {
  const { draft, setDraft, dirty, accept } = useWorkspaceDraft(value),
    task = useWorkspaceAction();
  const [tab, setTab] = useState("credits"),
    [query, setQuery] = useState(""),
    [newModel, setNewModel] = useState("");
  const change = <K extends keyof CommerceSettings>(
    key: K,
    next: CommerceSettings[K],
  ) => setDraft({ ...draft, [key]: next });
  const sync = (reset: string[] = []) => {
    if (!onSyncPrices) return;
    if (dirty) {
      task.setError("请先保存当前更改，再同步价格。");
      return;
    }
    void task.run(
      async () => accept(await onSyncPrices(reset)),
      "模型价格已同步。",
    );
  };
  const save = () => {
    const error = validateCommerceSettings(draft);
    if (error) {
      task.setError(error);
      return;
    }
    void task.run(
      async () => accept((await onSave(draft)) || draft),
      "积分与会员设置已保存。",
    );
  };
  return (
    <section className="fp-workspace-form" aria-label="积分与会员设置">
      <WorkspaceSection
        title="积分与会员"
        description="管理充值、会员权益和服务价格。"
        actions={
          <WorkspaceSave
            busy={task.busy}
            dirty={dirty && !readOnly}
            onClick={save}
          />
        }
      >
        <SettingsTabs
          label="计费设置"
          value={tab}
          onChange={setTab}
          items={[
            { id: "credits", label: "充值与积分" },
            { id: "plans", label: "会员计划" },
            { id: "payment", label: "支付接入" },
            { id: "models", label: "模型价格" },
          ]}
        />
        <WorkspaceFeedback {...task} />
        <fieldset disabled={task.busy || readOnly}>
          <AnimatedSize>
            {tab === "credits" && (
              <>
                <WorkspaceSection title="积分规则">
                  <div className="fp-workspace-grid">
                    <WorkspaceField
                      label="每元兑换积分"
                      numeric
                      value={draft.creditsPerYuan}
                      onChange={(v) => change("creditsPerYuan", Number(v))}
                    />
                    <WorkspaceField
                      label="成本倍率"
                      numeric
                      value={draft.costMultiplier ?? 1}
                      onChange={(v) => change("costMultiplier", Number(v))}
                    />
                    <WorkspaceField
                      label="单次回复积分"
                      numeric
                      value={draft.replyCredits ?? 0}
                      onChange={(v) => change("replyCredits", Number(v))}
                    />
                  </div>
                </WorkspaceSection>
                <WorkspaceSection
                  title="资料处理价格"
                  description="按实际处理次数计费。"
                >
                  <div className="fp-workspace-grid">
                    {(
                      [
                        ["quarkOcrRequest", "扫描识别（每次）"],
                        ["documentOrganization", "资料整理（每次）"],
                        ["webSearch", "联网搜索（每次）"],
                      ] as const
                    ).map(([key, label]) => (
                      <WorkspaceField
                        key={key}
                        label={label}
                        numeric
                        value={draft.serviceRates[key]}
                        onChange={(v) =>
                          change("serviceRates", {
                            ...draft.serviceRates,
                            [key]: Number(v),
                          })
                        }
                      />
                    ))}
                  </div>
                </WorkspaceSection>
              </>
            )}
            {tab === "plans" && (
              <WorkspaceSection
                title="会员计划"
                actions={
                  <button
                    type="button"
                    className="fp-button fp-secondary"
                    disabled={draft.plans.length >= 30}
                    onClick={() =>
                      change("plans", [
                        ...draft.plans,
                        {
                          id: crypto.randomUUID(),
                          name: "学习会员",
                          days: 30,
                          priceYuan: 10,
                          credits: 100,
                          discount: 0.9,
                          enabled: false,
                        },
                      ])
                    }
                  >
                    添加会员计划
                  </button>
                }
              >
                {draft.plans.map((plan, index) => (
                  <WorkspaceSection
                    key={plan.id}
                    title={plan.name || "新会员计划"}
                  >
                    <div className="fp-workspace-grid">
                      {(
                        [
                          ["name", "计划名称"],
                          ["days", "有效天数"],
                          ["priceYuan", "价格（元）"],
                          ["credits", "附赠积分"],
                          ["discount", "对话价格系数"],
                        ] as const
                      ).map(([key, label]) => (
                        <WorkspaceField
                          key={key}
                          label={label}
                          numeric={key !== "name"}
                          value={plan[key]}
                          onChange={(v) =>
                            change(
                              "plans",
                              draft.plans.map((p, i) =>
                                i === index
                                  ? {
                                      ...p,
                                      [key]: key === "name" ? v : Number(v),
                                    }
                                  : p,
                              ),
                            )
                          }
                        />
                      ))}
                    </div>
                    <WorkspaceToggle
                      label={`上架 ${plan.name}`}
                      checked={plan.enabled}
                      onChange={(v) =>
                        change(
                          "plans",
                          draft.plans.map((p, i) =>
                            i === index ? { ...p, enabled: v } : p,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      className="fp-button fp-ghost"
                      onClick={() =>
                        change(
                          "plans",
                          draft.plans.filter((p) => p.id !== plan.id),
                        )
                      }
                    >
                      移除计划
                    </button>
                  </WorkspaceSection>
                ))}
                {!draft.plans.length && <p>添加会员计划，设置学习权益。</p>}
              </WorkspaceSection>
            )}
            {tab === "payment" && (
              <WorkspaceSection title="支付接入">
                <WorkspaceToggle
                  label="启用充值"
                  checked={draft.enabled}
                  onChange={(v) => change("enabled", v)}
                />
                <WorkspaceField
                  label="支付网关"
                  value={draft.gateway}
                  onChange={(v) => change("gateway", v)}
                />
                <div className="fp-workspace-grid">
                  <WorkspaceField
                    label="商户号"
                    value={draft.pid}
                    onChange={(v) => change("pid", v)}
                  />
                  <WorkspaceField
                    label="商户密钥"
                    secret
                    value={draft.secret}
                    hint="留空时保留已保存的密钥。"
                    onChange={(v) => change("secret", v)}
                  />
                </div>
              </WorkspaceSection>
            )}
            {tab === "models" && (
              <WorkspaceSection
                title="模型价格"
                description="价格单位：元 / 百万 Token。"
                actions={
                  onSyncPrices && (
                    <button
                      type="button"
                      className="fp-button fp-secondary"
                      onClick={() => sync()}
                    >
                      同步上游价格
                    </button>
                  )
                }
              >
                <WorkspaceField
                  label="搜索模型价格"
                  value={query}
                  onChange={setQuery}
                />
                <div className="fp-workspace-inline">
                  <WorkspaceField
                    label="新模型名称"
                    value={newModel}
                    onChange={setNewModel}
                  />
                  <button
                    type="button"
                    className="fp-button fp-secondary"
                    disabled={!newModel.trim()}
                    onClick={() => {
                      const name = newModel.trim();
                      if (draft.modelRates?.[name]) {
                        task.setError("模型名称已存在。");
                        return;
                      }
                      change("modelRates", {
                        ...draft.modelRates,
                        [name]: { input: 0, cachedInput: 0, output: 0 },
                      });
                      setNewModel("");
                    }}
                  >
                    添加模型
                  </button>
                </div>
                {Object.entries(draft.modelRates || {})
                  .filter(([name]) =>
                    name.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map(([name, rate]) => (
                    <WorkspaceSection
                      key={name}
                      title={name}
                      description={
                        draft.rateOverrides?.includes(name)
                          ? "使用手动价格"
                          : "使用上游价格"
                      }
                    >
                      <ModelRateName
                        name={name}
                        onRename={(nextName) => {
                          const next = nextName.trim();
                          if (
                            !next ||
                            (next !== name && draft.modelRates?.[next])
                          ) {
                            task.setError("请填写尚未使用的模型名称。");
                            return false;
                          }
                          const rates = { ...draft.modelRates, [next]: rate };
                          if (next !== name) delete rates[name];
                          setDraft({
                            ...draft,
                            modelRates: rates,
                            rateOverrides: draft.rateOverrides?.map((id) =>
                              id === name ? next : id,
                            ),
                          });
                          return true;
                        }}
                      />
                      <div className="fp-workspace-grid">
                        {(
                          [
                            ["input", "输入价格"],
                            ["cachedInput", "缓存命中价格"],
                            ["output", "输出价格"],
                          ] as const
                        ).map(([key, label]) => (
                          <WorkspaceField
                            key={key}
                            label={`${name} · ${label}`}
                            numeric
                            value={rate[key]}
                            onChange={(v) =>
                              setDraft({
                                ...draft,
                                modelRates: {
                                  ...draft.modelRates,
                                  [name]: { ...rate, [key]: Number(v) },
                                },
                                rateOverrides: [
                                  ...new Set([
                                    ...(draft.rateOverrides || []),
                                    name,
                                  ]),
                                ],
                              })
                            }
                          />
                        ))}
                      </div>
                      <div className="fp-workspace-actions">
                        {onSyncPrices && (
                          <button
                            type="button"
                            className="fp-button fp-secondary"
                            onClick={() => sync([name])}
                          >
                            恢复上游价格
                          </button>
                        )}
                        <button
                          type="button"
                          className="fp-button fp-ghost"
                          onClick={() => {
                            const next = { ...draft.modelRates };
                            delete next[name];
                            setDraft({
                              ...draft,
                              modelRates: next,
                              rateOverrides: draft.rateOverrides?.filter(
                                (n) => n !== name,
                              ),
                            });
                          }}
                        >
                          移除模型
                        </button>
                      </div>
                    </WorkspaceSection>
                  ))}
              </WorkspaceSection>
            )}
          </AnimatedSize>
        </fieldset>
      </WorkspaceSection>
    </section>
  );
}

function ModelRateName({
  name,
  onRename,
}: {
  name: string;
  onRename: (next: string) => boolean;
}) {
  const [editing, setEditing] = useState(false),
    [next, setNext] = useState(name);
  return editing ? (
    <div className="fp-workspace-inline">
      <WorkspaceField
        label={`${name} · 模型名称`}
        value={next}
        onChange={setNext}
      />
      <button
        type="button"
        className="fp-button fp-secondary"
        onClick={() => {
          if (onRename(next)) setEditing(false);
        }}
      >
        确认名称
      </button>
      <button
        type="button"
        className="fp-button fp-ghost"
        onClick={() => {
          setNext(name);
          setEditing(false);
        }}
      >
        取消
      </button>
    </div>
  ) : (
    <button
      type="button"
      className="fp-button fp-ghost"
      onClick={() => setEditing(true)}
    >
      修改模型名称
    </button>
  );
}
