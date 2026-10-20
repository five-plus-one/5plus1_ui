import { ImageConversion } from "./imageConversion";
import { UploadPlaceholder } from "./uploadPlaceholder";
import { normalizeImageBlocks } from "./normalizeImageBlocks";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Mathematics } from "@tiptap/extension-mathematics";
import { TableKit } from "@tiptap/extension-table";
import { Markdown, MarkdownManager } from "@tiptap/markdown";
import { DirectiveBlock } from "./directiveBlock";
import type { Extensions } from "@tiptap/core";
import { ResizableImage } from "./resizableImage";
import UniqueID from "@tiptap/extension-unique-id";
import { Attachment } from "./attachment";
import { normalizeObsidianCallouts } from "./normalizeObsidianCallouts";
import { normalizeObsidianInlineStyles } from "./normalizeObsidianInlineStyles";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { noteLowlight } from "./codeBlockLowlight";
import { HashtagHighlight } from "./hashtagHighlight";

export const NOTE_ELEMENT_TYPES = [
  "paragraph", "heading", "blockquote", "codeBlock", "bulletList", "orderedList",
  "table", "horizontalRule", "image", "attachment", "blockMath", "directiveBlock",
];

export const NOTE_SCHEMA_VERSION = 2;

export function baseEditorExtensions(history = true, math?: {
  onInlineClick?: (latex: string, position: number) => void;
  onBlockClick?: (latex: string, position: number) => void;
}, directiveExtension = DirectiveBlock, mathExtensions?: Extensions, attachmentExtension = Attachment, codeExtension = CodeBlockLowlight.configure({ lowlight: noteLowlight })) {
  return [
    StarterKit.configure({
      undoRedo: history ? undefined : false,
      link: false,
      codeBlock: false,
    }),
    Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    codeExtension,
    ResizableImage.configure({ allowBase64: false, inline: false }),
    attachmentExtension,
    ImageConversion,
    UploadPlaceholder,
    TableKit.configure({ table: { resizable: true } }),
    UniqueID.configure({ types: NOTE_ELEMENT_TYPES }),
    directiveExtension,
    ...(mathExtensions || [Mathematics.configure({
      katexOptions: { throwOnError: false },
      inlineOptions: { onClick: (node, position) => math?.onInlineClick?.(String(node.attrs.latex || ""), position) },
      blockOptions: { onClick: (node, position) => math?.onBlockClick?.(String(node.attrs.latex || ""), position) },
    })]),
    Markdown.configure({ markedOptions: { gfm: true, breaks: false } }),
    HashtagHighlight,
  ];
}

export function markdownToDocument(markdown: string) {
  // Obsidian 内联样式 == / font color / span background 先归一，再 callout，再进 TipTap
  return normalizeImageBlocks(new MarkdownManager({ extensions: baseEditorExtensions(false) }).parse(
    normalizeObsidianCallouts(normalizeObsidianInlineStyles(markdown)),
  ));
}

export function documentToMarkdown(document: Parameters<MarkdownManager["serialize"]>[0]) {
  return new MarkdownManager({ extensions: baseEditorExtensions(false) }).serialize(document);
}
