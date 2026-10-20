import { useEffect, useId, useRef } from "react";
export function DiscardChangesPrompt({ onContinue, onDiscard }: { onContinue: () => void; onDiscard: () => void }) {
  const resume = useRef<HTMLButtonElement>(null);
  const description = useId();
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;resume.current?.focus();return()=>{if(previous?.isConnected)previous.focus();};},[]);
  return <div className="fp-discard-backdrop"><section className="fp-discard-prompt" role="alertdialog" aria-modal="true" aria-label="保存当前更改" aria-describedby={description}>
    <h2>保留这次更改？</h2><p id={description}>更改尚未保存。你可以继续编辑，或放弃后关闭。</p>
    <footer><button ref={resume} type="button" className="fp-button fp-secondary" onClick={onContinue}>继续编辑</button><button type="button" className="fp-button fp-danger" onClick={onDiscard}>放弃更改</button></footer>
  </section></div>;
}
