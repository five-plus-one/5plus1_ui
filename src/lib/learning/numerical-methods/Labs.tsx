import { LearningSelect } from "../LearningSelect";
("use client");
import { useEffect, useState } from "react";
import {
  areaError,
  bisectionSteps,
  fixedPointSteps,
} from "../engines/numerical-methods";
const box: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 16,
  padding: 20,
  background: "var(--md-sys-color-surface-container-low)",
  color: "var(--ink)",
  margin: "20px 0",
};
const button: React.CSSProperties = {
  padding: "8px 14px",
  border: "1px solid var(--line)",
  borderRadius: 8,
  cursor: "pointer",
  background: "var(--bg-app)",
  color: "var(--ink)",
};
const fmt = (n: number) => Number(n.toPrecision(8)).toString();
function Slider({
  label,
  value,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label style={{ display: "block", margin: "14px 0" }}>
      {label}：{value}
      <input
        aria-label={label}
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ display: "block", width: "100%", accentColor: "#b66b32" }}
      />
    </label>
  );
}
function usePlayback(max: number) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const active = playing && step < max;
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setStep((n) => Math.min(n + 1, max)), 900);
    return () => clearInterval(timer);
  }, [active, max]);
  return {
    step,
    setStep,
    active,
    pause: () => setPlaying(false),
    controls: (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          style={button}
          onClick={() => {
            if (step >= max) setStep(0);
            setPlaying(!active);
          }}
        >
          {active ? "暂停" : "播放过程"}
        </button>
        <button
          type="button"
          style={button}
          disabled={step >= max}
          onClick={() => {
            setPlaying(false);
            setStep((n) => Math.min(n + 1, max));
          }}
        >
          下一步
        </button>
        <button
          type="button"
          style={button}
          onClick={() => {
            setPlaying(false);
            setStep(0);
          }}
        >
          从头开始
        </button>
      </div>
    ),
  };
}
export function ErrorLab() {
  const [ea, setEa] = useState(0.2),
    [eb, setEb] = useState(0.1);
  const r = areaError(120, 60, ea, eb);
  return (
    <section style={box} aria-label="面积误差实验">
      <h3>边长的误差，怎样变成面积的误差？</h3>
      <p>桌面长 120 cm、宽 60 cm。拖动误差限，比较一阶估计与完整乘积。</p>
      <Slider
        label="长度误差限（cm）"
        value={ea}
        max={5}
        step={0.1}
        onChange={setEa}
      />
      <Slider
        label="宽度误差限（cm）"
        value={eb}
        max={5}
        step={0.1}
        onChange={setEb}
      />
      <svg
        viewBox="0 0 440 175"
        role="img"
        aria-label="面积由原矩形、两个一阶误差条带及角部乘积构成"
        style={{ width: "100%", maxHeight: 210 }}
      >
        <rect
          x="35"
          y="15"
          width="280"
          height="120"
          fill="#b66b3228"
          stroke="#b66b32"
        />
        <rect x="315" y="15" width={ea * 12} height="120" fill="#4e8fa6" />
        <rect x="35" y="135" width="280" height={eb * 6} fill="#c58f37" />
        <rect x="315" y="135" width={ea * 12} height={eb * 6} fill="#b15b79" />
        <text x="175" y="80" textAnchor="middle" fill="currentColor">
          7200 cm²
        </text>
      </svg>
      <p style={{ fontSize: 12 }}>
        图中误差条带放大展示。蓝色：宽 × 长度误差；金色：长 ×
        宽度误差；粉色：误差乘积。
      </p>
      <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <dt>一阶误差限</dt>
        <dd>{fmt(r.linear)} cm²</dd>
        <dt>包含乘积项的误差限</dt>
        <dd>{fmt(r.exact)} cm²</dd>
        <dt>面积可能范围</dt>
        <dd>
          {fmt(r.low)}～{fmt(r.high)} cm²
        </dd>
        <dt>一阶相对误差限</dt>
        <dd>{fmt((r.linear / r.nominal) * 100)}%</dd>
      </dl>
      <p>
        误差越小，乘积项通常越不显著；放大误差后，可以看见一阶估计与完整范围逐渐拉开。
      </p>
    </section>
  );
}
export function BisectionLab() {
  const playback = usePlayback(12);
  const row = bisectionSteps(playback.step).at(-1)!;
  const x = (v: number) => 40 + (v - 1) * 440;
  return (
    <section style={box} aria-label="二分法实验">
      <h3>每次留下根所在的半个区间</h3>
      <p>
        求 x³ + 4x² − 10 = 0 在 [1, 2]
        内的根。当前中点是近似值，半区间长是误差界。
      </p>
      {playback.controls}
      <Slider
        label="已完成的区间更新次数"
        value={playback.step}
        max={12}
        onChange={(v) => {
          playback.pause();
          playback.setStep(v);
        }}
      />
      <svg
        viewBox="0 0 520 95"
        role="img"
        aria-label={`当前区间从 ${row.a} 到 ${row.b}，中点 ${row.mid}`}
        style={{ width: "100%" }}
      >
        <line
          x1="40"
          x2="480"
          y1="45"
          y2="45"
          stroke="currentColor"
          opacity=".25"
        />
        <line
          x1={x(row.a)}
          x2={x(row.b)}
          y1="45"
          y2="45"
          stroke="#b66b32"
          strokeWidth="8"
        />
        <circle cx={x(row.mid)} cy="45" r="6" fill="#4e8fa6" />
        <text x="40" y="80" fill="currentColor">
          1
        </text>
        <text x="475" y="80" fill="currentColor">
          2
        </text>
      </svg>
      <p>
        当前区间：[{fmt(row.a)}, {fmt(row.b)}]
      </p>
      <p>
        中点：<strong>{fmt(row.mid)}</strong>；函数值：{fmt(row.value)}
      </p>
      <p>
        误差界：<strong>{fmt(row.bound)}</strong>{" "}
        {row.bound <= 0.005
          ? "≤ 0.005，已满足示例精度"
          : "> 0.005，继续缩小区间"}
      </p>
      <p>
        下一次保留{row.value > 0 ? "左" : "右"}半区间。此处“第 0 步”是尚未更新的
        [1, 2]，避免把中点编号与更新次数混淆。
      </p>
    </section>
  );
}
export function IterationLab() {
  const [kind, setKind] = useState<"sqrt" | "slow">("sqrt");
  const playback = usePlayback(30);
  const { L, root, rows } = fixedPointSteps(kind, playback.step + 1);
  const row = rows.at(-1)!;
  return (
    <section style={box} aria-label="不动点迭代实验">
      <h3>步长小，离根就近了吗？</h3>
      <label>
        迭代格式{" "}
        <LearningSelect
          value={kind}
          onChange={(e) => {
            setKind(e.target.value as "sqrt" | "slow");
            playback.pause();
            playback.setStep(0);
          }}
          style={button}
        >
          <option value="sqrt">√(2x + 3)，初值 4</option>
          <option value="slow">0.99x + 0.01，初值 0</option>
        </LearningSelect>
      </label>
      <p>
        {kind === "sqrt"
          ? "在 [2, 4] 上自映射，L = 1/√7，根为 3。"
          : "在 [0, 1] 上自映射，L = 0.99，根为 1。"}
      </p>
      {playback.controls}
      <Slider
        label="查看的迭代步骤"
        value={playback.step + 1}
        max={31}
        onChange={(v) => {
          playback.pause();
          playback.setStep(Math.max(0, v - 1));
        }}
      />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", fontVariantNumeric: "tabular-nums" }}>
          <thead>
            <tr>
              <th>步骤</th>
              <th>近似值</th>
              <th>步长</th>
              <th>后验界</th>
              <th>真实误差</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(-6).map((r) => (
              <tr key={r.k}>
                <td>{r.k}</td>
                <td>{fmt(r.x)}</td>
                <td>{fmt(r.step)}</td>
                <td>{fmt(r.bound)}</td>
                <td>{fmt(r.error)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        后验界 = {fmt(L / (1 - L))} × 步长。当前
        {row.bound <= 0.01 ? "已保证" : "尚不能保证"}误差 ≤ 0.01。
      </p>
      <p>蓝点是当前近似值，竖线是根 {root}。</p>
      <svg
        viewBox="0 0 500 55"
        role="img"
        aria-label={`近似值 ${row.x}，根 ${root}`}
        style={{ width: "100%" }}
      >
        <line
          x1="25"
          x2="475"
          y1="25"
          y2="25"
          stroke="currentColor"
          opacity=".3"
        />
        <line
          x1={kind === "sqrt" ? 175 : 475}
          x2={kind === "sqrt" ? 175 : 475}
          y1="8"
          y2="42"
          stroke="#b66b32"
          strokeWidth="3"
        />
        <circle
          cx={kind === "sqrt" ? 25 + (row.x - 2) * 150 : 25 + row.x * 450}
          cy="25"
          r="7"
          fill="#4e8fa6"
        />
      </svg>
      <p>
        这里已知根，才能展示真实误差作比较；一般求根时应使用可计算的误差界判断停止。
      </p>
    </section>
  );
}
