import { useEffect, useState } from "react";
import type { JSONContent } from '@tiptap/core';
import { MarkdownEditor, type MarkdownEditorProps } from '../editor/MarkdownEditor';
import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
export { Y };
export type CollaborationUser = { id: string; name: string; color: string };
export function useCollaboration({
  url,
  room,
  token,
  user,
  enabled = true,
}: {
  url: string;
  room: string;
  token: string | (() => Promise<string>);
  user: CollaborationUser;
  enabled?: boolean;
}) {
  let [session, setSession] = useState<{
    document: Y.Doc;
    provider: HocuspocusProvider;
  } | null>(null);
  let [status, setStatus] = useState("connecting");
  useEffect(() => {
    if (!enabled) return;
    let document = new Y.Doc();
    let provider = new HocuspocusProvider({
      url,
      name: room,
      document,
      token,
      onStatus: ({ status: s }) => setStatus(s),
      onAuthenticationFailed: () => setStatus("unauthorized"),
    });
    provider.setAwarenessField("user", user);
    setSession({ document, provider });
    return () => {
      setSession(null);
      provider.destroy();
      document.destroy();
    };
  }, [url, room, token, enabled, user.id, user.name, user.color]);
  return { session, status };
}
export type CollaborativeEditorProps = Omit<MarkdownEditorProps, 'onChange' | 'status'> & {
  user: CollaborationUser;
  status?: string;
  onChange?: (json: JSONContent) => void;
  onMarkdownChange?: (markdown: string) => void;
};
export function CollaborativeEditor({user,status='local',onChange,onMarkdownChange,...props}:CollaborativeEditorProps) {
 const label=status==='local'?'本地编辑':status==='connected'?'已连接':status==='unauthorized'?'需要重新登录':status==='disconnected'?'等待重新连接':'正在连接';
 return <section className="fp-collab-editor"><header className="fp-collab-presence"><span style={{color:user.color}}>●</span><span>{user.name}</span><span>{props.editable===false?'只读':'可以编辑'}</span><span role="status">{label}</span></header>
 <MarkdownEditor {...props} user={user} onChange={(markdown,json)=>{onChange?.(json);onMarkdownChange?.(markdown);}} />
 </section>;
}
