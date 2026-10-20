import { LearningSelect } from "../LearningSelect";
("use client");
import { useMemo, useState } from "react";
const panel =
  "rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] p-4";
const button =
  "rounded-md border border-[var(--line)] px-2.5 py-1.5 text-sm hover:border-[var(--accent)]";
function BoolButton({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      className={button}
      onClick={onChange}
      aria-pressed={value}
    >
      {label} = {value ? "真" : "假"}
    </button>
  );
}
export function TruthTableLab() {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);
  const [kind, setKind] = useState<"imp" | "iff" | "demorgan">("imp");
  const result =
    kind === "imp"
      ? !p || q
      : kind === "iff"
        ? p === q
        : !(p && q) === (!p || !q);
  const expression =
    kind === "imp"
      ? "p → q"
      : kind === "iff"
        ? "p ↔ q"
        : "¬(p ∧ q) ↔ (¬p ∨ ¬q)";
  return (
    <section className={panel} aria-label="真值表实验台">
      <h3 className="text-base font-semibold">真值表实验台</h3>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        切换公式和赋值，观察蕴含、等价与德摩根律。
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <LearningSelect
          className={button}
          value={kind}
          onChange={(e) => setKind(e.target.value as typeof kind)}
          aria-label="选择公式"
        >
          <option value="imp">蕴含</option>
          <option value="iff">双条件</option>
          <option value="demorgan">德摩根律</option>
        </LearningSelect>
        <BoolButton label="p" value={p} onChange={() => setP((v) => !v)} />
        <BoolButton label="q" value={q} onChange={() => setQ((v) => !v)} />
      </div>
      <div className="mt-4 rounded-lg bg-[var(--bg-muted)] p-4 text-center">
        <div className="font-mono text-lg">{expression}</div>
        <div className="mt-2 text-sm">
          当前结果：
          <strong className={result ? "text-emerald-600" : "text-rose-600"}>
            {result ? "真" : "假"}
          </strong>
        </div>
        {kind === "imp" && (
          <p className="mt-2 text-xs text-[var(--ink-soft)]">
            蕴含只在前件真、后件假时为假。
          </p>
        )}
      </div>
    </section>
  );
}
export function QuantifierScopeLab() {
  const [size, setSize] = useState(4);
  const [threshold, setThreshold] = useState(3);
  const values = useMemo(
    () => Array.from({ length: size }, (_, i) => i + 1),
    [size],
  );
  const satisfying = values.filter((x) => x >= threshold);
  return (
    <section className={panel} aria-label="量词作用域实验台">
      <h3 className="text-base font-semibold">量词作用域实验台</h3>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        论域为 1 到 n，谓词 P(x) 表示 x ≥ k。
      </p>
      <label className="mt-3 block text-sm">
        论域上界 n：{size}
        <input
          className="ml-3 align-middle"
          type="range"
          min="1"
          max="8"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
      </label>
      <label className="mt-2 block text-sm">
        阈值 k：{threshold}
        <input
          className="ml-3 align-middle"
          type="range"
          min="1"
          max="9"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
      </label>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-[var(--bg-muted)] p-3 text-sm">
          满足 P 的元素：&#123;{satisfying.join(", ") || "空"}&#125;
        </div>
        <div className="rounded-lg bg-[var(--bg-muted)] p-3 text-sm">
          ∀xP(x)：
          <strong>{satisfying.length === values.length ? "真" : "假"}</strong>
          <br />
          ∃xP(x)：<strong>{satisfying.length > 0 ? "真" : "假"}</strong>
        </div>
      </div>
    </section>
  );
}
function propertySummary(matrix: boolean[][]) {
  const reflexive = matrix.every((row, i) => row[i]);
  const symmetric = matrix.every((row, i) =>
    row.every((v, j) => !v || matrix[j][i]),
  );
  const antisymmetric = matrix.every((row, i) =>
    row.every((v, j) => i === j || !v || !matrix[j][i]),
  );
  const transitive = matrix.every((row, i) =>
    row.every((v, j) => !v || matrix[j].every((w, k) => !w || matrix[i][k])),
  );
  return { reflexive, symmetric, antisymmetric, transitive };
}
export function RelationPropertyLab() {
  const [matrix, setMatrix] = useState<boolean[][]>([
    [true, true, false],
    [false, true, true],
    [false, false, true],
  ]);
  const props = propertySummary(matrix);
  const toggle = (i: number, j: number) =>
    setMatrix((rows) =>
      rows.map((row, r) => row.map((v, c) => (r === i && c === j ? !v : v))),
    );
  return (
    <section className={panel} aria-label="关系性质实验台">
      <h3 className="text-base font-semibold">关系性质实验台</h3>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        点击关系矩阵中的格子，立即重新判断四种性质。
      </p>
      <div className="mt-4 grid grid-cols-3 gap-1" style={{ maxWidth: 210 }}>
        {matrix.flatMap((row, i) =>
          row.map((v, j) => (
            <button
              type="button"
              key={`${i}-${j}`}
              className={`${button} font-mono ${v ? "bg-[var(--accent-weak)] text-[var(--accent)]" : ""}`}
              onClick={() => toggle(i, j)}
              aria-label={`关系 ${i + 1} 到 ${j + 1}`}
            >
              {v ? "1" : "0"}
            </button>
          )),
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        {(
          [
            ["自反", props.reflexive],
            ["对称", props.symmetric],
            ["反对称", props.antisymmetric],
            ["传递", props.transitive],
          ] as const
        ).map(([name, ok]) => (
          <div
            key={name}
            className="rounded-lg bg-[var(--bg-muted)] p-2 text-center"
          >
            {name}
            <br />
            <strong className={ok ? "text-emerald-600" : "text-rose-600"}>
              {ok ? "满足" : "不满足"}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
export function FunctionMappingLab() {
  const [mapping, setMapping] = useState([0, 1, 1]);
  const labels = ["a", "b", "c"];
  const image = new Set(mapping);
  const injective = image.size === mapping.length;
  const surjective = image.size === labels.length;
  const update = (index: number, value: number) =>
    setMapping((m) => m.map((v, i) => (i === index ? value : v)));
  return (
    <section className={panel} aria-label="函数映射实验台">
      <h3 className="text-base font-semibold">函数映射实验台</h3>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        设置 f: &#123;1,2,3&#125; → &#123;a,b,c&#125;，观察单射、满射与双射。
      </p>
      <div className="mt-4 space-y-2">
        {mapping.map((value, i) => (
          <label key={i} className="flex items-center gap-3 text-sm">
            <span className="w-10 font-mono">f({i + 1})</span>
            <LearningSelect
              className={button}
              value={value}
              onChange={(e) => update(i, Number(e.target.value))}
            >
              {labels.map((label, j) => (
                <option key={label} value={j}>
                  {label}
                </option>
              ))}
            </LearningSelect>
          </label>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-[var(--bg-muted)] p-3 text-sm">
        像集：&#123;
        {[...image]
          .sort()
          .map((i) => labels[i])
          .join(", ")}
        &#125;
        <br />
        单射：<strong>{injective ? "是" : "否"}</strong>　满射：
        <strong>{surjective ? "是" : "否"}</strong>　双射：
        <strong>{injective && surjective ? "是" : "否"}</strong>
      </div>
    </section>
  );
}
