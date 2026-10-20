"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/core";
import type { MathfieldElement } from "mathlive";
import { closeHistory } from "@tiptap/pm/history";
import { Selection } from "@tiptap/pm/state";
import { yUndoPluginKey } from "@tiptap/y-tiptap";
import { Check, Code2, Keyboard, Trash2, Grid2X2, Settings2, CornerDownLeft } from "lucide-react";
import { matrixStyles, matrixTemplate, type MatrixStyle } from "./mathKeyboard";
import MathSymbolPalette from "./MathSymbolPalette";
import MathShortcutSettings from "./MathShortcutSettings";
import { installMathShortcuts, readShortcuts } from "./mathShortcuts";
import { mathPreferencesChanged, refreshMathPreferences } from "./mathPreferences";
import { SelectField } from "../SelectField";
import type { MathNodeHost } from "./LazyMathExtensions";


const templates = [
  ["分数", "\\frac{#0}{#?}"], ["根号", "\\sqrt{#0}"],
  ["上标", "#0^{#?}"], ["下标", "#0_{#?}"],
  ["积分", "\\int_{#?}^{#?} #? \\,d#?"], ["求和", "\\sum_{#?}^{#?} #?"],
] as const;

type MathSession = { id: string; editor: Editor; display: boolean; host: MathNodeHost; slot: HTMLElement; original: string; collapsedHeight: number };
type MathOpener = (editor: Editor, display: boolean, position?: number) => void;
const nestedTargets = new WeakMap<Editor, { editor: Editor; open: MathOpener }>();
export function bindNestedMathEditor(parent: Editor, editor: Editor, open: MathOpener) {
  const activate = () => nestedTargets.set(parent, { editor, open });
  const reset = (event: PointerEvent) => {
    if (!(event.target instanceof Element) || !event.target.closest(".visual-directive-editor")) nestedTargets.delete(parent);
  };
  editor.on("focus", activate);
  parent.view.dom.addEventListener("pointerdown", reset, true);
  activate();
  return () => {
    editor.off("focus", activate);
    parent.view.dom.removeEventListener("pointerdown", reset, true);
    if (nestedTargets.get(parent)?.editor === editor) nestedTargets.delete(parent);
  };
}
export function openActiveMathEditor(parent: Editor, display: boolean, fallback: MathOpener) {
  const target = nestedTargets.get(parent);
  if (target && !target.editor.isDestroyed && target.editor.view.dom.isConnected) target.open(target.editor, display);
  else fallback(parent, display);
}

function separateHistory(editor: Editor) {
  yUndoPluginKey.getState(editor.state)?.undoManager.stopCapturing();
  editor.view.dispatch(closeHistory(editor.state.tr));
}

export function useMathEditor() {
  const [session, setSession] = useState<MathSession | null>(null);
  const current = useRef<MathSession | null>(null);
  const close = useCallback((id?: string) => {
    if (id && current.current?.id !== id) return;
    const previous = current.current;
    current.current = null;
    setSession(null);
    if (previous && !previous.editor.isDestroyed) separateHistory(previous.editor);
  }, []);
  const open = useCallback((editor: Editor, display: boolean, position?: number, range?: { from: number; to: number }) => {
    if (!editor.isEditable) return;
    if (position === undefined) {
      separateHistory(editor);
      const target = range ?? editor.state.selection;
      editor.chain().insertContentAt({ from: target.from, to: target.to }, { type: display ? "blockMath" : "inlineMath", attrs: { latex: "" } }).command(({ tr }) => {
        tr.mapping.maps.at(-1)?.forEach((_oldStart, _oldEnd, start, end) => {
          tr.doc.nodesBetween(start, end, (node, pos) => {
            if (node.type.name === (display ? "blockMath" : "inlineMath")) { position = pos; return false; }
          });
        });
        return true;
      }).run();
    }
    if (position === undefined) return;
    const host = editor.view.nodeDOM(position) as MathNodeHost | null;
    const slot = host?.querySelector<HTMLElement>(".math-node-editor-slot");
    if (!host?.mathPosition || !slot || current.current?.host === host) return;
    close();
    separateHistory(editor);
    const next = { id: crypto.randomUUID(), editor, display, host, slot, collapsedHeight: host.getBoundingClientRect().height, original: String(editor.state.doc.nodeAt(position)?.attrs.latex ?? "") };
    current.current = next;
    setSession(next);
  }, [close]);
  return { open, card: <AnimatePresence>{session ? <MathEditor key={session.id} session={session} onClose={close} /> : null}</AnimatePresence> };
}

function MathEditor({ session, onClose: closeSession }: { session: MathSession; onClose: (id?: string) => void }) {
  const onClose = useCallback(() => closeSession(session.id), [closeSession, session.id]);
  const reduced = useReducedMotion();
  const [draft, setDraft] = useState(session.original);
  const draftRef = useRef(session.original);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [symbolOpen, setSymbolOpen] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)").matches);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState(readShortcuts);
  const sourceActive = useRef(false);
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [matrixRows, setMatrixRows] = useState(3);
  const [matrixColumns, setMatrixColumns] = useState(3);
  const [matrixStyle, setMatrixStyle] = useState<MatrixStyle>("pmatrix");
  const [matrixMessage, setMatrixMessage] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<MathfieldElement | null>(null);
  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const update = useCallback((value: string) => {
    const pos = session.host.mathPosition();
    if (pos === undefined || session.editor.isDestroyed) return;
    const node = session.editor.state.doc.nodeAt(pos);
    if (!node || !["inlineMath", "blockMath"].includes(node.type.name)) return;
    draftRef.current = value;
    setDraft(value);
    if (node.attrs.latex !== value) session.editor.view.dispatch(session.editor.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, latex: value }));
  }, [session]);

  useEffect(() => {
    session.host.classList.add("is-math-editing");
    session.host.setAttribute("draggable", "false");
    const sync = () => {
      const pos = session.host.mathPosition();
      if (pos === undefined || !session.host.isConnected) { onClose(); return; }
      const node = session.editor.state.doc.nodeAt(pos);
      if (!node || !["inlineMath", "blockMath"].includes(node.type.name)) { onClose(); return; }
      const value = String(node.attrs.latex ?? "");
      if (value !== draftRef.current) {
        draftRef.current = value;
        setDraft(value);
        fieldRef.current?.setValue(value, { silenceNotifications: true });
      }
    };
    const outside = (event: PointerEvent) => {
      if (!session.host.contains(event.target as Node) && !(event.target as Element).closest?.(".fp-popup-panel")) onClose();
    };
    session.editor.on("transaction", sync);
    session.editor.on("destroy", onClose);
    document.addEventListener("pointerdown", outside);
    return () => {
      session.host.classList.remove("is-math-editing");
      session.editor.off("transaction", sync);
      session.editor.off("destroy", onClose);
      document.removeEventListener("pointerdown", outside);
    };
  }, [session, onClose]);

  useEffect(() => {
    let active = true;
    let cleanup = () => {};

    document.documentElement.dataset.mathEditing = "true";
    document.dispatchEvent(new Event("fp:math-open"));
    panelRef.current?.focus();
    void (async () => {
      try {
        const { MathfieldElement: Field } = await import("mathlive");
        await import("mathlive/fonts.css");
        if (!active || !hostRef.current || !keyboardRef.current) return;
        const field = new Field();
        field.className = "note-math-live";
        field.mathVirtualKeyboardPolicy = "manual";
        field.smartFence = true;
        field.smartMode = false;
        field.environmentPopoverPolicy = "off";
        field.maxMatrixCols = 10;
        field.setAttribute("aria-label", "公式内容");
        hostRef.current.append(field);
        cleanup = () => { field.remove(); fieldRef.current = null; };
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        if (!active) return;
        field.menuItems = [];
        field.setValue(draftRef.current, { silenceNotifications: true });
        fieldRef.current = field;
        const keyboard = window.mathVirtualKeyboard;
        const previousContainer = keyboard.container;
        const previousLayouts = keyboard.layouts;
        keyboard.hide();
        keyboard.container = keyboardRef.current;
        const input = () => update(field.getValue("latex-unstyled"));
        field.addEventListener("input", input);
        const focus = () => { sourceActive.current = false; };
        field.addEventListener("focus", focus);
        cleanup = () => {
          keyboard.hide();
          keyboard.container = previousContainer;
          keyboard.layouts = previousLayouts;
          field.removeEventListener("input", input);
          field.removeEventListener("focus", focus);
          field.remove();
          fieldRef.current = null;
        };
        setStatus("ready");
        if (document.activeElement !== sourceRef.current) field.focus();
      } catch (cause) {
        cleanup();
        console.warn("Formula input initialization failed", cause);
        if (active) { setStatus("fallback"); setSourceOpen(true); }
      }
    })();
    return () => {
      active = false;
      cleanup();
      delete document.documentElement.dataset.mathEditing;

    };
  }, [update]);

  useEffect(() => {
    const read = () => setShortcuts(readShortcuts());
    const refresh = () => { void refreshMathPreferences(); };
    window.addEventListener(mathPreferencesChanged, read);
    window.addEventListener("storage", read);
    window.addEventListener("focus", refresh);
    refresh();
    return () => { window.removeEventListener(mathPreferencesChanged, read); window.removeEventListener("storage", read); window.removeEventListener("focus", refresh); };
  }, []);

  useEffect(() => {
    if (status !== "ready" || !fieldRef.current) return;
    const field = fieldRef.current;
    return installMathShortcuts(field, shortcuts, () => update(field.getValue("latex-unstyled")));
  }, [status, shortcuts, update]);

  const matrixAction = (command: "addRowAfter" | "addColumnAfter" | "removeRow" | "removeColumn") => {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    const changed = field.executeCommand(command);
    setMatrixMessage(changed ? "" : "请将光标放在矩阵内；每行最多 10 列。");
    if (changed) update(field.getValue("latex-unstyled"));
  };

  const finish = (remove = false) => {
    const editor = session.editor;
    const pos = session.host.mathPosition();
    if (pos === undefined || editor.isDestroyed) { onClose(); return; }
    const node = editor.state.doc.nodeAt(pos);
    if (remove && node) editor.commands.deleteRange({ from: pos, to: pos + node.nodeSize });
    onClose();
    if (!editor.isDestroyed) {
      const end = Math.min(pos + (remove ? 0 : node?.nodeSize ?? 0), editor.state.doc.content.size);
      editor.view.dispatch(editor.state.tr.setSelection(Selection.near(editor.state.doc.resolve(end), 1)));
      editor.commands.focus(undefined, { scrollIntoView: false });
    }
  };
  const insert = (template: string) => {
    const field = fieldRef.current;
    if (field && !sourceActive.current) {
      field.focus();
      field.insert(template, { selectionMode: "placeholder" });
      update(field.getValue("latex-unstyled"));
    } else {
      const source = sourceRef.current;
      const start = source?.selectionStart ?? draftRef.current.length;
      const end = source?.selectionEnd ?? start;
      const text = template.replaceAll("#0", draftRef.current.slice(start, end)).replaceAll("#?", "");
      const next = draftRef.current.slice(0, start) + text + draftRef.current.slice(end);
      update(next);
      field?.setValue(next, { silenceNotifications: true });
      source?.focus();
      requestAnimationFrame(() => source?.setSelectionRange(start + text.length, start + text.length));
    }
  };

  const [position, setPosition] = useState({ left: 16, top: 16 });
  useLayoutEffect(() => {
    const place = () => { const box = session.host.getBoundingClientRect(); setPosition({ left: Math.max(12, Math.min(box.left, window.innerWidth - Math.min(560, window.innerWidth - 24) - 12)), top: Math.max(12, Math.min(box.bottom + 8, window.innerHeight - 320)) }); };
    place(); window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [session]);
  return createPortal(<motion.div className="note-math-card inline-card-expansion" style={{ position: 'fixed', ...position, width: 'min(560px, calc(100vw - 24px))', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto', zIndex: 1100, transformOrigin: 'top left' }} initial={{ opacity: 0, scale: .98, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98, y: -4 }} transition={{ duration: reduced ? 0 : .18, ease: [.22, 1, .36, 1] }} ref={panelRef} role="group" aria-label={session.display ? "编辑独立公式" : "编辑行内公式"} tabIndex={-1}
    onPointerDown={event => event.stopPropagation()} onClick={event => event.stopPropagation()} onDoubleClick={event => event.stopPropagation()} onContextMenu={event => event.stopPropagation()}
    onKeyDownCapture={event => {
      if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
      if (!session.display && event.key === "Enter" && !event.shiftKey && !(event.target instanceof HTMLButtonElement)) { event.preventDefault(); event.stopPropagation(); finish(); return; }
      if (session.display && event.key === "Enter" && !event.ctrlKey && !event.metaKey && event.target === fieldRef.current) {
        event.preventDefault(); event.stopPropagation();
        fieldRef.current?.executeCommand("addRowAfter");
        if (fieldRef.current) update(fieldRef.current.getValue("latex-unstyled"));
        return;
      }
      if (event.key === "Escape" || (event.key === "Enter" && (event.ctrlKey || event.metaKey))) { event.preventDefault(); event.stopPropagation(); finish(); }
    }}
    onKeyDown={event => event.stopPropagation()}>
      <div className="note-math-topline">
        <span className="note-math-title">∑ <span>{session.display ? "独立公式" : "行内公式"}</span></span>
        <div className="note-math-controls">
          <button type="button" title="LaTeX 源码" aria-label="LaTeX 源码" aria-expanded={sourceOpen} disabled={status === "fallback"} onClick={() => setSourceOpen(v => !v)}><Code2 size={15} /><span>源码</span></button>
          <button type="button" aria-label="数学键盘" aria-expanded={symbolOpen} onClick={() => { setSymbolOpen(v => !v); window.mathVirtualKeyboard?.hide(); }}><Keyboard size={15}/><span>键盘</span></button>
          <button type="button" aria-label="快捷输入设置" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(v => !v)}><Settings2 size={15}/></button>
          <button type="button" className="note-math-delete" title="删除公式" aria-label="删除公式" onClick={() => finish(true)}><Trash2 size={15} /></button>
          <button type="button" className="note-math-done" aria-label="收起" title="收起 · Ctrl/⌘+Enter" onClick={() => finish()}><Check size={15} /><span>完成</span></button>
        </div>
      </div>
      <div className="note-math-writing">
        {status === "loading" && <span className="note-math-status" role="status">正在准备公式输入…</span>}
        <div ref={hostRef} className="note-math-live-host" hidden={status === "fallback"} />
        {sourceOpen && <label className="note-math-source-label">LaTeX<textarea ref={sourceRef} aria-label="LaTeX 源码" className="note-math-source" rows={2} value={draft} spellCheck={false} onFocus={() => { sourceActive.current = true; }} onChange={event => { update(event.target.value); fieldRef.current?.setValue(event.target.value, { silenceNotifications: true }); }} /></label>}
        {status === "fallback" && <span className="note-math-status" role="status">可直接输入 LaTeX 公式。</span>}
      </div>
      <div className="note-math-tools" role="toolbar" aria-label="公式结构">
        {templates.map(([label, template]) => <button key={label} type="button" disabled={status === "loading" && !sourceOpen} onMouseDown={e => e.preventDefault()} onClick={() => insert(template)}>{label}</button>)}
        <button type="button" aria-expanded={matrixOpen} onMouseDown={e => e.preventDefault()} onClick={() => { setMatrixOpen(v => !v); setMatrixMessage(""); }}><Grid2X2 size={14} />矩阵</button>
      </div>
      {matrixOpen && <div className="note-matrix-builder" role="group" aria-label="矩阵设置">
        <div className="note-matrix-settings">
          <label>行<SelectField label="矩阵行数" value={String(matrixRows)} onChange={value => setMatrixRows(Number(value))} options={Array.from({length:10},(_,i)=>({value:String(i+1),label:String(i+1)}))} /></label>
          <span aria-hidden="true">×</span>
          <label>列<SelectField label="矩阵列数" value={String(matrixColumns)} onChange={value => setMatrixColumns(Number(value))} options={Array.from({length:10},(_,i)=>({value:String(i+1),label:String(i+1)}))} /></label>
          <label>括号<SelectField label="矩阵括号" value={matrixStyle} onChange={value => setMatrixStyle(value as MatrixStyle)} options={matrixStyles.map(([value,label])=>({value,label}))} /></label>
          <button type="button" className="note-matrix-insert" disabled={status === "loading" && !sourceOpen} onMouseDown={e => e.preventDefault()} onClick={() => { insert(matrixTemplate(matrixRows, matrixColumns, matrixStyle)); setMatrixOpen(false); }}>插入 {matrixRows} × {matrixColumns}</button>
        </div>
        <div className="note-matrix-presets"><span>常用</span>{[[1, 3], [3, 1], [2, 2], [3, 3], [4, 4], [3, 4]].map(([rows, cols]) => <button key={`${rows}-${cols}`} type="button" aria-pressed={matrixRows === rows && matrixColumns === cols} onClick={() => { setMatrixRows(rows); setMatrixColumns(cols); }}>{rows} × {cols}</button>)}</div>
        <div className="note-matrix-actions"><span>光标所在矩阵</span>{([['增行', 'addRowAfter'], ['增列', 'addColumnAfter'], ['删行', 'removeRow'], ['删列', 'removeColumn']] as const).map(([label, command]) => <button key={command} type="button" disabled={status !== "ready" || sourceOpen} onMouseDown={e => e.preventDefault()} onClick={() => matrixAction(command)}>{label}</button>)}</div>
        {matrixMessage && <span className="note-math-status" role="status">{matrixMessage}</span>}
      </div>}
      {session.display && <div className="note-math-line-actions"><button type="button" onMouseDown={e => e.preventDefault()} onClick={() => { const field = fieldRef.current; if (field) { field.focus(); field.executeCommand("addRowAfter"); update(field.getValue("latex-unstyled")); } }}><CornerDownLeft size={14}/>换行</button><button type="button" onMouseDown={e => e.preventDefault()} onClick={() => insert("\\begin{aligned}#0 &= #? \\\\ #? &= #?\\end{aligned}")}>对齐多行</button><span>Enter 换行 · Ctrl/⌘+Enter 完成</span></div>}
      {settingsOpen && <MathShortcutSettings rules={shortcuts} onSave={setShortcuts} onClose={() => setSettingsOpen(false)} />}
      {symbolOpen && <MathSymbolPalette onInsert={insert} shortcuts={shortcuts} onCommand={command => { const field = fieldRef.current; if (field) { field.focus(); field.executeCommand(command); update(field.getValue("latex-unstyled")); } }} />}
      <div ref={keyboardRef} hidden />
  </motion.div>, session.slot);
}
