import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { productThemes, type ProductTheme } from "./themes";
import { ColorPicker } from "./StyledInputs";
import { AsyncAction } from "./ManagementViews";
import {
  WorkspaceSection,
  WorkspaceField,
  SettingsTabs,
  WorkspaceToggle,
} from "./WorkspaceForms";
export interface ContentTypography {
  font: string;
  fontSize: number;
  lineHeight: number;
  inherit: boolean;
}
export interface AppearancePreferences {
  theme: "light" | "dark" | "system";
  mode: "default" | "colorful" | "custom";
  lightAccent: string;
  darkAccent: string;
  selection: string;
  font: string;
  regions: Record<string, ContentTypography>;
}
export const READING_FONTS = [
  { value: "system", label: "系统默认" },
  { value: "songti", label: "宋体阅读" },
  { value: "kaiti", label: "楷体手写" },
  { value: "hei", label: "黑体清晰" },
  { value: "serif", label: "英文衬线" },
  { value: "mono", label: "等宽" },
];
const fontCSS: Record<string, string> = {
  system: "system-ui, sans-serif",
  songti: '"Noto Serif SC", SimSun, serif',
  kaiti: "KaiTi, STKaiti, serif",
  hei: '"Microsoft YaHei", sans-serif',
  serif: "Georgia, serif",
  mono: "Consolas, monospace",
};
/** Apply these variables to the host appearance scope; the selected product supplies the default palette. */
export function appearanceStyles(
  value: AppearancePreferences,
  systemDark = false,
  product: ProductTheme = "brand",
): CSSProperties {
  const dark =
    value.theme === "dark" || (value.theme === "system" && systemDark);
  const surface = dark ? "#1d1f22" : "#ffffff";
  const styles: Record<string, string> = {
    colorScheme: dark ? "dark" : "light",
    fontFamily: fontCSS[value.font] || value.font,
    "--fp-bg": dark ? "#141517" : "#fbfaf8",
    "--fp-surface": surface,
    "--fp-surface-muted": dark ? "#26282c" : "#f4f2ef",
    "--fp-surface-sunken": dark ? "#101113" : "#eeebe7",
    "--fp-ink": dark ? "#e8eaed" : "#202124",
    "--fp-muted": dark ? "#a9adb4" : "#6b7075",
    "--fp-faint": dark ? "#7c828a" : "#9aa0a6",
    "--fp-line": dark ? "#34373c" : "#e6e3df",
    "--fp-line-strong": dark ? "#464a50" : "#d3cfca",
  };
  const palette = productThemes[product] as {
    primary: string;
    onPrimary: string;
    soft: string;
    ink: string;
    darkPrimary?: string;
    darkOnPrimary?: string;
    darkSoft: string;
    darkInk: string;
    action?: string;
    onAction?: string;
    darkAction?: string;
    darkOnAction?: string;
  };
  Object.assign(styles, {
    "--fp-primary": dark
      ? palette.darkPrimary || palette.primary
      : palette.primary,
    "--fp-on-primary": dark
      ? palette.darkOnPrimary || palette.onPrimary
      : palette.onPrimary,
    "--fp-primary-soft": dark ? palette.darkSoft : palette.soft,
    "--fp-primary-ink": dark ? palette.darkInk : palette.ink,
    "--fp-action": dark
      ? palette.darkAction || palette.darkPrimary || palette.primary
      : palette.action || palette.primary,
    "--fp-on-action": dark
      ? palette.darkOnAction || palette.darkOnPrimary || palette.onPrimary
      : palette.onAction || palette.onPrimary,
  });
  const accent = dark ? value.darkAccent : value.lightAccent;
  if (value.mode === "custom" && /^#[\da-f]{6}$/i.test(accent)) {
    const rgb = [1, 3, 5].map((i) => parseInt(accent.slice(i, i + 2), 16)),
      mix = (factor: number, to: number) =>
        "#" +
        rgb
          .map((n) =>
            Math.round(n + (to - n) * factor)
              .toString(16)
              .padStart(2, "0"),
          )
          .join("");
    const luminance = (hex: string) => {
      const channels = [1, 3, 5]
        .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    let action = accent;
    for (let amount = 0; amount <= 0.9; amount += 0.05) {
      action = mix(amount, dark ? 255 : 0);
      const l = luminance(action);
      if (dark ? (l + 0.05) / 0.05 >= 7 : 1.05 / (l + 0.05) >= 4.5) break;
    }
    Object.assign(styles, {
      "--fp-primary": accent,
      "--fp-on-primary": luminance(accent) > 0.179 ? "#202124" : "#ffffff",
      "--fp-primary-soft": `color-mix(in srgb, ${accent} 14%, ${surface})`,
      "--fp-primary-ink": dark ? mix(0.5, 255) : mix(0.35, 0),
      "--fp-action": action,
      "--fp-on-action": dark ? "#101113" : "#ffffff",
    });
  }
  if (/^#[\da-f]{6}$/i.test(value.selection))
    styles["--fp-selection"] = value.selection;
  styles["--fp-heading-color"] = value.mode === "colorful" ? styles["--fp-primary-ink"] : styles["--fp-ink"];
  return styles as CSSProperties;
}
export function resolveContentTypography(
  value: AppearancePreferences,
  region: string,
): CSSProperties {
  const local = value.regions[region];
  return {
    fontFamily:
      fontCSS[!local || local.inherit ? value.font : local.font] || (!local || local.inherit ? value.font : local.font),
    fontSize: local && !local.inherit ? local.fontSize : undefined,
    lineHeight: local && !local.inherit ? local.lineHeight : undefined,
  };
}
export function AppearanceWorkspace({
  value,
  onChange,
  onReset,
  product = "brand",
  regions = [
    { id: "reading", label: "笔记阅读" },
    { id: "editor", label: "笔记编辑" },
    { id: "chat", label: "助手对话" },
  ],
}: {
  value: AppearancePreferences;
  onChange: (value: AppearancePreferences) => void;
  onReset: () => void;
  product?: ProductTheme;
  regions?: { id: string; label: string }[];
}) {
  const [systemDark, setSystemDark] = useState(
    () =>
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    if (typeof matchMedia === "undefined") return;
    const media = matchMedia("(prefers-color-scheme: dark)"),
      update = () => setSystemDark(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const change = (patch: Partial<AppearancePreferences>) =>
    onChange({ ...value, ...patch });
  return (
    <section
      className="fp-workspace-form fp-appearance-workspace"
      data-mode={value.mode}
      style={appearanceStyles(value, systemDark, product)}
      aria-label="外观设置"
    >
      <WorkspaceSection
        title="外观"
        description="让阅读、写作和对话保持适合自己的节奏。"
      >
        <SettingsTabs
          label="明暗主题"
          value={value.theme}
          onChange={(v) =>
            change({ theme: v as AppearancePreferences["theme"] })
          }
          items={[
            { id: "light", label: "浅色" },
            { id: "dark", label: "深色" },
            { id: "system", label: "跟随系统" },
          ]}
        />
        <WorkspaceField
          label="配色方式"
          value={value.mode}
          options={[
            { value: "default", label: "产品默认" },
            { value: "colorful", label: "内容彩色" },
            { value: "custom", label: "自定义" },
          ]}
          onChange={(v) => change({ mode: v as AppearancePreferences["mode"] })}
        />
        <div className="fp-workspace-grid">
          {(["lightAccent", "darkAccent", "selection"] as const).map(
            (key, i) => (
              <ColorPicker
                key={key}
                label={["白天主色", "夜间主色", "划词颜色"][i]}
                value={value[key]}
                onChange={(v) => change({ [key]: v, mode: "custom" })}
              />
            ),
          )}
        </div>
        <WorkspaceField
          label="全局字体"
          value={value.font}
          options={READING_FONTS}
          onChange={(v) => change({ font: v })}
        />
        {regions.map((region) => {
          const local = value.regions[region.id] || {
            font: value.font,
            fontSize: 16,
            lineHeight: 1.9,
            inherit: true,
          };
          const update = (patch: Partial<ContentTypography>) =>
            change({
              regions: {
                ...value.regions,
                [region.id]: { ...local, ...patch },
              },
            });
          return (
            <WorkspaceSection key={region.id} title={region.label}>
              <WorkspaceToggle
                label={`${region.label}跟随全局字体`}
                checked={local.inherit}
                onChange={(v) => update({ inherit: v })}
              />
              <div className="fp-workspace-grid">
                <WorkspaceField
                  label={`${region.label}字体`}
                  value={local.font}
                  options={READING_FONTS}
                  disabled={local.inherit}
                  onChange={(v) => update({ font: v })}
                />
                <WorkspaceField
                  label={`${region.label}字号`}
                  value={local.fontSize}
                  numeric
                  disabled={local.inherit}
                  onChange={(v) => {
                    const n = Number(v);
                    if (Number.isFinite(n) && n >= 10 && n <= 32)
                      update({ fontSize: n });
                  }}
                />
                <WorkspaceField
                  label={`${region.label}行高`}
                  value={local.lineHeight}
                  numeric
                  disabled={local.inherit}
                  onChange={(v) => {
                    const n = Number(v);
                    if (n >= 1.2 && n <= 2.5) update({ lineHeight: n });
                  }}
                />
              </div>
              <p
                className="fp-workspace-type-preview"
                style={resolveContentTypography(value, region.id)}
              >
                从阅读到理解，把想法变成自己的笔记。
              </p>
            </WorkspaceSection>
          );
        })}
        <AsyncAction confirm="恢复产品默认外观？" onAction={onReset}>
          恢复默认外观
        </AsyncAction>
      </WorkspaceSection>
    </section>
  );
}
export interface LearningRecord {
  id: string;
  subject: string;
  chapter: string;
  last: number;
  best: number;
  attempts: number;
  updatedAt?: string;
}
export function LearningRecords({
  records,
  onOpen,
  onClear,
  shortcuts,
  appearance,
}: {
  records: LearningRecord[];
  onOpen: (id: string) => void;
  onClear: () => Promise<void> | void;
  shortcuts?: ReactNode;
  appearance?: ReactNode;
}) {
  const subjects = [...new Set(records.map((r) => r.subject))],
    attempts = records.reduce((sum, r) => sum + r.attempts, 0),
    average = records.length
      ? Math.round(records.reduce((sum, r) => sum + r.best, 0) / records.length)
      : 0;
  return (
    <section className="fp-workspace-form" aria-label="学习设置">
      <WorkspaceSection
        title="学习记录"
        description={`${records.length} 个章节 · 平均最佳分 ${average} · ${attempts} 次测验`}
      >
        {subjects.map((subject) => (
          <WorkspaceSection key={subject} title={subject}>
            <div className="fp-workspace-item-list">
              {records
                .filter((r) => r.subject === subject)
                .map((r) => (
                  <button type="button" key={r.id} onClick={() => onOpen(r.id)}>
                    <strong>{r.chapter}</strong>
                    <small>
                      上次 {r.last} 分 · 最佳 {r.best} 分 · {r.attempts} 次
                    </small>
                  </button>
                ))}
            </div>
          </WorkspaceSection>
        ))}
        {!records.length && <p>完成章节测验后，可以在这里查看学习记录。</p>}
        <AsyncAction
          disabled={!records.length}
          confirm="清空全部测验成绩？题目和笔记会保留。"
          onAction={onClear}
        >
          清空测验成绩
        </AsyncAction>
      </WorkspaceSection>
      {shortcuts && (
        <WorkspaceSection title="快捷键">{shortcuts}</WorkspaceSection>
      )}
      {appearance}
    </section>
  );
}
