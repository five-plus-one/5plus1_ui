import { useCallback, useEffect, useState } from 'react';
export function useCanvasFullscreen() {
  const [fullscreen, setFullscreen] = useState(false), toggle = useCallback(() => setFullscreen(v => !v), []), exit = useCallback(() => setFullscreen(false), []);
  useEffect(() => { if (!fullscreen) return; const previous = document.activeElement as HTMLElement | null; const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); exit(); } }; document.addEventListener('keydown', key, true); return () => { document.removeEventListener('keydown', key, true); previous?.focus({ preventScroll: true }); }; }, [fullscreen, exit]);
  return { fullscreen, toggle, exit };
}
