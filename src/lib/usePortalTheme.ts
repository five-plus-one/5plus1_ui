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
    setTheme(values as CSSProperties);
  }, [anchor, open]);
  return theme;
}
