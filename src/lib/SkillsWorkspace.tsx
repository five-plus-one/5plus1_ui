import { useState } from "react";
import { AsyncAction } from "./ManagementViews";
import {
  WorkspaceSection,
  WorkspaceField,
  WorkspaceToggle,
  WorkspaceFeedback,
  WorkspaceSave,
  useWorkspaceAction,
  useWorkspaceDraft,
} from "./WorkspaceForms";
export interface EditableSkill {
  id: string;
  name: string;
  description: string;
  content: string;
  pinned: boolean;
}
export interface SkillsWorkspaceProps {
  skills: EditableSkill[];
  maxSkills?: number;
  maxFileBytes?: number;
  onSave: (skills: EditableSkill[]) => Promise<void> | void;
  onExport?: (skill: EditableSkill) => void;
}
export function parseSkillFile(
  raw: string,
  filename: string,
): Omit<EditableSkill, "id" | "pinned"> {
  const normalized = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  const fields = Object.fromEntries(
    (match?.[1] || "").split("\n").flatMap((line) => {
      const item = line.match(/^(name|description):\s*(.*?)\s*$/);
      return item ? [[item[1], item[2].replace(/^(['"])(.*)\1$/, "$2")]] : [];
    }),
  );
  return {
    name: fields.name || filename.replace(/\.(md|markdown)$/i, ""),
    description: fields.description || "",
    content: match ? normalized.slice(match[0].length) : normalized,
  };
}
export function SkillsWorkspace({
  skills,
  maxSkills = 100,
  maxFileBytes = 2_000_000,
  onSave,
  onExport,
}: SkillsWorkspaceProps) {
  const { draft, setDraft, dirty, accept } = useWorkspaceDraft(skills),
    task = useWorkspaceAction();
  const [query, setQuery] = useState(""),
    [active, setActive] = useState<string | null>(null);
  const selected = draft.find((s) => s.id === active);
  const update = (patch: Partial<EditableSkill>) =>
    setDraft(draft.map((s) => (s.id === active ? { ...s, ...patch } : s)));
  const importFiles = async (files: File[]) => {
    await task.run(async () => {
      const additions: EditableSkill[] = [];
      if (draft.length + files.length > maxSkills)
        throw new Error(`最多可保留 ${maxSkills} 个技能，请先整理后再导入。`);
      for (const file of files) {
        if (!/\.(md|markdown)$/i.test(file.name))
          throw new Error("请选择 Markdown 技能文件。");
        if (file.size > maxFileBytes)
          throw new Error(`${file.name} 超出文件大小限制。`);
        additions.push({
          ...parseSkillFile(await file.text(), file.name),
          id: crypto.randomUUID(),
          pinned: false,
        });
      }
      setDraft([...draft, ...additions]);
      if (additions[0]) setActive(additions[0].id);
    }, "文件已读入，保存后即可使用。");
  };
  return (
    <section className="fp-workspace-form" aria-label="技能管理">
      <WorkspaceSection
        title="技能库"
        description={`${draft.length} / ${maxSkills} 个技能`}
        actions={
          <>
            <label
              className="fp-button fp-secondary"
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (
                  !task.busy &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  event.currentTarget.querySelector("input")?.click();
                }
              }}
            >
              导入文件
              <input
                aria-label="导入技能文件"
                hidden
                type="file"
                accept=".md,.markdown,text/markdown"
                multiple
                disabled={task.busy}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  e.target.value = "";
                  if (files.length) void importFiles(files);
                }}
              />
            </label>
            <button
              type="button"
              className="fp-button fp-secondary"
              disabled={task.busy || draft.length >= maxSkills}
              onClick={() => {
                const next = {
                  id: crypto.randomUUID(),
                  name: "新技能",
                  description: "",
                  content: "",
                  pinned: false,
                };
                setDraft([...draft, next]);
                setActive(next.id);
              }}
            >
              新建技能
            </button>
            <WorkspaceSave
              busy={task.busy}
              dirty={dirty}
              onClick={() => {
                if (draft.some((s) => !s.name.trim())) {
                  task.setError("请填写技能名称。");
                  return;
                }
                void task.run(async () => {
                  await onSave(draft);
                  accept(draft);
                }, "技能库已保存。");
              }}
            />
          </>
        }
      >
        <WorkspaceFeedback {...task} />
        <div className="fp-workspace-split">
          <aside>
            <WorkspaceField
              label="搜索技能"
              value={query}
              onChange={setQuery}
            />
            <nav aria-label="技能列表" className="fp-workspace-item-list">
              {draft
                .filter((s) =>
                  `${s.name} ${s.description}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                )
                .map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    aria-pressed={active === s.id}
                    onClick={() => setActive(s.id)}
                  >
                    <strong>{s.name}</strong>
                    <small>
                      {s.pinned ? "始终使用" : "按需使用"} ·{" "}
                      {new Blob([s.content]).size.toLocaleString()} B
                    </small>
                  </button>
                ))}
            </nav>
            {!draft.length && <p>添加技能，为学习助手补充工作方法。</p>}
          </aside>
          <div>
            {selected ? (
              <fieldset disabled={task.busy}>
                <WorkspaceField
                  label="技能名称"
                  value={selected.name}
                  onChange={(v) => update({ name: v })}
                />
                <WorkspaceField
                  label="技能说明"
                  value={selected.description}
                  onChange={(v) => update({ description: v })}
                />
                <WorkspaceField
                  label="技能正文"
                  multiline
                  value={selected.content}
                  onChange={(v) => update({ content: v })}
                />
                <WorkspaceToggle
                  label="始终使用此技能"
                  description="关闭后，助手会按任务需要使用。"
                  checked={selected.pinned}
                  onChange={(v) => update({ pinned: v })}
                />
                <div className="fp-workspace-actions">
                  {onExport && (
                    <button
                      type="button"
                      className="fp-button fp-secondary"
                      onClick={() => onExport(selected)}
                    >
                      导出技能
                    </button>
                  )}
                  <AsyncAction
                    confirm={`删除“${selected.name}”？保存后生效。`}
                    onAction={() => {
                      setDraft(draft.filter((s) => s.id !== active));
                      setActive(null);
                    }}
                  >
                    删除技能
                  </AsyncAction>
                </div>
              </fieldset>
            ) : (
              <div className="fp-workspace-empty">
                选择一个技能，查看和编辑内容。
              </div>
            )}
          </div>
        </div>
      </WorkspaceSection>
    </section>
  );
}
