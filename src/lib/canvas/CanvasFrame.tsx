"use client";

import { AnimatedSize } from "../AnimatedSize";
import { useState } from "react";
import type { CanvasBlock, CanvasDiagnostic } from "./engines/types";
import { Pencil as PencilSparklesIcon } from "lucide-react";
import { CanvasDiagnosticPanel } from "./CanvasDiagnosticPanel";
import { CanvasRevisionPanel } from "./CanvasRevisionPanel";

interface CanvasFrameProps {
  title?: string;
  source?: string;
  diagnostic?: CanvasDiagnostic | null;
  controls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onPointerMove?: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp?: React.PointerEventHandler<HTMLDivElement>;
  onPointerCancel?: React.PointerEventHandler<HTMLDivElement>;
  onWheel?: React.WheelEventHandler<HTMLDivElement>;
  revisionBlock?: CanvasBlock;
  revisionTopic?: string;
  revisionBusy?: boolean;
  revisionError?: string | null;
  onRevisionSubmit?: (instruction: string) => void | Promise<void>;
  onRevisionAccepted?: (block: CanvasBlock) => void;
}

export function CanvasFrame({
  title,
  source,
  diagnostic,
  controls,
  children,
  className,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onWheel,
  revisionBlock,
  revisionTopic,
  revisionBusy = false,
  revisionError,
  onRevisionSubmit,
  onRevisionAccepted,
}: CanvasFrameProps) {
  const [showRevision, setShowRevision] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const hasSource = Boolean(source?.trim());

  return (
    <div
      className={`svg-canvas-wrapper canvas-frame ${className ?? ""}`}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onWheel={onWheel}
    >
      <div className="svg-canvas-controls svg-canvas-controls-left">
        <button
          type="button"
          className="press"
          disabled={!onRevisionSubmit}
          onClick={() => setShowRevision((value) => !value)}
          title="修改画布"
          aria-label="修改画布"
        >
          <PencilSparklesIcon size={11} />
        </button>
      </div>

      {controls}

      {title ? <div className="canvas-frame-title">{title}</div> : null}
      <div className="canvas-frame-body">{children}</div>

      <CanvasDiagnosticPanel diagnostic={diagnostic} />

      <AnimatedSize>
        {showRevision ? (
          <CanvasRevisionPanel
            block={revisionBlock}
            topic={revisionTopic}
            busy={revisionBusy}
            error={revisionError}
            onCancel={() => setShowRevision(false)}
            onSubmit={onRevisionSubmit}
            onRevisionAccepted={onRevisionAccepted}
          />
        ) : null}
      </AnimatedSize>

      {hasSource ? (
        <div className="canvas-source-panel">
          <button
            type="button"
            className="viz-error-toggle press"
            onClick={() => setShowSource((value) => !value)}
          >
            {showSource ? "收起内容" : "查看内容"}
          </button>
          <AnimatedSize>
            {showSource ? (
              <pre className="viz-error-source">{source}</pre>
            ) : null}
          </AnimatedSize>
        </div>
      ) : null}
    </div>
  );
}
