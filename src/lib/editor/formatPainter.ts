import type { Editor } from "@tiptap/react";

export type FormatPainterMode = null | "once" | "locked";

const MARK_TYPES = ["bold", "italic", "strike", "code", "underline"] as const;
export type PainterMark = (typeof MARK_TYPES)[number];

/** 从当前选区抓取 marks；无选区时返回空数组。 */
export function captureMarks(editor: Editor): PainterMark[] {
  const { from, to, empty } = editor.state.selection;
  if (empty || from >= to) {
    // 光标处：用 stored marks / 当前激活状态
    return MARK_TYPES.filter(type => editor.isActive(type));
  }
  const marks = new Set<PainterMark>();
  editor.state.doc.nodesBetween(from, to, node => {
    if (!node.isText) return;
    for (const mark of node.marks) {
      if ((MARK_TYPES as readonly string[]).includes(mark.type.name)) {
        marks.add(mark.type.name as PainterMark);
      }
    }
  });
  return MARK_TYPES.filter(type => marks.has(type));
}

export function applyMarks(editor: Editor, marks: readonly PainterMark[], from: number, to: number) {
  if (from >= to) return false;
  const chain = editor.chain().focus().setTextSelection({ from, to });
  for (const type of MARK_TYPES) {
    if (marks.includes(type)) chain.setMark(type);
    else chain.unsetMark(type);
  }
  return chain.run();
}

export function toggleFormatPainterMode(mode: FormatPainterMode): FormatPainterMode {
  if (mode === null) return "once";
  if (mode === "once") return "locked";
  return null;
}
