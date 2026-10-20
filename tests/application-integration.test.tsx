import { createRef } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ChatComposer, ConversationViewport, FileTree, ResourceExplorer } from '../src/lib';

afterEach(cleanup);

it('connects the host scroll controller to the conversation viewport', () => {
  const viewport = createRef<HTMLDivElement>();
  const scroll = vi.fn();
  render(<ConversationViewport ref={viewport} onScroll={scroll} aria-label="对话记录"><p>学习记录</p></ConversationViewport>);
  expect(viewport.current).toBe(screen.getByLabelText('对话记录'));
  fireEvent.scroll(viewport.current!, { target: { scrollTop: 120 } });
  expect(scroll).toHaveBeenCalledOnce();
});

it('lets the host handle pasted files before the composer fallback', () => {
  const input = createRef<HTMLTextAreaElement>();
  const files = vi.fn();
  const paste = vi.fn(event => event.preventDefault());
  render(<ChatComposer inputRef={input} inputProps={{onPaste:paste}} value="" onChange={vi.fn()} onSend={vi.fn()} onFiles={files}/>);
  expect(input.current).toBe(screen.getByRole('textbox', {name:'消息'}));
  fireEvent.paste(input.current!, {clipboardData:{files:[new File(['notes'], 'notes.txt')],getData:()=>''}});
  expect(paste).toHaveBeenCalledOnce();
  expect(files).not.toHaveBeenCalled();
});

it('keeps tree children outside the host row decoration', () => {
  render(<FileTree expandedIds={['folder']} onSelect={vi.fn()} items={[{id:'folder',name:'课程资料',kind:'folder',children:[{id:'note',name:'课堂笔记',kind:'file'}]}]} renderRow={(node,row)=><div data-testid={`row-${node.id}`}>{row}</div>}/>);
  expect(screen.getByTestId('row-folder')).toHaveTextContent('课程资料');
  expect(screen.getByTestId('row-folder')).not.toHaveTextContent('课堂笔记');
  expect(screen.getByTestId('row-note')).toHaveTextContent('课堂笔记');
});

it('respects host resource permissions for keyboard deletion and controlled search', () => {
  const action=vi.fn(), query=vi.fn();
  const {container}=render(<ResourceExplorer availableActions={['download']} query="笔记" onQueryChange={query} items={[{id:'note',name:'课堂笔记.md',kind:'file'}]} selectedIds={['note']} onSelectionChange={vi.fn()} onFolderChange={vi.fn()} onOpen={vi.fn()} onAction={action}/>);
  fireEvent.keyDown(container.querySelector('.fp-explorer-content')!,{key:'Delete'});
  expect(action).not.toHaveBeenCalled();
  const search=screen.getByRole('textbox',{name:'搜索当前文件夹'});
  fireEvent.change(search,{target:{value:'公式'}});
  expect(query).toHaveBeenCalledWith('公式');
  expect(search).toHaveValue('笔记');
});
