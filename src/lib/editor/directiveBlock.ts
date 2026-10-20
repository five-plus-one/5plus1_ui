import { Node, mergeAttributes } from "@tiptap/core";

type DirectiveToken = {
  type: "directiveBlock";
  raw: string;
  name: string;
  attributes: string;
  body: string;
};

function tokenizeDirective(src: string): DirectiveToken | undefined {
  const leaf = src.match(
    /^::(video|audio|interactive|figure|plot)\{([^\n}]*)\}[ \t]*(?:\r?\n|$)/,
  );
  if (leaf)
    return {
      type: "directiveBlock",
      raw: leaf[0],
      name: leaf[1],
      attributes: leaf[2] || "",
      body: "",
    };
  const header = src.match(/^:::([a-zA-Z][\w-]*)(?:\{([^\n}]*)\})?[ \t]*\r?\n/);
  if (!header) return;
  let depth = 1;
  let offset = header[0].length;
  while (offset <= src.length) {
    const nextBreak = src.indexOf("\n", offset);
    const end = nextBreak < 0 ? src.length : nextBreak + 1;
    const line = src.slice(offset, end).replace(/\r?\n$/, "");
    if (/^:::[a-zA-Z][\w-]*(?:\{[^\n}]*\})?[ \t]*$/.test(line)) depth += 1;
    if (/^:::[ \t]*$/.test(line)) {
      depth -= 1;
      if (depth === 0) {
        const body = src.slice(header[0].length, offset).replace(/\r?\n$/, "");
        return {
          type: "directiveBlock",
          raw: src.slice(0, end),
          name: header[1],
          attributes: header[2] || "",
          body,
        };
      }
    }
    if (nextBreak < 0) break;
    offset = end;
  }
}

export const DirectiveBlock = Node.create({
  name: "directiveBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      name: { default: "note" },
      attributes: { default: "" },
      body: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-directive-block]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-directive-block": "" }),
    ];
  },
  parseMarkdown(token, helpers) {
    const directive = token as DirectiveToken;
    return helpers.createNode("directiveBlock", {
      name: directive.name,
      attributes: directive.attributes,
      body: directive.body,
    });
  },
  renderMarkdown(node) {
    const attributes = String(node.attrs?.attributes || "").trim();
    const body = String(node.attrs?.body || "");
    const name = node.attrs?.name || "note";
    if (["video", "audio", "interactive", "figure", "plot"].includes(name))
      return `::${name}${attributes ? `{${attributes}}` : ""}`;
    return `:::${name}${attributes ? `{${attributes}}` : ""}\n${body}${body.endsWith("\n") ? "" : "\n"}:::`;
  },
  markdownTokenizer: {
    name: "directiveBlock",
    level: "block",
    start: (src: string) =>
      src.search(
        /^::(?:interactive|video|audio|figure|plot)\{[^\n}]*\}[ \t]*$|^:::[a-zA-Z][\w-]*(?:\{[^\n}]*\})?[ \t]*$/m,
      ),
    tokenize: (src: string) => tokenizeDirective(src),
  },
});

export const DIRECTIVE_CARD_TYPES = [
  ["definition", "定义"],
  ["theorem", "定理"],
  ["example", "例题"],
  ["insight", "直觉"],
  ["pitfall", "易错点"],
  ["note", "说明"],
  ["tip", "技巧"],
  ["memory", "记忆卡"],
  ["derivation", "推导"],
  ["timeline", "时间线"],
  ["event", "事件"],
  ["concept", "概念"],
  ["compare", "对比"],
  ["cause-effect", "因果"],
  ["keypoint", "核心要点"],
  ["interactive", "互动内容"],
  ["video", "视频"],
  ["figure", "图片"],
  ["plot", "函数图"],
  ["audio", "音频"],
  ["historymap", "历史地图"],
  ["learninganimation", "学习动画"],
  ["attachment", "附件"],
] as const;

export function directiveTitleAttribute(name: string) {
  if (name === "timeline") return "period";
  if (name === "concept") return "term";
  if (["event", "compare", "cause-effect"].includes(name)) return "title";
  return "label";
}

export function readDirectiveTitle(attributes: string, name: string) {
  const key = directiveTitleAttribute(name);
  for (const candidate of [key, "label", "title", "term", "period"]) {
    const match = attributes.match(
      new RegExp(`(?:^|\\s)${candidate}=(?:"([^"]*)"|'([^']*)'|([^\\s}]+))`),
    );
    if (match) return match[1] ?? match[2] ?? match[3] ?? "";
  }
  return "";
}

export function writeDirectiveTitle(
  attributes: string,
  name: string,
  title: string,
) {
  const key = directiveTitleAttribute(name);
  const cleaned = attributes
    .replace(
      /(?:^|\s)(?:label|title|period|term)=(?:"[^"]*"|'[^']*'|[^\s}]+)/g,
      "",
    )
    .trim();
  const escaped = title.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return [`${key}="${escaped}"`, cleaned].filter(Boolean).join(" ");
}
