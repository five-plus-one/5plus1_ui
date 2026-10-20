import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { entries, Demo, groups } from "../src/catalog";

// jsdom 缺少的浏览器 API
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
if (!Element.prototype.animate) {
  Element.prototype.animate = vi.fn(() => ({ cancel() {} })) as never;
}
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
}

describe("组件目录", () => {
  it('可见选择和日期输入使用统一控件',()=>{
    const failures:string[]=[];
    for(const entry of entries){const {container,unmount}=render(<Demo name={entry.name} notify={()=>{}}/>);if(container.querySelector('select:not([hidden]),input[type="date"]:not([hidden]),input[type="datetime-local"],input[type="month"],input[type="week"],input[type="time"]'))failures.push(entry.name);unmount();}
    expect(failures).toEqual([]);
  });
  it('每个示例的按钮都明确声明表单行为',()=>{
    const failures:string[]=[];
    for(const entry of entries){const {container,unmount}=render(<Demo name={entry.name} notify={()=>{}}/>);if(container.querySelector('button:not([type])'))failures.push(entry.name);unmount();}
    expect(failures).toEqual([]);
  });
  it("每个条目都属于已声明的分组", () => {
    const known = new Set(groups);
    const unknown = entries.filter((e) => !known.has(e.group));
    expect(unknown.map((e) => `${e.name}:${e.group}`)).toEqual([]);
  });

  it("每个条目都有中文名与说明", () => {
    const bad = entries.filter((e) => !e.zh || !e.description);
    expect(bad.map((e) => e.name)).toEqual([]);
  });

  it("每个组件示例都能渲染且不崩溃", () => {
    const failures: string[] = [];
    for (const entry of entries) {
      try {
        const { unmount } = render(
          <Demo name={entry.name} notify={() => {}} />,
        );
        unmount();
      } catch (error) {
        failures.push(
          `${entry.name}: ${(error as Error).message.split("\n")[0]}`,
        );
      }
    }
    expect(failures).toEqual([]);
  });

  it("渲染结果不是空占位", () => {
    const empty: string[] = [];
    for (const entry of entries) {
      const { container, unmount } = render(
        <Demo name={entry.name} notify={() => {}} />,
      );
      const text = (container.textContent || "").trim();
      if (
        !text.length &&
        !container.querySelector("svg, img, input, textarea, table, .fp-skeleton")
      )
        empty.push(entry.name);
      unmount();
    }
    expect(empty).toEqual([]);
  });
});
