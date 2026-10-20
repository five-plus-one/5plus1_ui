"use client";
import { useState } from "react";
export function cholesky2(a: number, b: number, c: number) {
  if (a <= 0 || a * c - b * b <= 0) return null;
  const l11 = Math.sqrt(a),
    l21 = b / l11,
    l22 = Math.sqrt(c - l21 * l21);
  return { l11, l21, l22 };
}
const f = (x: number) =>
  Math.abs(x) < 1e-12 ? "0" : Number(x.toPrecision(6)).toString();
function Slider({
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
    <label className="block my-3">
      {label}：{f(value)}
      <input
        aria-label={label}
        className="w-full"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
    </label>
  );
}
export function CholeskyLab() {
  const [c, setC] = useState(5),
    [b, setB] = useState(2);
  const l = cholesky2(4, b, c);
  return (
    <section aria-label="平方根分解实验" className="border rounded-xl p-4 my-6">
      <h3>改变矩阵，逐步计算平方根分解</h3>
      <p>A 的两行为 (4，b)、(b，c)。保持对称，观察正定条件如何限制参数。</p>
      <Slider
        label="非对角元素 b"
        value={b}
        min={-4}
        max={4}
        step={0.5}
        change={setB}
      />
      <Slider
        label="右下角元素 c"
        value={c}
        min={0}
        max={8}
        step={0.5}
        change={setC}
      />
      <div aria-live="polite">
        {l ? (
          <>
            <p>
              ① l₁₁=√4=2；② l₂₁=b/2={f(l.l21)}；③ l₂₂=√(c−l₂₁²)={f(l.l22)}。
            </p>
            <p>
              乘回：第一行 (4，{f(l.l11 * l.l21)})；第二行 ({f(l.l11 * l.l21)}，
              {f(l.l21 ** 2 + l.l22 ** 2)})。
            </p>
          </>
        ) : (
          <p>
            4c−b²={f(4 * c - b * b)}，不满足正定条件，不能得到正对角的实数
            Cholesky 分解。
          </p>
        )}
      </div>
    </section>
  );
}
export function LULab() {
  const [a, setA] = useState(2),
    [step, setStep] = useState(0);
  const multiplier = a ? 3 / a : NaN,
    pivot = 4 - multiplier;
  return (
    <section aria-label="LU分解实验" className="border rounded-xl p-4 my-6">
      <h3>把消元乘子保存到 L</h3>
      <p>A 的两行为 (a，1)、(3，4)。右端项为 (5，6)。</p>
      <Slider
        label="首主元 a"
        value={a}
        min={0}
        max={4}
        step={0.5}
        change={(v) => {
          setA(v);
          setStep(0);
        }}
      />
      <button
        type="button"
        onClick={() => setStep(Math.min(3, step + 1))}
        disabled={step === 3}
      >
        下一步
      </button>
      <button type="button" className="ml-4" onClick={() => setStep(0)}>
        从头计算
      </button>
      <div aria-live="polite">
        {a === 0 ? (
          <p>首主元为零，必须先换行，当前无主元 LU 流程不能继续。</p>
        ) : (
          <>
            <p>第 {step} 步</p>
            {step >= 1 && <p>m₂₁=3/a={f(multiplier)}；R₂←R₂−m₂₁R₁。</p>}
            {step >= 2 && (
              <p>
                L 的两行为 (1，0)、({f(multiplier)}，1)；U 为 ({f(a)}，1)、(0，
                {f(pivot)})。
              </p>
            )}
            {step >= 3 &&
              (Math.abs(pivot) < 1e-12 ? (
                <p>第二主元为零：矩阵奇异。</p>
              ) : (
                <p>
                  先解 Ly=b：y=(5，{f(6 - multiplier * 5)})；再解 Ux=y：x₂=
                  {f((6 - multiplier * 5) / pivot)}，x₁=
                  {f((5 - (6 - multiplier * 5) / pivot) / a)}。
                </p>
              ))}
          </>
        )}
      </div>
    </section>
  );
}
export function ThomasLab() {
  const [diagonal, setDiagonal] = useState(2),
    [step, setStep] = useState(0);
  const pivots = [diagonal];
  const rhs = [1];
  for (let i = 1; i < 3; i++) {
    pivots.push(diagonal - 1 / pivots[i - 1]);
    rhs.push((i === 2 ? 1 : 0) + rhs[i - 1] / pivots[i - 1]);
  }
  const valid = pivots.every((x) => Number.isFinite(x) && Math.abs(x) > 1e-10);
  const x = [0, 0, rhs[2] / pivots[2]];
  for (let i = 1; i >= 0; i--) x[i] = (rhs[i] + x[i + 1]) / pivots[i];
  return (
    <section aria-label="追赶法实验" className="border rounded-xl p-4 my-6">
      <h3>三对角系统：前向递推与回代</h3>
      <p>主对角均为 d，相邻副对角均为 −1，b=(1，0，1)。</p>
      <Slider
        label="主对角 d"
        value={diagonal}
        min={1}
        max={4}
        step={0.25}
        change={(v) => {
          setDiagonal(v);
          setStep(0);
        }}
      />
      <button
        type="button"
        onClick={() => setStep(Math.min(4, step + 1))}
        disabled={step === 4}
      >
        下一步
      </button>
      <button type="button" className="ml-4" onClick={() => setStep(0)}>
        从头计算
      </button>
      <div aria-live="polite">
        {!valid ? (
          <p>递推中出现零主元，当前追赶流程失效，需改用选主元方法。</p>
        ) : (
          <>
            {pivots.slice(0, step).map((v, i) => (
              <p key={i}>
                第 {i + 1} 行：新主元 {f(v)}，新右端 {f(rhs[i])}。
              </p>
            ))}
            {step === 4 && (
              <p>
                从最后一行回代：x=({x.map(f).join("，")})。代回右端为 (
                {f(diagonal * x[0] - x[1])}，{f(-x[0] + diagonal * x[1] - x[2])}
                ，{f(-x[1] + diagonal * x[2])})。
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
export function ConditionLab() {
  const [epsilon, setEpsilon] = useState(0.1),
    [delta, setDelta] = useState(0.01);
  return (
    <section
      aria-label="条件数与扰动实验"
      className="border rounded-xl p-4 my-6"
    >
      <h3>小扰动为何可能变成大误差</h3>
      <p>A=diag(1，ε)，原 b=(1，0)，原解 x=(1，0)。把第二个右端分量改成 δ。</p>
      <Slider
        label="较小对角元素 ε"
        value={epsilon}
        min={0.01}
        max={1}
        step={0.01}
        change={setEpsilon}
      />
      <Slider
        label="右端扰动 δ"
        value={delta}
        min={0}
        max={0.1}
        step={0.001}
        change={setDelta}
      />
      <p aria-live="polite">
        ∞ 范数条件数 κ=1/ε={f(1 / epsilon)}；新解为 (1，{f(delta / epsilon)}
        )。右端相对扰动 {f(delta)}，解的相对变化 {f(delta / epsilon)}
        ，放大倍数为 {f(1 / epsilon)}。
      </p>
      <p>这是矩阵本身的敏感性。即使求解步骤稳定，输入中的误差也会被放大。</p>
    </section>
  );
}
export function DividedDifferenceLab() {
  const [y, setY] = useState(5),
    [x, setX] = useState(1.5);
  const d2 = (y - 3) / 2,
    value = 1 + x + d2 * x * (x - 1);
  return (
    <section aria-label="差商插值实验" className="border rounded-xl p-4 my-6">
      <h3>新增节点只需追加一个差商项</h3>
      <p>已有节点 (0，1)、(1，2)，追加节点 (2，y)。</p>
      <Slider
        label="第三个函数值 y"
        value={y}
        min={0}
        max={8}
        step={0.5}
        change={setY}
      />
      <Slider
        label="求值位置 x"
        value={x}
        min={0}
        max={2}
        step={0.05}
        change={setX}
      />
      <p>
        一阶差商为 1、{f(y - 2)}；二阶差商为 ({f(y - 2)}−1)/2={f(d2)}。
      </p>
      <p aria-live="polite">
        p(x)=1+x+{f(d2)}x(x−1)，p({f(x)})={f(value)}。
      </p>
      <svg
        viewBox="0 0 400 220"
        role="img"
        aria-label="插值多项式曲线"
        className="w-full"
        style={{ maxHeight: 260 }}
      >
        <path d="M30 15V195H375" stroke="currentColor" fill="none" />
        <polyline
          points={Array.from({ length: 81 }, (_, i) => {
            const z = i / 40;
            return `${30 + 170 * z},${195 - 20 * (1 + z + d2 * z * (z - 1))}`;
          }).join(" ")}
          stroke="#7650ae"
          strokeWidth={3}
          fill="none"
        />
        {[
          [0, 1],
          [1, 2],
          [2, y],
          [x, value],
        ].map(([z, v], i) => (
          <circle
            key={i}
            cx={30 + z * 170}
            cy={195 - v * 20}
            r={5}
            fill={i === 3 ? "#d87927" : "#7650ae"}
          />
        ))}
      </svg>
      <p>
        因子 x(x−1) 在旧节点为零，所以调整最后一个差商不会改变前两个节点的值。
      </p>
    </section>
  );
}
