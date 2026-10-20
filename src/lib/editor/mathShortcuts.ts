import type { MathfieldElement } from "mathlive";
import { matrixTemplate } from "./mathKeyboard";
import { mathStorage as localStorage } from "./mathPreferences";
export type MathShortcut = { trigger: string; replacement: string; mode: "auto" | "tab"; enabled: boolean; kind?: "matrix" };
export const shortcutStorageKey = "fp.math.shortcuts.v1";
const greek: Record<string, string> = { a:"alpha", b:"beta", g:"gamma", d:"delta", e:"epsilon", z:"zeta", h:"eta", t:"theta", i:"iota", k:"kappa", l:"lambda", m:"mu", n:"nu", x:"xi", p:"pi", r:"rho", s:"sigma", u:"upsilon", f:"phi", c:"chi", j:"psi", o:"omega", G:"Gamma", D:"Delta", T:"Theta", L:"Lambda", X:"Xi", P:"Pi", S:"Sigma", U:"Upsilon", F:"Phi", J:"Psi", O:"Omega" };
export const defaultMathShortcuts: MathShortcut[] = [
  { trigger: "mat", replacement: "\\begin{pmatrix}#?\\end{pmatrix}", mode: "tab", enabled: true, kind: "matrix" },
  ...Object.entries(greek).map(([trigger, name]) => ({ trigger: `@${trigger}`, replacement: `\\${name}`, mode: "auto" as const, enabled: true })),
  { trigger: "//", replacement: "\\frac{#?}{#?}", mode: "auto", enabled: true },
  ...[["sum", "\\sum_{#?}^{#?}#?"], ["lim", "\\lim_{#?\\to #?}#?"], ["sqrt", "\\sqrt{#?}"], ["int", "\\int_{#?}^{#?}#?\\,d x"], ["cases", "\\begin{cases}#? & #? \\\\ #? & #?\\end{cases}"], ["vec", "\\vec{#?}"], ["frac", "\\frac{#?}{#?}"]].map(([trigger,replacement]) => ({ trigger, replacement, mode: "tab" as const, enabled: true })),
];
export function expandMatrixShortcut(typed: string, rules: MathShortcut[]) {
  const dimensions = typed.match(/(10|[1-9])x(10|[1-9])$/);
  if (!dimensions) return null;
  const rule = rules.find(rule => rule.kind === "matrix" && rule.enabled && typed.endsWith(rule.trigger + dimensions[0]));
  return rule ? { length: rule.trigger.length + dimensions[0].length, replacement: matrixTemplate(Number(dimensions[1]), Number(dimensions[2]), "pmatrix") } : null;
}
export function validateShortcuts(rules: MathShortcut[]): string | null {
  const used = new Set<string>();
  for (const rule of rules) {
    if (!rule.trigger.trim() || /\s/.test(rule.trigger) || rule.trigger.length > 40 || !rule.replacement.trim()) return "请填写有效的触发词和公式，触发词不能含空格。";
    if (used.has(rule.trigger)) return `触发词 ${rule.trigger} 重复，请修改。`;
    used.add(rule.trigger);
  }
  const auto = rules.filter(rule => rule.enabled && rule.mode === "auto");
  for (const a of auto) for (const b of auto) if (a !== b && b.trigger.startsWith(a.trigger)) return `${a.trigger} 与 ${b.trigger} 会提前触发，请改用 Tab 展开。`;
  return null;
}
export function readShortcuts(): MathShortcut[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(shortcutStorageKey) ?? "null");
    if (Array.isArray(value) && value.every(r => r && typeof r.trigger === "string" && typeof r.replacement === "string" && ["auto","tab"].includes(r.mode) && typeof r.enabled === "boolean") && !validateShortcuts(value)) return value;
  } catch { /* Use defaults when browser storage is unavailable. */ }
  return defaultMathShortcuts.map(rule => ({ ...rule }));
}
export function installMathShortcuts(field: MathfieldElement, rules: MathShortcut[], changed: () => void) {
  const original = field.inlineShortcuts;
  const shortcuts = { ...original };
  // MathLive maps @ to a circle. Prefixes must remain literal while a rule is typed.
  for (const trigger of Object.keys(shortcuts)) {
    if (trigger === "@" || rules.some(rule => rule.enabled && rule.trigger.startsWith(trigger) && rule.trigger !== trigger)) delete shortcuts[trigger];
  }
  for (const rule of rules) {
    delete shortcuts[rule.trigger];
    if (rule.enabled && rule.mode === "auto") shortcuts[rule.trigger] = rule.replacement;
  }
  // Keep the star symbol literal in both ordinary and superscript input.
  shortcuts["*"] = "\\ast";
  field.inlineShortcuts = shortcuts;
  field.inlineShortcutTimeout = 0;
  let trail: { key: string; position: number }[] = [];
  const clear = () => { trail = []; };
  const keydown = (event: KeyboardEvent) => {
    if (event.isComposing || event.keyCode === 229 || event.ctrlKey || event.metaKey || event.altKey) { clear(); return; }
    if (event.key === "Tab" && !event.shiftKey) {
      const typed = trail.map(item => item.key).join("");
      const rule = [...rules].filter(rule => rule.enabled && rule.mode === "tab" && typed.endsWith(rule.trigger)).sort((a,b) => b.trigger.length-a.trigger.length)[0];
      const matrix = expandMatrixShortcut(typed, rules);
      const replacement = rule?.replacement ?? matrix?.replacement;
      const length = rule?.trigger.length ?? matrix?.length ?? 0;
      const start = trail[trail.length - length]?.position;
      if (replacement && start !== undefined && field.position >= start) {
        event.preventDefault(); event.stopImmediatePropagation();
        field.selection = { ranges: [[start, field.position]] };
        field.insert(replacement, { selectionMode: "placeholder" });
        changed(); clear(); return;
      }
    }
    if (event.key.length === 1) { trail.push({ key: event.key, position: field.position }); trail = trail.slice(-64); }
    else clear();
  };
  field.addEventListener("keydown", keydown, true);
  field.addEventListener("pointerdown", clear);
  field.addEventListener("blur", clear);
  return () => {
    field.removeEventListener("keydown", keydown, true);
    field.removeEventListener("pointerdown", clear);
    field.removeEventListener("blur", clear);
    // React can remove the custom element before passive effect cleanup runs.
    if (field.isConnected) field.inlineShortcuts = original;
  };
}
