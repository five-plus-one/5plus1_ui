import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ChatComposer, MediaControls, MediaSlider, NavigationCard, SelectField } from '../src/lib';

afterEach(cleanup);

it('keeps model changes separate from message actions and preserves typing focus', () => {
  function Draft() { const [text, setText] = useState(''); return <ChatComposer value={text} onChange={setText} onSend={vi.fn()} onFiles={vi.fn()} tools={<button>联网搜索</button>} footer={<button>选择模型</button>}/>; }
  const {container}=render(<Draft/>);
  const input=screen.getByRole('textbox'); input.focus();
  fireEvent.change(input,{target:{value:'请整理课堂笔记'}});
  expect(input).toHaveFocus();
  expect(container.querySelector('.fp-composer-actions')).toContainElement(screen.getByRole('button',{name:'发送消息'}));
  expect(container.querySelector('.fp-composer-footer')).toContainElement(screen.getByRole('button',{name:'选择模型'}));
});

it('allows media selection and range changes with a local dark menu', () => {
  const change=vi.fn();
  const {container}=render(<MediaControls progress={<MediaSlider aria-label="进度" value={20} onChange={change}/>}><SelectField label="速度" value="1" options={[{value:'1',label:'1×'},{value:'2',label:'2×'}]} onChange={change}/></MediaControls>);
  expect(container.firstChild).toHaveAttribute('data-theme','dark');
  fireEvent.change(screen.getByRole('slider'),{target:{value:'40'}});
  expect(change).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('combobox',{name:'速度'}));
  fireEvent.click(screen.getByRole('option',{name:'2×'}));
  expect(change).toHaveBeenLastCalledWith('2');
});

it('opens a navigation card with its accessible title and description', () => {
  const open=vi.fn(); render(<NavigationCard title="笔记本与导入" description="管理课程与发布内容" onClick={open}/>);
  fireEvent.click(screen.getByRole('button',{name:'笔记本与导入 管理课程与发布内容'}));
  expect(open).toHaveBeenCalledOnce();
});
