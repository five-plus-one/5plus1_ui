import { createRef, useRef, useState } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { AnchoredPanel, MemberSearch, ThemeToggle, ContentSkeleton, DiscardChangesPrompt } from '../src/lib';
import { usePortalTheme } from '../src/lib/usePortalTheme';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('focuses the draft decision and restores the previous control when resuming',()=>{
 const resume=vi.fn(),discard=vi.fn();const trigger=document.createElement('button');document.body.append(trigger);trigger.focus();
 const {unmount}=render(<DiscardChangesPrompt onContinue={resume} onDiscard={discard}/>);
 expect(screen.getByRole('button',{name:'继续编辑'})).toHaveFocus();expect(screen.getByRole('alertdialog')).toHaveAccessibleDescription('更改尚未保存。你可以继续编辑，或放弃后关闭。');
 fireEvent.click(screen.getByRole('button',{name:'继续编辑'}));expect(resume).toHaveBeenCalledOnce();expect(discard).not.toHaveBeenCalled();unmount();expect(trigger).toHaveFocus();trigger.remove();
});
it('keeps continuous typing in a suggestion anchor as results arrive',async()=>{
 function Suggestions(){const anchor=useRef<HTMLInputElement>(null);const[text,setText]=useState('');return <><input ref={anchor} aria-label="姓名" value={text} onChange={e=>setText(e.target.value)}/>{text&&<AnchoredPanel anchor={anchor} open onClose={()=>{}} role="listbox" label="成员"><button role="option">匹配成员</button></AnchoredPanel>}</>;}
 render(<Suggestions/>);const input=screen.getByLabelText('姓名');await userEvent.type(input,'FivePlusOne');await new Promise(r=>setTimeout(r,30));expect(input).toHaveValue('FivePlusOne');expect(input).toHaveFocus();
});
it('lets member search keep focus through asynchronous results and further typing',async()=>{
 render(<MemberSearch debounceMs={0} onSearch={async()=>[{id:'five',name:'五加一'}]} onPick={vi.fn()}/>);
 const input=screen.getByRole('combobox',{name:'搜索成员'});await userEvent.type(input,'Five');await screen.findByRole('option');await userEvent.type(input,'PlusOne');expect(input).toHaveValue('FivePlusOne');expect(input).toHaveFocus();
});
it('updates an open portal palette when an ancestor theme changes',async()=>{
 const anchor=createRef<HTMLDivElement>();
 vi.stubGlobal('getComputedStyle',(el:HTMLElement)=>({color:el.closest('[data-theme="dark"]')?'rgb(255, 255, 255)':'rgb(0, 0, 0)',colorScheme:'normal',fontFamily:'sans-serif',length:1,item:()=> '--fp-ink',getPropertyValue:()=>el.closest('[data-theme="dark"]')?'#ffffff':'#000000'}));
 function Palette(){const theme=usePortalTheme(anchor,true);return <div style={theme} data-testid="palette"/>;}
 const {container}=render(<section data-theme="light"><div ref={anchor}/><Palette/></section>);await waitFor(()=>expect(screen.getByTestId('palette')).toHaveStyle({color:'rgb(0, 0, 0)'}));
 act(()=>container.querySelector('section')!.setAttribute('data-theme','dark'));await waitFor(()=>expect(screen.getByTestId('palette')).toHaveStyle({color:'rgb(255, 255, 255)'}));
});
it('switches appearance with one action and renders an accessible loading surface',()=>{
 const change=vi.fn();render(<><ThemeToggle dark={false} onChange={change}/><ContentSkeleton label="正在读取笔记"/></>);fireEvent.click(screen.getByRole('button',{name:'切换为深色'}));expect(change).toHaveBeenCalledWith(true);expect(screen.getByRole('status',{name:'正在读取笔记'})).toHaveAttribute('aria-busy','true');expect(screen.queryByRole('dialog')).toBeNull();
});
it('navigates settings categories and filters them while retaining the active page',async()=>{
 const {SettingsLayout}=await import('../src/lib');
 function Settings(){const[value,setValue]=useState('appearance');return <SettingsLayout items={[{id:'appearance',label:'外观'},{id:'keyboard',label:'快捷键'}]} value={value} onChange={setValue} onClose={()=>{}}><p>{value==='appearance'?'外观设置内容':'快捷键设置内容'}</p></SettingsLayout>;}
 render(<Settings/>);fireEvent.click(screen.getByRole('button',{name:'快捷键'}));expect(screen.getByText('快捷键设置内容')).toBeVisible();expect(screen.getByRole('button',{name:'快捷键'})).toHaveAttribute('aria-current','page');await userEvent.type(screen.getByRole('textbox',{name:'搜索设置'}),'外观');expect(screen.queryByRole('button',{name:'快捷键'})).toBeNull();expect(screen.getByText('快捷键设置内容')).toBeVisible();
});

it('uses the document title once in a shared reading article',async()=>{
 const {SharedReadingPage}=await import('../src/lib');
 const {rerender}=render(<SharedReadingPage title="阅读手册" markdown={'# 阅读手册\n\n正文'} content={<><h1>阅读手册</h1><p>正文</p></>}/>);
 expect(screen.getAllByRole('heading',{level:1,name:'阅读手册'})).toHaveLength(1);
 rerender(<SharedReadingPage title="阅读手册" markdown="正文" content={<p>正文</p>}/>);
 expect(screen.getAllByRole('heading',{level:1,name:'阅读手册'})).toHaveLength(1);
});
