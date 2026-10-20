import type { ReactNode } from "react";
export interface ShareMemberRowProps { name: string; detail?: string; avatar?: ReactNode; role: ReactNode; actions?: ReactNode; }
export function ShareMemberRow({ name, detail, avatar, role, actions }: ShareMemberRowProps) {
  return <div className="fp-share-member-row">
    <span className="fp-share-member-avatar" aria-hidden="true">{avatar || name.slice(0, 1)}</span>
    <span className="fp-share-member-identity"><strong>{name}</strong>{detail && <small>{detail}</small>}</span>
    <div className="fp-share-member-role">{role}</div>
    {actions && <div className="fp-share-member-actions">{actions}</div>}
  </div>;
}
