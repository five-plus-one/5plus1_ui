/** 代码块语言选项：下拉列表 + 从节点读语言的纯函数。 */

export type CodeBlockLanguageOption = {
  /** 展示名，例如 JavaScript */
  label: string;
  /** 写入 codeBlock.attrs.language / Markdown fence 的值 */
  value: string;
};

/** 工具栏/浮动条常用语言列表（顺序稳定，勿随意重排）。 */
export const CODE_BLOCK_LANGUAGES: readonly CodeBlockLanguageOption[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "markdown", label: "Markdown" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
  { value: "mermaid", label: "Mermaid" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
] as const;

/** 「无语言」时 attrs.language 的规范值。 */
export function emptyLanguage(): null {
  return null;
}

/**
 * 从 ProseMirror 节点（或任意带 attrs.language 的对象）读出语言。
 * 空串 / 空白 / 非字符串一律归一为 null。
 */
export function languageFromNode(node: unknown): string | null {
  if (!node || typeof node !== "object") return emptyLanguage();
  const attrs = (node as { attrs?: { language?: unknown } }).attrs;
  const language = attrs?.language;
  if (typeof language !== "string") return emptyLanguage();
  const trimmed = language.trim();
  return trimmed ? trimmed : emptyLanguage();
}

/** 判断某语言值是否在常用列表中（下拉受控时用于保留未知语言）。 */
export function isKnownLanguage(value: string | null | undefined): boolean {
  if (!value) return false;
  return CODE_BLOCK_LANGUAGES.some((item) => item.value === value);
}
