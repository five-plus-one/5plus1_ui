/** ImageGallery - 从课栈 chat/ImageStrip + NoteImageGallery 提取
 *
 * 横向图片画廊：可拖动滚动，点击打开灯箱查看大图。
 * 合并了两个原始组件的职责：拖动容器与图片列表。
 */

import { useRef, useState, type PointerEvent } from "react";
import { ImageIcon } from "lucide-react";
import { MediaLightbox } from "./MediaLightbox";

export interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  label?: string;
  /** 每张缩略图的边长 */
  size?: number;
  /** 顶栏右侧附加信息，例如检索词 */
  meta?: string;
}

const DRAG_THRESHOLD = 4;

export function ImageGallery({
  images,
  label = "笔记图片",
  size = 132,
  meta,
}: ImageGalleryProps) {
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [active, setActive] = useState<GalleryImage | null>(null);

  if (!images.length) return null;

  return (
    <section className="fp-gallery">
      <header className="fp-gallery-head">
        <ImageIcon size={15} aria-hidden="true" />
        <span>
          {label} · {images.length} 张
        </span>
        {meta && <small>{meta}</small>}
      </header>
      <div
        ref={strip}
        className="fp-gallery-strip"
        data-dragging={drag.current?.moved || undefined}
        onPointerDown={(e: PointerEvent<HTMLDivElement>) => {
          const el = strip.current;
          if (!el || e.button !== 0) return;
          drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const el = strip.current;
          const d = drag.current;
          if (!el || !d) return;
          const dx = e.clientX - d.x;
          if (!d.moved && Math.abs(dx) >= DRAG_THRESHOLD) {
            d.moved = true;
            el.setPointerCapture(e.pointerId);
          }
          if (d.moved) el.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        {images.map((img, i) => (
          <button
            key={`${img.src}:${i}`}
            type="button"
            className="fp-gallery-item"
            style={{ width: size, height: size }}
            onClick={() => {
              if (drag.current?.moved) return;
              setActive(img);
            }}
          >
            <img src={img.src} alt={img.alt || img.caption || `图片 ${i + 1}`} />
            {img.caption && <span>{img.caption}</span>}
          </button>
        ))}
      </div>
      <MediaLightbox
        src={active?.src ?? null}
        alt={active?.alt || active?.caption}
        onClose={() => setActive(null)}
      />
    </section>
  );
}
