import { useRef, useState, type ReactNode } from "react";
import {
  MemberSearch,
  type MemberSearchProps,
  type MemberSearchResult,
  type MemberSearchKind,
} from "./MemberSearch";
import { MemberAccess, type MemberAccessProps } from "./MemberAccess";
import { ShareLink, type ShareLinkProps } from "./ShareLink";
import { ModelSelector, type ModelGroup } from "./ModelSelector";
import { SelectField, type SelectOption } from "./SelectField";
import { Switch, SegmentedControl } from "./index";
import {
  ResourceExplorer,
  type ResourceExplorerProps,
} from "./ResourceExplorer";
import { AnimatedSize } from "./AnimatedSize";
export interface ShareAccessPanelProps {
  title?: string;
  access: MemberAccessProps;
  search: Omit<MemberSearchProps, "onPick" | "excludedIds" | "disabled">;
  onAddMember: (
    member: MemberSearchResult,
    kind: MemberSearchKind,
  ) => Promise<void> | void;
  link: ShareLinkProps;
  permissionSummary?: ReactNode;
}
export function ShareAccessPanel({
  title = "分享与协作",
  access,
  search,
  onAddMember,
  link,
  permissionSummary,
}: ShareAccessPanelProps) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const guard = useRef(false);
  return (
    <section className="fp-share-access-panel" aria-busy={busy}>
      <h3>{title}</h3>
      {permissionSummary}
      {access.canManage && (
        <MemberSearch
          {...search}
          disabled={busy}
          excludedIds={access.members.map((member) => member.id)}
          onPick={(member, kind) => {
            if (guard.current) return;
            guard.current = true;
            setBusy(true);
            setError("");
            void Promise.resolve()
              .then(() => onAddMember(member, kind))
              .catch((cause) =>
                setError(
                  cause instanceof Error
                    ? cause.message
                    : "暂时无法添加成员，请重试。",
                ),
              )
              .finally(() => {
                guard.current = false;
                setBusy(false);
              });
          }}
        />
      )}
      {error && (
        <p role="alert" className="fp-error-text">
          {error}
        </p>
      )}
      <MemberAccess {...access} />
      <ShareLink {...link} disabled={link.disabled || !access.canManage} />
    </section>
  );
}
export interface ChatPreferencesPanelProps {
  models: ModelGroup[];
  modelId: string;
  onModelChange: (id: string) => void;
  thinking: string;
  thinkingOptions: SelectOption[];
  onThinkingChange: (value: string) => void;
  webEnabled: boolean;
  onWebChange: (value: boolean) => void;
  disabled?: boolean;
  quota?: ReactNode;
  children?: ReactNode;
}
export function ChatPreferencesPanel({
  models,
  modelId,
  onModelChange,
  thinking,
  thinkingOptions,
  onThinkingChange,
  webEnabled,
  onWebChange,
  disabled,
  quota,
  children,
}: ChatPreferencesPanelProps) {
  return (
    <section className="fp-pattern-panel">
      <h3>对话设置</h3>
      <div className="fp-chat-preferences">
        <label>
          使用模型
          <ModelSelector
            groups={models}
            value={modelId}
            onChange={onModelChange}
            disabled={disabled}
          />
        </label>
        <label>
          思考方式
          <SelectField
            label="思考方式"
            value={thinking}
            options={thinkingOptions}
            onChange={onThinkingChange}
            disabled={disabled}
          />
        </label>
        <Switch
          label="联网查找资料"
          checked={webEnabled}
          onChange={onWebChange}
          disabled={disabled}
        />
        {quota}
        {children}
      </div>
    </section>
  );
}
export function ResourceWorkspace({
  explorer,
  preview,
  previewTitle = "资料预览",
  actions,
}: {
  explorer: ResourceExplorerProps;
  preview: ReactNode;
  previewTitle?: string;
  actions?: ReactNode;
}) {
  const [pane, setPane] = useState("files");
  return (
    <section className="fp-resource-workspace">
      <div className="fp-resource-mobile-switch">
        <SegmentedControl
          value={pane}
          onChange={setPane}
          items={[
            { value: "files", label: "文件" },
            { value: "preview", label: previewTitle },
          ]}
        />
      </div>
      <div className="fp-resource-workspace-panes" data-pane={pane}>
        <aside>
          <ResourceExplorer
            {...explorer}
            onOpen={(item) => {
              explorer.onOpen(item);
              setPane("preview");
            }}
          />
        </aside>
        <section aria-label={previewTitle}>
          <header>
            <h3>{previewTitle}</h3>
            {actions}
          </header>
          <AnimatedSize>{preview}</AnimatedSize>
        </section>
      </div>
    </section>
  );
}
