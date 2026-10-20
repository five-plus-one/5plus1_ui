"use client";

import { useEffect, useRef, useState } from "react";

const THEME_COLORS = [
  { label: "墨色", value: "#1f2937" },
  { label: "白", value: "#ffffff" },
  { label: "红", value: "#dc2626" },
  { label: "橙", value: "#ea580c" },
  { label: "黄", value: "#ca8a04" },
  { label: "绿", value: "#16a34a" },
  { label: "青", value: "#0891b2" },
  { label: "蓝", value: "#2563eb" },
  { label: "紫", value: "#7c3aed" },
  { label: "粉", value: "#db2777" },
];

const STANDARD_COLORS = [
  "#000000", "#7f1d1d", "#9a3412", "#854d0e", "#166534",
  "#0e7490", "#1d4ed8", "#6d28d9", "#9d174d", "#525252",
];

const HIGHLIGHT_COLORS = [
  "#fef08a", "#bbf7d0", "#a5f3fc", "#ddd6fe", "#fecdd3",
  "#fde68a", "#86efac", "#67e8f9", "#c4b5fd", "#fda4af",
];

const TRANSLUCENT_COLORS = [
  "rgba(17,24,39,0.55)", "rgba(220,38,38,0.45)", "rgba(234,88,12,0.45)",
  "rgba(22,163,74,0.45)", "rgba(37,99,235,0.45)", "rgba(124,58,237,0.45)",
];

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem("fp-toolbar-recent-colors");
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return Array.isArray(parsed) ? parsed.filter(v => typeof v === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

function pushRecent(color: string) {
  const next = [color, ...readRecent().filter(item => item !== color)].slice(0, 8);
  try { localStorage.setItem("fp-toolbar-recent-colors", JSON.stringify(next)); } catch { /* ignore */ }
}

export default function ToolbarColorPicker({
  mode,
  current,
  onApply,
  onClose,
}: {
  mode: "text" | "highlight";
  current?: string | null;
  onApply: (color: string | null) => void;
  onClose: () => void;
}) {
  const [recent, setRecent] = useState<string[]>([]);
  const [custom, setCustom] = useState(current?.startsWith('#') ? current : '#FD8B07');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setRecent(readRecent()), []);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onClose();
    };
    const escape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", escape);
    };
  }, [onClose]);

  const choose = (color: string | null) => {
    if (color) pushRecent(color);
    setRecent(readRecent());
    onApply(color);
    onClose();
  };

  const swatches = (colors: readonly string[] | readonly { label: string; value: string }[]) =>
    colors.map(item => {
      const value = typeof item === "string" ? item : item.value;
      const label = typeof item === "string" ? value : item.label;
      return (
        <button
          key={value}
          type="button"
          title={label}
          aria-label={label}
          className="toolbar-color-swatch"
          style={{ background: value }}
          data-active={current === value || undefined}
          onClick={() => choose(value)}
        />
      );
    });

  return (
    <div ref={rootRef} className="toolbar-color-picker" role="listbox" aria-label={mode === "text" ? "字体颜色" : "荧光笔颜色"}>
      {recent.length > 0 && (
        <section>
          <h4>最近使用</h4>
          <div className="toolbar-color-grid">{swatches(recent)}</div>
        </section>
      )}
      <section>
        <h4>{mode === "text" ? "主题色" : "荧光笔"}</h4>
        <div className="toolbar-color-grid">{swatches(mode === "text" ? THEME_COLORS : HIGHLIGHT_COLORS)}</div>
      </section>
      {mode === "text" && (
        <>
          <section>
            <h4>标准色</h4>
            <div className="toolbar-color-grid">{swatches(STANDARD_COLORS)}</div>
          </section>
          <section>
            <h4>半透明</h4>
            <div className="toolbar-color-grid">{swatches(TRANSLUCENT_COLORS)}</div>
          </section>
        </>
      )}
      <section>
        <h4>自定义</h4>
        <div className="toolbar-color-custom">
          <input
            type="text"
            aria-label="自定义颜色"
            value={custom}
            placeholder="#FD8B07"
            onChange={event => setCustom(event.target.value)}
          />
          <button type="button" disabled={!/^#[0-9a-f]{6}$/i.test(custom)} onClick={() => choose(custom)}>应用</button>
          <button type="button" onClick={() => choose(mode === "text" ? null : "#fef08a")}>
            {mode === "text" ? "默认颜色" : "默认高亮"}
          </button>
        </div>
      </section>
    </div>
  );
}
