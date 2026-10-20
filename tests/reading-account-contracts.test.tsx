import { afterEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/core";
import {
  BrowserSurface,
  CreditAdjustment,
  DirectoryPicker,
  FloatingWindow,
  ImportPanel,
  LoginForm,
  MarkdownContent,
  MarkdownEditor,
  ShortcutProvider,
  ShortcutSettings,
  moveEditorBlock,
  useShortcut,
} from "../src/lib";
afterEach(cleanup);
it("renders math, tables and expandable semantic directives in reading mode", async () => {
  render(
    <MarkdownContent
      markdown={
        '# 课程笔记\n\n公式 $x^2$。\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n:::concept{term="线性映射"}\n保持加法与数乘。\n:::'
      }
    />,
  );
  expect(screen.getByRole("heading", { name: "课程笔记" })).toBeInTheDocument();
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(document.querySelector(".katex")).toBeTruthy();
  const trigger = screen.getByRole("button", { name: /线性映射/ });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
});
it("leaves scripts and unsafe media URLs outside rendered content", () => {
  const { container } = render(
    <MarkdownContent
      markdown={
        '<script>alert(1)</script>\n\n[危险链接](javascript:alert(1))\n\n::video{src="javascript:alert(1)" title="视频"}'
      }
    />,
  );
  expect(container.querySelector("script")).toBeNull();
  expect(container.querySelector("a")?.getAttribute("href") || "").not.toMatch(
    /^javascript:/,
  );
  expect(
    container.querySelector("video")?.getAttribute("src") || "",
  ).not.toMatch(/^javascript:/);
});
it("provides specialist directive attributes and body through the reader adapter", () => {
  const renderDirective = vi.fn(({ name, attributes, children }) =>
    name === "plot" ? (
      <section aria-label="函数绘图">
        {attributes.fn}
        {children}
      </section>
    ) : undefined,
  );
  render(
    <MarkdownContent
      markdown={':::plot{fn="x*x"}\n观察曲线。\n:::'}
      renderDirective={renderDirective}
    />,
  );
  expect(screen.getByRole("region", { name: "函数绘图" })).toHaveTextContent(
    "x*x",
  );
  expect(renderDirective).toHaveBeenCalledWith(
    expect.objectContaining({ name: "plot", attributes: { fn: "x*x" } }),
  );
});
it("preserves document block attributes and selection when moving a block", async () => {
  let editor!: Editor;
  render(
    <MarkdownEditor
      markdown={"# 标题\n\n第一段\n\n第二段"}
      onReady={(value) => {
        editor = value;
      }}
    />,
  );
  await waitFor(() => expect(editor).toBeTruthy());
  const nodes: number[] = [];
  editor.state.doc.forEach((_node, offset) => nodes.push(offset));
  editor.commands.setTextSelection(nodes[2] + 1);
  expect(moveEditorBlock(editor, "up")).toBe(true);
  expect(editor.state.doc.child(1).textContent).toBe("第二段");
  expect(editor.state.selection.$from.parent.textContent).toBe("第二段");
  expect(editor.state.doc.child(0).type.name).toBe("heading");
});
it("keeps login fields after rejection and blocks duplicate login attempts", async () => {
  let reject!: (reason: Error) => void;
  const login = vi.fn(
    () =>
      new Promise<void>((_yes, no) => {
        reject = no;
      }),
  );
  render(<LoginForm onLogin={login} />);
  fireEvent.change(screen.getByRole("textbox", { name: "账号" }), {
    target: { value: "student" },
  });
  fireEvent.change(screen.getByLabelText("密码", { exact: true }), {
    target: { value: "secret" },
  });
  fireEvent.click(screen.getByRole("button", { name: "登录", exact: true }));
  expect(screen.getByRole("button", { name: "正在登录…" })).toBeDisabled();
  reject(Error("账号暂时无法登录"));
  await screen.findByRole("alert");
  expect(screen.getByRole("textbox", { name: "账号" })).toHaveValue("student");
  expect(screen.getByLabelText("密码", { exact: true })).toHaveValue("secret");
  expect(login).toHaveBeenCalledOnce();
});
it("rejects fractional and excessive credit deductions before confirmation", () => {
  const submit = vi.fn();
  render(<CreditAdjustment name="同学" balance={10} onSubmit={submit} />);
  fireEvent.change(screen.getByRole("textbox", { name: "调整原因" }), {
    target: { value: "更正" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "调整数量" }), {
    target: { value: "-11" },
  });
  expect(screen.getByRole("button", { name: "确认调整" })).toBeDisabled();
  fireEvent.change(screen.getByRole("textbox", { name: "调整数量" }), {
    target: { value: "1.5" },
  });
  expect(screen.getByRole("button", { name: "确认调整" })).toBeDisabled();
  fireEvent.change(screen.getByRole("textbox", { name: "调整数量" }), {
    target: { value: "-5" },
  });
  fireEvent.click(screen.getByRole("button", { name: "确认调整" }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "确认", exact: true }));
  expect(submit).toHaveBeenCalledWith(-5, "更正");
});
it("does not confirm a disabled directory even when its id is supplied", () => {
  render(
    <DirectoryPicker
      items={[{ id: "a", name: "归档", disabled: true }]}
      value="a"
      onChange={() => {}}
      onConfirm={() => {}}
    />,
  );
  expect(screen.getByRole("button", { name: "选择此目录" })).toBeDisabled();
});
it("preserves newly added files when an earlier import completes", async () => {
  let finish!: () => void;
  render(
    <ImportPanel
      onImport={() =>
        new Promise<void>((yes) => {
          finish = yes;
        })
      }
    />,
  );
  const first = new File(["a"], "first.md"),
    next = new File(["b"], "next.md");
  const area = screen.getByText("将文件拖到这里，或选择文件。").parentElement!;
  fireEvent.drop(area, { dataTransfer: { files: [first] } });
  fireEvent.click(screen.getByRole("button", { name: "开始导入" }));
  fireEvent.drop(area, { dataTransfer: { files: [next] } });
  finish();
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "开始导入" })).toBeEnabled(),
  );
  expect(screen.getByText("next.md")).toBeInTheDocument();
});
it("respects shortcut priority, input focus and composition", () => {
  const primary = vi.fn(),
    secondary = vi.fn();
  function Bindings() {
    useShortcut({
      id: "one",
      label: "搜索",
      keys: "Ctrl+k",
      priority: 1,
      run: useCallback(primary, []),
    });
    useShortcut({
      id: "two",
      label: "搜索",
      keys: "Ctrl+k",
      priority: 2,
      run: useCallback(secondary, []),
    });
    return <input aria-label="正文" />;
  }
  render(
    <ShortcutProvider>
      <Bindings />
    </ShortcutProvider>,
  );
  fireEvent.keyDown(window, { key: "k", ctrlKey: true });
  expect(secondary).toHaveBeenCalledOnce();
  expect(primary).not.toHaveBeenCalled();
  fireEvent.keyDown(screen.getByRole("textbox", { name: "正文" }), {
    key: "k",
    ctrlKey: true,
  });
  fireEvent.keyDown(window, { key: "k", ctrlKey: true, isComposing: true });
  expect(secondary).toHaveBeenCalledOnce();
});
it("reports a shortcut conflict and leaves the current binding intact", () => {
  const change = vi.fn();
  render(
    <ShortcutSettings
      items={[
        { id: "a", label: "搜索", keys: "Ctrl+k", enabled: true },
        { id: "b", label: "笔记", keys: "Ctrl+n", enabled: true },
      ]}
      onChange={change}
    />,
  );
  const trigger = screen.getByRole("button", { name: "设置笔记快捷键" });
  fireEvent.click(trigger);
  fireEvent.keyDown(trigger, { key: "k", ctrlKey: true });
  expect(screen.getByRole("alert")).toHaveTextContent("已被其他操作使用");
  expect(change).not.toHaveBeenCalled();
});
it("navigates a browser surface only to valid web URLs", () => {
  const navigate = vi.fn();
  render(
    <BrowserSurface url="https://fiveplus.one/" onNavigate={navigate}>
      网页预览
    </BrowserSurface>,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "网页地址" }), {
    target: { value: "https://example.com/notes" },
  });
  fireEvent.click(screen.getByRole("button", { name: "前往" }));
  expect(navigate).toHaveBeenCalledWith("https://example.com/notes");
});
it("resizes floating windows through the keyboard without disturbing their location", () => {
  const change = vi.fn();
  render(
    <FloatingWindow
      title="笔记"
      geometry={{ x: 20, y: 30, width: 400, height: 300 }}
      onGeometryChange={change}
      onClose={() => {}}
    >
      正文
    </FloatingWindow>,
  );
  fireEvent.keyDown(screen.getByRole("separator", { name: "调整窗口大小" }), {
    key: "ArrowRight",
  });
  expect(change).toHaveBeenCalledWith({
    x: 20,
    y: 30,
    width: 416,
    height: 300,
  });
});
