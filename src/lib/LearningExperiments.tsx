import { useState, type ReactNode } from "react";
import { learningExperiments, getInteractive } from "./learning/registry";
import { LearningSourceContext } from "./learning/numerical-methods/SourceViewer";
import { AnimatedSize } from "./AnimatedSize";
import {
  LearningSourceView,
  type LearningSourceResource,
} from "./LearningSourceView";
import { SurfaceBoundary } from "./SurfaceBoundary";
import {
  WorkspaceSection,
  WorkspaceField,
  WorkspaceFeedback,
  useWorkspaceAction,
} from "./WorkspaceForms";
export { learningExperiments };
export { getInteractive as getLearningExperiment };
export type { InteractiveMeta as LearningExperimentMeta } from "./learning/registry";
export interface LearningExperimentProps {
  id: string;
  sources?: Record<string, LearningSourceResource>;
  renderSource?: (
    id: string,
    kind: "audio" | "document" | "transcript",
  ) => ReactNode;
}
export function LearningExperiment({
  id,
  renderSource,
  sources,
}: LearningExperimentProps) {
  const experiment = getInteractive(id);
  if (!experiment) return <p>暂时无法打开此实验，请重新选择。</p>;
  const Component = experiment.Component;
  return (
    <LearningSourceContext.Provider
      value={
        renderSource ||
        (sources
          ? (key, kind) =>
              sources[`${key}:${kind}`] || sources[key] ? (
                <LearningSourceView
                  key={`${key}:${kind}`}
                  source={sources[`${key}:${kind}`] || sources[key]}
                />
              ) : (
                <p>此资料暂不可用。</p>
              )
          : null)
      }
    >
      <SurfaceBoundary resetKey={id}>
        <AnimatedSize>
          <div className="fp-lab-content" aria-label={experiment.title}>
            <Component />
          </div>
        </AnimatedSize>
      </SurfaceBoundary>
    </LearningSourceContext.Provider>
  );
}
export function ExperimentLibrary({
  value,
  onSelect,
  onSave,
  renderSource,
  sources,
}: {
  value?: string;
  onSelect?: (id: string) => void;
  onSave?: (id: string) => Promise<void> | void;
  renderSource?: LearningExperimentProps["renderSource"];
  sources?: LearningExperimentProps["sources"];
}) {
  const [query, setQuery] = useState(""),
    [subject, setSubject] = useState("all"),
    [local, setLocal] = useState(""),
    task = useWorkspaceAction(),
    active = value ?? local;
  const subjects: Record<string, string> = {
    probability: "概率论",
    chemistry: "有机化学",
    physics: "大学物理",
    "discrete-math": "离散数学",
    "numerical-methods": "数值计算",
  };
  return (
    <section className="fp-workspace-form">
      <WorkspaceSection
        title="交互实验"
        description="改变条件，观察结果，检验自己的理解。"
      >
        <div className="fp-workspace-grid">
          <WorkspaceField label="搜索实验" value={query} onChange={setQuery} />
          <WorkspaceField
            label="实验学科"
            value={subject}
            onChange={setSubject}
            options={[
              { value: "all", label: "全部学科" },
              ...Object.entries(subjects).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
        </div>
        <div className="fp-workspace-split">
          <nav
            className="fp-workspace-item-list fp-experiment-list"
            aria-label="交互实验列表"
          >
            {learningExperiments
              .filter(
                (e) =>
                  (subject === "all" || subject === e.subjectId) &&
                  `${e.title} ${e.description || ""}`.includes(query),
              )
              .map((e) => (
                <button
                  type="button"
                  key={e.id}
                  aria-pressed={active === e.id}
                  onClick={() => {
                    setLocal(e.id);
                    onSelect?.(e.id);
                  }}
                >
                  <strong>{e.title}</strong>
                  <small>{subjects[e.subjectId] || e.subjectId}</small>
                </button>
              ))}
          </nav>
          <div>
            {active ? (
              <>
                <LearningExperiment
                  id={active}
                  renderSource={renderSource}
                  sources={sources}
                />
                {onSave && (
                  <button
                    type="button"
                    disabled={task.busy}
                    className="fp-button fp-secondary"
                    onClick={() =>
                      void task.run(() => onSave(active), "实验已保存到笔记。")
                    }
                  >
                    保存到笔记
                  </button>
                )}
              </>
            ) : (
              <div className="fp-workspace-empty">选择一个实验开始探索。</div>
            )}
          </div>
        </div>
        <WorkspaceFeedback {...task} />
      </WorkspaceSection>
    </section>
  );
}
