/** FilterSelect - 从课栈 layout/BookshelfFilter 提取
 *
 * 带分组的下拉筛选：用于书架、课程列表等场景。
 * 与 Select 的区别是支持 optgroup 与分组标签，并保留最近选择。
 */

import { useId } from 'react';
import { SelectField } from './SelectField';

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
  const generatedId = useId();
  const selectId = id || generatedId;
  return (
    <div className="fp-filter">
      {label && (
        <span id={selectId} className="fp-filter-label">
          {label}
        </span>
      )}
      <SelectField label={label || '筛选'} value={value} onChange={onChange} disabled={disabled} options={[...options,...groups.flatMap(group=>group.options.map(option=>({...option,group:group.label})))]} />
    </div>
  );
}
