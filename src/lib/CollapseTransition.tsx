import type { ReactNode } from 'react';

export interface CollapseTransitionProps { isOpen: boolean; children: ReactNode; duration?: number; easing?: string }
/** Grid interpolation follows dynamic content and reverses smoothly during rapid toggles. */
export function CollapseTransition({ isOpen, children, duration = 240, easing = 'cubic-bezier(0.2, 0, 0, 1)' }: CollapseTransitionProps) {
  return <div className="fp-collapse-transition" data-open={isOpen || undefined} aria-hidden={!isOpen} inert={!isOpen} style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: `grid-template-rows ${duration}ms ${easing}, opacity ${duration}ms ${easing}`, opacity: isOpen ? 1 : 0 }}><div style={{ minHeight: 0, overflow: 'hidden' }}>{children}</div></div>;
}
