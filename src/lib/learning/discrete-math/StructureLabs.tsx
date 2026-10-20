import { LearningSelect } from "../LearningSelect";
("use client");
import { useState } from "react";
const vertexNames = ["a", "b", "c", "d"];
const possibleEdges = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];
export function graphFacts(mask: number) {
  const edges = possibleEdges.filter((_, i) => mask & (1 << i));
  const degrees = vertexNames.map(
    (_, v) => edges.filter((e) => e.includes(v)).length,
  );
  const colors = [-1, -1, -1, -1];
  let bipartite = true,
    components = 0;
  for (let start = 0; start < 4; start++) {
    if (colors[start] >= 0) continue;
    components++;
    colors[start] = 0;
    const queue = [start];
    for (let i = 0; i < queue.length; i++) {
      const v = queue[i];
      for (const e of edges) {
        if (!e.includes(v)) continue;
        const w = e[0] === v ? e[1] : e[0];
        if (colors[w] < 0) {
          colors[w] = 1 - colors[v];
          queue.push(w);
        } else if (colors[w] === colors[v]) bipartite = false;
      }
    }
  }
  let matching: number[][] = [];
  for (let candidate = 0; candidate < 1 << edges.length; candidate++) {
    const selected = edges.filter((_, i) => candidate & (1 << i));
    const endpoints = selected.flat();
    if (
      new Set(endpoints).size === endpoints.length &&
      selected.length > matching.length
    )
      matching = selected;
  }
  return { edges, degrees, colors, bipartite, components, matching };
}
export function GraphStructureLab({
  matching = false,
}: {
  matching?: boolean;
}) {
  const [mask, setMask] = useState(45);
  const facts = graphFacts(mask);
  const positions = [
    [90, 60],
    [310, 60],
    [310, 230],
    [90, 230],
  ];
  return (
    <section
      aria-label={matching ? "图的匹配实验" : "图的度数与二染色实验"}
      className="rounded-xl border p-4 my-6"
    >
      <h3>{matching ? "选边与最大匹配" : "改变边，观察图的性质"}</h3>
      <p>点击边的开关，观察度数、连通分支和二染色如何一起变化。</p>
      <div className="flex flex-wrap gap-3">
        {possibleEdges.map(([a, b], i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={Boolean(mask & (1 << i))}
              onChange={() => setMask(mask ^ (1 << i))}
            />{" "}
            {vertexNames[a]}—{vertexNames[b]}
          </label>
        ))}
      </div>
      <svg
        viewBox="0 0 400 290"
        role="img"
        aria-label="当前无向图"
        style={{ width: "100%", maxHeight: 300 }}
      >
        {facts.edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={positions[a][0]}
            y1={positions[a][1]}
            x2={positions[b][0]}
            y2={positions[b][1]}
            stroke={
              matching && facts.matching.some((e) => e[0] === a && e[1] === b)
                ? "#d87927"
                : "#8b79a5"
            }
            strokeWidth={
              matching && facts.matching.some((e) => e[0] === a && e[1] === b)
                ? 7
                : 3
            }
          />
        ))}
        {positions.map(([x, y], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={23}
              fill={facts.colors[i] ? "#f0c589" : "#cab5f0"}
            />
            <text x={x} y={y + 6} textAnchor="middle" fill="#252033">
              {vertexNames[i]}
            </text>
          </g>
        ))}
      </svg>
      <p aria-live="polite">
        度数：{facts.degrees.join("、")}；度数和{" "}
        {facts.degrees.reduce((a, b) => a + b, 0)} = 2 × {facts.edges.length}
        。连通分支：{facts.components}。
      </p>
      <p>
        {facts.bipartite
          ? "可以二染色：每条边的两个端点颜色不同。"
          : "存在奇圈，当前图不能二染色。"}
      </p>
      {matching && (
        <p>
          橙色边是一组最大匹配，大小为 {facts.matching.length}
          。每个顶点最多连接一条被选中的边。尝试只保留
          a—b、b—c、c—d，比较中间一条与两端两条。
        </p>
      )}
    </section>
  );
}
export function MatchingLab() {
  return <GraphStructureLab matching />;
}
export function SetCountingLab() {
  const [a, setA] = useState(7),
    [b, setB] = useState(14);
  const members = (mask: number) =>
    vertexNames.filter((_, i) => mask & (1 << i));
  const count = (mask: number) => members(mask).length;
  return (
    <section aria-label="集合运算实验" className="rounded-xl border p-4 my-6">
      <h3>逐个元素检查集合运算</h3>
      {[
        ["A", a, setA],
        ["B", b, setB],
      ].map(([name, mask, change]) => (
        <div key={String(name)}>
          {String(name)}：
          {vertexNames.map((v, i) => (
            <label key={v} className="mx-2">
              <input
                type="checkbox"
                checked={Boolean(Number(mask) & (1 << i))}
                onChange={() =>
                  (change as (v: number) => void)(Number(mask) ^ (1 << i))
                }
              />
              {v}
            </label>
          ))}
        </div>
      ))}
      <table className="w-full my-4">
        <thead>
          <tr>
            <th>元素</th>
            <th>属于 A</th>
            <th>属于 B</th>
            <th>A∪B</th>
            <th>A∩B</th>
            <th>A∖B</th>
          </tr>
        </thead>
        <tbody>
          {vertexNames.map((v, i) => (
            <tr key={v}>
              {[
                v,
                Boolean(a & (1 << i)),
                Boolean(b & (1 << i)),
                Boolean((a | b) & (1 << i)),
                Boolean(a & b & (1 << i)),
                Boolean(a & ~b & (1 << i)),
              ].map((x, j) => (
                <td key={j}>
                  {typeof x === "boolean" ? (x ? "是" : "否") : x}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p aria-live="polite">
        |A∪B| = {count(a | b)} = {count(a)} + {count(b)} − {count(a & b)}
        。交集中的元素在两次计数中重复了一次。
      </p>
    </section>
  );
}
export function OrderLab() {
  const [selected, setSelected] = useState(2);
  const numbers = [1, 2, 3, 6];
  return (
    <section aria-label="整除偏序实验" className="rounded-xl border p-4 my-6">
      <h3>整除关系中的上界与下界</h3>
      <p>
        集合为 {"{1,2,3,6}"}，顺序 a≤b 表示 a 整除
        b。选择一个元素，查看它与其他元素是否可比。
      </p>
      <LearningSelect
        aria-label="选择元素"
        value={selected}
        onChange={(e) => setSelected(Number(e.target.value))}
      >
        {numbers.map((n) => (
          <option key={n}>{n}</option>
        ))}
      </LearningSelect>
      <table className="w-full my-4">
        <tbody>
          {numbers.map((n) => (
            <tr key={n}>
              <th>{n}</th>
              <td>
                {selected % n === 0
                  ? `${n} 是 ${selected} 的下界`
                  : n % selected === 0
                    ? `${n} 是 ${selected} 的上界`
                    : "二者不可比"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        2 与 3 的公共下界只有 1，公共上界只有 6，因此下确界为 1、上确界为
        6。偏序允许不可比元素。
      </p>
    </section>
  );
}
