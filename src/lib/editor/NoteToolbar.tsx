"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Tip from "./Tip";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/react";
import { Baseline, Bold, Braces, Code2, Download, Eraser, Highlighter, Italic, Layers3, Link2, List, ListOrdered, Minus, MoreHorizontal, Paintbrush, Paperclip, Quote, Redo2, Save, Sigma, Strikethrough, Table2, Underline, Undo2, Video, Workflow } from "lucide-react";
import { insertMermaidCard } from "./mermaid";
import { captureMarks, toggleFormatPainterMode, type FormatPainterMode, type PainterMark } from "./formatPainter";
import { languageFromNode } from "./codeBlockLanguage";
import { CodeBlockLanguageSelect } from "./CodeBlockLanguageSelect";
import ToolbarColorPicker from "./ToolbarColorPicker";
import { useToolbarOverflow } from "./useToolbarOverflow";

type Menu = `group:${string}` | "math" | "heading" | "color" | "highlight" | "insert" | "list" | "more" | "table" | "link";
type Action = { id: string; label: string; icon: ReactNode; active?: boolean; disabled?: boolean; menu?: Menu; run?: () => void; before?: () => void };
type Group = { label?: string; id: string; priority: number; actions: Action[]; custom?: ReactNode };

export default function NoteToolbar({ editor, onHistory, onAttachment, onVideo, onInsertCard, onMath, onSnapshot, onExport, formatPainterMode, onFormatPainterMode, formatPainterMarks, onFormatPainterMarks, hiddenActions = [] }: {
  editor: Editor; onHistory: () => void; onAttachment: () => void; onVideo?: () => void; onInsertCard: () => void;
  onMath: (display: boolean) => void; onSnapshot: () => void; onExport: () => void;
  formatPainterMode: FormatPainterMode; onFormatPainterMode: (mode: FormatPainterMode) => void;
  formatPainterMarks: PainterMark[]; onFormatPainterMarks: (marks: PainterMark[]) => void;
  hiddenActions?: readonly string[];
}) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [tableSize, setTableSize] = useState({ rows: 3, cols: 3 });
  const [href, setHref] = useState("");
  const [, refresh] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const savedSelection = useRef<{ from: number; to: number } | null>(null);
  const painterMarks = useRef<PainterMark[]>([]);
  useEffect(() => {
    const update = ({ transaction }: { transaction: import("@tiptap/pm/state").Transaction }) => {
      if (savedSelection.current && transaction.docChanged) savedSelection.current = {
        from: transaction.mapping.map(savedSelection.current.from),
        to: transaction.mapping.map(savedSelection.current.to),
      };
      refresh(n => n + 1);
    };
    editor.on("transaction", update);
    return () => { editor.off("transaction", update); };
  }, [editor]);
  useEffect(() => {
    if (!menu) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!topRef.current?.contains(target) && !popRef.current?.contains(target)) setMenu(null);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenu(null); moreRef.current?.focus(); } };
    const resize = () => setMenu(null);
    const originalWidth = topRef.current?.clientWidth;
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
      if (topRef.current?.clientWidth !== originalWidth) resize();
    });
    if (topRef.current) observer?.observe(topRef.current);
    window.addEventListener("pointerdown", outside);
    window.addEventListener("keydown", escape);
    window.addEventListener("resize", resize);
    return () => { observer?.disconnect(); window.removeEventListener("pointerdown", outside); window.removeEventListener("keydown", escape); window.removeEventListener("resize", resize); };
  }, [menu]);
  const captureSelection = () => { const { from, to } = editor.state.selection; savedSelection.current = { from, to }; };
  const restoreSelection = () => {
    const saved = savedSelection.current;
    if (saved && saved.to <= editor.state.doc.content.size) editor.chain().focus().setTextSelection(saved).run();
    else editor.commands.focus();
  };
  const close = () => { setMenu(null); savedSelection.current = null; };
  const run = (fn: () => void) => { fn(); close(); };
  const heading = ([1, 2, 3, 4, 5, 6] as const).find(level => editor.isActive("heading", { level }));
  const textColor = editor.getAttributes("textStyle").color || null;
  const highlight = editor.getAttributes("highlight").color || "#fde047";
  const painter = () => {
    const next = toggleFormatPainterMode(formatPainterMode);
    onFormatPainterMode(next); onFormatPainterMarks(next ? painterMarks.current : []);
  };
  const sourceGroups: Group[] = [
    { id: "history", priority: 100, actions: [
      { id: "undo", label: "撤销", icon: <Undo2 size={16} />, disabled: !editor.can().undo(), run: () => { editor.chain().focus().undo().run(); } },
      { id: "redo", label: "重做", icon: <Redo2 size={16} />, disabled: !editor.can().redo(), run: () => { editor.chain().focus().redo().run(); } },
    ] },
    { id: "painter", priority: 40, actions: [{ id: "painter", label: "格式刷", icon: <Paintbrush size={16} />, active: !!formatPainterMode, before: () => { painterMarks.current = captureMarks(editor); }, run: painter }] },
    { id: "heading", priority: 95, actions: [{ id: "heading", label: "标题级别", icon: <b>{heading ? `H${heading}` : "Hn"}</b>, menu: "heading" }] },
    { id: "bold", priority: 90, actions: [{ id: "bold", label: "粗体", icon: <Bold size={16} />, active: editor.isActive("bold"), run: () => { editor.chain().focus().toggleBold().run(); } }] },
    { id: "italic", priority: 65, actions: [{ id: "italic", label: "斜体", icon: <Italic size={16} />, active: editor.isActive("italic"), run: () => { editor.chain().focus().toggleItalic().run(); } }] },
    { id: "colors", priority: 60, actions: [
      { id: "color", label: "字体颜色", icon: <><Baseline size={16} /><i className="toolbar-color-bar" style={{ background: textColor || "var(--fp-ink)" }} /></>, menu: "color", before: captureSelection },
      { id: "highlight", label: "荧光笔", icon: <><Highlighter size={16} /><i className="toolbar-color-bar" style={{ background: highlight }} /></>, menu: "highlight", before: captureSelection },
    ] },
    { id: "list", priority: 70, actions: [{ id: "list", label: "列表", icon: <List size={16} />, menu: "list" }] },
    { id: "link", priority: 45, actions: [{ id: "link", label: "链接", icon: <Link2 size={16} />, active: editor.isActive("link"), menu: "link", before: captureSelection }] },
    { id: "attachment", priority: 42, actions: [{ id: "attachment", label: "附件", icon: <Paperclip size={16} />, run: onAttachment }] },
    { id: "math", priority: 99, actions: [{ id: "math", label: "公式", icon: <Sigma size={16} />, menu: "math" }] },
    { id: "insert", priority: 98, actions: [{ id: "insert", label: "插入", icon: <Table2 size={16} />, menu: "insert" }] },
    { id: "decoration", priority: 35, actions: [
      { id: "strike", label: "删除线", icon: <Strikethrough size={16} />, active: editor.isActive("strike"), run: () => { editor.chain().focus().toggleStrike().run(); } },
      { id: "underline", label: "下划线", icon: <Underline size={16} />, active: editor.isActive("underline"), run: () => { editor.chain().focus().toggleUnderline().run(); } },
    ] },
    { id: "clear", priority: 20, actions: [{ id: "clear", label: "清除格式", icon: <Eraser size={16} />, run: () => { editor.chain().focus().unsetAllMarks().clearNodes().run(); } }] },
    { id: "quote", priority: 30, actions: [{ id: "quote", label: "引用", icon: <Quote size={16} />, active: editor.isActive("blockquote"), run: () => { editor.chain().focus().toggleBlockquote().run(); } }] },
    { id: "code", priority: 25, actions: [
      { id: "code", label: "行内代码", icon: <Code2 size={16} />, active: editor.isActive("code"), run: () => { editor.chain().focus().toggleCode().run(); } },
      { id: "codeBlock", label: "代码块", icon: <Braces size={16} />, active: editor.isActive("codeBlock"), run: () => { editor.chain().focus().toggleCodeBlock().run(); } },
    ] },
    { id: "versions", priority: 15, actions: [{ id: "versions", label: "历史", icon: <span>历史</span>, run: onHistory }] },
  ];
  if (editor.isActive("codeBlock")) sourceGroups.push({ id: "language", priority: 85, actions: [], custom: <CodeBlockLanguageSelect language={languageFromNode(editor.state.selection.$head.parent)} onChange={language => editor.chain().focus().updateAttributes("codeBlock", { language }).run()} /> });
  if (editor.isActive("table")) sourceGroups.push({ id: "tableActions", priority: 80, actions: [
    { id: "addRow", label: "添加行", icon: <span>+行</span>, run: () => { editor.chain().focus().addRowAfter().run(); } },
    { id: "deleteRow", label: "删除行", icon: <span>−行</span>, run: () => { editor.chain().focus().deleteRow().run(); } },
    { id: "addColumn", label: "添加列", icon: <span>+列</span>, run: () => { editor.chain().focus().addColumnAfter().run(); } },
    { id: "deleteColumn", label: "删除列", icon: <span>−列</span>, run: () => { editor.chain().focus().deleteColumn().run(); } },
    { id: "deleteTable", label: "删除表格", icon: <span>删表</span>, run: () => { editor.chain().focus().deleteTable().run(); } },
  ] });
  const actions = sourceGroups.flatMap(group => group.actions);
  const pick = (...ids: string[]) => actions.filter(action => ids.includes(action.id));
  const groups: Group[] = [
    { id: "history", label: "撤销重做", priority: 100, actions: pick("undo", "redo") },
    { id: "text", label: "文字格式", priority: 80, actions: pick("heading", "bold", "italic", "underline", "strike", "color", "highlight", "painter", "clear") },
    { id: "paragraph", label: "段落", priority: 60, actions: pick("list", "quote", "code", "codeBlock") },
    { id: "insertions", label: "插入", priority: 90, actions: [
      ...pick("math"), { id: "table", label: "表格", icon: <Table2 size={16} />, menu: "table" },
      { id: "card", label: "卡片", icon: <Layers3 size={16} />, run: onInsertCard }, ...pick("link", "attachment"),
      { id: "video", label: "视频 · 边看边记", icon: <Video size={16} />, run: onVideo || onAttachment },
      { id: "mermaid", label: "Mermaid 图", icon: <Workflow size={16} />, run: () => { insertMermaidCard(editor); } },
      { id: "divider", label: "分隔线", icon: <Minus size={16} />, run: () => { editor.chain().focus().setHorizontalRule().run(); } },
    ] },
    { id: "versions", label: "历史与导出", priority: 40, actions: [...pick("versions"),
      { id: "snapshot", label: "建立版本", icon: <Save size={16} />, run: onSnapshot },
      { id: "export", label: "导出", icon: <Download size={16} />, run: onExport },
    ] },
    ...sourceGroups.filter(group => ["language", "tableActions"].includes(group.id)).map(group => ({ ...group, label: group.id === "language" ? "代码语言" : "表格操作" })),
  ];
  const availableGroups = groups.map(group => ({ ...group, actions: group.actions.filter(action => !hiddenActions.includes(action.id)) })).filter(group => group.actions.length || group.custom);
  const { hostRef, measureRef, modes, visible, overflow } = useToolbarOverflow(availableGroups);
  const actionButton = (action: Action, expanded = false, measuring = false, labeled = false) => <button key={action.id} type="button" title={action.label} aria-label={action.label} aria-pressed={action.active || undefined} aria-expanded={action.menu ? menu === action.menu : undefined} disabled={action.disabled} className={expanded ? "toolbar-menu-item" : undefined}
    onMouseDown={event => { if (!measuring) { event.preventDefault(); action.before?.(); } }}
    onClick={event => {
      if (measuring) return;
      action.before?.();
      if (action.menu) {
        setAnchor(expanded ? anchor ?? event.currentTarget.getBoundingClientRect() : event.currentTarget.getBoundingClientRect());
        setMenu(current => current === action.menu ? null : action.menu!);
        if (action.menu === "link") setHref(editor.getAttributes("link").href || "");
      } else if (action.run) run(action.run);
    }}>{action.icon}{(expanded || labeled) && action.id !== "versions" && <span>{action.label}</span>}</button>;
  const renderGroup = (group: Group, expanded = false, measuring = false, mode = modes[group.id] ?? "full") => <div key={group.id} data-group={group.id} className={expanded ? "toolbar-overflow-group" : "toolbar-group"}>
    {mode === "group" && !expanded && group.id !== "history" ? <button type="button" aria-label={group.label} aria-expanded={menu === `group:${group.id}`} onMouseDown={e => e.preventDefault()} onClick={e => { setAnchor(e.currentTarget.getBoundingClientRect()); setMenu(`group:${group.id}`); }}>{group.label}<span aria-hidden="true">⌄</span></button> : <>{group.actions.map(action => actionButton(action, expanded, measuring, mode === "full" && group.id !== "history"))}{group.custom}</>}
  </div>;
  const menuItem = (label: string, icon: ReactNode, fn: () => void) => <button type="button" className="toolbar-menu-item" onMouseDown={e => e.preventDefault()} onClick={() => run(fn)}>{icon}<span>{label}</span></button>;
  const left = anchor ? Math.max(8, Math.min(anchor.left, window.innerWidth - 256)) : 8;
  const top = anchor ? Math.min(anchor.bottom + 6, window.innerHeight - 160) : 8;
  return <div className="note-editor-topbar" ref={topRef} role="toolbar" aria-label="笔记编辑工具">
    <div ref={hostRef} className="visual-note-editor-toolbar">{visible.map(group => renderGroup(group))}</div>
    {overflow.length > 0 && <Tip tip="更多"><button ref={moreRef} type="button" aria-label="更多" title="更多" aria-expanded={menu === "more"} onMouseDown={e => e.preventDefault()} onClick={() => { setAnchor(moreRef.current?.getBoundingClientRect() ?? null); setMenu(menu === "more" ? null : "more"); }}><MoreHorizontal size={17} /></button></Tip>}
    <div ref={measureRef} className="visual-note-editor-toolbar toolbar-measure" aria-hidden="true" inert>{(["full", "icons", "group"] as const).map(mode => <div key={mode} data-measure-mode={mode} className="toolbar-measure-row">{availableGroups.map(group => renderGroup(group, false, true, mode))}</div>)}</div>
    {formatPainterMode && editor.state.selection.empty && !formatPainterMarks.length && <span className="note-toolbar-hint" role="status">请先选中带格式的文字，再点格式刷</span>}
    {menu && anchor && createPortal(<div ref={popRef} className="fp-editor-menu note-toolbar-portal-menu" role="dialog" aria-label="编辑工具选项" style={{ left, top, maxHeight: Math.max(100, window.innerHeight - top - 12) }}>
      {menu === "more" && <>{overflow.map(group => <div key={group.id}><strong className="toolbar-menu-label">{group.label}</strong>{renderGroup(group, true)}</div>)}</>}
      {menu.startsWith("group:") && availableGroups.filter(group => `group:${group.id}` === menu).map(group => <div key={group.id}><strong className="toolbar-menu-label">{group.label}</strong>{renderGroup(group, true)}</div>)}
      {menu === "heading" && <><strong className="toolbar-menu-label">标题级别</strong><div className="toolbar-menu-grid">{([1, 2, 3, 4, 5, 6] as const).map(level => <button key={level} type="button" className={heading === level ? "is-active" : ""} onClick={() => run(() => { editor.chain().focus().toggleHeading({ level }).run(); })}>H{level}</button>)}</div>{menuItem("正文", null, () => { editor.chain().focus().setParagraph().run(); })}</>}
      {(menu === "color" || menu === "highlight") && <ToolbarColorPicker mode={menu === "color" ? "text" : "highlight"} current={menu === "color" ? textColor : highlight} onApply={value => { restoreSelection(); if (menu === "color") { if (value === null) editor.chain().unsetMark("textStyle").removeEmptyTextStyle().run(); else editor.chain().setColor(value).run(); } else { if (value === null) editor.chain().unsetHighlight().run(); else editor.chain().setHighlight({ color: value }).run(); } }} onClose={close} />}
      {menu === "list" && <>{menuItem("无序列表", <List size={15} />, () => { editor.chain().focus().toggleBulletList().run(); })}{menuItem("有序列表", <ListOrdered size={15} />, () => { editor.chain().focus().toggleOrderedList().run(); })}</>}
      {menu === "link" && <form className="toolbar-link-form" onSubmit={event => { event.preventDefault(); restoreSelection(); if (href.trim()) editor.chain().extendMarkRange("link").setLink({ href: href.trim() }).run(); else editor.chain().extendMarkRange("link").unsetLink().run(); close(); }}><label>链接地址<input aria-label="链接地址" value={href} onChange={e => setHref(e.target.value)} placeholder="https://" /></label><button type="submit">应用</button>{menuItem("移除链接", null, () => { restoreSelection(); editor.chain().extendMarkRange("link").unsetLink().run(); })}</form>}
      {menu === "math" && <>{menuItem("行内公式", <Sigma size={15} />, () => onMath(false))}{menuItem("独立公式", <Sigma size={15} />, () => onMath(true))}</>}
      {menu === "insert" && <>
        <button type="button" className="toolbar-menu-item" onClick={() => setMenu("table")}><Table2 size={15} />表格…</button>
        {menuItem("行内公式", <Sigma size={15} />, () => onMath(false))}{menuItem("独立公式", <Sigma size={15} />, () => onMath(true))}
        {menuItem("说明卡片", <Layers3 size={15} />, onInsertCard)}{!hiddenActions.includes("video") && menuItem("视频 · 边看边记", <Video size={15} />, onVideo || onAttachment)}{!hiddenActions.includes("attachment") && menuItem("附件", <Paperclip size={15} />, onAttachment)}{menuItem("分隔线", <Minus size={15} />, () => { editor.chain().focus().setHorizontalRule().run(); })}
      </>}
      {menu === "table" && <><strong className="toolbar-menu-label">{tableSize.rows} × {tableSize.cols} 表格</strong><div className="toolbar-table-grid">{Array.from({ length: 64 }, (_, i) => { const rows = Math.floor(i / 8) + 1, cols = i % 8 + 1; return <button key={i} type="button" aria-label={`${rows} 行 ${cols} 列`} className={rows <= tableSize.rows && cols <= tableSize.cols ? "is-active" : ""} onFocus={() => setTableSize({ rows, cols })} onMouseEnter={() => setTableSize({ rows, cols })} onClick={() => run(() => { editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run(); })} />; })}</div></>}
    </div>, document.body)}
  </div>;
}
