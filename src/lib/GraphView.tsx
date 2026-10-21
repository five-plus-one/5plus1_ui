import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Maximize, Minus, Network, Pause, Play, Plus, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { Checkbox } from "./index";
import { ColorPicker } from "./StyledInputs";
import { GraphSimulation, type ForceNode } from "./graphPhysics";
import { MediaSlider } from "./MediaControls";

export interface GraphNode { id: string; label: string; kind?: string }
export interface GraphEdge { source: string; target: string }
export interface GraphSettings {
  showArrows: boolean; textOpacity: number; nodeSize: number; lineThickness: number;
  centerForce: number; repelForce: number; linkForce: number;
  colorGroups: { query: string; color: string }[];
}
export const defaultGraphSettings: GraphSettings = { showArrows: false, textOpacity: 1, nodeSize: 1, lineThickness: 1, centerForce: 0.5, repelForce: 9, linkForce: 0.8, colorGroups: [] };
export interface GraphViewProps {
  nodes: GraphNode[]; edges: GraphEdge[]; selectedId?: string; onSelect: (id: string) => void;
  settings?: GraphSettings; onSettingsChange?: (settings: GraphSettings) => void;
  onRefresh?: () => void; onClose?: () => void; loading?: boolean; error?: string;
}
type Camera = { x: number; y: number; zoom: number };
const clampZoom = (n: number) => Math.max(0.08, Math.min(4, n));
const nodeRadius = (node: ForceNode, scale: number) => (4 + Math.min(5, Math.sqrt(node.degree) * 0.7)) * scale;

/** A live force-directed canvas, with an accessible search and note inspector. */
export function GraphView({ nodes, edges, selectedId, onSelect, settings: controlled, onSettingsChange, onRefresh, onClose, loading, error }: GraphViewProps) {
  const [local, setLocal] = useState(defaultGraphSettings), [query, setQuery] = useState(""), [filters, setFilters] = useState(false);
  const [active, setActive] = useState(selectedId || ""), [hovered, setHovered] = useState(""), [paused, setPaused] = useState(false), [engineError, setEngineError] = useState("");
  const settings = controlled || local;
  const canvas = useRef<HTMLCanvasElement>(null), simulation = useRef(new GraphSimulation());
  const camera = useRef<Camera>({ x: 0, y: 0, zoom: 1 }), target = useRef<Camera>({ x: 0, y: 0, zoom: 1 });
  const size = useRef({ width: 1, height: 1 }), initialized = useRef(false), interacted = useRef(false), dirty = useRef(true);
  const current = useRef({ nodes, settings, active, hovered, paused, query, onSelect });
  current.current = { nodes, settings, active, hovered, paused, query, onSelect };
  const fit = () => {
    const bodies = simulation.current.nodes;
    if (!bodies.length) return;
    const minX = Math.min(...bodies.map(n => n.x)), maxX = Math.max(...bodies.map(n => n.x));
    const minY = Math.min(...bodies.map(n => n.y)), maxY = Math.max(...bodies.map(n => n.y));
    const { width, height } = size.current;
    const zoom = clampZoom(Math.min((width - 100) / Math.max(120, maxX - minX), (height - 140) / Math.max(120, maxY - minY), 1.5));
    target.current = { x: -(minX + maxX) / 2 * zoom, y: -(minY + maxY) / 2 * zoom, zoom };
    dirty.current = true;
  };
  const fitRef = useRef(fit); fitRef.current = fit;
  const zoom = (factor: number) => { interacted.current = true; const old = target.current; const next = clampZoom(old.zoom * factor); target.current = { x: old.x * next / old.zoom, y: old.y * next / old.zoom, zoom: next }; dirty.current = true; };
  const focus = (id: string) => {
    setActive(id); const n = simulation.current.get(id); if (!n) return;
    interacted.current = true; const zoom = Math.max(0.8, target.current.zoom);
    target.current = { x: -n.x * zoom, y: -n.y * zoom, zoom }; dirty.current = true;
  };
  const setSettings = (patch: Partial<GraphSettings>) => { const next = { ...settings, ...patch }; setLocal(next); onSettingsChange?.(next); simulation.current.wake(); dirty.current = true; };
  useEffect(() => { setActive(selectedId || ""); }, [selectedId]);
  useEffect(() => {
    simulation.current.reconcile(nodes.map(n => n.id), edges);
    dirty.current = true;
    if (!initialized.current && nodes.length) { interacted.current = false; fitRef.current(); }
    initialized.current = nodes.length > 0;
  }, [nodes, edges]);
  useEffect(() => { simulation.current.wake(); dirty.current = true; }, [settings, query, active, hovered, paused]);

  useEffect(() => {
    const element = canvas.current;
    if (!element || typeof CanvasRenderingContext2D === "undefined") return;
    const ctx = element.getContext("2d");
    if (!ctx) { setEngineError("画布暂时无法显示，请通过搜索打开笔记。"); return; }
    let frame = 0, last = 0, elapsed = 0, live = true;
    let font = "sans-serif";
    let palette = { ink: "#202124", muted: "#747981", line: "#d5d8de", surface: "#fff", action: "#7255b4", groups: [] as string[] };
    const colors = () => {
      const css = getComputedStyle(element), get = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
      font = css.fontFamily;
      palette = { ink: get("--fp-ink", palette.ink), muted: get("--fp-muted", palette.muted), line: get("--fp-line-strong", palette.line), surface: get("--fp-surface", palette.surface), action: get("--fp-primary", palette.action), groups: [get("--fp-primary", "#7255b4"), get("--fp-success", "#368b75"), get("--fp-warning", "#ae782f"), "#6d91b6", "#b67c96", "#8b94a8"] };
      dirty.current = true;
    };
    colors();
    const theme = new MutationObserver(colors); theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-product", "class", "style"] });
    const resize = () => {
      const rect = element.getBoundingClientRect(); const ratio = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { width: Math.max(1, rect.width), height: Math.max(1, rect.height) };
      element.width = Math.round(size.current.width * ratio); element.height = Math.round(size.current.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0); dirty.current = true;
      if (!interacted.current) fitRef.current();
    };
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    const point = (event: PointerEvent | WheelEvent) => { const r = element.getBoundingClientRect(); return { x: event.clientX - r.left - size.current.width / 2, y: event.clientY - r.top - size.current.height / 2 }; };
    const hit = (p: { x: number; y: number }) => {
      const c = camera.current, world = { x: (p.x - c.x) / c.zoom, y: (p.y - c.y) / c.zoom };
      return simulation.current.nodes.reduce<ForceNode | undefined>((best, n) => {
        const d = Math.hypot(n.x - world.x, n.y - world.y), radius = Math.max(nodeRadius(n, current.current.settings.nodeSize), 12 / c.zoom);
        return d <= radius && (!best || d < Math.hypot(best.x - world.x, best.y - world.y)) ? n : best;
      }, undefined);
    };
    const pointers = new Map<number, { x: number; y: number }>();
    let gesture: { id: number; node?: string; start: { x: number; y: number }; last: { x: number; y: number }; moved: boolean } | undefined;
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const p = point(e); pointers.set(e.pointerId, p); element.setPointerCapture(e.pointerId); interacted.current = true;
      setHovered("");
      if (pointers.size > 1) { if (gesture?.node) simulation.current.release(gesture.node); gesture = undefined; return; }
      const n = hit(p); gesture = { id: e.pointerId, node: n?.id, start: p, last: p, moved: false };
      if (n) simulation.current.pin(n.id, n.x, n.y);
      element.style.cursor = n ? "grabbing" : "grabbing";
    };
    const move = (e: PointerEvent) => {
      const p = point(e), previous = pointers.get(e.pointerId);
      if (previous && pointers.size === 2) {
        const other = [...pointers.entries()].find(([id]) => id !== e.pointerId)![1];
        const oldDistance = Math.hypot(previous.x - other.x, previous.y - other.y), distance = Math.hypot(p.x - other.x, p.y - other.y);
        const c = camera.current, next = clampZoom(c.zoom * distance / Math.max(1, oldDistance));
        const oldCenter = { x: (previous.x + other.x) / 2, y: (previous.y + other.y) / 2 }, center = { x: (p.x + other.x) / 2, y: (p.y + other.y) / 2 };
        camera.current = target.current = { x: center.x - (oldCenter.x - c.x) * next / c.zoom, y: center.y - (oldCenter.y - c.y) * next / c.zoom, zoom: next };
        pointers.set(e.pointerId, p); dirty.current = true; return;
      }
      if (previous) pointers.set(e.pointerId, p);
      if (gesture && gesture.id === e.pointerId) {
        gesture.moved ||= Math.hypot(p.x - gesture.start.x, p.y - gesture.start.y) > 4;
        if (gesture.node) {
          const c = camera.current; simulation.current.pin(gesture.node, (p.x - c.x) / c.zoom, (p.y - c.y) / c.zoom);
        } else {
          const c = camera.current; camera.current = target.current = { ...c, x: c.x + p.x - gesture.last.x, y: c.y + p.y - gesture.last.y };
        }
        gesture.last = p; dirty.current = true;
      } else if (!pointers.size) { const n = hit(p); setHovered(n?.id || ""); element.style.cursor = n ? "grab" : "grab"; }
    };
    const up = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (gesture?.id === e.pointerId) {
        if (gesture.node) simulation.current.release(gesture.node);
        if (!gesture.moved && e.type !== "pointercancel") setActive(gesture.node || "");
        gesture = undefined;
      }
      if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);
      dirty.current = true; element.style.cursor = "grab";
    };
    const leave = () => { if (!pointers.size) setHovered(""); };
    const double = (e: MouseEvent) => { const n = hit(point(e as PointerEvent)); if (n) current.current.onSelect(n.id); };
    const wheel = (e: WheelEvent) => {
      e.preventDefault(); interacted.current = true;
      const p = point(e), c = target.current, next = clampZoom(c.zoom * Math.exp(-Math.max(-100, Math.min(100, e.deltaY)) * 0.002));
      target.current = { x: p.x - (p.x - c.x) * next / c.zoom, y: p.y - (p.y - c.y) * next / c.zoom, zoom: next }; dirty.current = true;
    };
    element.addEventListener("pointerdown", down); element.addEventListener("pointermove", move); element.addEventListener("pointerup", up); element.addEventListener("pointercancel", up); element.addEventListener("lostpointercapture", up); element.addEventListener("pointerleave", leave); element.addEventListener("dblclick", double); element.addEventListener("wheel", wheel, { passive: false });
    const draw = () => {
      const { width, height } = size.current, c = camera.current, { settings, active, hovered, query, nodes } = current.current;
      ctx.clearRect(0, 0, width, height);
      const s = simulation.current, labels = new Map(nodes.map(n => [n.id, n])), focusId = hovered || active;
      const neighborhood = new Set(focusId ? [focusId] : []);
      if (focusId) for (const [a, b] of s.links) { if (a.id === focusId) neighborhood.add(b.id); if (b.id === focusId) neighborhood.add(a.id); }
      const matching = new Set(query.trim() ? nodes.filter(n => n.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).map(n => n.id) : []);
      const screen = (n: ForceNode) => ({ x: n.x * c.zoom + c.x + width / 2, y: n.y * c.zoom + c.y + height / 2 });
      const visible = (n: ForceNode) => { const p = screen(n); return p.x > -30 && p.y > -30 && p.x < width + 30 && p.y < height + 30; };
      const dim = (id: string) => focusId ? !neighborhood.has(id) : query.trim() ? !matching.has(id) : false;
      for (const [a, b] of s.links) {
        if (!visible(a) && !visible(b)) continue;
        const p = screen(a), q = screen(b), connected = focusId && (a.id === focusId || b.id === focusId);
        ctx.globalAlpha = connected ? 0.8 : focusId || query.trim() ? 0.08 : 0.58;
        ctx.strokeStyle = connected ? palette.action : palette.line; ctx.lineWidth = settings.lineThickness * (connected ? 1.4 : 0.7);
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        if (settings.showArrows && (connected || c.zoom > 0.7)) { const angle = Math.atan2(q.y - p.y, q.x - p.x), offset = nodeRadius(b, settings.nodeSize) * c.zoom + 3; const x = q.x - Math.cos(angle) * offset, y = q.y - Math.sin(angle) * offset; ctx.beginPath(); ctx.moveTo(x - Math.cos(angle - 0.5) * 5, y - Math.sin(angle - 0.5) * 5); ctx.lineTo(x, y); ctx.lineTo(x - Math.cos(angle + 0.5) * 5, y - Math.sin(angle + 0.5) * 5); ctx.stroke(); }
      }
      const kinds = [...new Set(nodes.map(n => n.kind).filter(Boolean))];
      const ordered = [...s.nodes].sort((a, b) => Number(b.id === focusId) - Number(a.id === focusId) || Number(neighborhood.has(b.id)) - Number(neighborhood.has(a.id)) || b.degree - a.degree);
      const occupied: { x: number; y: number; w: number; h: number }[] = [];
      for (const n of ordered) {
        if (!visible(n)) continue;
        const p = screen(n), data = labels.get(n.id), radius = Math.max(2, nodeRadius(n, settings.nodeSize) * c.zoom), faded = dim(n.id);
        const group = settings.colorGroups.find(g => g.query.trim() && data?.label.includes(g.query));
        const color = group?.color || (data?.kind ? palette.groups[Math.max(0, kinds.indexOf(data.kind)) % palette.groups.length] : palette.action);
        ctx.globalAlpha = faded ? 0.18 : 1; ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
        if (n.id === focusId) { ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p.x, p.y, radius + 5, 0, Math.PI * 2); ctx.stroke(); }
        if (faded || !data || !settings.textOpacity || (focusId ? !neighborhood.has(n.id) : c.zoom < 0.55 && occupied.length >= 12)) continue;
        const text = data.label.length > 22 ? data.label.slice(0, 21) + "…" : data.label;
        ctx.font = `${n.id === focusId ? 600 : 400} 12px ${font}`;
        const w = ctx.measureText(text).width + 10, h = 20, x = p.x - w / 2, y = p.y + radius + 6;
        if (occupied.some(r => x < r.x + r.w + 6 && x + w + 6 > r.x && y < r.y + r.h + 3 && y + h + 3 > r.y)) continue;
        occupied.push({ x, y, w, h }); ctx.globalAlpha = settings.textOpacity * 0.94;
        ctx.fillStyle = palette.surface; ctx.fillRect(x, y, w, h); ctx.fillStyle = palette.ink; ctx.textBaseline = "middle"; ctx.textAlign = "center"; ctx.fillText(text, p.x, y + h / 2);
      }
      ctx.globalAlpha = 1;
    };
    const tick = (now: number) => {
      if (!live) return;
      const delta = Math.min(50, now - last); last = now; elapsed += delta;
      if (!document.hidden) {
        let changed = false;
        if (!current.current.paused) while (elapsed >= 1000 / 60) { changed = simulation.current.step(current.current.settings) || changed; elapsed -= 1000 / 60; }
        else elapsed = 0;
        if (!interacted.current && changed) fitRef.current();
        const c = camera.current, t = target.current;
        if (Math.abs(c.x - t.x) + Math.abs(c.y - t.y) + Math.abs(c.zoom - t.zoom) > 0.01) {
          const rate = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0.2;
          camera.current = { x: c.x + (t.x - c.x) * rate, y: c.y + (t.y - c.y) * rate, zoom: c.zoom + (t.zoom - c.zoom) * rate }; changed = true;
        }
        if (changed || dirty.current) { draw(); dirty.current = false; }
      } else elapsed = 0;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { live = false; cancelAnimationFrame(frame); observer.disconnect(); theme.disconnect(); element.removeEventListener("pointerdown", down); element.removeEventListener("pointermove", move); element.removeEventListener("pointerup", up); element.removeEventListener("pointercancel", up); element.removeEventListener("lostpointercapture", up); element.removeEventListener("pointerleave", leave); element.removeEventListener("dblclick", double); element.removeEventListener("wheel", wheel); };
  }, []);
  const matches = nodes.filter(n => n.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const selected = nodes.find(n => n.id === active), neighbors = new Set(edges.flatMap(e => e.source === active ? [e.target] : e.target === active ? [e.source] : []).filter(id => id !== active));
  const groups = [...new Set(nodes.map(n => n.kind).filter(Boolean))];
  return <section className="fp-graph" aria-label="关系图谱" onKeyDown={event => { if (event.key === "Escape") { if (filters) setFilters(false); else if (query) setQuery(""); else if (active) setActive(""); else onClose?.(); } }}>
    <header className="fp-graph-toolbar"><div className="fp-graph-heading"><Network size={18}/><div><h3>关系图谱</h3><span>{nodes.length} 篇笔记 · {edges.length} 条关联</span></div></div>
      <label className="fp-graph-search"><Search size={16}/><input aria-label="搜索关联笔记" placeholder="搜索笔记…" value={query} onChange={event => setQuery(event.target.value)}/>{query && <button type="button" aria-label="清空搜索" onClick={() => setQuery("")}><X size={14}/></button>}</label>
      <div className="fp-graph-actions"><button type="button" title="适应画布" aria-label="适应画布" onClick={() => { interacted.current = true; fit(); }}><Maximize size={17}/></button><button type="button" aria-label={paused ? "继续动态布局" : "暂停动态布局"} title={paused ? "继续动态布局" : "暂停动态布局"} onClick={() => { setPaused(!paused); simulation.current.wake(); }}>{paused ? <Play size={17}/> : <Pause size={17}/>}</button><button type="button" aria-label="显示设置" title="图谱设置" aria-expanded={filters} onClick={() => setFilters(!filters)}><SlidersHorizontal size={17}/></button>{onClose && <button type="button" title="关闭图谱" aria-label="关闭图谱" onClick={onClose}><X size={19}/></button>}</div>
    </header>
    <div className="fp-graph-viewport"><canvas ref={canvas} className="fp-graph-canvas" tabIndex={0} role="img" aria-label="可拖动的笔记关系图；使用搜索选择笔记" onKeyDown={event => {
      if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(1.2); }
      else if (event.key === "-") { event.preventDefault(); zoom(1 / 1.2); }
      else if (event.key === "0") { event.preventDefault(); fit(); }
      else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) { event.preventDefault(); interacted.current = true; target.current = { ...target.current, x: target.current.x + (event.key === "ArrowLeft" ? 40 : event.key === "ArrowRight" ? -40 : 0), y: target.current.y + (event.key === "ArrowUp" ? 40 : event.key === "ArrowDown" ? -40 : 0) }; dirty.current = true; }
      else if (event.key === "Enter" && active) onSelect(active);
    }}/>
      {loading && <div className="fp-graph-placeholder" role="status"><div className="fp-graph-skeleton"><i/><i/><i/><i/><i/></div><p>正在展开笔记关系…</p></div>}
      {(error || engineError) && <div className="fp-graph-placeholder" role="alert"><p>{error || engineError}</p>{onRefresh && <button type="button" onClick={onRefresh}>重新加载</button>}</div>}
      {!loading && !error && !nodes.length && <div className="fp-graph-placeholder"><Network size={32}/><p>把笔记链接起来，知识会在这里连接成图。</p></div>}
      {query.trim() && <nav className="fp-graph-results" aria-label="选择关联笔记"><small>{matches.length ? `${matches.length} 篇匹配的笔记` : "没有找到匹配的笔记"}</small>{matches.slice(0, 30).map(n => <button type="button" key={n.id} aria-pressed={n.id === active} onClick={() => focus(n.id)}>{n.label}</button>)}{matches.length > 30 && <small>继续输入可缩小范围</small>}</nav>}
      <aside className="fp-graph-options" data-open={filters} inert={!filters} aria-hidden={!filters} aria-label="图谱设置"><header><strong>图谱设置</strong><button type="button" aria-label="关闭设置" onClick={() => setFilters(false)}><X size={16}/></button></header>
        <p>拖动节点时，周围的笔记会随之调整。</p><Checkbox label="显示箭头" checked={settings.showArrows} onChange={event => setSettings({ showArrows: event.target.checked })}/>
        {([ ["repelForce", "节点间距", 1, 20, 1], ["linkForce", "连线牵引", 0.1, 2, 0.1], ["centerForce", "中心吸引", 0, 2, 0.1], ["nodeSize", "节点大小", 0.5, 3, 0.1], ["lineThickness", "连线粗细", 0.5, 3, 0.1], ["textOpacity", "文字清晰度", 0, 1, 0.1] ] as const).map(([id, label, min, max, step]) => <label className="fp-graph-setting" key={id}><span>{label}<output>{settings[id]}</output></span><MediaSlider aria-label={label} min={min} max={max} step={step} value={settings[id]} onChange={event => setSettings({ [id]: Number(event.target.value) })}/></label>)}
        {groups.length > 0 && <div className="fp-graph-group-legend"><strong>笔记分组</strong>{groups.map((kind, index) => <span key={kind}><i data-color={index % 6}/>{kind}</span>)}</div>}
        <div className="fp-graph-color-groups"><strong>关键词颜色</strong>{settings.colorGroups.map((group, index) => <div key={index}><input className="fp-pattern-input" aria-label={`第 ${index + 1} 组关键词`} value={group.query} placeholder="标题包含" onChange={event => setSettings({ colorGroups: settings.colorGroups.map((g, i) => i === index ? { ...g, query: event.target.value } : g) })}/><ColorPicker label={`第 ${index + 1} 组颜色`} value={group.color} onChange={color => setSettings({ colorGroups: settings.colorGroups.map((g, i) => i === index ? { ...g, color } : g) })}/><button type="button" aria-label={`删除第 ${index + 1} 组`} onClick={() => setSettings({ colorGroups: settings.colorGroups.filter((_, i) => i !== index) })}><X size={14}/></button></div>)}<button type="button" onClick={() => setSettings({ colorGroups: [...settings.colorGroups, { query: "", color: "#7255b4" }] })}><Plus size={14}/>添加分组</button></div>
        <button type="button" onClick={() => { setSettings(defaultGraphSettings); simulation.current.wake(); }}><RotateCcw size={14}/>恢复默认</button>{onRefresh && <button type="button" disabled={loading} onClick={onRefresh}>刷新笔记关系</button>}
      </aside>
      {selected && <div className="fp-graph-inspector"><button className="fp-graph-inspector-close" type="button" aria-label="取消选择" onClick={() => setActive("")}><X size={14}/></button><small>{selected.kind || "笔记"} · {neighbors.size} 篇关联</small><strong>{selected.label}</strong><button type="button" onClick={() => onSelect(selected.id)}>打开笔记<ArrowUpRight size={15}/></button></div>}
      <div className="fp-graph-zoom"><button type="button" aria-label="放大图谱" onClick={() => zoom(1.2)}><Plus size={17}/></button><button type="button" aria-label="缩小图谱" onClick={() => zoom(1 / 1.2)}><Minus size={17}/></button></div>
      <p className="fp-graph-hint">拖动节点 · 滚轮缩放 · 双击打开笔记{paused ? " · 布局已暂停" : ""}</p>
    </div>
  </section>;
}
