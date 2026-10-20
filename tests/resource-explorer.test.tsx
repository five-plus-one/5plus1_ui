import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,it,expect,vi} from 'vitest';
import {ContextMenu,ResourceExplorer} from '../src/lib';
afterEach(cleanup);
it('opens context actions with keyboard, enters a submenu and dismisses with Escape',async()=>{
 const select=vi.fn();render(<ContextMenu items={[{id:'view',label:'视图',children:[{id:'grid',label:'网格',onSelect:select}]}]}><span>文件区</span></ContextMenu>);
 fireEvent.keyDown(screen.getByText('文件区').parentElement!,{key:'F10',shiftKey:true});
 await waitFor(()=>expect(screen.getByRole('menuitem',{name:'视图'})).toHaveFocus());
 fireEvent.keyDown(screen.getByRole('menuitem',{name:'视图'}),{key:'ArrowRight'});
 fireEvent.click(screen.getByRole('menuitem',{name:'网格'}));expect(select).toHaveBeenCalledOnce();expect(screen.queryByRole('menu')).toBeNull();
 fireEvent.contextMenu(screen.getByText('文件区'),{clientX:20,clientY:20});fireEvent.keyDown(document,{key:'Escape'});expect(screen.queryByRole('menu')).toBeNull();
});
it('navigates folders, filters resources and selects files in both views',()=>{
 const change=vi.fn(),selection=vi.fn();render(<ResourceExplorer items={[{id:'folder',name:'资料',kind:'folder'},{id:'file',name:'讲义.pdf',kind:'file',size:2048}]} selectedIds={[]} onSelectionChange={selection} onFolderChange={change} onOpen={()=>{}}/>);
 fireEvent.click(screen.getByRole('button',{name:'资料'}));expect(change).toHaveBeenCalledWith('folder');
 fireEvent.click(screen.getByRole('checkbox',{name:'选择讲义.pdf'}));expect(selection).toHaveBeenCalledWith(['file']);
 fireEvent.click(screen.getByRole('button',{name:'网格视图'}));expect(screen.getByRole('button',{name:'网格视图'})).toHaveAttribute('aria-pressed','true');
 fireEvent.change(screen.getByRole('textbox',{name:'搜索当前文件夹'}),{target:{value:'讲义'}});expect(screen.queryByRole('button',{name:'资料'})).toBeNull();expect(screen.getByRole('button',{name:'讲义.pdf'})).toBeInTheDocument();
});
