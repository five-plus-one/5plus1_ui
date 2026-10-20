import type { Editor } from '@tiptap/core';
export function insertMermaidCard(editor: Editor) {
  return editor.chain().focus().insertContent({ type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: 'flowchart LR\n  A[开始] --> B[理解] --> C[应用]' }] }).run();
}
