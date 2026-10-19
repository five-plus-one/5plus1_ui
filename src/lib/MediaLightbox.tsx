/** MediaLightbox - 从课栈 shared/ImageLightbox 提取
 *
 * 全屏图片查看：缩放、拖动平移、双击复位、键盘 Esc 关闭。
 * 适合笔记图片、课件截图等需要细看的内容。
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export interface MediaLightboxProps {
  /** 图片地址；为 null 时关闭 */
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export function MediaLightbox({ src, alt = "", onClose }: MediaLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!src) return;
    setZoom(1);
    setPan({ x: 0, y: 0 });
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=")
        setZoom((z) => Math.min(5, z * 1.2));
      if (e.key === "-") setZoom((z) => Math.max(0.25, z / 1.2));
      if (e.key === "0") {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [src, onClose]);

  const reset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  if (!src || typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fp-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt || "图片预览"}
      onWheel={(e) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        setZoom((z) => Math.max(0.25, Math.min(5, z * (e.deltaY > 0 ? 0.9 : 1.1))));
      }}
    >
      <div className="fp-lightbox-bar">
        <span className="fp-lightbox-zoom">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          aria-label="缩小"
          onClick={() => setZoom((z) => Math.max(0.25, z / 1.2))}
        >
          <ZoomOut size={17} />
        </button>
        <button
          type="button"
          aria-label="放大"
          onClick={() => setZoom((z) => Math.min(5, z * 1.2))}
        >
          <ZoomIn size={17} />
        </button>
        <button type="button" aria-label="复位" onClick={reset}>
          <RotateCcw size={17} />
        </button>
        <button type="button" aria-label="关闭" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div
        className="fp-lightbox-stage"
        data-dragging={dragging || undefined}
        onDoubleClick={() => (zoom > 1 ? reset() : setZoom(2))}
        onPointerDown={(e) => {
          if (e.button !== 0 || zoom <= 1) return;
          setDragging(true);
          dragStart.current = { x: e.clientX, y: e.clientY };
          panStart.current = { ...pan };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          setPan({
            x: panStart.current.x + e.clientX - dragStart.current.x,
            y: panStart.current.y + e.clientY - dragStart.current.y,
          });
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragging ? "none" : "transform 160ms var(--fp-ease)",
          }}
        />
      </div>
      <button
        type="button"
        className="fp-lightbox-scrim"
        aria-label="关闭预览"
        onClick={onClose}
      />
    </div>,
    document.body,
  );
}
