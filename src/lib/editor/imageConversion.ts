import { Node } from "@tiptap/core";

export const ImageConversion = Node.create({
  name: "imageConversion", group: "block", atom: true, selectable: true,
  addAttributes() {
    return Object.fromEntries(["src", "alt", "jobId", "markdown", "error"].map(key => [key, { default: "" }]));
  },
  parseHTML() { return [{ tag: "figure[data-image-conversion]" }]; },
  renderHTML({ node }) { return ["figure", { "data-image-conversion": "" }, ["img", { src: node.attrs.src, alt: node.attrs.alt }]]; },
  renderMarkdown(node) { return `![${String(node.attrs?.alt || "图片").replace(/[\[\]]/g, "")}](${node.attrs?.src || ""})`; },
});
