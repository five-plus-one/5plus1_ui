import { useEffect, useId, useRef, useState } from 'react';
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Check, Code2, Pencil } from 'lucide-react';
import { noteLowlight } from './codeBlockLowlight';
import { CollapseTransition } from '../CollapseTransition';
import { AnimatedSize } from '../AnimatedSize';
import { SelectField } from '../SelectField';
import { CODE_BLOCK_LANGUAGES } from './codeBlockLanguage';

const templates = [
  { value: 'flow', label: '流程图', code: 'flowchart LR\n  A[开始] --> B{理解}\n  B --> C[应用]' },
  { value: 'sequence', label: '时序图', code: 'sequenceDiagram\n  participant U as 用户\n  participant S as 服务\n  U->>S: 请求\n  S-->>U: 响应' },
  { value: 'state', label: '状态图', code: 'stateDiagram-v2\n  [*] --> 待办\n  待办 --> 进行中\n  进行中 --> 完成' },
];
export function MermaidPreview({ code }: { code: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, ''), generation = useRef(0);
  const [svg, setSvg] = useState(''), [error, setError] = useState(''), [theme, setTheme] = useState('');
  useEffect(() => { const sync=()=>setTheme(`${document.documentElement.dataset.theme}/${document.documentElement.dataset.product}`);sync();const observer=new MutationObserver(sync);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-product']});return()=>observer.disconnect(); },[]);
  useEffect(() => {
    const current = ++generation.current;
    const timer = setTimeout(async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        const palette=getComputedStyle(document.documentElement);
        mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', suppressErrorRendering: true, theme: 'base', themeVariables: { fontFamily: 'system-ui, sans-serif', primaryColor: palette.getPropertyValue('--fp-primary-soft').trim() || '#fff2e2', primaryTextColor: palette.getPropertyValue('--fp-ink').trim() || '#202124', primaryBorderColor: palette.getPropertyValue('--fp-line-strong').trim() || '#b9a68e', lineColor: palette.getPropertyValue('--fp-muted').trim() || '#757575' } });
        const result = await mermaid.render(`fp-mermaid-${id}-${current}`, code);
        if (generation.current === current) { setSvg(result.svg); setError(''); }
      } catch { if (generation.current === current) setError('图表语法有误，请检查连线、括号和节点名称。'); }
    }, 250);
    return () => { clearTimeout(timer); generation.current++; };
  }, [code, id, theme]);
  return <div className="fp-mermaid-preview" aria-label="图表预览"><AnimatedSize>{error ? <p role="alert">{error}</p> : svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <p role="status">正在绘制图表…</p>}</AnimatedSize></div>;
}
function CodeView({ node, editor, getPos }: NodeViewProps) {
  const mermaid = String(node.attrs.language).toLowerCase() === 'mermaid';
  const [editing, setEditing] = useState(false), [source, setSource] = useState(false);
  const code = node.textContent;
  const commit = (value: string) => {
    const pos = getPos(); if (pos === undefined || editor.isDestroyed) return;
    editor.commands.command(({ tr }) => { const current = tr.doc.nodeAt(pos); if (!current) return false; tr.replaceWith(pos + 1, pos + current.nodeSize - 1, value ? editor.schema.text(value) : []); return true; });
  };
  return <NodeViewWrapper className={mermaid ? 'fp-mermaid-node' : 'fp-code-node'}>
    {mermaid && <pre hidden aria-hidden="true"><NodeViewContent /></pre>}
    {mermaid ? <div contentEditable={false}>
      <header className="fp-code-header"><span><Code2 size={14} />Mermaid 图表</span><div>{editor.isEditable && <button type="button" aria-label={editing ? '完成图表编辑' : '编辑图表'} aria-expanded={editing} onClick={() => setEditing(value => !value)}>{editing ? <Check size={14} /> : <Pencil size={14} />}{editing ? '完成' : '编辑'}</button>}<button type="button" aria-pressed={source} onClick={() => setSource(value => !value)}>源码</button></div></header>
      <CollapseTransition isOpen={editing}><div className="fp-mermaid-source"><SelectField label="图表模板" value="" placeholder="插入模板" options={templates} onChange={value => { const template = templates.find(item => item.value === value); if (template) commit(template.code); }} /><textarea aria-label="Mermaid 源码" value={code} spellCheck={false} onChange={event => commit(event.target.value)} onKeyDown={event => { event.stopPropagation(); if (event.key === 'Escape' || (event.key === 'Enter' && (event.ctrlKey || event.metaKey))) { event.preventDefault(); setEditing(false); } }} /></div></CollapseTransition>
      {!editing && source && <pre><code>{code}</code></pre>}
      <MermaidPreview code={code} />
    </div> : <><div contentEditable={false} className="fp-code-header"><SelectField label="代码块语言" value={node.attrs.language || ''} disabled={!editor.isEditable} options={[{value:'',label:'纯文本'}, ...CODE_BLOCK_LANGUAGES]} onChange={language => { const pos = getPos(); if (pos !== undefined) editor.commands.command(({tr}) => { tr.setNodeMarkup(pos, undefined, {...node.attrs, language: language || null}); return true; }); }} /></div><pre><code><NodeViewContent /></code></pre></>}
  </NodeViewWrapper>;
}
export const VisualCodeBlock = CodeBlockLowlight.extend({ addNodeView() { return ReactNodeViewRenderer(CodeView); } }).configure({ lowlight: noteLowlight });
