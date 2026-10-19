import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {Dropdown,Popover} from '../src/lib';
afterEach(cleanup);
it('dismisses a menu outside and restores trigger focus on Escape',()=>{
 render(<><Dropdown label="更多操作" items={[{label:'重命名',onClick:vi.fn()}]}/><button>其他位置</button></>);
 const trigger=screen.getByRole('button',{name:'更多操作'});
 fireEvent.click(trigger); expect(screen.getByRole('menu')).toBeInTheDocument();
 fireEvent.pointerDown(screen.getByText('其他位置')); expect(screen.queryByRole('menu')).not.toBeInTheDocument();
 fireEvent.click(trigger); fireEvent.keyDown(document,{key:'Escape'});
 expect(screen.queryByRole('menu')).not.toBeInTheDocument(); expect(trigger).toHaveFocus();
});
it('supports keyboard navigation and closes after an action',async()=>{
 const action=vi.fn();render(<Dropdown label="菜单" items={[{label:'第一项',onClick:vi.fn()},{label:'第二项',onClick:action}]}/>);
 fireEvent.keyDown(screen.getByRole('button',{name:'菜单'}),{key:'ArrowDown'});
 await waitFor(()=>expect(screen.getByRole('menuitem',{name:'第一项'})).toHaveFocus());
 fireEvent.keyDown(document.activeElement!,{key:'End'});expect(screen.getByRole('menuitem',{name:'第二项'})).toHaveFocus();
 fireEvent.click(document.activeElement!);expect(action).toHaveBeenCalledOnce();expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});
it('keeps interacting with popover content open',()=>{
 render(<Popover label="设置"><input aria-label="名称"/></Popover>);fireEvent.click(screen.getByRole('button',{name:'设置'}));fireEvent.pointerDown(screen.getByRole('textbox'));expect(screen.getByRole('dialog')).toBeInTheDocument();
});
it('renders nested menus within the containing modal',()=>{
 render(<dialog open><Dropdown label="文档操作" items={[{label:'复制',onClick:vi.fn()}]}/></dialog>);
 fireEvent.click(screen.getByRole('button',{name:'文档操作'}));expect(screen.getByRole('menu').closest('dialog')).not.toBeNull();
});
