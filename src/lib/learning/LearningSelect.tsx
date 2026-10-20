import {
  Children,
  isValidElement,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { SelectField, type SelectOption } from "../SelectField";
export function LearningSelect({
  children,
  value,
  defaultValue,
  onChange,
  "aria-label": label,
  title,
  disabled,
  className,
  style,
  id,
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const [local, setLocal] = useState(String(defaultValue ?? ""));
  const options: SelectOption[] = [];
  const collect = (nodes: ReactNode, group?: string) =>
    Children.forEach(nodes, (child) => {
      if (
        !isValidElement<{
          value?: string | number;
          children?: ReactNode;
          disabled?: boolean;
          label?: string;
        }>(child)
      )
        return;
      if (child.type === "option")
        options.push({
          value: String(child.props.value ?? child.props.children ?? ""),
          label: String(child.props.children ?? child.props.value ?? ""),
          disabled: child.props.disabled,
          group,
        });
      else collect(child.props.children, child.props.label || group);
    });
  collect(children);
  const selected =
    value === undefined ? local || options[0]?.value || "" : String(value);
  return (
    <span
      id={id}
      className={`fp-learning-select ${className || ""}`}
      style={style}
    >
      <SelectField
        label={label || title || "选择实验条件"}
        value={selected}
        disabled={disabled}
        options={options}
        onChange={(next) => {
          setLocal(next);
          onChange?.({
            target: { value: next },
            currentTarget: { value: next },
          } as ChangeEvent<HTMLSelectElement>);
        }}
      />
    </span>
  );
}
