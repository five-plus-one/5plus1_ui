import { useState } from "react";
import {
  UserProfileEditor,
  CapacityEditor,
  AdministratorAccess,
  type DirectoryUser,
  type DirectoryGroup,
} from "./DirectoryWorkspace";
import { CreditAdjustment } from "./AccountViews";
import {
  SettingsTabs,
  WorkspaceSection,
  WorkspaceFeedback,
} from "./WorkspaceForms";
import { AnimatedSize } from "./AnimatedSize";
export interface UserDetailsWorkspaceProps {
  user: DirectoryUser;
  groups: DirectoryGroup[];
  existing?: boolean;
  protectedUser?: boolean;
  storage?: { used: number; capacity: number };
  credits?: number;
  administrator?: boolean;
  loading?: boolean;
  error?: string;
  onSaveProfile: (user: DirectoryUser) => Promise<void> | void;
  onSaveCapacity?: (
    gigabytes: number,
    expectedBytes: number,
  ) => Promise<void> | void;
  onAdjustCredits?: (amount: number, reason: string) => Promise<void> | void;
  onSaveAdministrator?: (enabled: boolean) => Promise<void> | void;
  onRetry?: () => void;
}
export function UserDetailsWorkspace(props: UserDetailsWorkspaceProps) {
  return <UserDetailsSession key={props.user.sub || "new"} {...props} />;
}
function UserDetailsSession({
  user,
  groups,
  existing = true,
  protectedUser,
  storage,
  credits,
  administrator,
  loading,
  error,
  onSaveProfile,
  onSaveCapacity,
  onAdjustCredits,
  onSaveAdministrator,
  onRetry,
}: UserDetailsWorkspaceProps) {
  const [tab, setTab] = useState("profile");
  return (
    <section className="fp-workspace-form">
      <WorkspaceSection title={user.name || "添加用户"}>
        <SettingsTabs
          label="用户详情"
          value={tab}
          onChange={setTab}
          items={[
            { id: "profile", label: "资料" },
            ...(existing
              ? [
                  { id: "storage", label: "存储" },
                  { id: "credits", label: "积分" },
                  { id: "access", label: "平台权限" },
                ]
              : []),
          ]}
        />
        <WorkspaceFeedback error={error} />
        {error && onRetry && (
          <button
            type="button"
            className="fp-button fp-secondary"
            onClick={onRetry}
          >
            重试
          </button>
        )}
        <AnimatedSize>
          <div hidden={tab !== "profile"}>
            <UserProfileEditor
              user={user}
              existing={existing}
              protectedUser={protectedUser}
              onSave={onSaveProfile}
            />
            <WorkspaceSection title="所在用户组">
              <p>
                {groups
                  .filter((group) => group.members.includes(user.sub))
                  .map((group) => group.name)
                  .join("、") || "尚未加入用户组"}
              </p>
            </WorkspaceSection>
          </div>
          <div hidden={tab !== "storage"}>
            {storage && onSaveCapacity ? (
              <CapacityEditor
                usedBytes={storage.used}
                capacityBytes={storage.capacity}
                onSave={onSaveCapacity}
              />
            ) : (
              <p role="status">
                {loading ? "正在读取存储信息…" : "存储信息暂不可用。"}
              </p>
            )}
          </div>
          <div hidden={tab !== "credits"}>
            {credits !== undefined && onAdjustCredits ? (
              <CreditAdjustment
                name={user.name}
                balance={credits}
                onSubmit={onAdjustCredits}
              />
            ) : (
              <p role="status">
                {loading ? "正在读取积分…" : "积分信息暂不可用。"}
              </p>
            )}
          </div>
          <div hidden={tab !== "access"}>
            {administrator !== undefined && onSaveAdministrator ? (
              <AdministratorAccess
                name={user.name}
                enabled={administrator}
                protectedUser={protectedUser}
                onSave={onSaveAdministrator}
              />
            ) : (
              <p role="status">
                {loading ? "正在读取管理权限…" : "管理权限暂不可用。"}
              </p>
            )}
          </div>
        </AnimatedSize>
      </WorkspaceSection>
    </section>
  );
}
