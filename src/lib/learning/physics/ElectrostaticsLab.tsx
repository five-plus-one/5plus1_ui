import { LearningSelect } from "../LearningSelect";
("use client");
import { useId, useState } from "react";
export function electricField(
  mode: string,
  charge: number,
  distance: number,
  radius = 1,
) {
  const k = 8.9875517923e9;
  if (mode === "sphere")
    return distance >= 0 && radius > 0
      ? k *
          charge *
          1e-9 *
          (distance <= radius ? distance / radius ** 3 : 1 / distance ** 2)
      : NaN;
  if (mode === "ring")
    return radius > 0
      ? (k * charge * 1e-9 * distance) /
          (radius * radius + distance * distance) ** 1.5
      : NaN;
  if (!(distance > 0)) return NaN;
  if (mode === "line") return (2 * k * charge * 1e-9) / distance;
  return (
    ((k * charge * 1e-9) / (distance * distance)) *
    (mode === "superposition" ? 2 : 1)
  );
}
export default function ElectrostaticsLab() {
  const [mode, setMode] = useState("point"),
    [charge, setCharge] = useState(5),
    [distance, setDistance] = useState(1),
    [radius, setRadius] = useState(1);
  const arrowId = useId();
  const field = electricField(mode, charge, distance, radius);
  return (
    <section
      aria-label="静电场实验"
      className="rounded-xl border border-[var(--line)] p-4"
    >
      <h3>从电荷到电场</h3>
      <label>
        选择情景
        <LearningSelect
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            if (distance <= 0 && !["sphere", "ring"].includes(e.target.value))
              setDistance(0.1);
          }}
        >
          <option value="point">点电荷与球对称场</option>
          <option value="superposition">两个同向等强电场叠加</option>
          <option value="line">无限长直线电荷</option>
          <option value="sphere">均匀带电实心球</option>
          <option value="ring">圆环轴线上电场</option>
        </LearningSelect>
      </label>
      <label className="block my-3">
        {mode === "line" ? "线密度 λ" : "电荷量 q"}：{charge}{" "}
        {mode === "line" ? "nC/m" : "nC"}
        <input
          aria-label="电荷参数"
          type="range"
          min="-10"
          max="10"
          step="0.5"
          value={charge}
          onChange={(e) => setCharge(Number(e.target.value))}
        />
      </label>
      <label className="block">
        {mode === "ring" ? "轴向距离 z" : "距离 r"}：{distance.toFixed(1)} m
        <input
          aria-label="距离"
          type="range"
          min={mode === "sphere" || mode === "ring" ? 0 : 0.1}
          max="3"
          step="0.1"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
        />
      </label>
      {(mode === "sphere" || mode === "ring") && (
        <label className="block my-3">
          半径 R：{radius.toFixed(1)} m
          <input
            aria-label="半径"
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </label>
      )}
      <svg role="img" aria-label="电场方向示意" viewBox="0 0 400 130">
        <defs>
          <marker
            id={arrowId}
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0 0L8 4L0 8" fill="#7555b5" />
          </marker>
        </defs>
        {mode === "ring" ? (
          <ellipse
            cx="80"
            cy="65"
            rx="12"
            ry="38"
            fill="none"
            stroke="#7555b5"
            strokeWidth="4"
          />
        ) : (
          <circle
            cx="80"
            cy="65"
            r={mode === "sphere" ? 35 : 20}
            fill="#efe6ff"
          />
        )}
        <text x="80" y="71" textAnchor="middle">
          {charge > 0 ? "+" : charge < 0 ? "−" : "0"}
        </text>
        <circle cx="300" cy="65" r="4" fill="#555" />
        {field !== 0 && (
          <line
            x1={charge < 0 ? 290 : 120}
            x2={charge < 0 ? 200 : 290}
            y1="65"
            y2="65"
            stroke="#7555b5"
            strokeWidth="4"
            markerEnd={`url(#${arrowId})`}
          />
        )}
        <text x="195" y="105" textAnchor="middle">
          {mode === "ring" ? "z" : "r"} = {distance.toFixed(1)} m
        </text>
      </svg>
      <p className="text-xl font-semibold">E = {field.toFixed(2)} N/C</p>
      <p>
        {mode === "sphere"
          ? "均匀带电实心球：球内 E=kQr/R³，球外 E=kQ/r²。中心场为零；球面两式连续，在r=R取得最大场强。"
          : mode === "ring"
            ? "圆环轴线：E=kQz/(R²+z²)^(3/2)。中心z=0时为零，z=R/√2时取得正半轴峰值；远处近似点电荷。"
            : mode === "line"
              ? "E = λ/(2πε₀r)，这里假定直线无限长。距离加倍，场强减半。"
              : mode === "superposition"
                ? "每个电场都是 kq/r²，这里设两场方向相同，E总 = 2kq/r²。一般情况必须按向量相加。"
                : "E = kq/r²。球对称电荷在球外也得到相同形式；高斯面面积为4πr²，通量为E·4πr²=q/ε₀。"}
      </p>
      <p>
        负号表示场指向电荷，正号表示背离电荷；先判断对称性与方向，再代入数值。
      </p>
    </section>
  );
}
