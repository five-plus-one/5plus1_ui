import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

/** Carry the anchor's product palette into a surface mounted outside its DOM scope. */
export function usePortalTheme(
  anchor: RefObject<HTMLElement | null>,
  open: boolean,
) {
  const [theme, setTheme] = useState<CSSProperties>({});
  useLayoutEffect(() => {
    if (!open || !anchor.current) return;
    const readTheme = () => {
    if (!anchor.current) return;
    const computed = getComputedStyle(anchor.current);
    const values: Record<string, string> = {
      color: computed.color,
      colorScheme: computed.colorScheme,
      fontFamily: computed.fontFamily,
    };
    for (let index = 0; index < computed.length; index++) {
      const property = computed.item(index);
      if (property.startsWith("--fp-"))
        values[property] = computed.getPropertyValue(property);
    }
    setTheme(previous => {
      const next = values as CSSProperties;
      return JSON.stringify(previous) === JSON.stringify(next) ? previous : next;
    });
    };
    readTheme();
    const observer = new MutationObserver(readTheme);
    for (let node: HTMLElement | null = anchor.current; node; node = node.parentElement)
      observer.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme", "data-product"] });
    const system = window.matchMedia?.("(prefers-color-scheme: dark)");
    system?.addEventListener("change", readTheme);
    return () => { observer.disconnect(); system?.removeEventListener("change", readTheme); };
  }, [anchor, open]);
  return theme;
}
