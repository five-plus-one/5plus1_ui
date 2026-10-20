"use client";

import { CODE_BLOCK_LANGUAGES } from "./codeBlockLanguage";

export type CodeBlockLanguageSelectProps = {
  /** 当前语言；null / undefined / "" 表示无语言 */
  language?: string | null;
  /** 选择变化；选「无语言」时回调 null */
  onChange: (lang: string | null) => void;
  className?: string;
};

/**
 * 受控代码块语言下拉。可独立放进工具栏 / 浮动条，
 * 父组件用 languageFromNode 读节点、再把值写回 updateAttributes。
 */
export function CodeBlockLanguageSelect({ language, onChange, className }: CodeBlockLanguageSelectProps) {
  const current = language ?? "";
  return (
    <select
      className={["code-block-language-select", className].filter(Boolean).join(" ")}
      aria-label="代码块语言"
      value={current}
      onChange={(event) => {
        const next = event.target.value;
        onChange(next ? next : null);
      }}
    >
      <option value="">无语言</option>
      {CODE_BLOCK_LANGUAGES.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

export default CodeBlockLanguageSelect;
