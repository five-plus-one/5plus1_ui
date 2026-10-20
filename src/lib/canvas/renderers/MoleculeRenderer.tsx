import { createContext, useContext, useEffect, useState } from "react";
import type { CanvasBlock, MoleculeCanvasBlock } from "../engines/types";
import { CanvasFrame } from "../CanvasFrame";
import { RawSvgRenderer } from "./RawSvgRenderer";
export const MoleculeRenderContext = createContext<
  | ((
      source: string,
      options: { width: number; height: number; signal: AbortSignal },
    ) => Promise<string>)
  | null
>(null);
export function MoleculeRenderer({
  block,
  revisionTopic,
  onRevisionSubmit,
  onRevisionAccepted,
}: {
  block: MoleculeCanvasBlock;
  revisionTopic?: string;
  onRevisionSubmit?: (instruction: string) => Promise<void> | void;
  onRevisionAccepted?: (block: CanvasBlock) => void;
}) {
  const render = useContext(MoleculeRenderContext),
    [result, setResult] = useState({ key: "", svg: "", error: "" });
  useEffect(() => {
    if (!render) return;
    const controller = new AbortController();
    setResult({ key: block.source, svg: "", error: "" });
    void render(block.source, {
      width: block.width || 380,
      height: block.height || 300,
      signal: controller.signal,
    })
      .then((svg) => {
        if (!controller.signal.aborted)
          setResult({ key: block.source, svg, error: "" });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({
            key: block.source,
            svg: "",
            error: "分子结构暂时无法显示，请检查后重试。",
          });
      });
    return () => controller.abort();
  }, [render, block.source, block.width, block.height]);
  const props = { revisionTopic, onRevisionSubmit, onRevisionAccepted };
  return result.key === block.source && result.svg ? (
    <RawSvgRenderer
      {...props}
      block={{ ...block, kind: "raw-svg", source: result.svg }}
    />
  ) : (
    <CanvasFrame
      {...props}
      title={block.title || "分子结构"}
      source={block.source}
      revisionBlock={block}
    >
      <p role="status">
        {result.error ||
          (render ? "正在绘制分子结构…" : "选择分子结构，查看对应内容。")}
      </p>
    </CanvasFrame>
  );
}
