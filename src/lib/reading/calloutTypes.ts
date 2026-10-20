export const CALLOUT_TYPES = [
  "definition",
  "theorem",
  "example",
  "insight",
  "pitfall",
  "note",
  "tip",
  "memory",
] as const;

export type CalloutType = (typeof CALLOUT_TYPES)[number];

export const CALLOUTS = new Set<string>(CALLOUT_TYPES);

const DIRECTIVE_ALIASES: Record<string, string> = {
  intuition: "insight", technique: "tip", comparison: "compare",
  summary: "keypoint", question: "note", task: "note",
};

export function canonicalDirectiveName(name: string) {
  return DIRECTIVE_ALIASES[name] ?? name;
}

export const CALLOUT_META: Record<string, { label: string; cls: string }> = {
  definition: { label: "定义", cls: "callout-definition" },
  theorem: { label: "定理", cls: "callout-theorem" },
  example: { label: "例", cls: "callout-example" },
  insight: { label: "直觉", cls: "callout-insight" },
  pitfall: { label: "易错点", cls: "callout-pitfall" },
  note: { label: "注", cls: "callout-note" },
  tip: { label: "提示", cls: "callout-tip" },
  memory: { label: "记忆卡", cls: "callout-memory" },
};

/**
 * Obsidian callout 类型 → 本项目 callout kind。
 * null 表示「不转 callout」（保持普通 blockquote）。
 * 未列出的未知类型在 resolveObsidianCallout 中回退为 note。
 */
export const OBSIDIAN_CALLOUT_ALIASES: Record<string, CalloutType | null> = {
  note: "note",
  info: "note",
  todo: "note",
  question: "note",
  help: "note",
  faq: "note",
  tip: "tip",
  hint: "tip",
  important: "tip",
  success: "tip",
  check: "tip",
  done: "tip",
  warning: "pitfall",
  caution: "pitfall",
  attention: "pitfall",
  danger: "pitfall",
  error: "pitfall",
  failure: "pitfall",
  fail: "pitfall",
  bug: "pitfall",
  example: "example",
  abstract: "insight",
  summary: "insight",
  tldr: "insight",
  definition: "definition",
  theorem: "theorem",
  quote: null,
  cite: null,
};

/** 把 Obsidian callout 类型解析为本项目 kind；未知类型回退 note。 */
export function resolveObsidianCallout(type: string): CalloutType {
  const key = type.toLowerCase();
  if (key in OBSIDIAN_CALLOUT_ALIASES) {
    return OBSIDIAN_CALLOUT_ALIASES[key] ?? "note";
  }
  return "note";
}

/** quote/cite 等明确不转 callout 的类型。 */
export function isSkippedObsidianCallout(type: string): boolean {
  const key = type.toLowerCase();
  return key in OBSIDIAN_CALLOUT_ALIASES && OBSIDIAN_CALLOUT_ALIASES[key] === null;
}
