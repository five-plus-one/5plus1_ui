import { useId, useRef, useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { SelectField } from './SelectField';

export interface AccessMember { id: string; name: string; detail?: string; role: string; editable?: boolean }
export interface AccessRole { value: string; label: string; description?: string }
export interface MemberAccessProps {
  members: AccessMember[];
  roles: AccessRole[];
  canManage?: boolean;
  busyIds?: string[];
  onRoleChange?: (memberId: string, role: string) => void;
  onRemove?: (memberId: string) => void;
  onInvite?: (address: string, role: string) => Promise<void> | void;
  defaultInviteRole?: string;
  error?: string;
}
/** Controlled access view. The host authorizes every role change, removal and invitation. */
export function MemberAccess({ members, roles, canManage = false, busyIds = [], onRoleChange, onRemove, onInvite, defaultInviteRole, error }: MemberAccessProps) {
  const [address, setAddress] = useState(''), [role, setRole] = useState(defaultInviteRole || roles[0]?.value || ''), [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [inviteError, setInviteError] = useState('');
  const guard = useRef(false), id = useId();
  return <section className="fp-member-access" aria-label="成员与访问权限">
    <ul className="fp-access-members">{members.map(member => <li key={member.id}>
      <span className="fp-access-avatar" aria-hidden="true">{member.name.slice(0, 1)}</span>
      <span className="fp-access-identity"><strong>{member.name}</strong>{member.detail && <small>{member.detail}</small>}</span>
      {canManage && member.editable !== false && onRoleChange ? <SelectField label={`${member.name}的权限`} value={member.role} disabled={busyIds.includes(member.id)} onChange={value => onRoleChange(member.id, value)} options={roles} /> : <span className="fp-access-role">{roles.find(option => option.value === member.role)?.label || member.role}</span>}
      {canManage && member.editable !== false && onRemove && <button type="button" className="fp-access-remove" aria-label={`移除${member.name}`} disabled={busyIds.includes(member.id)} onClick={() => onRemove(member.id)}><X size={15} /></button>}
    </li>)}</ul>
    {!members.length && <p className="fp-access-help">还没有其他成员。</p>}
    {canManage && onInvite && <form className="fp-access-invite" onSubmit={async event => {
      event.preventDefault(); if (guard.current || !address.trim() || !role) return;
      guard.current = true; setBusy(true); setMessage(''); setInviteError('');
      try { await onInvite(address.trim(), role); setAddress(''); setMessage('邀请已发送'); }
      catch (cause) { setInviteError(cause instanceof Error ? cause.message : '邀请未能发送，请重试'); }
      finally { guard.current = false; setBusy(false); }
    }}>
      <label htmlFor={id}>邀请成员</label><div className="fp-access-invite-fields"><input id={id} type="email" required placeholder="输入邮箱地址" value={address} disabled={busy} onChange={event => setAddress(event.target.value)} />
        <SelectField label="邀请权限" value={role} disabled={busy} onChange={setRole} options={roles} />
        <button type="submit" disabled={busy || !address.trim() || !role}><UserPlus size={15} aria-hidden="true" />{busy ? '正在邀请…' : '邀请'}</button></div>
      {roles.find(option => option.value === role)?.description && <p className="fp-access-help">{roles.find(option => option.value === role)?.description}</p>}
      {message && <p className="fp-access-help" role="status">{message}</p>}
    </form>}
    {(error || inviteError) && <p className="fp-error-text" role="alert">{error || inviteError}</p>}
  </section>;
}
