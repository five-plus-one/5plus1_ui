import type { ReactNode } from "react";
import type { Editor } from "@tiptap/core";
import { EditorContent } from "@tiptap/react";
import { EditorContextMenu } from "./EditorContextMenu";

export interface MarkdownEditorSurfaceProps {
  editor: Editor | null;
  toolbar?: ReactNode;
  children?: ReactNode;
  className?: string;
  contextMenu?: boolean;
}
/** A shared editing surface for applications that own document sessions and persistence. */
export function MarkdownEditorSurface({ editor, toolbar, children, className = "", contextMenu = true }: MarkdownEditorSurfaceProps) {
  const content = <EditorContent editor={editor}/>;
  return <section className={`fp-markdown-editor fp-markdown-editor-surface ${className}`} data-readonly={editor && !editor.isEditable || undefined}>
    {toolbar}{contextMenu ? <EditorContextMenu editor={editor}>{content}</EditorContextMenu> : content}{children}
  </section>;
}
