/** FilterSelect - 从课栈 layout/BookshelfFilter 提取
 *
 * 带分组的下拉筛选：用于书架、课程列表等场景。
 * 与 Select 的区别是支持 optgroup 与分组标签，并保留最近选择。
 */

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  label: string;
  options: FilterOption[];
}

export interface FilterSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  /** 不带分组的选项 */
  options?: FilterOption[];
  /** 分组选项 */
  groups?: FilterGroup[];
  disabled?: boolean;
  id?: string;
}

export function FilterSelect({
  label = "筛选",
  value,
  onChange,
  options = [],
  groups = [],
  disabled,
  id,
}: FilterSelectProps) {
  const selectId = id || "fp-filter-select";
  return (
    <div className="fp-filter">
      {label && (
        <label htmlFor={selectId} className="fp-filter-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className="fp-input fp-filter-select"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
