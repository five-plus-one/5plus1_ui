import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { Editor } from '@tiptap/core';
import { AttachmentPicker, MarkdownEditor, MemberSearch, SelectField, ShareLink, UploadQueue, type MemberSearchResult } from '../src/lib';

vi.mock('mermaid', () => ({ default: { initialize: vi.fn(), render: async (_id:string, source:string) => ({ svg: `<svg role="img" aria-label="流程图"><text>${source.includes('验证')?'验证':'开始'}</text></svg>` }) } }));
afterEach(cleanup);
it('opens slash commands after whitespace and preserves preceding content', async () => {
  let editor!: Editor;
  render(<MarkdownEditor markdown="" onReady={instance => { editor=instance; instance.view.coordsAtPos=()=>({left:20,right:20,top:20,bottom:40}); }} />);
  await waitFor(()=>expect(editor).toBeDefined());
  act(()=>{editor.commands.insertContent('正文 /mermaid');});
  const choice=await screen.findByRole('option',{name:/Mermaid 图表/});
  fireEvent.mouseDown(choice);fireEvent.click(choice);
  expect(editor.getText()).toContain('正文 ');expect(editor.getText()).not.toContain('/mermaid');
  expect(editor.getJSON().content?.some(node=>node.type==='codeBlock'&&node.attrs?.language==='mermaid')).toBe(true);
});
it('retains attachment selection after a failed submission and allows retry', async () => {
  const submit = vi.fn().mockRejectedValueOnce(new Error()).mockResolvedValueOnce(undefined);
  render(<AttachmentPicker items={[{id:'pdf',name:'讲义.pdf'}]} selectedIds={['pdf']} onChange={()=>{}} onConfirm={submit} />);
  fireEvent.click(screen.getByRole('button',{name:'添加资料'}));
  await screen.findByRole('alert');expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked','true');
  fireEvent.click(screen.getByRole('button',{name:'添加资料'}));
  await waitFor(()=>expect(submit).toHaveBeenCalledTimes(2));expect(submit).toHaveBeenLastCalledWith(['pdf']);
});
it('bounds upload progress and exposes actions for the task state', () => {
  const cancel=vi.fn(),retry=vi.fn();
  render(<UploadQueue tasks={[{id:'one',name:'讲义.pdf',status:'uploading',progress:120},{id:'two',name:'笔记.md',status:'error'}]} onCancel={cancel} onRetry={retry}/>);
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow','100');
  fireEvent.click(screen.getByRole('button',{name:'取消上传讲义.pdf'}));expect(cancel).toHaveBeenCalledWith('one');
  fireEvent.click(screen.getByRole('button',{name:'重试笔记.md'}));expect(retry).toHaveBeenCalledWith('two');
});
it('selects themed options by keyboard and restores focus', async () => {
  const change=vi.fn();render(<SelectField label="权限" value="read" onChange={change} options={[{value:'read',label:'可阅读'},{value:'edit',label:'可编辑'}]} />);
  const trigger=screen.getByRole('button',{name:'权限'});fireEvent.click(trigger);
  await waitFor(()=>expect(screen.getByRole('option',{name:'可阅读'})).toHaveFocus());
  fireEvent.keyDown(screen.getByRole('option',{name:'可阅读'}),{key:'ArrowDown'});
  expect(screen.getByRole('option',{name:'可编辑'})).toHaveFocus();fireEvent.click(screen.getByRole('option',{name:'可编辑'}));
  expect(change).toHaveBeenCalledWith('edit');expect(trigger).toHaveFocus();expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
it('cancels stale member searches, excludes existing members and supports selection', async () => {
  const requests:{signal:AbortSignal;resolve:(members:MemberSearchResult[])=>void}[]=[],pick=vi.fn();
  const search=vi.fn((_query:string,_kind:string,signal:AbortSignal)=>new Promise<MemberSearchResult[]>(resolve=>requests.push({signal,resolve})));
  render(<MemberSearch debounceMs={0} excludedIds={['owner']} onSearch={search} onPick={pick}/>);
  const input=screen.getByRole('combobox',{name:'搜索成员'});fireEvent.change(input,{target:{value:'林'}});
  await waitFor(()=>expect(requests).toHaveLength(1));fireEvent.change(input,{target:{value:'陈'}});
  await waitFor(()=>expect(requests).toHaveLength(2));expect(requests[0].signal.aborted).toBe(true);
  await act(async()=>{requests[1].resolve([{id:'owner',name:'所有者'},{id:'chen',name:'陈同学'}]);requests[0].resolve([{id:'lin',name:'林同学'}]);});
  expect(screen.queryByRole('option',{name:/所有者|林同学/})).not.toBeInTheDocument();
  fireEvent.keyDown(input,{key:'Enter'});expect(pick).toHaveBeenCalledWith({id:'chen',name:'陈同学'},'user');expect(input).toHaveValue('');
});
it('retains sharing state on failed settings and reports copy results', async()=>{
  const copy=vi.fn().mockResolvedValue(undefined),change=vi.fn().mockRejectedValue(new Error());
  render(<ShareLink enabled url="https://example.com/share" access="read" onAccessChange={()=>{}} onEnabledChange={change} onCopy={copy}/>);
  fireEvent.click(screen.getByRole('switch'));await screen.findByRole('alert');expect(screen.getByRole('switch')).toHaveAttribute('aria-checked','true');
  fireEvent.click(screen.getByRole('button',{name:'复制链接'}));await screen.findByText('链接已复制');expect(copy).toHaveBeenCalledWith('https://example.com/share');
});
it('edits Mermaid source and serializes the updated graph into Markdown',async()=>{
  const change=vi.fn();render(<MarkdownEditor markdown={'```mermaid\nflowchart LR\n A[开始] --> B[完成]\n```'} onChange={change}/>);
  fireEvent.click(await screen.findByRole('button',{name:'编辑图表'}));
  fireEvent.change(screen.getByRole('textbox',{name:'Mermaid 源码'}),{target:{value:'flowchart LR\n A[验证] --> B[完成]'}});
  expect(change).toHaveBeenLastCalledWith(expect.stringContaining('A[验证]'),expect.objectContaining({type:'doc'}));
  fireEvent.click(screen.getByRole('button',{name:'完成图表编辑'}));
  await screen.findByRole('img',{name:'流程图'});expect(screen.getByRole('img',{name:'流程图'})).toHaveTextContent('验证');
  expect(screen.queryByRole('textbox',{name:'Mermaid 源码'})).not.toBeInTheDocument();
});
