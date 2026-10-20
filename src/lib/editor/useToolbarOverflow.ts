"use client";
import { useLayoutEffect, useRef, useState } from "react";
export type ToolbarItem = { id: string; priority: number; width?: number; actions?: readonly unknown[] };

/** Keep visual order stable while removing the least important groups first. */
export function partitionToolbarItems<T extends ToolbarItem>(items: readonly T[], available: number, width = (item: T) => item.width ?? 0) {
  const retained = new Set(items.map(item => item.id));
  const total = () => items.reduce((sum, item) => sum + (retained.has(item.id) ? width(item) : 0), 0) + Math.max(0, retained.size - 1) * 4;
  for (const item of [...items].sort((a, b) => a.priority - b.priority || items.indexOf(b) - items.indexOf(a))) {
    if (total() <= Math.max(0, available)) break;
    retained.delete(item.id);
  }
  return { visible: items.filter(item => retained.has(item.id)), overflow: items.filter(item => !retained.has(item.id)) };
}
export type ToolbarMode = "full" | "icons" | "group";
export function planToolbar<T extends ToolbarItem>(items: readonly T[], available: number, width: (item: T, mode: ToolbarMode) => number) {
  // Choose the complete layout together: collapsing a large group must not leave
  // earlier groups folded when their commands would now fit in the freed space.
  let best: { modes: Record<string, ToolbarMode>; score: number } | null = null;
  const visit = (index: number, used: number, score: number, modes: Record<string, ToolbarMode>) => {
    if (used > available) return;
    if (index === items.length) {
      if (!best || score > best.score) best = { modes: { ...modes }, score };
      return;
    }
    const item = items[index], count = item.actions?.length ?? 1;
    for (const mode of ["full", "icons", "group"] as const) {
      const exposed = mode === "group" ? 0 : count;
      const utility = exposed * 100000 + exposed * item.priority * 100 + (mode === "full" ? count * item.priority : 0);
      modes[item.id] = mode;
      visit(index + 1, used + width(item, mode) + (index ? 4 : 0), score + utility, modes);
    }
  };
  visit(0, 0, 0, {});
  if (best) return { modes: (best as { modes: Record<string, ToolbarMode> }).modes, visible: [...items], overflow: [] as T[] };
  const modes: Record<string, ToolbarMode> = Object.fromEntries(items.map(item => [item.id, "full"]));
  const order = [...items].sort((a, b) => a.priority - b.priority);
  const total = () => items.reduce((sum, item) => sum + width(item, modes[item.id]), 0) + Math.max(0, items.length - 1) * 4;
  for (const mode of ["icons", "group"] as const) {
    for (const item of order) {
      if (total() <= available) return { modes, visible: [...items], overflow: [] as T[] };
      if (width(item, mode) < width(item, modes[item.id])) modes[item.id] = mode;
    }
  }
  if (total() <= available) return { modes, visible: [...items], overflow: [] as T[] };
  return { modes, ...partitionToolbarItems(items, available - 40, item => width(item, modes[item.id])) };
}
export function useToolbarOverflow<T extends ToolbarItem>(items: readonly T[]) {
  const hostRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ modes: Record<string, ToolbarMode>; ids: string[] }>({ modes: {}, ids: [] });
  useLayoutEffect(() => {
    const host = hostRef.current, measure = measureRef.current;
    if (!host || !measure || !host.parentElement) return;
    const parent = host.parentElement;
    let frame = 0;
    let alive = true;
    const update = () => {
      if (!alive) return;
      const widths = new Map(Array.from(measure.querySelectorAll<HTMLElement>("[data-measure-mode] [data-group]")).map(child => [`${child.parentElement!.dataset.measureMode}:${child.dataset.group}`, child.getBoundingClientRect().width]));
      const style = getComputedStyle(parent);
      const available = parent.clientWidth - parseFloat(style.paddingLeft || "0") - parseFloat(style.paddingRight || "0");
      const next = planToolbar(items, Math.floor(available / 8) * 8, (item, mode) => widths.get(`${mode}:${item.id}`) ?? Infinity);
      const value = { modes: next.modes, ids: next.visible.map(item => item.id) };
      setLayout(previous => JSON.stringify(previous) === JSON.stringify(value) ? previous : value);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(parent); observer?.observe(measure);
    window.addEventListener("resize", schedule);
    document.fonts?.addEventListener("loadingdone", schedule);
    void document.fonts?.ready.then(() => { if (alive) schedule(); });
    return () => { alive = false; cancelAnimationFrame(frame); observer?.disconnect(); window.removeEventListener("resize", schedule); document.fonts?.removeEventListener("loadingdone", schedule); };
  });
  return { hostRef, measureRef, modes: layout.modes, visible: items.filter(item => layout.ids.includes(item.id)), overflow: items.filter(item => !layout.ids.includes(item.id)) };
}
