import { Node, mergeAttributes } from "@tiptap/core";

type AttachmentToken = { type: "attachment"; raw: string; name: string; url: string; mediaType: string };

function readAttribute(source: string, name: string) {
  const match = source.match(new RegExp(`(?:^|\\s)${name}=(?:"([^"]*)"|'([^']*)'|([^\\s}]+))`));
  const value = match?.[1] ?? match?.[2] ?? match?.[3] ?? "";
  try { return decodeURIComponent(value); } catch { return value; }
}

function escapeAttribute(value: string) {
  return encodeURIComponent(value);
}

function tokenizeAttachment(src: string): AttachmentToken | undefined {
  const match = src.match(/^::attachment\{([^\n}]*)\}[ \t]*(?:\r?\n|$)/);
  if (!match) return;
  return {
    type: "attachment",
    raw: match[0],
    name: readAttribute(match[1], "name") || "附件",
    url: readAttribute(match[1], "url"),
    mediaType: readAttribute(match[1], "mediaType") || "application/octet-stream",
  };
}

export const Attachment = Node.create({
  name: "attachment",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      name: { default: "附件" },
      url: { default: "" },
      mediaType: { default: "application/octet-stream" },
    };
  },
  parseHTML() {
    return [{
      tag: "figure[data-note-attachment]",
      getAttrs: element => {
        const host = element as HTMLElement;
        return {
          name: host.dataset.name || "附件",
          url: host.dataset.url || "",
          mediaType: host.dataset.mediaType || "application/octet-stream",
        };
      },
    }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["figure", mergeAttributes(HTMLAttributes, {
      "data-note-attachment": "",
      "data-name": HTMLAttributes.name,
      "data-url": HTMLAttributes.url,
      "data-media-type": HTMLAttributes.mediaType,
    }), ["a", { href: HTMLAttributes.url, target: "_blank", rel: "noreferrer" }, HTMLAttributes.name || "附件"]];
  },
  renderMarkdown(node) {
    const name = escapeAttribute(String(node.attrs?.name || "附件"));
    const url = escapeAttribute(String(node.attrs?.url || ""));
    const mediaType = escapeAttribute(String(node.attrs?.mediaType || "application/octet-stream"));
    return `::attachment{name="${name}" url="${url}" mediaType="${mediaType}"}\n\n`;
  },
  parseMarkdown(token, helpers) {
    const attachment = token as AttachmentToken;
    return helpers.createNode("attachment", { name: attachment.name, url: attachment.url, mediaType: attachment.mediaType });
  },
  markdownTokenizer: {
    name: "attachment",
    level: "block",
    start: (src: string) => src.search(/^::attachment\{[^\n}]*\}[ \t]*$/m),
    tokenize: (src: string) => tokenizeAttachment(src),
  },
});
