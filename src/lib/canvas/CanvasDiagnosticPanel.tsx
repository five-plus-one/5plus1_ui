import type { CanvasDiagnostic } from "./engines/types";
export function CanvasDiagnosticPanel({
  diagnostic,
}: {
  diagnostic?: CanvasDiagnostic | null;
}) {
  return !diagnostic || diagnostic.ok ? null : (
    <div className="fp-canvas-status" role="status">
      <strong>画布暂时无法显示</strong>
      <p>请检查内容，或通过“修改画布”调整后再试。</p>
    </div>
  );
}
