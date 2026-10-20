import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ResourcePreview } from '../src/lib';
import { animateFormulaTransition, cancelFormulaTransition } from '../src/lib/editor/formulaTransition';
if(!Element.prototype.animate)Element.prototype.animate=vi.fn() as never;

afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();});
it('keeps the current resource when a previous text response finishes late',async()=>{
 let resolveOld!:(value:Response)=>void;
 vi.stubGlobal('fetch',vi.fn((url:string)=>url==='/old'?new Promise<Response>(resolve=>{resolveOld=resolve;}):Promise.resolve(new Response('当前资料'))));
 const view=render(<ResourcePreview resource={{url:'/old',name:'old.txt',mediaType:'text/plain'}}/>);
 view.rerender(<ResourcePreview resource={{url:'/new',name:'new.txt',mediaType:'text/plain'}}/>);
 await screen.findByText('当前资料');
 await act(async()=>{resolveOld(new Response('上一份资料'));});
 expect(screen.getByText('当前资料')).toBeInTheDocument();expect(screen.queryByText('上一份资料')).not.toBeInTheDocument();
});
it('releases paragraph constraints and the closing snapshot when reopening a formula',()=>{
 const animations:{cancel:ReturnType<typeof vi.fn>;onfinish:null|(()=>void);oncancel:null|(()=>void)}[]=[];
 vi.spyOn(Element.prototype,'animate').mockImplementation(()=>{const animation={cancel:vi.fn(),onfinish:null,oncancel:null};animations.push(animation);return animation as unknown as Animation;});
 const paragraph=document.createElement('p'),overlay=document.createElement('div');document.body.append(paragraph,overlay);
 animateFormulaTransition(paragraph,overlay,300,40);
 expect(overlay.isConnected).toBe(true);cancelFormulaTransition(paragraph);
 expect(overlay.isConnected).toBe(false);expect(animations.every(animation=>animation.cancel.mock.calls.length===1)).toBe(true);
 cancelFormulaTransition(paragraph);expect(animations.every(animation=>animation.cancel.mock.calls.length===1)).toBe(true);
 paragraph.remove();
});
it('finishes a formula contraction with clean paragraph styles',()=>{
 const animations:{cancel:ReturnType<typeof vi.fn>;onfinish:null|(()=>void);oncancel:null|(()=>void)}[]=[];
 vi.spyOn(Element.prototype,'animate').mockImplementation(()=>{const animation={cancel:vi.fn(),onfinish:null,oncancel:null};animations.push(animation);return animation as unknown as Animation;});
 const paragraph=document.createElement('p'),overlay=document.createElement('div');document.body.append(paragraph,overlay);
 animateFormulaTransition(paragraph,overlay,300,40);animations[2].onfinish?.();
 expect(overlay.isConnected).toBe(false);expect(animations.every(animation=>animation.cancel.mock.calls.length===1)).toBe(true);
 expect(paragraph.style.height).toBe('');expect(paragraph.style.opacity).toBe('');paragraph.remove();
});
