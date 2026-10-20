"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import katex from "katex";
import { Star, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { mathCatalog, symbolCategories, searchMathSymbols } from "./mathCatalog";
import type { MathShortcut } from "./mathShortcuts";
import { mathStorage as localStorage, mathPreferencesChanged } from "./mathPreferences";
const storageKey = "fp.math.symbols.v1";
function readPreferences() {
  try { const value = JSON.parse(localStorage.getItem(storageKey) ?? "{}"); return { favorites: Array.isArray(value.favorites) ? value.favorites.filter((x: unknown) => typeof x === "string") as string[] : [], recent: Array.isArray(value.recent) ? value.recent.filter((x: unknown) => typeof x === "string") as string[] : [] }; } catch { return { favorites: [] as string[], recent: [] as string[] }; }
}
const previews = new Map(mathCatalog.map(symbol => [symbol.id, katex.renderToString(symbol.latex, { throwOnError: false, trust: false, strict: false })]));
type KeyboardCommand = "undo" | "redo" | "moveToPreviousChar" | "moveToNextChar" | "deleteBackward" | "moveToNextPlaceholder" | "moveToPreviousPlaceholder";
export default function MathSymbolPalette({ onInsert, shortcuts, onCommand }: { onInsert: (value: string) => void; shortcuts: readonly MathShortcut[]; onCommand?: (command: KeyboardCommand) => void }) {
  const [category, setCategory] = useState("basic");
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState<Record<string, number>>({});
  const [columns, setColumns] = useState(8);
  const [preferences, setPreferences] = useState(readPreferences);
  const [selected, setSelected] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const refresh = () => setPreferences(readPreferences());
    window.addEventListener(mathPreferencesChanged, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(mathPreferencesChanged, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  useEffect(() => {
    if (!root.current) return;
    const resize = () => { const width = root.current?.clientWidth ?? 0; setColumns(Math.max(4, Math.min(20, Math.floor(width / 56)))); };
    resize(); const observer = new ResizeObserver(resize); observer.observe(root.current); return () => observer.disconnect();
  }, []);
  const items = useMemo(() => {
    if (query.trim()) { const ids = new Set(shortcuts.filter(rule => rule.trigger.toLowerCase().includes(query.toLowerCase())).map(rule => rule.replacement)); const found = new Set(searchMathSymbols(query)); return mathCatalog.filter(symbol => found.has(symbol) || ids.has(symbol.insert)); }
    if (category === "recent") return preferences.recent.map(id => mathCatalog.find(symbol => symbol.id === id)).filter(symbol => !!symbol);
    if (category === "favorites") return mathCatalog.filter(symbol => preferences.favorites.includes(symbol.id));
    return mathCatalog.filter(symbol => symbol.categories.includes(category));
  }, [category, query, preferences, shortcuts]);
  const size = columns * (columns <= 7 ? 3 : 4), pageKey = query ? `search:${query}` : category;
  const total = Math.max(1, Math.ceil(items.length / size));
  const page = Math.min(pages[pageKey] ?? 0, total - 1);
  const shown = items.slice(page * size, (page + 1) * size);
  const current = mathCatalog.find(symbol => symbol.id === selected);
  const shortcut = current && shortcuts.find(rule => rule.enabled && rule.replacement === current.insert);
  const save = (next: typeof preferences) => { setPreferences(next); try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Keep preferences for this session. */ } };
  return <div className="math-symbol-palette" ref={root}>
    <div className="math-keyboard-navigation" aria-label="键盘操作">{([ ["undo", "撤销"], ["redo", "重做"], ["moveToPreviousChar", "←"], ["moveToNextChar", "→"], ["moveToPreviousPlaceholder", "上一空位"], ["moveToNextPlaceholder", "下一空位"], ["deleteBackward", "退格"] ] as const).map(([command, label]) => <button type="button" key={command} onMouseDown={e => e.preventDefault()} onClick={() => onCommand?.(command)}>{label}</button>)}</div>
    <div className="math-symbol-categories" role="tablist" aria-label="符号分类">{[["recent", "最近"], ["favorites", "收藏"], ...symbolCategories].map(([id, label]) => <button type="button" role="tab" aria-selected={!query && category === id} key={id} onMouseDown={e => e.preventDefault()} onClick={() => { setCategory(id); setQuery(""); }}>{label}</button>)}</div>
    <div className="math-symbol-search"><Search size={15}/><input aria-label="搜索数学符号" placeholder="搜索名称、LaTeX 或快捷词" value={query} onChange={e => setQuery(e.target.value)} /><span>{items.length} 项</span></div>
    <div className="math-symbol-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {shown.map(symbol => <div key={symbol.id} className="math-symbol-cell">
        <button type="button" className="math-symbol-insert" aria-label={`插入${symbol.label}`} title={`${symbol.label} · ${symbol.insert}`} onMouseDown={e => e.preventDefault()} onFocus={() => setSelected(symbol.id)} onMouseEnter={() => setSelected(symbol.id)} onClick={() => { onInsert(symbol.insert); setSelected(symbol.id); save({ ...preferences, recent: [symbol.id, ...preferences.recent.filter(id => id !== symbol.id)].slice(0, 40) }); }}><span aria-hidden="true" dangerouslySetInnerHTML={{ __html: previews.get(symbol.id) ?? "" }}/></button>
        <button type="button" className={`math-symbol-star${preferences.favorites.includes(symbol.id) ? " is-favorite" : ""}`} aria-label={`${preferences.favorites.includes(symbol.id) ? "取消收藏" : "收藏"}${symbol.label}`} aria-pressed={preferences.favorites.includes(symbol.id)} onMouseDown={e => e.preventDefault()} onClick={() => save({ ...preferences, favorites: preferences.favorites.includes(symbol.id) ? preferences.favorites.filter(id => id !== symbol.id) : [...preferences.favorites, symbol.id] })}><Star size={10}/></button>
      </div>)}
    </div>
    {!items.length && <p className="note-math-status">{query ? "没有找到匹配符号，请尝试名称或 LaTeX 命令。" : category === "favorites" ? "选择符号后点按星标，将常用符号放在这里。" : "使用过的符号会显示在这里。"}</p>}
    <div className="math-symbol-footer">{current && <button type="button" className="math-mobile-favorite" aria-label={`${preferences.favorites.includes(current.id) ? "取消收藏" : "收藏"}${current.label}`} onClick={() => save({ ...preferences, favorites: preferences.favorites.includes(current.id) ? preferences.favorites.filter(id => id !== current.id) : [...preferences.favorites, current.id] })}><Star size={18}/></button>}<span className="math-symbol-detail">{current ? <>{current.label} <code>{current.insert}</code>{shortcut && <kbd>{shortcut.trigger}{shortcut.mode === "tab" ? " ⇥" : ""}</kbd>}</> : "选中公式片段后，点击符号可替换选区"}</span><div><button type="button" aria-label="上一页符号" disabled={page === 0} onMouseDown={e => e.preventDefault()} onClick={() => setPages(p => ({ ...p, [pageKey]: page - 1 }))}><ChevronLeft size={14}/></button><span aria-live="polite">{page + 1} / {total}</span><button type="button" aria-label="下一页符号" disabled={page + 1 >= total} onMouseDown={e => e.preventDefault()} onClick={() => setPages(p => ({ ...p, [pageKey]: page + 1 }))}><ChevronRight size={14}/></button></div></div>
  </div>;
}
