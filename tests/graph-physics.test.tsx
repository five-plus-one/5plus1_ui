import { describe, expect, it } from "vitest";
import { GraphSimulation } from "../src/lib/graphPhysics";
const options = { centerForce: 0.5, repelForce: 9, linkForce: 0.8, nodeSize: 1 };
describe("live graph forces", () => {
  it("separates unlinked nodes and attracts stretched links", () => {
    const free = new GraphSimulation(); free.reconcile(["a", "b"], []);
    Object.assign(free.get("a")!, {x:-5,y:0}); Object.assign(free.get("b")!,{x:5,y:0});
    free.step({...options,centerForce:0});
    expect(free.get("b")!.x-free.get("a")!.x).toBeGreaterThan(10);
    const linked = new GraphSimulation(); linked.reconcile(["a","b"],[{source:"a",target:"b"}]);
    Object.assign(linked.get("a")!,{x:-200,y:0}); Object.assign(linked.get("b")!,{x:200,y:0});
    linked.step({...options,repelForce:0,centerForce:0});
    expect(linked.get("b")!.x-linked.get("a")!.x).toBeLessThan(400);
  });
  it("pins a dragged node while its neighbors respond, then releases it", () => {
    const graph = new GraphSimulation(); graph.reconcile(["a","b","c"],[{source:"a",target:"b"},{source:"b",target:"c"}]);
    for(let i=0;i<400;i++)graph.step(options);
    const before = { ...graph.get("b")! }; graph.pin("a",600,200);
    for(let i=0;i<40;i++)graph.step(options);
    expect(graph.get("a")!.x).toBe(600);
    expect(Math.hypot(graph.get("b")!.x-before.x,graph.get("b")!.y-before.y)).toBeGreaterThan(10);
    graph.release("a");graph.step(options);
    expect(graph.get("a")!.fixed).toBeUndefined(); expect(graph.get("a")!.x).not.toBe(600);
  });
  it("preserves positions across live data updates and discards invalid links", () => {
    const graph=new GraphSimulation();graph.reconcile(["a","b"],[{source:"a",target:"b"}]); graph.get("a")!.x=123;
    graph.reconcile(["a","b","c"],[{source:"a",target:"c"},{source:"c",target:"a"},{source:"a",target:"missing"},{source:"a",target:"a"}]);
    expect(graph.get("a")!.x).toBe(123);expect(graph.links).toHaveLength(1);expect(graph.get("a")!.degree).toBe(1);
  });
  it("keeps a dense 403-note graph finite through repeated interaction", () => {
    const graph=new GraphSimulation(),ids=Array.from({length:403},(_,i)=>String(i));
    graph.reconcile(ids,Array.from({length:1728},(_,i)=>({source:ids[i%403],target:ids[(i*7+11)%403]})));
    for(let i=0;i<180;i++)graph.step(options);
    graph.pin("10",-800,400);for(let i=0;i<30;i++)graph.step(options);graph.release("10");
    expect(graph.nodes.every(n=>Number.isFinite(n.x)&&Number.isFinite(n.y))).toBe(true);
    expect(Math.max(...graph.nodes.map(n=>n.x))-Math.min(...graph.nodes.map(n=>n.x))).toBeGreaterThan(300);
  });
});
