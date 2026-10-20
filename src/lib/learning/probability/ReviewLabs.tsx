"use client";

import { useMemo, useState } from "react";

export function diskSlice(x: number) {
  const coordinate = Math.max(-0.99, Math.min(0.99, x));
  const halfLength = Math.sqrt(1 - coordinate * coordinate);
  return {
    x: coordinate,
    halfLength,
    length: 2 * halfLength,
    marginal: (2 * halfLength) / Math.PI,
    density: 1 / (2 * halfLength),
  };
}

function choose(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  let value = 1;
  for (let i = 1; i <= k; i++) value = (value * (n - i + 1)) / i;
  return Math.round(value);
}

export function ontoCount(n: number, m: number): number {
  if (m === 0) return n === 0 ? 1 : 0;
  if (n < m || n < 0) return 0;
  let previous = Array(m + 1).fill(0) as number[];
  previous[0] = 1;
  for (let people = 1; people <= n; people++) {
    const next = Array(m + 1).fill(0) as number[];
    for (let occupied = 1; occupied <= m; occupied++)
      next[occupied] = occupied * (previous[occupied] + previous[occupied - 1]);
    previous = next;
  }
  return previous[m];
}

export function occupancyModel(n: number, m: number) {
  const total = ontoCount(n, m);
  const same = ontoCount(n - 1, m);
  const counts = Array.from({ length: Math.max(0, n - m + 1) }, (_, i) => ({
    people: i + 1,
    count: choose(n, i + 1) * ontoCount(n - i - 1, m - 1),
  }));
  return {
    total,
    same,
    different: total ? (total - same) / total : null,
    counts,
  };
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}
export function fraction(a: number, b: number) {
  if (!b) return "—";
  const g = gcd(a, b);
  return `${a / g}/${b / g}`;
}

const panel =
  "rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 space-y-4";
const accent = "var(--accent, #7555b5)";

export function DiskConditionalLab() {
  const [x, setX] = useState(0);
  const slice = diskSlice(x);
  const lineX = 150 + slice.x * 105;
  return (
    <section aria-label="圆盘条件密度实验" className={panel}>
      <div>
        <h3 className="font-semibold text-lg">沿圆盘切一条弦</h3>
        <p className="text-sm text-[var(--muted)]">
          圆盘内均匀取点。拖动横坐标，比较切片长度与归一后的条件密度。
        </p>
      </div>
      <label className="block">
        横坐标 x = {slice.x.toFixed(2)}
        <input
          className="block w-full"
          aria-label="横坐标"
          type="range"
          min="-0.99"
          max="0.99"
          step="0.01"
          value={x}
          onChange={(event) => setX(Number(event.target.value))}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <svg
          role="img"
          aria-label="单位圆与当前竖直弦"
          viewBox="0 0 300 280"
          className="w-full max-h-72"
        >
          <circle
            cx="150"
            cy="135"
            r="105"
            fill="var(--accent-soft, #eee6ff)"
            stroke={accent}
            strokeWidth="2"
          />
          <path
            d="M20 135H280M150 15V255"
            stroke="var(--muted, #777)"
            fill="none"
          />
          <line
            x1={lineX}
            x2={lineX}
            y1={135 - 105 * slice.halfLength}
            y2={135 + 105 * slice.halfLength}
            stroke={accent}
            strokeWidth="6"
          />
          <circle cx={lineX} cy="135" r="4" fill="var(--text, #222)" />
          <text x="282" y="151" fontSize="13" fill="currentColor">
            x
          </text>
          <text x="158" y="17" fontSize="13" fill="currentColor">
            y
          </text>
          <text
            x="150"
            y="275"
            textAnchor="middle"
            fontSize="13"
            fill="currentColor"
          >
            紫色弦长 = {slice.length.toFixed(4)}
          </text>
        </svg>
        <div className="space-y-3">
          <p>
            允许范围：−{slice.halfLength.toFixed(4)} ≤ y ≤{" "}
            {slice.halfLength.toFixed(4)}
          </p>
          <p>边缘密度 fₓ(x) = {slice.marginal.toFixed(4)}</p>
          <p className="font-semibold" style={{ color: accent }}>
            条件密度 = {slice.density.toFixed(4)}
          </p>
          <svg
            role="img"
            aria-label="归一后的条件密度图"
            viewBox="0 0 300 155"
            className="w-full"
          >
            <path
              d="M20 125H280M150 15V135"
              stroke="var(--muted, #777)"
              fill="none"
            />
            <rect
              x={150 - slice.halfLength * 105}
              y={125 - slice.density * 25}
              width={slice.length * 105}
              height={slice.density * 25}
              fill="var(--accent-soft, #eee6ff)"
              stroke={accent}
            />
            <text
              x="150"
              y="150"
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
            >
              矩形面积：弦长 × 密度 = 1
            </text>
          </svg>
        </div>
      </div>
      <p className="text-sm">
        弦长 =
        2√(1−x²)，条件密度为弦长的倒数。越靠近圆边，允许区间越窄、密度越高，但总概率始终为一。端点处边缘密度为零，所以只考察
        −1 &lt; x &lt; 1。
      </p>
      <button
        type="button"
        className="rounded-lg border border-[var(--line)] px-3 py-1.5"
        onClick={() => setX(0)}
      >
        回到圆心
      </button>
    </section>
  );
}

export function OccupancyLab() {
  const [people, setPeople] = useState(6);
  const [windows, setWindows] = useState(4);
  const model = useMemo(
    () => occupancyModel(people, windows),
    [people, windows],
  );
  return (
    <section aria-label="非空窗口分配实验" className={panel}>
      <div>
        <h3 className="font-semibold text-lg">每个窗口都有人</h3>
        <p className="text-sm text-[var(--muted)]">
          人员与窗口分别有区别；只记录谁去哪个窗口，不区分队内顺序。所有满足每窗非空的分配等可能。
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          人数：{people}
          <input
            className="block w-full"
            aria-label="人数"
            type="range"
            min="2"
            max="8"
            step="1"
            value={people}
            onChange={(event) => setPeople(Number(event.target.value))}
          />
        </label>
        <label>
          窗口数：{windows}
          <input
            className="block w-full"
            aria-label="窗口数"
            type="range"
            min="2"
            max="4"
            step="1"
            value={windows}
            onChange={(event) => setWindows(Number(event.target.value))}
          />
        </label>
      </div>
      {model.total === 0 ? (
        <p role="status">
          人数少于窗口数，无法满足每个窗口都有人。增加人数或减少窗口数后继续。
        </p>
      ) : (
        <>
          <div
            className="rounded-lg p-3"
            style={{ background: "var(--accent-soft, #eee6ff)" }}
          >
            <p>
              有效分配共 <strong>{model.total}</strong> 种
            </p>
            <p>
              指定两人同窗：{model.same} 种；不同窗：{model.total - model.same}{" "}
              种。
            </p>
            <p className="font-semibold">
              指定两人不同窗的概率：
              {fraction(model.total - model.same, model.total)} ≈{" "}
              {model.different!.toFixed(6)}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="text-left font-semibold mb-2">
                指定窗口人数的分布
              </caption>
              <thead>
                <tr>
                  <th className="p-2 text-left">人数</th>
                  <th className="p-2 text-left">分配数</th>
                  <th className="p-2 text-left">概率</th>
                </tr>
              </thead>
              <tbody>
                {model.counts.map((row) => (
                  <tr
                    key={row.people}
                    className="border-t border-[var(--line)]"
                  >
                    <td className="p-2">{row.people}</td>
                    <td className="p-2">{row.count}</td>
                    <td className="p-2">
                      {fraction(row.count, model.total)}{" "}
                      <span className="text-[var(--muted)]">
                        ≈ {(row.count / model.total).toFixed(4)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm">
            先只保留每窗非空的分配。指定两人同窗时，把二人看作一个整体，人数减少一而仍需占满全部窗口；指定窗口恰有
            k 人时，先选出这 k 人，再让剩余人员占满其余窗口。
          </p>
        </>
      )}
      <button
        type="button"
        className="rounded-lg border border-[var(--line)] px-3 py-1.5"
        onClick={() => {
          setPeople(6);
          setWindows(4);
        }}
      >
        恢复初始参数
      </button>
    </section>
  );
}
