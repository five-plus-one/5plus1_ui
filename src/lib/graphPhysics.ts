export interface ForceNode { id: string; x: number; y: number; vx: number; vy: number; degree: number; fixed?: { x: number; y: number } }
export interface ForceLink { source: string; target: string }
export interface ForceOptions { centerForce: number; repelForce: number; linkForce: number; nodeSize: number }

/** Stateful simulation: dragging pins one body while every other body keeps moving. */
export class GraphSimulation {
  nodes: ForceNode[] = [];
  links: [ForceNode, ForceNode][] = [];
  heat = 1;
  private byId = new Map<string, ForceNode>();
  reconcile(ids: string[], links: ForceLink[]) {
    const next = new Map<string, ForceNode>();
    ids.forEach((id, index) => {
      if (next.has(id)) return;
      const angle = index * 2.399963229728653, radius = 24 * Math.sqrt(index + 1);
      const node = this.byId.get(id) || { id, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, vx: 0, vy: 0, degree: 0 };
      node.degree = 0; next.set(id, node);
    });
    this.byId = next; this.nodes = [...next.values()];
    const seen = new Set<string>(); this.links = [];
    links.forEach(link => {
      const a = next.get(link.source), b = next.get(link.target);
      const key = JSON.stringify([link.source, link.target].sort());
      if (!a || !b || a === b || seen.has(key)) return;
      seen.add(key); a.degree++; b.degree++; this.links.push([a, b]);
    });
    this.wake();
  }
  get(id: string) { return this.byId.get(id); }
  wake() { this.heat = 1; }
  pin(id: string, x: number, y: number) { const n = this.get(id); if (n) { n.fixed = { x, y }; n.x = x; n.y = y; n.vx = n.vy = 0; this.wake(); } }
  release(id: string) { const n = this.get(id); if (n) { delete n.fixed; this.wake(); } }
  step(options: ForceOptions) {
    if (this.heat < 0.002) return false;
    const nodes = this.nodes, k = Math.max(0, options.repelForce) * 180, alpha = Math.max(0.15, this.heat);
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      let dx = b.x - a.x, dy = b.y - a.y;
      if (Math.abs(dx) + Math.abs(dy) < 0.001) { dx = 0.1 * Math.cos(i + j); dy = 0.1 * Math.sin(i + j); }
      const distance = Math.sqrt(dx * dx + dy * dy), minimum = 16 * options.nodeSize;
      const force = Math.min(8, k / Math.max(64, distance * distance) + Math.max(0, minimum - distance) * 0.12) * alpha;
      const fx = dx / distance * force, fy = dy / distance * force;
      a.vx -= fx; a.vy -= fy; b.vx += fx; b.vy += fy;
    }
    for (const [a, b] of this.links) {
      const dx = b.x - a.x, dy = b.y - a.y, length = Math.max(1, Math.hypot(dx, dy));
      const rest = 74 + Math.min(40, (a.degree + b.degree) * 1.2);
      const force = (length - rest) * 0.025 * options.linkForce * alpha;
      // Degree weighting prevents densely linked hubs from accelerating excessively.
      const fx = dx / length * force, fy = dy / length * force;
      a.vx += fx / Math.sqrt(a.degree); a.vy += fy / Math.sqrt(a.degree);
      b.vx -= fx / Math.sqrt(b.degree); b.vy -= fy / Math.sqrt(b.degree);
    }
    let energy = 0, pinned = false;
    for (const n of nodes) {
      if (n.fixed) { n.x = n.fixed.x; n.y = n.fixed.y; n.vx = n.vy = 0; pinned = true; continue; }
      n.vx = Math.max(-14, Math.min(14, (n.vx - n.x * options.centerForce * 0.001) * 0.82));
      n.vy = Math.max(-14, Math.min(14, (n.vy - n.y * options.centerForce * 0.001) * 0.82));
      n.x += n.vx; n.y += n.vy; energy += n.vx * n.vx + n.vy * n.vy;
    }
    this.heat = pinned ? Math.max(0.35, this.heat * 0.985) : this.heat * (energy / Math.max(1, nodes.length) < 0.002 ? 0.85 : 0.995);
    return true;
  }
}
