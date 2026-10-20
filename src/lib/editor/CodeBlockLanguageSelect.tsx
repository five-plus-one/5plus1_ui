"use client";

import { SelectField } from "../SelectField";
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
  return <SelectField label="代码块语言" className={className} value={current} onChange={value => onChange(value || null)} options={[{value:'',label:'无语言'},...CODE_BLOCK_LANGUAGES]} />;
}

export default CodeBlockLanguageSelect;
