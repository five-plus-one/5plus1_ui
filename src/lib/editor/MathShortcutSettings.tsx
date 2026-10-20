"use client";
import { useState } from "react";
import { mathStorage as localStorage } from "./mathPreferences";
import { defaultMathShortcuts, shortcutStorageKey, validateShortcuts, type MathShortcut } from "./mathShortcuts";
export default function MathShortcutSettings({ rules, onSave, onClose }: { rules: MathShortcut[]; onSave: (rules: MathShortcut[]) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(rules.map(rule => ({ ...rule })));
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const change = (index: number, patch: Partial<MathShortcut>) => { setDraft(value => value.map((rule, i) => i === index ? { ...rule, ...patch } : rule)); setError(""); };
  return <section className="math-shortcut-settings" aria-label="公式快捷输入设置">
    <div className="math-shortcut-heading"><strong>快捷输入</strong><input aria-label="查找快捷规则" placeholder="查找触发词或命令" value={filter} onChange={e => setFilter(e.target.value)}/><button type="button" onClick={() => { setDraft(defaultMathShortcuts.map(r => ({ ...r }))); setError(""); }}>恢复默认</button></div>
    <p>触屏可使用数学键盘；使用实体键盘时，在公式中输入 @a 得到 α；sum 后按 Tab 展开求和。mat3x4 后按 Tab 插入矩阵。Tab / Shift+Tab 切换占位框。</p>
    <div className="math-shortcut-list">{draft.map((rule, index) => !`${rule.trigger} ${rule.replacement}`.toLowerCase().includes(filter.toLowerCase()) ? null : <div key={index} className="math-shortcut-row">
      <input type="checkbox" aria-label={`启用规则 ${index + 1}`} checked={rule.enabled} onChange={e => change(index, { enabled: e.target.checked })}/>
      <input aria-label={`触发词 ${index + 1}`} value={rule.trigger} onChange={e => change(index, { trigger: e.target.value })}/>
      <input aria-label={`替换公式 ${index + 1}`} readOnly={rule.kind === "matrix"} value={rule.kind === "matrix" ? "接行数 x 列数，例如 3x4（1–10）" : rule.replacement} onChange={e => change(index, { replacement: e.target.value })}/>
      <select aria-label={`触发方式 ${index + 1}`} disabled={rule.kind === "matrix"} value={rule.mode} onChange={e => change(index, { mode: e.target.value as MathShortcut["mode"] })}><option value="auto">自动</option><option value="tab">Tab</option></select>
      <button type="button" aria-label={`删除规则 ${index + 1}`} onClick={() => setDraft(value => value.filter((_, i) => i !== index))}>×</button>
    </div>)}</div>
    {error && <p role="alert">{error}</p>}
    <div className="math-shortcut-actions"><button type="button" onClick={() => { setFilter(""); setDraft(value => [...value, { trigger: "", replacement: "", mode: "tab", enabled: true }]); }}>添加规则</button><button type="button" onClick={() => setDraft(value => value.map(rule => ({ ...rule, enabled: false })))}>全部停用</button><span/><button type="button" onClick={onClose}>取消</button><button type="button" onClick={() => { const problem = validateShortcuts(draft); if (problem) { setError(problem); return; } try { localStorage.setItem(shortcutStorageKey, JSON.stringify(draft)); } catch { setError("浏览器无法保存设置，请检查存储权限。"); return; } onSave(draft); onClose(); }}>保存规则</button></div>
  </section>;
}
