import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

/** Controls retain a dark media palette, including menus rendered in a portal. */
export function MediaControls({ progress, children, className = "", ...props }: HTMLAttributes<HTMLDivElement> & { progress?: ReactNode }) {
  return <div {...props} data-theme="dark" className={`fp-media-controls ${className}`}>
    {progress && <div className="fp-media-progress">{progress}</div>}
    <div className="fp-media-toolbar">{children}</div>
  </div>;
}

/** A styled range keeps native keyboard and assistive technology behavior. */
export function MediaSlider({ className = "", style, min = 0, max = 100, value, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const fill = Math.max(0, Math.min(100, (Number(value ?? min) - Number(min)) / (Number(max) - Number(min) || 1) * 100));
  return <input {...props} type="range" min={min} max={max} value={value} className={`fp-media-slider ${className}`} style={{ ...style, "--fp-media-fill": `${fill}%` } as CSSProperties} />;
}
