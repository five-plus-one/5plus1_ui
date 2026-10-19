/** AcademicYearSwitcher - 从课栈 layout/AcademicYearSwitcher 提取
 *
 * 两级选择：先选年级，再选学期。可作为年级筛选、学期切换等通用场景。
 */

export interface AcademicYear {
  id: string;
  grade: string;
  term: string;
  label: string;
}

export interface AcademicYearSwitcherProps {
  years: AcademicYear[];
  value: string;
  onChange: (id: string) => void;
  /** 紧凑模式只显示文字 */
  compact?: boolean;
  /** 学期标签，默认「学期」。 */
  termLabel?: string;
}

export function AcademicYearSwitcher({
  years,
  value,
  onChange,
  compact = false,
  termLabel = "学期",
}: AcademicYearSwitcherProps) {
  const current = years.find((y) => y.id === value);
  const grades = Array.from(new Set(years.map((y) => y.grade)));
  const terms = current
    ? years.filter((y) => y.grade === current.grade)
    : [];

  return (
    <div className="fp-academic" data-compact={compact || undefined}>
      <div className="fp-academic-row" role="group" aria-label="年级">
        {grades.map((g) => {
          const first = years.find((y) => y.grade === g)!;
          const tapped = current?.grade === g;
          return (
            <button
              key={g}
              type="button"
              className="fp-academic-btn"
              aria-pressed={tapped}
              onClick={() => onChange(first.id)}
            >
              {g}
            </button>
          );
        })}
      </div>
      {terms.length > 1 && (
        <div className="fp-academic-row" role="group" aria-label={termLabel}>
          {terms.map((t) => (
            <button
              key={t.id}
              type="button"
              className="fp-academic-btn fp-academic-term"
              aria-pressed={t.id === value}
              onClick={() => onChange(t.id)}
            >
              {t.term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
