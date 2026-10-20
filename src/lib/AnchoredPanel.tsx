import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { usePortalTheme } from "./usePortalTheme";
export interface AnchoredPanelProps {
  anchor: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  id?: string;
  role?: "dialog" | "menu" | "listbox";
  width?: number;
  maxHeight?: number;
  className?: string;
  initialFocus?: RefObject<HTMLElement | null>;
  /** Suggestion lists keep typing in their anchor; dialogs and menus receive focus. */
  autoFocus?: boolean;
}
export function AnchoredPanel({
  anchor,
  open,
  onClose,
  children,
  label,
  id,
  role = "dialog",
  width,
  maxHeight = 320,
  className = "",
  initialFocus,
  autoFocus = role !== "listbox",
}: AnchoredPanelProps) {
  const panel = useRef<HTMLDivElement>(null),
    close = useRef(onClose);
  close.current = onClose;
  const [exiting, setExiting] = useState(false),
    [position, setPosition] = useState({
      left: 8,
      top: 8,
      width: width || 240,
      maxHeight,
    });
  const previousOpen = useRef(false);
  const theme = usePortalTheme(anchor, open);
  useLayoutEffect(() => {
    if (previousOpen.current && !open) setExiting(true);
    previousOpen.current = open;
  }, [open]);
  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => setExiting(false), 120);
    return () => clearTimeout(timer);
  }, [exiting]);
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = anchor.current?.getBoundingClientRect();
      if (!rect) {
        close.current();
        return;
      }
      const w = Math.max(
          0,
          Math.min(width || Math.max(rect.width, 240), window.innerWidth - 16),
        ),
        below = window.innerHeight - rect.bottom - 16,
        above = rect.top - 16,
        up =
          below < Math.min(panel.current?.scrollHeight || maxHeight, 200) &&
          above > below,
        height = Math.max(0, Math.min(maxHeight, up ? above : below));
      setPosition({
        left: Math.max(8, Math.min(rect.left, window.innerWidth - w - 8)),
        top: up
          ? Math.max(
              8,
              rect.top -
                Math.min(panel.current?.scrollHeight || height, height) -
                8,
            )
          : rect.bottom + 8,
        width: w,
        maxHeight: height,
      });
    };
    place();
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(place);
    if (anchor.current) observer?.observe(anchor.current);
    if (panel.current) observer?.observe(panel.current);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchor, width, maxHeight]);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      if (!autoFocus && !initialFocus?.current) return;
      (
        initialFocus?.current ||
        panel.current?.querySelector<HTMLElement>(
          'input,button,[tabindex="0"]',
        ) ||
        panel.current
      )?.focus({ preventScroll: true });
    });
    const outside = (e: Event) => {
      if (
        !panel.current?.contains(e.target as Node) &&
        !anchor.current?.contains(e.target as Node)
      )
        close.current();
    };
    const key = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        (!(e.target as HTMLElement).closest?.("[data-fp-overlay]") ||
          (e.target as HTMLElement).closest?.("[data-fp-overlay]") ===
            panel.current)
      ) {
        e.preventDefault();
        e.stopPropagation();
        close.current();
        anchor.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("focusin", outside, true);
    document.addEventListener("keydown", key, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("focusin", outside, true);
      document.removeEventListener("keydown", key, true);
    };
  }, [open, anchor, initialFocus, autoFocus]);
  if (!open && !exiting) return null;
  return createPortal(
    <div
      ref={panel}
      data-fp-overlay=""
      id={id}
      role={role}
      aria-label={label}
      tabIndex={-1}
      data-exiting={!open || undefined}
      aria-hidden={!open || undefined}
      inert={!open}
      className={`fp-popup-panel fp-anchored-panel ${className}`}
      style={{ ...theme, position: "fixed", ...position, overflow: "auto" }}
      onKeyDown={(event) => {
        if (
          role === "dialog" ||
          (event.target as HTMLElement).closest("[data-fp-overlay]") !==
            panel.current ||
          (event.target as HTMLElement).matches("input,textarea")
        )
          return;
        const items = [
            ...event.currentTarget.querySelectorAll<HTMLElement>(
              '[role="menuitem"]:not(:disabled),[role="option"]:not(:disabled)',
            ),
          ],
          index = items.indexOf(document.activeElement as HTMLElement);
        const next =
          event.key === "ArrowDown"
            ? (index + 1) % items.length
            : event.key === "ArrowUp"
              ? (index - 1 + items.length) % items.length
              : event.key === "Home"
                ? 0
                : event.key === "End"
                  ? items.length - 1
                  : -1;
        if (next >= 0) {
          event.preventDefault();
          event.stopPropagation();
          items[next]?.focus();
        }
      }}
    >
      {children}
    </div>,
    anchor.current?.closest("[data-fp-overlay],dialog") || document.body,
  );
}
