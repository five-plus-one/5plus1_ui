import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ColorPicker, Combobox, DatePicker, Select, TimePicker } from '../src/lib';
afterEach(cleanup);
it('selects a date in the themed calendar and respects date boundaries',async()=>{
  const change=vi.fn();const {container}=render(<DatePicker aria-label="日期" defaultValue="2026-10-20" min="2026-10-20" max="2026-10-22" onChange={event=>change(event.target.value)}/>);
  expect(container.querySelector('input[type=date]')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'选择日期'}));
  expect(screen.getByRole('button',{name:'2026-10-19'})).toBeDisabled();
  fireEvent.click(screen.getByRole('button',{name:'2026-10-21'}));
  expect(change).toHaveBeenCalledWith('2026-10-21');expect(screen.getByRole('textbox',{name:'日期'})).toHaveValue('2026-10-21');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
it('selects time without opening the device picker',()=>{
  const change=vi.fn();render(<TimePicker aria-label="时间" defaultValue="09:00" onChange={event=>change(event.target.value)}/>);
  fireEvent.click(screen.getByRole('button',{name:'选择时间'}));
  fireEvent.click(screen.getByRole('group',{name:'分钟'}).querySelectorAll('button')[30]);
  expect(change).toHaveBeenCalledWith('09:30');
});
it('retains the select form value and change event contract',async()=>{
  const change=vi.fn();const {container}=render(<form><Select name="access" aria-label="权限" options={[{value:'read',label:'阅读'},{value:'edit',label:'编辑'}]} defaultValue="read" onChange={event=>change(event.target.value)}/></form>);
  fireEvent.click(screen.getByRole('combobox',{name:'权限'}));fireEvent.click(screen.getByRole('option',{name:'编辑'}));
  await waitFor(()=>expect(change).toHaveBeenCalledWith('edit'));
  expect(new FormData(container.querySelector('form')!).get('access')).toBe('edit');
  expect(container.querySelector('select')).not.toBeVisible();
});
it('provides keyboard choices and HEX entry without native popups',()=>{
  const pick=vi.fn();const {container}=render(<><Combobox label="分类" options={['笔记','资料']} value="" onChange={pick}/><ColorPicker label="颜色" value="#FD8B07" onChange={pick}/></>);
  const combo=screen.getByRole('combobox');fireEvent.focus(combo);fireEvent.keyDown(combo,{key:'ArrowDown'});fireEvent.keyDown(combo,{key:'Enter'});expect(pick).toHaveBeenCalledWith('资料');
  fireEvent.click(screen.getByRole('button',{name:'颜色'}));fireEvent.change(screen.getByRole('textbox',{name:'十六进制颜色'}),{target:{value:'#123456'}});expect(pick).toHaveBeenCalledWith('#123456');
  expect(container.querySelector('input[type=color],datalist')).toBeNull();
});
