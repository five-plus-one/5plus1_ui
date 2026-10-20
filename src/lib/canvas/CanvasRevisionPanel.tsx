import { useState } from "react";
import type { CanvasBlock } from "./engines/types";
import {
  WorkspaceField,
  WorkspaceFeedback,
  useWorkspaceAction,
} from "../WorkspaceForms";
export interface CanvasRevisionPanelProps {
  block?: CanvasBlock;
  topic?: string;
  busy?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit?: (instruction: string) => void | Promise<void>;
  onRevisionAccepted?: (block: CanvasBlock) => void;
}
export function CanvasRevisionPanel({
  busy,
  error,
  onCancel,
  onSubmit,
}: CanvasRevisionPanelProps) {
  const [instruction, setInstruction] = useState(""),
    task = useWorkspaceAction(),
    pending = busy || task.busy;
  return (
    <form
      className="fp-canvas-revision"
      onSubmit={(e) => {
        e.preventDefault();
        if (!instruction.trim() || pending || !onSubmit) return;
        void task.run(async () => {
          await onSubmit(instruction.trim());
          setInstruction("");
          onCancel();
        });
      }}
    >
      <WorkspaceField
        label="希望如何调整画布"
        value={instruction}
        multiline
        disabled={pending}
        onChange={setInstruction}
      />
      <WorkspaceFeedback error={error || task.error} />
      <footer className="fp-workspace-actions">
        <button
          className="fp-button fp-secondary"
          type="button"
          disabled={pending}
          onClick={onCancel}
        >
          取消
        </button>
        <button
          className="fp-button fp-primary"
          type="submit"
          disabled={pending || !instruction.trim() || !onSubmit}
        >
          {pending ? "正在调整…" : "生成修改"}
        </button>
      </footer>
    </form>
  );
}
