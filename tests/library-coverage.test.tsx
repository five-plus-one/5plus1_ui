import { expect, it, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import * as UI from "../src/lib";
import mapping from "../docs/kezhan-component-map.json";
import { productThemes } from "../src/lib/themes";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it("provides every reusable entry registered in the source mapping", () => {
  const missing = [...new Set(mapping.flatMap((row) => row.components))].filter(
    (name) => !(name in UI),
  );
  expect(missing).toEqual([]);
  expect(new Set(mapping.map((row) => row.source)).size).toBe(277);
});
function luminance(hex: string) {
  const channels = hex
    .replace("#", "")
    .match(/../g)!
    .map((value) => parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
it("keeps primary action labels readable across the four light and dark palettes", () => {
  for (const palette of Object.values(productThemes)) {
    const p = palette as Record<string, string>;
    for (const dark of [false, true]) {
      const background = dark
          ? p.darkAction || p.darkPrimary || p.primary
          : p.action || p.primary,
        foreground = dark
          ? p.darkOnAction || p.darkOnPrimary || p.onPrimary
          : p.onAction || p.onPrimary;
      const values = [luminance(background), luminance(foreground)].sort(
        (a, b) => b - a,
      );
      expect(
        (values[0] + 0.05) / (values[1] + 0.05),
        `${p.name} ${dark ? "dark" : "light"}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  }
});
it("keeps directory-specific attributes when editing a media address", () => {
  const change = vi.fn();
  render(
    <UI.DirectiveFields
      name="figure"
      value={'src="old.png" alt="笔记图片" custom="keep"'}
      onChange={change}
    />,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "图片地址" }), {
    target: { value: "new.png" },
  });
  expect(UI.parseDirectiveAttributes(change.mock.calls[0][0])).toEqual({
    src: "new.png",
    alt: "笔记图片",
    custom: "keep",
  });
});
it("directs invalid select validation to its themed trigger", () => {
  const { container } = render(
    <UI.Select
      required
      aria-label="课程"
      value=""
      options={[
        { value: "", label: "请选择" },
        { value: "a", label: "线性代数" },
      ]}
      onChange={() => {}}
    />,
  );
  fireEvent.invalid(container.querySelector("select")!);
  expect(screen.getByRole("combobox", { name: "课程" })).toHaveFocus();
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(container.querySelector("select")).toHaveAttribute("hidden");
});
it("prevents dropping a parent folder into any of its descendants", () => {
  const move = vi.fn();
  render(
    <UI.ResourceExplorer
      items={[
        { id: "a", name: "上级", kind: "folder" },
        { id: "b", parentId: "a", name: "下级", kind: "folder" },
      ]}
      folderId="a"
      selectedIds={[]}
      onSelectionChange={() => {}}
      onFolderChange={() => {}}
      onOpen={() => {}}
      onMove={move}
    />,
  );
  fireEvent.drop(
    screen.getByRole("button", { name: "下级" }).closest("[data-resource-id]")!,
    { dataTransfer: { files: [], getData: () => JSON.stringify(["a"]) } },
  );
  expect(move).not.toHaveBeenCalled();
});
it("windows both list and grid representations of large folders", () => {
  const { container } = render(
    <UI.ResourceExplorer
      items={Array.from({ length: 1000 }, (_, index) => ({
        id: String(index),
        name: `资料 ${index}`,
        kind: "file" as const,
      }))}
      selectedIds={[]}
      onSelectionChange={() => {}}
      onFolderChange={() => {}}
      onOpen={() => {}}
    />,
  );
  expect(container.querySelectorAll("[data-resource-id]").length).toBeLessThan(
    100,
  );
  fireEvent.click(screen.getByRole("button", { name: "网格视图" }));
  expect(container.querySelectorAll("[data-resource-id]").length).toBeLessThan(
    100,
  );
  expect(screen.getByText("1000 项")).toBeInTheDocument();
});
it("keeps a read-only sharing panel from offering a new member search", () => {
  render(
    <UI.ShareAccessPanel
      access={{ members: [], roles: [], canManage: false }}
      search={{ onSearch: async () => [] }}
      onAddMember={() => {}}
      link={{
        enabled: false,
        onEnabledChange: () => {},
        access: "read",
        onAccessChange: () => {},
      }}
    />,
  );
  expect(screen.queryByRole("textbox")).toBeNull();
  expect(screen.getByRole("switch")).toBeDisabled();
});

it("adapts the taskbar to available width and keeps overflow windows selectable", () => {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("fp-taskbar") ? 330 : 640;
    },
  );
  const select = vi.fn();
  render(
    <UI.WindowTaskbar
      windows={Array.from({ length: 6 }, (_, index) => ({
        id: String(index),
        title: `窗口 ${index + 1}`,
      }))}
      onSelect={select}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "还有 4 个窗口" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "窗口 6" }));
  expect(select).toHaveBeenCalledWith("5");
});
it("offers the graph settings and filters accessible note navigation", () => {
  render(
    <UI.GraphView
      nodes={[
        { id: "a", label: "向量空间" },
        { id: "b", label: "线性映射" },
      ]}
      edges={[{ source: "a", target: "b" }]}
      onSelect={() => {}}
    />,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "搜索关联笔记" }), {
    target: { value: "映射" },
  });
  expect(screen.queryByRole("button", { name: "向量空间" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "显示设置" }));
  expect(screen.getByRole("slider", { name: "节点大小" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "添加分组" }));
  expect(
    screen.getByRole("textbox", { name: "第 1 组关键词" }),
  ).toBeInTheDocument();
});
