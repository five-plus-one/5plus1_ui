import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Measures intrinsic content, including async loads, without animating the content itself. */
export function AnimatedSize({ children, initialHeight, className }: { children: ReactNode; initialHeight?: number; className?: string }) {
  const content = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(initialHeight);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const element = content.current;
    if (!element) return;
    const measure = () => setHeight(element.getBoundingClientRect().height);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <motion.div className={className} data-animated-size="" initial={initialHeight === undefined ? false : { height: initialHeight, opacity: 0 }}
    animate={{ height: height ?? 'auto', opacity: 1 }} exit={{ height: initialHeight ?? 0, opacity: 0 }}
    transition={{ duration: reduced ? 0 : .24, ease: [.2, 0, 0, 1] }} style={{ overflow: 'clip', minWidth: 0 }}>
    <div ref={content} style={{ display: 'flow-root', minWidth: 0 }}>{children}</div>
  </motion.div>;
}
