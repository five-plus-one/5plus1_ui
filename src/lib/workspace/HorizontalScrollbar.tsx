"use client";

import { useRef, useState } from "react";

export default function HorizontalScrollbar({
  value,
  max,
  viewport,
  controls,
  onChange,
}: {
  value: number;
  max: number;
  viewport: number;
  controls: string;
  onChange: (value: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; value: number; travel: number } | null>(
    null,
  );
  const [dragging, setDragging] = useState(false);

  const safeMax = Math.max(0, max);
  const ratio =
    safeMax <= 0
      ? 1
      : Math.max(0.08, Math.min(1, viewport / Math.max(1, viewport + safeMax)));
  const progress = safeMax > 0 ? Math.min(1, Math.max(0, value / safeMax)) : 0;
  const position = progress * (1 - ratio);

  const clamp = (next: number) => Math.max(0, Math.min(safeMax, next));
  const move = (next: number) => onChange(clamp(next));

  return (
    <div
      ref={track}
      className="horizontal-scrollbar"
      role="scrollbar"
      aria-label="横向滚动预览"
      aria-orientation="horizontal"
      aria-controls={controls}
      aria-valuemin={0}
      aria-valuemax={Math.round(safeMax)}
      aria-valuenow={Math.round(value)}
      data-dragging={dragging || undefined}
      tabIndex={0}
      onPointerDown={(event) => {
        if (event.button !== 0 || !track.current) return;
        const box = track.current.getBoundingClientRect();
        const travel = box.width * (1 - ratio);
        const next =
          event.target === event.currentTarget
            ? ((event.clientX - box.left - (box.width * ratio) / 2) /
                Math.max(1, travel)) *
              safeMax
            : value;
        move(next);
        drag.current = {
          x: event.clientX,
          value: clamp(next),
          travel,
        };
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        move(
          drag.current.value +
            ((event.clientX - drag.current.x) / Math.max(1, drag.current.travel)) *
              safeMax,
        );
      }}
      onPointerUp={(event) => {
        drag.current = null;
        setDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
      }}
      onKeyDown={(event) => {
        const step =
          event.key === "ArrowLeft"
            ? -48
            : event.key === "ArrowRight"
              ? 48
              : event.key === "PageUp"
                ? -viewport
                : event.key === "PageDown"
                  ? viewport
                  : 0;
        if (step || event.key === "Home" || event.key === "End") {
          event.preventDefault();
          move(
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? safeMax
                : value + step,
          );
        }
      }}
    >
      <span
        className="horizontal-scrollbar-fill"
        style={{ width: `${(position + ratio) * 100}%` }}
        aria-hidden="true"
      />
      <span
        className="horizontal-scrollbar-thumb"
        style={{ width: `${ratio * 100}%`, left: `${position * 100}%` }}
        aria-hidden="true"
      />
    </div>
  );
}
