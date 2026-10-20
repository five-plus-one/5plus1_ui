import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CanvasBlock } from "./canvas/engines/types";
import { CanvasBlockRenderer } from "./canvas/CanvasBlockRenderer";
import { MoleculeRenderContext } from "./canvas/renderers/MoleculeRenderer";
import {
  WorkspaceSection,
  WorkspaceFeedback,
  useWorkspaceAction,
} from "./WorkspaceForms";
import { SettingsTabs } from "./WorkspaceForms";
import { AnimatedSize } from "./AnimatedSize";
export type {
  CanvasBlock,
  CanvasDiagnostic,
  PlotSpec,
  CanvasAttrs,
  PlotAttrs,
} from "./canvas/engines/types";
export { CanvasBlockRenderer } from "./canvas/CanvasBlockRenderer";
export { CanvasRevisionPanel } from "./canvas/CanvasRevisionPanel";
export { CanvasDiagnosticPanel } from "./canvas/CanvasDiagnosticPanel";
export { default as SvgCanvas } from "./canvas/SvgCanvas";
export { FunctionPlot } from "./canvas/FunctionPlot";
export { compileMathExpr, calculateTicks } from "./canvas/canvasUtils";
export { sanitizeSvg } from "./canvas/engines/sanitizeSvg";
export interface CanvasWorkspaceProps {
  value: CanvasBlock;
  onChange: (block: CanvasBlock) => void;
  onRevise?: (
    block: CanvasBlock,
    instruction: string,
    signal: AbortSignal,
  ) => Promise<CanvasBlock>;
  renderMolecule?: React.ContextType<typeof MoleculeRenderContext>;
  recorder?: ReactNode;
  onDiagnostic?: (error: unknown) => void;
}
export function CanvasWorkspace({
  value,
  onChange,
  onRevise,
  renderMolecule,
  recorder,
  onDiagnostic,
}: CanvasWorkspaceProps) {
  const [candidate, setCandidate] = useState<CanvasBlock | null>(null),
    [view, setView] = useState("current"),
    task = useWorkspaceAction();
  const pending = useRef<AbortController | null>(null),
    current = useRef(value);
  current.current = value;
  useEffect(() => () => pending.current?.abort(), []);
  useEffect(() => {
    setCandidate(null);
    setView("current");
    pending.current?.abort();
  }, [value]);
  return (
    <MoleculeRenderContext.Provider value={renderMolecule || null}>
      <section className="fp-workspace-form fp-canvas-workspace">
        <WorkspaceSection
          title={value.title || "学习画布"}
          description="探索图形，提出修改，再确认需要保留的版本。"
        >
          <SettingsTabs
            label="画布版本"
            value={view}
            onChange={setView}
            items={[
              { id: "current", label: "当前版本" },
              ...(candidate ? [{ id: "candidate", label: "修改预览" }] : []),
              ...(recorder ? [{ id: "recording", label: "操作回放" }] : []),
            ]}
          />
          <WorkspaceFeedback {...task} />
          <AnimatedSize>
            {view === "recording" ? (
              recorder
            ) : (
              <CanvasBlockRenderer
                block={view === "candidate" && candidate ? candidate : value}
                onRevisionSubmit={
                  onRevise
                    ? async (instruction) => {
                        pending.current?.abort();
                        const controller = new AbortController();
                        pending.current = controller;
                        let failure: unknown;
                        const snapshot = value;
                        const ok = await task.run(async () => {
                          try {
                            const next = await onRevise(
                              snapshot,
                              instruction,
                              controller.signal,
                            );
                            if (
                              controller.signal.aborted ||
                              current.current !== snapshot
                            )
                              return;
                            setCandidate(next);
                            setView("candidate");
                          } catch (cause) {
                            failure = cause;
                            throw cause;
                          }
                        });
                        if (!ok) {
                          onDiagnostic?.(failure);
                          throw new Error("画布修改未完成，请保留输入后重试。");
                        }
                      }
                    : undefined
                }
              />
            )}
          </AnimatedSize>
          {candidate && (
            <div className="fp-workspace-actions">
              <button
                type="button"
                className="fp-button fp-primary"
                onClick={() => {
                  onChange(candidate);
                  setCandidate(null);
                  setView("current");
                }}
              >
                采用此版本
              </button>
              <button
                type="button"
                className="fp-button fp-secondary"
                onClick={() => {
                  setCandidate(null);
                  setView("current");
                }}
              >
                保留当前版本
              </button>
            </div>
          )}
        </WorkspaceSection>
      </section>
    </MoleculeRenderContext.Provider>
  );
}
