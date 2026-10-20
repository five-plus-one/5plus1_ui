import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { EditorContent, useEditor, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react';
import type { Editor, Extensions, JSONContent } from '@tiptap/core';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import Placeholder from '@tiptap/extension-placeholder';
import type { HocuspocusProvider } from '@hocuspocus/provider';
import type * as Y from 'yjs';
import { FileText, Trash2, Pencil, Check } from 'lucide-react';
import { SelectField } from '../SelectField';
import { VisualCodeBlock } from './VisualCodeBlock';
import NoteToolbar from './NoteToolbar';
import { baseEditorExtensions, documentToMarkdown, markdownToDocument } from './schema';
import { DirectiveBlock, DIRECTIVE_CARD_TYPES, readDirectiveTitle, writeDirectiveTitle } from './directiveBlock';
import { Attachment } from './attachment';
import { createLazyMathExtensions } from './LazyMathExtensions';
import { useMathEditor } from './MathEditor';
import { applyMarks, type FormatPainterMode, type PainterMark } from './formatPainter';

export interface MarkdownEditorProps {
  /** Initial Markdown. Change documentKey when switching documents; use the Editor handle for external updates. */
  markdown?: string;
  documentKey?: string;
  document?: Y.Doc;
  provider?: HocuspocusProvider;
  user?: { id: string; name: string; color: string };
  editable?: boolean;
  placeholder?: string;
  onChange?: (markdown: string, document: JSONContent) => void;
  onReady?: (editor: Editor) => void;
  onHistory?: () => void;
  onSnapshot?: () => void;
  onExport?: (markdown: string) => void;
  onAttachment?: (editor: Editor, kind: 'file' | 'video') => void;
  onOpenAttachment?: (attachment: { name: string; url: string; mediaType: string }) => void;
  onFiles?: (files: File[], editor: Editor) => void;
  resolveResourceUrl?: (url: string) => string;
  renderDirective?: (props: NodeViewProps) => ReactNode;
  extensions?: Extensions;
  status?: ReactNode;
  toolbar?: boolean;
}
function DirectiveView(props: NodeViewProps) {
  const { node, updateAttributes, editor, deleteNode } = props;
  const [editing, setEditing] = useState(false);
  const nested = useRef<Editor | null>(null);
  const published = useRef(String(node.attrs.body || ''));
  useEffect(() => {
    const body = String(node.attrs.body || '');
    if (nested.current && !nested.current.isDestroyed && body !== published.current) { nested.current.commands.setContent(markdownToDocument(body), { emitUpdate: false }); published.current = body; }
  }, [node.attrs.body]);
  const name = String(node.attrs.name);
  return <NodeViewWrapper className="fp-directive-node" contentEditable={false} data-selected={props.selected || undefined}>
    <div className="fp-directive-heading" contentEditable={false}><SelectField label="卡片类型" value={name} disabled={!editor.isEditable} onChange={value => updateAttributes({ name: value })} options={DIRECTIVE_CARD_TYPES.map(([value, label]) => ({ value, label }))} />
      {editor.isEditable && <span className="fp-directive-actions"><button type="button" aria-label={editing ? '完成卡片编辑' : '编辑卡片内容'} onClick={() => setEditing(value => !value)}>{editing ? <Check size={14} /> : <Pencil size={14} />}</button><button type="button" aria-label="删除卡片" onClick={deleteNode}><Trash2 size={14} /></button></span>}</div>
    <input aria-label="卡片标题" value={readDirectiveTitle(node.attrs.attributes, name)} disabled={!editor.isEditable} placeholder="添加标题" onChange={e => updateAttributes({ attributes: writeDirectiveTitle(node.attrs.attributes, name, e.target.value) })} />
    <MarkdownEditor markdown={String(node.attrs.body || '')} editable={editing && editor.isEditable} toolbar={editing} onReady={instance => { nested.current = instance; }} onChange={body => { published.current = body; updateAttributes({ body }); }} />
  </NodeViewWrapper>;
}
export function MarkdownEditor(props: MarkdownEditorProps) {
  const { markdown = '', documentKey = 'default', document, provider, user, editable = true, placeholder = '写下你的理解…', extensions = [], status } = props;
  const latest = useRef(props); latest.current = props;
  const math = useMathEditor();
  const instanceRef = useRef<Editor | null>(null);
  const mathRef = useRef(math); mathRef.current = math;
  const [quick, setQuick] = useState<{ from: number; to: number; top: number; left: number; query: string; active: number } | null>(null);
  const quickRef = useRef(quick); quickRef.current = quick;
  const commandDefs = [
    ['text', '文本', '普通段落'], ['h1', '一级标题', '大标题'], ['h2', '二级标题', '章节标题'], ['h3', '三级标题', '小节标题'],
    ['bullet', '无序列表', '项目列表'], ['ordered', '有序列表', '编号列表'], ['quote', '引用', '引用段落'], ['code', '代码块', '代码内容'],
    ['divider', '分隔线', '划分内容'], ['table', '表格', '3 × 3'], ['inlineMath', '行内公式', '在段落中输入公式'], ['math', '独立公式', '独立成行'], ['card', '卡片', '说明与重点'],
  ];
  const choices = (query: string) => commandDefs.filter(command => command.join(' ').toLowerCase().includes(query.toLowerCase()));
  function updateQuick(instance: Editor) {
    const { $from, from, empty } = instance.state.selection;
    const match = empty && instance.isEditable && !$from.parent.type.spec.code ? $from.parent.textBetween(0, $from.parentOffset).match(/^\/([^\s/]*)$/u) : null;
    if (!match) { setQuick(null); return; }
    const point = instance.view.coordsAtPos(from);
    setQuick(old => ({ from: from - match[0].length, to: from, query: match[1], top: Math.max(8, Math.min(point.bottom + 6, window.innerHeight - 300)), left: Math.max(8, Math.min(point.left, window.innerWidth - 272)), active: old?.query === match[1] ? old.active : 0 }));
  }
  function runQuick(command: string) {
    const instance = instanceRef.current, range = quickRef.current;
    if (!instance || !range) return;
    setQuick(null); instance.chain().focus().deleteRange(range).run();
    if (command === 'text') instance.commands.setParagraph();
    else if (/^h[123]$/.test(command)) instance.commands.setHeading({ level: Number(command[1]) as 1 | 2 | 3 });
    else if (command === 'bullet') instance.commands.toggleBulletList();
    else if (command === 'ordered') instance.commands.toggleOrderedList();
    else if (command === 'quote') instance.commands.toggleBlockquote();
    else if (command === 'code') instance.commands.toggleCodeBlock();
    else if (command === 'divider') instance.commands.setHorizontalRule();
    else if (command === 'table') instance.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true });
    else if (command === 'inlineMath' || command === 'math') mathRef.current.open(instance, command === 'math');
    else if (command === 'card') instance.commands.insertContent({ type: 'directiveBlock', attrs: { name: 'note', attributes: '', body: '' } });
  }
  const [painterMode, setPainterMode] = useState<FormatPainterMode>(null);
  const [painterMarks, setPainterMarks] = useState<PainterMark[]>([]);
  const painter = useRef({ mode: painterMode, marks: painterMarks }); painter.current = { mode: painterMode, marks: painterMarks };
  const editor: Editor | null = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      ...baseEditorExtensions(!document, undefined,
        DirectiveBlock.extend({ addNodeView: () => ReactNodeViewRenderer(view => latest.current.renderDirective ? <NodeViewWrapper>{latest.current.renderDirective(view)}</NodeViewWrapper> : <DirectiveView {...view} />) }),
        createLazyMathExtensions({ onInlineClick: (_latex, position) => instanceRef.current && mathRef.current.open(instanceRef.current, false, position), onBlockClick: (_latex, position) => instanceRef.current && mathRef.current.open(instanceRef.current, true, position) }),
        Attachment.extend({ addNodeView: () => ReactNodeViewRenderer(({ node, editor: instance, deleteNode }) => <NodeViewWrapper className="fp-attachment-node"><FileText size={20} /><span>{String(node.attrs.name)}</span>{latest.current.onOpenAttachment && <button type="button" onClick={() => latest.current.onOpenAttachment?.({ name: node.attrs.name, url: node.attrs.url, mediaType: node.attrs.mediaType })}>查看附件</button>}{instance.isEditable && <button type="button" aria-label="删除附件" onClick={deleteNode}><Trash2 size={14} /></button>}</NodeViewWrapper>) }),
        VisualCodeBlock,
      ).map(extension => extension.name === 'image' ? extension.configure({ resolveUrl: (url: string) => latest.current.resolveResourceUrl?.(url) || url }) : extension),
      Placeholder.configure({ placeholder }),
      ...(document ? [Collaboration.configure({ document })] : []),
      ...(provider && user ? [CollaborationCaret.configure({ provider, user })] : []),
      ...extensions,
    ],
    content: document ? undefined : markdownToDocument(markdown),
    onCreate: ({ editor }) => latest.current.onReady?.(editor),
    onUpdate: ({ editor }) => { latest.current.onChange?.(documentToMarkdown(editor.getJSON()), editor.getJSON()); updateQuick(editor); },
    onSelectionUpdate: ({ editor }) => updateQuick(editor),
    onBlur: () => setQuick(null),
    editorProps: {
      attributes: { 'aria-label': '笔记正文', class: 'fp-editor-prose' },
      handleKeyDown(_view, event) {
        const current = quickRef.current;
        if (!current || event.isComposing) return false;
        const items = choices(current.query);
        if (event.key === 'Escape') { setQuick(null); return true; }
        if (!items.length) return false;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { setQuick({ ...current, active: (current.active + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length }); return true; }
        if (event.key === 'Enter') { runQuick(items[Math.min(current.active, items.length - 1)][0]); return true; }
        return false;
      },
      handlePaste(_view, event) { const files = Array.from(event.clipboardData?.files || []), instance = instanceRef.current; if (files.length && latest.current.onFiles && instance) { latest.current.onFiles(files, instance); return true; } return false; },
      handleDrop(view, event, _slice, moved) { const files = Array.from(event.dataTransfer?.files || []), instance = instanceRef.current; if (!moved && files.length && latest.current.onFiles && instance) { const pos = view.posAtCoords({ left: event.clientX, top: event.clientY }); if (pos) instance.commands.setTextSelection(pos.pos); latest.current.onFiles(files, instance); return true; } return false; },
      handleDOMEvents: { mouseup: () => { const instance = instanceRef.current; if (instance && painter.current.mode && !instance.state.selection.empty) { const { from, to } = instance.state.selection; applyMarks(instance, painter.current.marks, from, to); if (painter.current.mode === 'once') setPainterMode(null); } return false; } },
    },
  }, [documentKey, document, provider]);
  instanceRef.current = editor;
  useEffect(() => { editor?.setEditable(editable); }, [editor, editable]);
  return <section className="fp-markdown-editor" data-readonly={!editable || undefined}>
    {editor && editable && props.toolbar !== false && <NoteToolbar editor={editor} onHistory={() => latest.current.onHistory?.()} onSnapshot={() => latest.current.onSnapshot?.()}
      hiddenActions={[...(!props.onHistory ? ['versions'] : []), ...(!props.onSnapshot ? ['snapshot'] : []), ...(!props.onExport ? ['export'] : []), ...(!props.onAttachment ? ['attachment', 'video'] : [])]}
      onExport={() => latest.current.onExport?.(documentToMarkdown(editor.getJSON()))}
      onAttachment={() => latest.current.onAttachment?.(editor, 'file')} onVideo={() => latest.current.onAttachment?.(editor, 'video')}
      onInsertCard={() => { editor.chain().focus().insertContent({ type: 'directiveBlock', attrs: { name: 'note', attributes: '', body: '' } }).run(); }}
      onMath={display => math.open(editor, display)} formatPainterMode={painterMode} onFormatPainterMode={setPainterMode} formatPainterMarks={painterMarks} onFormatPainterMarks={setPainterMarks} />}
    <EditorContent editor={editor} />
    {math.card}
    {quick && editor && createPortal(<div className="fp-editor-menu fp-editor-quick" role="listbox" aria-label="插入内容" style={{ left: quick.left, top: quick.top, maxHeight: 280 }}>
      {choices(quick.query).map(([id, label, detail], index) => <button type="button" role="option" aria-selected={index === quick.active} tabIndex={-1} key={id} onMouseDown={event => event.preventDefault()} onClick={() => runQuick(id)}><strong>{label}</strong><small>{detail}</small></button>)}
      {!choices(quick.query).length && <p className="fp-muted">没有匹配的内容</p>}
    </div>, editor.view.dom.closest('dialog') || window.document.body)}
    {status && <footer className="fp-markdown-status">{status}</footer>}
  </section>;
}
