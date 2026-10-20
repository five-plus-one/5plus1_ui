import { SelectField } from "../SelectField";
export function parseDirectiveAttributes(
  value: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  const expression =
    /([\w-]+)=(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^\s}]+))/g;
  for (const match of value.matchAll(expression))
    result[match[1]] = (match[2] ?? match[3] ?? match[4] ?? "").replace(
      /\\([\\"'])/g,
      "$1",
    );
  return result;
}
export function setDirectiveAttribute(
  value: string,
  key: string,
  next: string,
) {
  const attributes = parseDirectiveAttributes(value);
  if (next) attributes[key] = next;
  else delete attributes[key];
  return Object.entries(attributes)
    .map(
      ([name, text]) =>
        `${name}="${text.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`,
    )
    .join(" ");
}
const fieldGroups: Record<string, [string, string][]> = {
  video: [
    ["src", "视频地址"],
    ["poster", "封面地址"],
  ],
  audio: [["src", "音频地址"]],
  figure: [
    ["src", "图片地址"],
    ["alt", "图片说明"],
    ["caption", "图片标题"],
    ["credit", "图片来源"],
  ],
  interactive: [["src", "内容地址"]],
  plot: [
    ["fn", "函数表达式"],
    ["xmin", "横轴最小值"],
    ["xmax", "横轴最大值"],
    ["ymin", "纵轴最小值"],
    ["ymax", "纵轴最大值"],
  ],
  historymap: [
    ["points", "地点与坐标"],
    ["caption", "地图说明"],
  ],
  learninganimation: [
    ["src", "演示地址"],
    ["source", "源文件地址"],
    ["caption", "演示说明"],
  ],
  event: [
    ["year", "事件时间"],
    ["location", "地点"],
    ["people", "人物"],
    ["result", "结果"],
    ["impact", "影响"],
  ],
  attachment: [
    ["src", "附件地址"],
    ["name", "附件名称"],
  ],
};
export function DirectiveFields({
  name,
  value,
  onChange,
  disabled,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const attributes = parseDirectiveAttributes(value);
  const aliases: Record<string, string> = {
    "learning-animation": "learninganimation",
    figuremedia: "figure",
    functionplot: "plot",
    eventcard: "event",
    noteattachment: "attachment",
    memorycard: "memory",
  };
  const kind = aliases[name] || name;
  const fields = fieldGroups[kind] || [];
  if (!fields.length && kind !== "memory") return null;
  return (
    <div className="fp-directive-fields">
      {kind === "memory" && (
        <label>
          回忆方式
          <SelectField
            label="回忆方式"
            value={attributes.mode || "checklist"}
            onChange={(next) =>
              onChange(setDirectiveAttribute(value, "mode", next))
            }
            disabled={disabled}
            options={[
              { value: "checklist", label: "逐项回忆" },
              { value: "cloze", label: "重点挖空" },
            ]}
          />
        </label>
      )}
      {fields.map(([key, label]) => (
        <label key={key}>
          {label}
          <input
            aria-label={label}
            value={attributes[key] || ""}
            disabled={disabled}
            onChange={(event) =>
              onChange(setDirectiveAttribute(value, key, event.target.value))
            }
          />
        </label>
      ))}
    </div>
  );
}
