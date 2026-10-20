import { Checkbox } from "./index";
import { ColorPicker } from "./StyledInputs";
import { useEffect, useRef, useState } from "react";
import type { Core, StylesheetStyle } from "cytoscape";
import { CollapseTransition } from "./CollapseTransition";
export interface GraphNode {
  id: string;
  label: string;
  kind?: string;
}
export interface GraphEdge {
  source: string;
  target: string;
}
export interface GraphSettings {
  showArrows: boolean;
  textOpacity: number;
  nodeSize: number;
  lineThickness: number;
  centerForce: number;
  repelForce: number;
  linkForce: number;
  colorGroups: { query: string; color: string }[];
}
export const defaultGraphSettings: GraphSettings = {
  showArrows: true,
  textOpacity: 1,
  nodeSize: 1,
  lineThickness: 1,
  centerForce: 0.5,
  repelForce: 9,
  linkForce: 0.8,
  colorGroups: [],
};
export interface GraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedId?: string;
  onSelect: (id: string) => void;
  settings?: GraphSettings;
  onSettingsChange?: (settings: GraphSettings) => void;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string;
}
/** Data and settings are controlled independently from the local graph viewport. */
export function GraphView({
  nodes,
  edges,
  selectedId,
  onSelect,
  settings: controlled,
  onSettingsChange,
  onRefresh,
  loading,
  error,
}: GraphViewProps) {
  const [local, setLocal] = useState(defaultGraphSettings),
    [query, setQuery] = useState(""),
    [filters, setFilters] = useState(false),
    [engineError, setEngineError] = useState(""),
    [ready, setReady] = useState(0),
    [themeVersion, setThemeVersion] = useState(0);
  const settings = controlled || local;
  const host = useRef<HTMLDivElement>(null),
    graph = useRef<Core | null>(null),
    select = useRef(onSelect);
  select.current = onSelect;
  const setSettings = (patch: Partial<GraphSettings>) => {
    const next = { ...settings, ...patch };
    setLocal(next);
    onSettingsChange?.(next);
  };
  useEffect(() => {
    if (
      loading ||
      !host.current ||
      !nodes.length ||
      typeof CanvasRenderingContext2D === "undefined"
    )
      return;
    let live = true;
    let observer: ResizeObserver | undefined;
    const element = host.current;
    void import("cytoscape")
      .then(({ default: cytoscape }) => {
        if (!live) return;
        const css = getComputedStyle(element),
          ink = css.getPropertyValue("--fp-ink").trim(),
          action = css.getPropertyValue("--fp-action").trim(),
          line = css.getPropertyValue("--fp-line-strong").trim();
        const cy = cytoscape({
          container: element,
          elements: [
            ...nodes.map((node) => ({ data: { ...node } })),
            ...edges
              .filter(
                (edge) =>
                  nodes.some((n) => n.id === edge.source) &&
                  nodes.some((n) => n.id === edge.target),
              )
              .map((edge, index) => ({
                data: {
                  id: `edge-${index}`,
                  source: edge.source,
                  target: edge.target,
                },
              })),
          ],
          style: [
            {
              selector: "node",
              style: {
                label: "data(label)",
                "background-color": action,
                color: ink,
                "font-size": 12,
                "text-valign": "bottom",
                "text-margin-y": 8,
                width: 18,
                height: 18,
              },
            },
            {
              selector: "edge",
              style: {
                width: 1.5,
                "line-color": line,
                "target-arrow-color": line,
                "curve-style": "bezier",
              },
            },
            {
              selector: ":selected",
              style: { "border-width": 3, "border-color": ink },
            },
          ] as StylesheetStyle[],
          layout: { name: "cose", animate: false },
          minZoom: 0.15,
          maxZoom: 4,
        });
        graph.current = cy;
        setReady((value) => value + 1);
        cy.on("tap", "node", (event) => select.current(event.target.id()));
        if (typeof ResizeObserver !== "undefined") {
          observer = new ResizeObserver(() => cy.resize());
          observer.observe(element);
        }
        setEngineError("");
      })
      .catch(() => {
        if (live) setEngineError("关系图暂时无法显示，可从下方列表打开笔记。");
      });
    return () => {
      live = false;
      observer?.disconnect();
      graph.current?.destroy();
      graph.current = null;
    };
  }, [nodes, edges, loading]);
  useEffect(() => {
    const cy = graph.current;
    if (!cy) return;
    const css = host.current ? getComputedStyle(host.current) : null;
    const ink = css?.getPropertyValue("--fp-ink").trim() || "#202124",
      action = css?.getPropertyValue("--fp-action").trim() || "#b85e00",
      line = css?.getPropertyValue("--fp-line-strong").trim() || "#d0d3d7";
    cy.nodes().removeStyle();
    cy.style()
      .selector("node")
      .style({
        "background-color": action,
        color: ink,
        width: 18 * settings.nodeSize,
        height: 18 * settings.nodeSize,
        "text-opacity": settings.textOpacity,
      })
      .selector("edge")
      .style({
        "line-color": line,
        "target-arrow-color": line,
        width: 1.5 * settings.lineThickness,
        "target-arrow-shape": settings.showArrows ? "triangle" : "none",
      })
      .update();
    for (const group of settings.colorGroups.filter((group) =>
      group.query.trim(),
    ))
      cy.nodes()
        .filter((node) => String(node.data("label")).includes(group.query))
        .style("background-color", group.color);
  }, [settings, nodes, edges, ready, themeVersion]);
  useEffect(() => {
    const cy = graph.current;
    if (!cy) return;
    cy.nodes().unselect();
    if (selectedId) cy.getElementById(selectedId).select();
  }, [selectedId, nodes, edges, ready]);
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setThemeVersion((value) => value + 1),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-product"],
    });
    return () => observer.disconnect();
  }, []);
  const matches = nodes.filter((node) =>
    node.label.toLowerCase().includes(query.toLowerCase()),
  );
  const relayout = () =>
    graph.current
      ?.layout({
        name: "cose",
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        animationDuration: 220,
        gravity: settings.centerForce,
        nodeRepulsion: () => settings.repelForce * 1000,
        idealEdgeLength: () => 80 / Math.max(0.1, settings.linkForce),
      })
      .run();
  return (
    <section className="fp-graph" aria-label="笔记关系">
      <header>
        <h3>笔记关系</h3>
        <span>
          {nodes.length} 篇笔记 · {edges.length} 条联系
        </span>
      </header>
      <div className="fp-pattern-actions">
        <input
          className="fp-pattern-input"
          aria-label="搜索关联笔记"
          placeholder="搜索笔记"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="button" onClick={() => graph.current?.fit(undefined, 24)}>
          适应视图
        </button>
        <button type="button" onClick={relayout}>
          重新排列
        </button>
        <button
          type="button"
          aria-expanded={filters}
          onClick={() => setFilters((value) => !value)}
        >
          显示设置
        </button>
        {onRefresh && (
          <button type="button" disabled={loading} onClick={onRefresh}>
            刷新
          </button>
        )}
      </div>
      <CollapseTransition isOpen={filters}>
        <div className="fp-graph-settings">
          <Checkbox
            label="显示箭头"
            checked={settings.showArrows}
            onChange={(event) =>
              setSettings({ showArrows: event.target.checked })
            }
          />
          {(
            [
              ["nodeSize", "节点大小", 0.5, 3, 0.1],
              ["lineThickness", "连线粗细", 0.5, 3, 0.1],
              ["textOpacity", "文字清晰度", 0, 1, 0.1],
              ["centerForce", "中心吸引", 0, 2, 0.1],
              ["repelForce", "节点间距", 1, 20, 1],
              ["linkForce", "连线牵引", 0.1, 2, 0.1],
            ] as const
          ).map(([id, label, min, max, step]) => (
            <label key={id}>
              {label}
              <input
                type="range"
                aria-label={label}
                min={min}
                max={max}
                step={step}
                value={settings[id]}
                onChange={(event) =>
                  setSettings({ [id]: Number(event.target.value) })
                }
              />
              <output>{settings[id]}</output>
            </label>
          ))}
          <button type="button" onClick={relayout}>
            应用排列
          </button>
          <div className="fp-graph-color-groups">
            <strong>分组颜色</strong>
            {settings.colorGroups.map((group, index) => (
              <div key={index}>
                <input
                  className="fp-pattern-input"
                  aria-label={`第 ${index + 1} 组关键词`}
                  value={group.query}
                  placeholder="标题包含"
                  onChange={(event) =>
                    setSettings({
                      colorGroups: settings.colorGroups.map((item, i) =>
                        i === index
                          ? { ...item, query: event.target.value }
                          : item,
                      ),
                    })
                  }
                />
                <ColorPicker
                  label={`第 ${index + 1} 组颜色`}
                  value={group.color}
                  onChange={(color) =>
                    setSettings({
                      colorGroups: settings.colorGroups.map((item, i) =>
                        i === index ? { ...item, color } : item,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  aria-label={`删除第 ${index + 1} 组`}
                  onClick={() =>
                    setSettings({
                      colorGroups: settings.colorGroups.filter(
                        (_item, i) => i !== index,
                      ),
                    })
                  }
                >
                  删除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setSettings({
                  colorGroups: [
                    ...settings.colorGroups,
                    { query: "", color: "#FD8B07" },
                  ],
                })
              }
            >
              添加分组
            </button>
          </div>
        </div>
      </CollapseTransition>
      {(error || engineError) && <p role="alert">{error || engineError}</p>}
      {loading ? (
        <p role="status">正在读取笔记关系…</p>
      ) : nodes.length ? (
        <>
          <div ref={host} className="fp-graph-stage" aria-hidden="true" />
          <nav aria-label="选择关联笔记">
            {matches.map((node) => (
              <button
                type="button"
                key={node.id}
                aria-pressed={node.id === selectedId}
                onClick={() => {
                  onSelect(node.id);
                  const target = graph.current?.getElementById(node.id);
                  if (target?.length)
                    graph.current?.animate({
                      center: { eles: target },
                      duration: 180,
                    });
                }}
              >
                {node.label}
              </button>
            ))}
          </nav>
          {!matches.length && <p>没有找到匹配的笔记。</p>}
        </>
      ) : (
        <p>添加关联笔记后，在这里查看它们的联系。</p>
      )}
    </section>
  );
}
