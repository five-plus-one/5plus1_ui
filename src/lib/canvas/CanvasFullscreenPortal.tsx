import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
/** A stable portal target preserves the view while moving between inline and full screen. */
export function CanvasFullscreenPortal({
  open,
  onExit,
  children,
  label = "学习画布",
}: {
  open: boolean;
  onExit: () => void;
  children: ReactNode;
  label?: string;
}) {
  const placeholder = useRef<HTMLDivElement>(null),
    stage = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLElement | null>(null);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const node = document.createElement("div");
    node.className = "fp-canvas-portal-content";
    setTarget(node);
    return () => node.remove();
  }, []);
  useLayoutEffect(() => {
    if (target) (open ? stage.current : placeholder.current)?.append(target);
  }, [target, open]);
  useEffect(() => {
    if (!open) return;
    trigger.current = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() =>
      stage.current
        ?.querySelector<HTMLElement>('button:not(:disabled),[tabindex="0"]')
        ?.focus({ preventScroll: true }),
    );
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <div ref={placeholder} />
      {target && createPortal(children, target)}
      {open &&
        createPortal(
          <div className="canvas-fullscreen-backdrop" onClick={onExit}>
            <div
              ref={stage}
              className="canvas-fullscreen-stage"
              role="dialog"
              aria-modal="true"
              aria-label={label}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (
                  event.key === "Escape" &&
                  (event.target as HTMLElement).closest("[data-fp-overlay]")
                )
                  return;
                if (event.key === "Escape") {
                  event.preventDefault();
                  event.stopPropagation();
                  onExit();
                }
                if (event.key !== "Tab") return;
                const nodes = [
                  ...event.currentTarget.querySelectorAll<HTMLElement>(
                    'button:not(:disabled),input:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]',
                  ),
                ].filter((node) => node.getClientRects().length);
                const first = nodes[0],
                  last = nodes.at(-1);
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
