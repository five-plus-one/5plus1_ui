/** DistributionChart - 从课栈 visualizations/primitives/DistributionChart 提取
 *
 * 概率分布示意图：正态、二项、泊松。坐标轴与刻度清晰，
 * 交互模式下可通过滑块改变参数。SVG 绘制，随容器宽度缩放。
 */

import { useId, useState } from "react";

export type DistributionKind = "normal" | "binomial" | "poisson";

export interface DistributionChartProps {
  type: DistributionKind;
  /** 初始参数 */
  params?: {
    mu?: number;
    sigma?: number;
    n?: number;
    p?: number;
    lambda?: number;
  };
  /** 允许调整参数 */
  interactive?: boolean;
  height?: number;
  label?: string;
}

const W = 320;
const H = 170;
const PAD = { l: 30, r: 12, t: 14, b: 26 };
const INNER_W = W - PAD.l - PAD.r;
const INNER_H = H - PAD.t - PAD.b;

function normalPdf(x: number, mu: number, sigma: number) {
  const s = Math.max(1e-6, sigma);
  return (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / s) ** 2);
}
function combination(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}
function binomialPmf(k: number, n: number, p: number) {
  return combination(n, k) * p ** k * (1 - p) ** (n - k);
}
function poissonPmf(k: number, lambda: number) {
  let fact = 1;
  for (let i = 2; i <= k; i++) fact *= i;
  return (lambda ** k * Math.exp(-lambda)) / fact;
}

export function DistributionChart({
  type,
  params = {},
  interactive = false,
  height = 180,
  label,
}: DistributionChartProps) {
  const titleId = useId();
  const [mu, setMu] = useState(params.mu ?? 0);
  const [sigma, setSigma] = useState(params.sigma ?? 1);
  const [n, setN] = useState(params.n ?? 10);
  const [p, setP] = useState(params.p ?? 0.5);
  const [lambda, setLambda] = useState(params.lambda ?? 3);

  // 采样
  const bars: { x: number; y: number }[] = [];
  let xs: number[] = [];
  let peak = 1;
  if (type === "normal") {
    const lo = mu - 4 * sigma;
    const hi = mu + 4 * sigma;
    const count = 120;
    for (let i = 0; i <= count; i++) {
      const x = lo + ((hi - lo) * i) / count;
      bars.push({ x, y: normalPdf(x, mu, sigma) });
    }
    peak = Math.max(...bars.map((b) => b.y));
    xs = [lo, mu - sigma, mu, mu + sigma, hi];
  } else {
    const k = type === "binomial" ? n : Math.max(1, Math.round(lambda * 4));
    for (let i = 0; i <= k; i++) {
      const y =
        type === "binomial" ? binomialPmf(i, n, p) : poissonPmf(i, lambda);
      bars.push({ x: i, y });
    }
    peak = Math.max(...bars.map((b) => b.y), 1e-9);
    xs = [0, Math.round(k / 2), k];
  }

  const xMin = bars[0].x;
  const xMax = bars[bars.length - 1].x;
  const sx = (x: number) =>
    PAD.l + ((x - xMin) / (xMax - xMin || 1)) * INNER_W;
  const sy = (y: number) => PAD.t + INNER_H - (y / peak) * INNER_H * 0.92;

  const path =
    type === "normal"
      ? bars
          .map((b, i) => `${i === 0 ? "M" : "L"}${sx(b.x).toFixed(1)},${sy(b.y).toFixed(1)}`)
          .join(" ")
      : "";
  const barWidth = type === "normal" ? 0 : Math.max(4, INNER_W / bars.length - 4);

  const chart = (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={height}
      role="img"
      aria-labelledby={titleId}
      className="fp-dist-chart"
    >
      <title id={titleId}>
        {label ||
          (type === "normal"
            ? `正态分布 μ=${mu} σ=${sigma}`
            : type === "binomial"
              ? `二项分布 n=${n} p=${p}`
              : `泊松分布 λ=${lambda}`)}
      </title>
      <line
        x1={PAD.l}
        y1={PAD.t + INNER_H}
        x2={PAD.l + INNER_W}
        y2={PAD.t + INNER_H}
        className="fp-dist-axis"
      />
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + INNER_H} className="fp-dist-axis" />
      {type === "normal" ? (
        <path d={path} className="fp-dist-line" />
      ) : (
        bars.map((b, i) => (
          <rect
            key={i}
            x={sx(b.x) - barWidth / 2}
            y={sy(b.y)}
            width={barWidth}
            height={PAD.t + INNER_H - sy(b.y)}
            rx={2}
            className="fp-dist-bar"
          />
        ))
      )}
      {xs.map((x, i) => (
        <text
          key={i}
          x={sx(x)}
          y={H - 8}
          textAnchor="middle"
          className="fp-dist-tick"
        >
          {Number.isInteger(x) ? x : x.toFixed(1)}
        </text>
      ))}
    </svg>
  );

  if (!interactive) return <div className="fp-dist">{chart}</div>;

  return (
    <div className="fp-dist">
      {chart}
      <div className="fp-dist-controls">
        {type === "normal" ? (
          <>
            <label>
              <span>均值 μ · {mu.toFixed(1)}</span>
              <input
                type="range"
                min={-3}
                max={3}
                step={0.1}
                value={mu}
                onChange={(e) => setMu(Number(e.target.value))}
              />
            </label>
            <label>
              <span>标准差 σ · {sigma.toFixed(1)}</span>
              <input
                type="range"
                min={0.3}
                max={3}
                step={0.1}
                value={sigma}
                onChange={(e) => setSigma(Number(e.target.value))}
              />
            </label>
          </>
        ) : type === "binomial" ? (
          <>
            <label>
              <span>试验次数 n · {n}</span>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
              />
            </label>
            <label>
              <span>成功概率 p · {p.toFixed(2)}</span>
              <input
                type="range"
                min={0.05}
                max={0.95}
                step={0.05}
                value={p}
                onChange={(e) => setP(Number(e.target.value))}
              />
            </label>
          </>
        ) : (
          <label>
            <span>λ · {lambda.toFixed(1)}</span>
            <input
              type="range"
              min={0.5}
              max={10}
              step={0.5}
              value={lambda}
              onChange={(e) => setLambda(Number(e.target.value))}
            />
          </label>
        )}
      </div>
    </div>
  );
}
