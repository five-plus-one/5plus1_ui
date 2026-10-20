import { Node, mergeAttributes } from "@tiptap/core";
import type { Editor, JSONContent } from "@tiptap/core";

export function appendUploadPlaceholder(editor: Editor, placeholder: JSONContent) {
  const insertionPoint = editor.state.selection.to;
  return editor.chain().focus().insertContentAt(insertionPoint, [placeholder, { type: "paragraph" }]).run();
}

const escapeAttribute = (value: unknown) => String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const UploadPlaceholder = Node.create({
  name: "uploadPlaceholder",
  group: "block",
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      uploadId: { default: "" },
      name: { default: "附件" },
      mediaType: { default: "application/octet-stream" },
      error: { default: "" },
      convert: { default: false, parseHTML: element => element.getAttribute("convert") === "true" },
    };
  },
  parseHTML() { return [{ tag: "div[data-upload-placeholder]" }]; },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-upload-placeholder": "" }), `正在上传 ${HTMLAttributes.name || "附件"}`];
  },
  renderMarkdown(node) {
    const attrs = node.attrs || {};
    return `<div data-upload-placeholder="" uploadid="${escapeAttribute(attrs.uploadId)}" name="${escapeAttribute(attrs.name)}" mediatype="${escapeAttribute(attrs.mediaType)}" error="${escapeAttribute(attrs.error)}" convert="${attrs.convert === true ? "true" : "false"}">正在上传 ${escapeAttribute(attrs.name || "附件")}</div>\n\n`;
  },
});
