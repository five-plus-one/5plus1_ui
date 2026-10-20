"use client";
import { useEffect, useState, type ReactNode } from "react";
import {
  fitLine,
  interpolate,
  linearSteps,
  odeSteps,
  powerSteps,
  quadrature,
  type OdeMethod,
} from "../engines/numerical-methods-extension";
const colors = ["#bb6b32", "#287c80", "#8661a2"];
function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      aria-label={title}
      style={{
        margin: "24px 0",
        padding: 20,
        border: "1px solid var(--line)",
        borderRadius: 16,
      }}
    >
      <h3>{title}</h3>
      {children}
    </section>
  );
}
function Range({
  label,
  value,
  min,
  max,
  step = 1,
  change,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  change: (n: number) => void;
}) {
  return (
    <label style={{ display: "block", margin: "16px 0" }}>
      {label}：{value}
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </label>
  );
}
function Graph({
  series,
  xmin = 0,
  xmax = 1,
  ymin = 0,
  ymax = 1,
  dots = [],
}: {
  series: {
    name: string;
    points: [number, number][];
  }[];
  xmin?: number;
  xmax?: number;
  ymin?: number;
  ymax?: number;
  dots?: [number, number][];
}) {
  const px = (x: number) => 36 + ((x - xmin) / (xmax - xmin)) * 450;
  const py = (y: number) => 210 - ((y - ymin) / (ymax - ymin)) * 180;
  return (
    <>
      <svg
        viewBox="0 0 520 245"
        role="img"
        aria-label={series.map((s) => s.name).join("、") + "对照图"}
        style={{ width: "100%", height: "auto" }}
      >
        <path
          d="M36 25V210H490"
          fill="none"
          stroke="currentColor"
          opacity="0.4"
        />
        {[xmin, xmax].map((x) => (
          <text
            key={x}
            x={px(x)}
            y="232"
            textAnchor="middle"
            fill="currentColor"
            fontSize="12"
          >
            {x}
          </text>
        ))}
        {[ymin, ymax].map((y) => (
          <text
            key={y}
            x="29"
            y={py(y) + 4}
            textAnchor="end"
            fill="currentColor"
            fontSize="12"
          >
            {y}
          </text>
        ))}
        {series.map((s, i) => (
          <polyline
            key={s.name}
            points={s.points.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}
            fill="none"
            stroke={colors[i % colors.length]}
            strokeWidth="2.5"
          />
        ))}
        {dots.map(([x, y], i) => (
          <circle key={i} cx={px(x)} cy={py(y)} r="4" fill="currentColor" />
        ))}
      </svg>
      <p style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
        {series.map((s, i) => (
          <span key={s.name} style={{ color: colors[i % colors.length] }}>
            ● {s.name}
          </span>
        ))}
      </p>
    </>
  );
}
function Playback({
  count,
  change,
  max,
}: {
  count: number;
  change: (n: number) => void;
  max: number;
}) {
  const [playing, play] = useState(false);
  const active = playing && count < max;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => change(count + 1), 600);
    return () => clearTimeout(id);
  }, [active, count, change]);
  const style = {
    border: "1px solid var(--line)",
    borderRadius: 8,
    padding: "6px 12px",
    cursor: "pointer",
  };
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <button
        type="button"
        style={style}
        onClick={() => {
          if (count === max) change(0);
          play(!active);
        }}
      >
        {active ? "暂停" : "播放过程"}
      </button>
      <button
        type="button"
        style={style}
        disabled={count === max}
        onClick={() => {
          play(false);
          change(count + 1);
        }}
      >
        下一步
      </button>
      <button
        type="button"
        style={style}
        onClick={() => {
          play(false);
          change(0);
        }}
      >
        从头开始
      </button>
      <span>第 {count} 步</span>
    </div>
  );
}
export function LinearLab() {
  const [count, setCount] = useState(0);
  const j = linearSteps("jacobi", count).at(-1)!,
    g = linearSteps("seidel", count).at(-1)!;
  return (
    <Frame title="两种线性迭代的计算过程">
      <p>
        求解 4x + y = 1，x + 3y = 2，从 (0, 0) 开始，观察每轮使用新旧值的差别。
      </p>
      <Playback count={count} change={setCount} max={12} />
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>方法</th>
              <th>x</th>
              <th>y</th>
              <th>最大残差</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Jacobi", j],
              ["Gauss–Seidel", g],
            ].map(([name, value]) => {
              const v = value as typeof j;
              return (
                <tr key={String(name)}>
                  <td>{String(name)}</td>
                  <td>{v.x.toFixed(8)}</td>
                  <td>{v.y.toFixed(8)}</td>
                  <td>{v.residual.toExponential(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p>精确解为 (1/11, 7/11)。本例严格对角占优，两种方法都收敛。</p>
    </Frame>
  );
}
export function InterpolationLab() {
  const [n, setN] = useState(6);
  const f = (x: number) => 1 / (1 + 25 * x * x);
  const nodes = Array.from({ length: n + 1 }, (_, i) => -1 + (2 * i) / n),
    values = nodes.map(f);
  const points = Array.from({ length: 201 }, (_, i) => -1 + i / 100);
  const curve = points.map(
    (x) => [x, interpolate(nodes, values, x)] as [number, number],
  );
  const error = Math.max(...curve.map(([x, y]) => Math.abs(y - f(x))));
  const ymin = Math.min(-0.1, ...curve.map((p) => p[1])),
    ymax = Math.max(1.1, ...curve.map((p) => p[1]));
  return (
    <Frame title="等距高次插值会怎样变化">
      <p>对 f(x) = 1/(1 + 25x²) 使用等距节点，观察端点附近的曲线。</p>
      <Range
        label="多项式最高次数"
        value={n}
        min={2}
        max={12}
        step={2}
        change={setN}
      />
      <Graph
        xmin={-1}
        xmax={1}
        ymin={Math.floor(ymin * 10) / 10}
        ymax={Math.ceil(ymax * 10) / 10}
        dots={nodes.map((x, i) => [x, values[i]])}
        series={[
          { name: "原函数", points: points.map((x) => [x, f(x)]) },
          { name: "插值多项式", points: curve },
        ]}
      />
      <p>
        201 个观察点上的最大误差约 {error.toFixed(5)}
        。这是采样比较，不能代替整个区间的严格误差界。
      </p>
    </Frame>
  );
}
export function FittingLab() {
  const [last, setLast] = useState(3);
  const xs = [0, 1, 2, 3],
    ys = [1, 2, 2, last],
    fit = fitLine(xs, ys);
  return (
    <Frame title="一个观测点怎样影响拟合">
      <Range
        label="最后一个点的纵坐标"
        value={last}
        min={0}
        max={6}
        step={0.1}
        change={setLast}
      />
      <Graph
        xmax={3}
        ymin={-1}
        ymax={6}
        dots={xs.map((x, i) => [x, ys[i]])}
        series={[
          {
            name: "最小二乘直线",
            points: [
              [0, fit.intercept],
              [3, fit.intercept + 3 * fit.slope],
            ],
          },
        ]}
      />
      <p>
        拟合直线：y = {fit.intercept.toFixed(4)} {fit.slope < 0 ? "−" : "+"}{" "}
        {Math.abs(fit.slope).toFixed(4)}x
      </p>
      <p>
        残差平方和：{fit.sse.toFixed(5)}
        。移动一个点会改变整条直线，其他点的残差也随之改变。
      </p>
    </Frame>
  );
}
export function QuadratureLab() {
  const [power, setPower] = useState(1),
    n = 2 ** power;
  const f = (x: number) => x ** 4,
    t = quadrature(f, 0, 1, n, "trapezoid"),
    s = quadrature(f, 0, 1, n, "simpson");
  return (
    <Frame title="加密网格与积分精度">
      <p>计算从 0 到 1 的 x⁴ 积分，精确值为 0.2。</p>
      <Range label="加密层数" value={power} min={1} max={6} change={setPower} />
      <Graph
        series={[
          {
            name: "原函数",
            points: Array.from({ length: 101 }, (_, i) => [
              i / 100,
              f(i / 100),
            ]),
          },
          {
            name: "梯形上边界",
            points: Array.from({ length: n + 1 }, (_, i) => [i / n, f(i / n)]),
          },
        ]}
      />
      <p>
        分段数 {n}，步长 {(1 / n).toFixed(6)}
      </p>
      <table>
        <thead>
          <tr>
            <th>公式</th>
            <th>积分近似值</th>
            <th>绝对误差</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["复化梯形", t],
            ["复化 Simpson", s],
          ].map(([name, value]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{Number(value).toFixed(10)}</td>
              <td>{Math.abs(Number(value) - 0.2).toExponential(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        步长减半后，可比较梯形误差约缩小 4 倍、Simpson 误差约缩小 16 倍的规律。
      </p>
    </Frame>
  );
}
export function OdeLab() {
  const [n, setN] = useState(10),
    [count, setCount] = useState(0);
  const methods: [OdeMethod, string][] = [
    ["euler", "Euler"],
    ["heun", "改进 Euler"],
    ["rk4", "RK4"],
  ];
  const paths = methods.map(([method, name]) => ({
    name,
    rows: odeSteps((_t, y) => y, 1, 1 / n, n, method),
  }));
  return (
    <Frame title="沿时间比较三种近似解">
      <p>初值问题 y′ = y，y(0) = 1，精确解为 eᵗ。</p>
      <Range
        label="时间分段数"
        value={n}
        min={4}
        max={20}
        step={2}
        change={(v) => {
          setN(v);
          setCount(0);
        }}
      />
      <Playback count={count} change={setCount} max={n} />
      <Graph
        ymin={1}
        ymax={3}
        series={paths.map((p) => ({
          name: p.name,
          points: p.rows.slice(0, count + 1).map((r) => [r.t, r.y]),
        }))}
      />
      <p>
        当前时间 {(count / n).toFixed(3)}，精确值{" "}
        {Math.exp(count / n).toFixed(9)}
      </p>
      <table>
        <thead>
          <tr>
            <th>方法</th>
            <th>近似值</th>
            <th>绝对误差</th>
          </tr>
        </thead>
        <tbody>
          {paths.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{p.rows[count].y.toFixed(9)}</td>
              <td>
                {Math.abs(p.rows[count].y - Math.exp(count / n)).toExponential(
                  3,
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}
export function PowerLab() {
  const [ratio, setRatio] = useState(0.5),
    [count, setCount] = useState(0);
  const rows = powerSteps(ratio, 20),
    current = rows[count];
  return (
    <Frame title="特征值接近时，幂法收敛多快">
      <p>
        矩阵为 diag(3, {Number((3 * ratio).toFixed(2))})，初始向量为 (1,
        1)。每步用最大绝对分量规范化。
      </p>
      <Range
        label="两个特征值的比值"
        value={ratio}
        min={0.1}
        max={0.95}
        step={0.05}
        change={(v) => {
          setRatio(v);
          setCount(0);
        }}
      />
      <Playback count={count} change={setCount} max={20} />
      <Graph
        xmax={20}
        series={[
          {
            name: "第二个分量",
            points: rows.slice(0, count + 1).map((r, i) => [i, r.y]),
          },
        ]}
      />
      <p>
        当前向量：(1, {current.y.toFixed(7)})；特征值近似：
        {current.eigenvalue.toFixed(7)}；规范化残差：
        {current.residual.toExponential(3)}。
      </p>
      <p>比值越接近 1，非主方向衰减越慢。</p>
    </Frame>
  );
}
