import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { Tabs, Switch, Rating, DatePicker, TimePicker, ColorPicker, SelectField, Accordion, FileTree, MemberSearch } from '../src/lib';

afterEach(cleanup);
it('keeps tabs, switches and ratings within a form from submitting it',async()=>{
 const submit=vi.fn(event=>event.preventDefault()),change=vi.fn();
 render(<form onSubmit={submit}><Tabs items={[{value:'a',label:'笔记'},{value:'b',label:'资料'}]} value="a" onChange={change}/><Switch label="提醒" checked={false} onChange={change}/><Rating value={1} onChange={change}/></form>);
 const user=userEvent.setup();await user.click(screen.getByRole('tab',{name:'资料'}));await user.click(screen.getByRole('switch'));await user.click(screen.getByRole('button',{name:'3 星'}));
 expect(change).toHaveBeenCalledTimes(3);expect(submit).not.toHaveBeenCalled();
});
it('opens the calendar at the externally selected month',async()=>{
 const view=render(<DatePicker aria-label="日期" value="2026-02-23" onChange={()=>{}}/>);
 fireEvent.click(screen.getByRole('button',{name:'选择日期'}));expect(screen.getByRole('button',{name:'2026-02-23'})).toHaveAttribute('aria-pressed','true');
 fireEvent.keyDown(document,{key:'Escape'});
 view.rerender(<DatePicker aria-label="日期" value="2027-08-12" onChange={()=>{}}/>);
 fireEvent.click(screen.getByRole('button',{name:'选择日期'}));
 await waitFor(()=>expect(screen.getByRole('button',{name:'2027-08-12'})).toHaveAttribute('aria-pressed','true'));
});
it('validates typed dates and times with the form',()=>{
 render(<><DatePicker aria-label="日期" defaultValue="2026-02-30"/><TimePicker aria-label="时间" defaultValue="25:00"/></>);
 expect(screen.getByRole('textbox',{name:'日期'})).toBeInvalid();expect(screen.getByRole('textbox',{name:'时间'})).toBeInvalid();
 fireEvent.change(screen.getByRole('textbox',{name:'日期'}),{target:{value:'2026-02-28'}});
 expect(screen.getByRole('textbox',{name:'日期'})).toBeValid();
 fireEvent.click(screen.getByRole('button',{name:'选择日期'}));expect(screen.getByRole('button',{name:'2026-02-28'})).toHaveAttribute('aria-pressed','true');
});
it('disables times outside the allowed interval',()=>{
 render(<TimePicker aria-label="时间" defaultValue="10:30" min="10:15" max="11:00"/>);
 fireEvent.click(screen.getByRole('button',{name:'选择时间'}));
 const minutes=screen.getByRole('group',{name:'分钟'});
 expect(minutes.querySelectorAll('button')[14]).toBeDisabled();expect(minutes.querySelectorAll('button')[15]).toBeEnabled();
 const hours=screen.getByRole('group',{name:'小时'});expect(hours.querySelectorAll('button')[9]).toBeDisabled();expect(hours.querySelectorAll('button')[10]).toBeEnabled();
 fireEvent.click(hours.querySelectorAll('button')[11]);expect(screen.getByRole('textbox',{name:'时间'})).toHaveValue('11:00');
});
it('keeps HEX input synchronized with controlled color updates',()=>{
 const view=render(<ColorPicker label="颜色" value="#FD8B07" onChange={()=>{}}/>);
 fireEvent.click(screen.getByRole('button',{name:'颜色'}));
 view.rerender(<ColorPicker label="颜色" value="#1A73E8" onChange={()=>{}}/>);
 expect(screen.getByRole('textbox',{name:'十六进制颜色'})).toHaveValue('#1A73E8');
});
it('focuses selection search and chooses a matching enabled result with Enter',async()=>{
 const change=vi.fn();render(<SelectField label="卡片类型" value="a" searchable options={[{value:'a',label:'说明'},{value:'b',label:'概念',disabled:true},{value:'c',label:'概念比较'}]} onChange={change}/>);
 fireEvent.click(screen.getByRole('combobox',{name:'卡片类型'}));const search=screen.getByRole('textbox',{name:'搜索选项'});
 await waitFor(()=>expect(search).toHaveFocus());
 fireEvent.change(search,{target:{value:'概念'}});fireEvent.keyDown(search,{key:'Enter'});
 expect(change).toHaveBeenCalledWith('c');expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
it('keeps collapsed accordion controls out of the keyboard path',async()=>{
 render(<Accordion items={[{title:'详细设置',content:<button>保存设置</button>}]}/>);
 const trigger=screen.getByRole('button',{name:'详细设置'});
 expect(screen.queryByRole('button',{name:'保存设置'})).not.toBeInTheDocument();fireEvent.click(trigger);
 expect(screen.getByRole('button',{name:'保存设置'})).toBeInTheDocument();fireEvent.click(trigger);
 expect(screen.queryByRole('button',{name:'保存设置'})).not.toBeInTheDocument();
});
it('delegates context-menu opening to the file host',()=>{
 const open=vi.fn(),select=vi.fn(),node={id:'a',kind:'file' as const,name:'讲义.pdf'};
 render(<FileTree items={[node]} onSelect={select} onOpen={open}/>);
 fireEvent.contextMenu(screen.getByRole('treeitem'),{clientX:40,clientY:40,ctrlKey:true});
 expect(open).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('menuitem',{name:'打开'}));
 expect(select).toHaveBeenCalledWith(node);expect(open).toHaveBeenCalledWith(node,expect.objectContaining({ctrlKey:true}));
});
it('skips disabled members during keyboard search navigation',async()=>{
 const pick=vi.fn();render(<MemberSearch debounceMs={0} onPick={pick} onSearch={async()=>[{id:'1',name:'甲'},{id:'2',name:'乙',disabled:true},{id:'3',name:'丙'}]}/>);
 const input=screen.getByRole('combobox');fireEvent.change(input,{target:{value:'同学'}});
 await screen.findByRole('option',{name:'丙 添加'});fireEvent.keyDown(input,{key:'ArrowDown'});fireEvent.keyDown(input,{key:'Enter'});
 expect(pick).toHaveBeenCalledWith(expect.objectContaining({id:'3'}),'user');
});
