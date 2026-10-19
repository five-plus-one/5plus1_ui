import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Extensions, JSONContent, Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import Placeholder from "@tiptap/extension-placeholder";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading2,
  Cloud,
  CloudOff,
} from "lucide-react";
import { IconButton, Badge } from "../index";
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
export function CollaborativeEditor({
  document,
  provider,
  user,
  content,
  editable = true,
  onChange,
  onReady,
  extensions = [],
  baseExtensions,
  status = "local",
}: {
  document?: Y.Doc;
  provider?: HocuspocusProvider;
  user: CollaborationUser;
  content?: JSONContent | string;
  editable?: boolean;
  onChange?: (json: JSONContent) => void;
  onReady?: (editor: Editor) => void;
  extensions?: Extensions;
  baseExtensions?: Extensions;
  status?: string;
}) {
  let editor = useEditor(
    {
      extensions: [
        ...(baseExtensions || [
          StarterKit.configure({ undoRedo: document ? false : undefined }),
        ]),
        Placeholder.configure({ placeholder: "从一个想法开始，写下你的理解…" }),
        ...(document ? [Collaboration.configure({ document })] : []),
        ...(provider
          ? [
              CollaborationCaret.configure({
                provider,
                user: { name: user.name, color: user.color },
              }),
            ]
          : []),
        ...extensions,
      ],
      content: document ? undefined : content,
      editable,
      immediatelyRender: false,
      onCreate: ({ editor }) => onReady?.(editor),
      onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
    },
    [document, provider],
  );
  let [, refresh] = useState(0);
  useEffect(() => {
    if (!editor) return;
    let f = () => refresh((v) => v + 1);
    editor.on("selectionUpdate", f);
    editor.on("transaction", f);
    return () => {
      editor.off("selectionUpdate", f);
      editor.off("transaction", f);
    };
  }, [editor]);
  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);
  let controls = editor
    ? [
        {
          label: "二级标题",
          icon: <Heading2 size={16} />,
          active: editor.isActive("heading", { level: 2 }),
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          label: "粗体",
          icon: <Bold size={16} />,
          active: editor.isActive("bold"),
          action: () => editor.chain().focus().toggleBold().run(),
        },
        {
          label: "斜体",
          icon: <Italic size={16} />,
          active: editor.isActive("italic"),
          action: () => editor.chain().focus().toggleItalic().run(),
        },
        {
          label: "无序列表",
          icon: <List size={16} />,
          active: editor.isActive("bulletList"),
          action: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          label: "有序列表",
          icon: <ListOrdered size={16} />,
          active: editor.isActive("orderedList"),
          action: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
          label: "引用",
          icon: <Quote size={16} />,
          active: editor.isActive("blockquote"),
          action: () => editor.chain().focus().toggleBlockquote().run(),
        },
      ]
    : [];
  return (
    <section className="fp-collab-editor">
      <header className="fp-editor-toolbar">
        <div role="group" aria-label="文本格式">
          {controls.map((c) => (
            <IconButton
              label={c.label}
              key={c.label}
              aria-pressed={c.active}
              disabled={!editable}
              onClick={c.action}
            >
              {c.icon}
            </IconButton>
          ))}
        </div>
        <Badge
          tone={
            status === "unauthorized"
              ? "error"
              : status === "disconnected"
                ? "warning"
                : "accent"
          }
        >
          {status === "local"
            ? "本地编辑"
            : status === "connected"
              ? "已连接"
              : status === "unauthorized"
                ? "需要重新登录"
                : status === "disconnected"
                  ? "等待重新连接"
                  : "正在连接"}
        </Badge>
      </header>
      <EditorContent editor={editor} className="fp-editor-content" />
      <footer>
        <span style={{ color: user.color }}>●</span>
        {user.name}
        <span>{editable ? "可以编辑" : "只读"}</span>
      </footer>
    </section>
  );
}
