const active = new WeakMap<HTMLElement, () => void>();

export function cancelFormulaTransition(target: HTMLElement) {
  active.get(target)?.();
}

/** Keeps the paragraph and its closing card in the same transition lifetime. */
export function animateFormulaTransition(target: HTMLElement, overlay: HTMLElement, before: number, after: number) {
  cancelFormulaTransition(target);
  const options = { duration: 220, easing: 'cubic-bezier(.2,0,0,1)' };
  const height = target.animate([{height:`${before}px`,overflow:'clip'},{height:`${after}px`,overflow:'clip'}],options);
  const opacity = target.animate([{opacity:0},{opacity:0,offset:.35},{opacity:1}],options);
  const closing = overlay.animate([{height:`${before}px`,opacity:1},{height:`${after}px`,opacity:0}],options);
  const cleanup = () => {
    if(active.get(target)!==cleanup)return;
    active.delete(target);
    overlay.remove();
    height.cancel(); opacity.cancel(); closing.cancel();
  };
  active.set(target,cleanup);
  closing.onfinish=cleanup;
  closing.oncancel=cleanup;
}
