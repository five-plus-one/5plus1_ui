import { afterEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import type { Editor } from "@tiptap/core";
import {
  AsyncAction,
  AudioPlayer,
  BacklinksPanel,
  CanvasWorkbench,
  ClassroomTimeline,
  ManagementTable,
  MarkdownEditor,
  MemoryCard,
  ProductNavigation,
  QuizScoring,
  ResourceExplorer,
  SaveConflict,
  SearchResults,
  SetupWizard,
  VersionHistory,
  WorkspaceTabs,
} from "../src/lib";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it("keeps an asynchronous action retryable, reports failure and prevents duplicate requests", async () => {
  let reject!: (reason: Error) => void;
  const action = vi.fn(
    () =>
      new Promise<void>((_resolve, no) => {
        reject = no;
      }),
  );
  render(
    <div className="fp-pattern-panel">
      <AsyncAction onAction={action}>保存</AsyncAction>
    </div>,
  );
  fireEvent.click(screen.getByRole("button", { name: "保存" }));
  fireEvent.click(screen.getByRole("button", { name: "正在处理…" }));
  expect(action).toHaveBeenCalledOnce();
  reject(Error("网络暂时不可用"));
  await screen.findByRole("alert");
  expect(screen.getByRole("button", { name: "保存" })).toBeEnabled();
});
it("requires confirmation before restoring a version and retains its preview after failure", async () => {
  const restore = vi.fn().mockRejectedValue(Error());
  render(
    <VersionHistory
      versions={[
        {
          id: "a",
          label: "课堂整理",
          date: "今天",
          preview: <p>已保存的正文</p>,
        },
      ]}
      selectedId="a"
      onSelect={() => {}}
      onRestore={restore}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "恢复此版本" }));
  expect(restore).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "确认恢复" }));
  await screen.findByRole("alert");
  expect(screen.getByText("已保存的正文")).toBeInTheDocument();
  expect(restore).toHaveBeenCalledWith("a");
});
it("keeps both conflict versions visible when applying a choice fails", async () => {
  render(
    <SaveConflict
      local="我的正文"
      remote="同学的正文"
      onResolve={() => Promise.reject(Error())}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "使用我的修改" }));
  await screen.findByRole("alert");
  expect(screen.getByText("我的正文")).toBeInTheDocument();
  expect(screen.getByText("同学的正文")).toBeInTheDocument();
});
it("ignores stale search results and opens a current result with the keyboard", async () => {
  const resolvers: ((value: { id: string; title: string }[]) => void)[] = [],
    open = vi.fn();
  const search = vi.fn(
    () =>
      new Promise<{ id: string; title: string }[]>((resolve) =>
        resolvers.push(resolve),
      ),
  );
  const view = render(
    <SearchResults
      query="旧"
      onQueryChange={() => {}}
      onSearch={search}
      onOpen={open}
      debounceMs={0}
    />,
  );
  await waitFor(() => expect(search).toHaveBeenCalledTimes(1));
  view.rerender(
    <SearchResults
      query="新"
      onQueryChange={() => {}}
      onSearch={search}
      onOpen={open}
      debounceMs={0}
    />,
  );
  await waitFor(() => expect(search).toHaveBeenCalledTimes(2));
  resolvers[1]([{ id: "new", title: "新的笔记" }]);
  await screen.findByText("新的笔记");
  resolvers[0]([{ id: "old", title: "旧的笔记" }]);
  await waitFor(() => expect(screen.queryByText("旧的笔记")).toBeNull());
  fireEvent.keyDown(screen.getByRole("textbox", { name: "搜索内容" }), {
    key: "Enter",
  });
  expect(open).toHaveBeenCalledWith({ id: "new", title: "新的笔记" });
});
it("moves focus across workspace tabs and preserves the selected tab when closing another", () => {
  const select = vi.fn(),
    close = vi.fn();
  render(
    <WorkspaceTabs
      tabs={[
        { id: "a", title: "第一章" },
        { id: "b", title: "第二章" },
      ]}
      activeId="a"
      onSelect={select}
      onClose={close}
    />,
  );
  fireEvent.keyDown(screen.getByRole("tab", { name: "第一章" }), {
    key: "ArrowRight",
  });
  expect(select).toHaveBeenCalledWith("b");
  expect(screen.getByRole("tab", { name: "第二章" })).toHaveFocus();
  fireEvent.click(screen.getByRole("button", { name: "关闭第二章" }));
  expect(close).toHaveBeenCalledWith("b");
  expect(screen.getByRole("tab", { name: "第一章" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
it("passes a dropped workspace tab to the target pane and insertion index", () => {
  const move = vi.fn();
  render(
    <WorkspaceTabs
      tabs={[{ id: "a", title: "第一章" }]}
      activeId="a"
      paneId="right"
      onSelect={() => {}}
      onClose={() => {}}
      onMove={move}
    />,
  );
  fireEvent.drop(screen.getByRole("tab", { name: "第一章" }).parentElement!, {
    dataTransfer: {
      getData: () => JSON.stringify({ id: "other", paneId: "left" }),
    },
  });
  expect(move).toHaveBeenCalledWith("other", "right", 0);
});
it("selects a continuous range without opening resources", () => {
  const open = vi.fn();
  function Example() {
    const [ids, setIds] = useState<string[]>([]);
    return (
      <ResourceExplorer
        items={["a", "b", "c"].map((id) => ({
          id,
          name: id,
          kind: "file" as const,
        }))}
        selectedIds={ids}
        onSelectionChange={setIds}
        onOpen={open}
        onFolderChange={() => {}}
      />
    );
  }
  render(<Example />);
  fireEvent.click(screen.getByRole("checkbox", { name: "选择a" }));
  fireEvent.click(screen.getByRole("button", { name: "c", exact: true }), {
    shiftKey: true,
  });
  for (const id of ["a", "b", "c"])
    expect(screen.getByRole("checkbox", { name: `选择${id}` })).toBeChecked();
  expect(open).not.toHaveBeenCalled();
});
it("delegates dropped files to the visible folder", () => {
  const upload = vi.fn();
  render(
    <ResourceExplorer
      items={[]}
      folderId="notes"
      selectedIds={[]}
      onSelectionChange={() => {}}
      onOpen={() => {}}
      onFolderChange={() => {}}
      onUpload={upload}
    />,
  );
  const file = new File(["text"], "notes.txt");
  fireEvent.drop(screen.getByText("文件夹还是空的").parentElement!, {
    dataTransfer: { files: [file] },
  });
  expect(upload).toHaveBeenCalledWith([file], "notes");
});
it("cancels previous audio authorization and retains the newest source", async () => {
  const calls: { signal: AbortSignal; resolve: (url: string) => void }[] = [];
  const resolve = vi.fn(
    (_url: string, signal: AbortSignal) =>
      new Promise<string>((yes) => calls.push({ signal, resolve: yes })),
  );
  const view = render(<AudioPlayer src="one" resolveSource={resolve} />);
  view.rerender(<AudioPlayer src="two" resolveSource={resolve} />);
  expect(calls[0].signal.aborted).toBe(true);
  calls[1].resolve("/two.wav");
  await waitFor(() =>
    expect(view.container.querySelector("audio")).toHaveAttribute(
      "src",
      "/two.wav",
    ),
  );
  calls[0].resolve("/one.wav");
  await waitFor(() =>
    expect(view.container.querySelector("audio")).toHaveAttribute(
      "src",
      "/two.wav",
    ),
  );
});
it("keeps memory answers outside the keyboard path until revealed", () => {
  const view = render(
    <MemoryCard
      question="问题"
      answer={<button type="button">答案中的链接</button>}
      revealed={false}
      onReveal={() => {}}
    />,
  );
  expect(screen.queryByRole("button", { name: "答案中的链接" })).toBeNull();
  view.rerender(
    <MemoryCard
      question="问题"
      answer={<button type="button">答案中的链接</button>}
      revealed
      onReveal={() => {}}
    />,
  );
  expect(
    screen.getByRole("button", { name: "答案中的链接" }),
  ).toBeInTheDocument();
});
it("enforces a setup step requirement before allowing continuation", () => {
  const next = vi.fn();
  render(
    <SetupWizard
      steps={[
        { id: "a", title: "名称", content: "填写名称", canContinue: false },
        { id: "b", title: "完成", content: "准备好了" },
      ]}
      step={0}
      onStepChange={next}
      onComplete={() => {}}
    />,
  );
  expect(screen.getByRole("button", { name: "继续" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "继续" }));
  expect(next).not.toHaveBeenCalled();
});
it("highlights the current classroom chapter and seeks to a selected chapter", () => {
  const seek = vi.fn();
  render(
    <ClassroomTimeline
      chapters={[
        { id: "b", title: "例题", time: 120 },
        { id: "a", title: "概念", time: 0 },
      ]}
      currentTime={150}
      onSeek={seek}
    />,
  );
  expect(screen.getByRole("button", { name: /例题/ })).toHaveAttribute(
    "aria-current",
    "step",
  );
  fireEvent.click(screen.getByRole("button", { name: /概念/ }));
  expect(seek).toHaveBeenCalledWith(0);
});
it("retains workbench source edits across view changes and keeps hidden parameters inert", () => {
  function Example() {
    const [source, setSource] = useState("原始内容");
    return (
      <CanvasWorkbench
        title="图表"
        source={source}
        onSourceChange={setSource}
        inspector={<button type="button">调整参数</button>}
      >
        图表预览
      </CanvasWorkbench>
    );
  }
  render(<Example />);
  expect(screen.queryByRole("button", { name: "调整参数" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "编辑源码" }));
  fireEvent.change(screen.getByRole("textbox", { name: "内容源码" }), {
    target: { value: "更新后的内容" },
  });
  fireEvent.click(screen.getByRole("button", { name: "查看内容" }));
  fireEvent.click(screen.getByRole("button", { name: "编辑源码" }));
  expect(screen.getByRole("textbox", { name: "内容源码" })).toHaveValue(
    "更新后的内容",
  );
});
it("delegates subjective scores within the declared question scale", () => {
  const score = vi.fn();
  render(
    <QuizScoring
      items={[
        { id: "q", title: "证明题", maximum: 5, awarded: 2, subjective: true },
      ]}
      onScoreChange={score}
    />,
  );
  fireEvent.change(screen.getByRole("slider", { name: "证明题自评得分" }), {
    target: { value: "3.5" },
  });
  expect(score).toHaveBeenCalledWith("q", 3.5);
});
it("opens backlinks and marks the active product for navigation", () => {
  const open = vi.fn(),
    change = vi.fn();
  render(
    <>
      <BacklinksPanel items={[{ id: "a", title: "复习提纲" }]} onOpen={open} />
      <ProductNavigation
        items={[
          { id: "a", label: "笔记" },
          { id: "b", label: "资料" },
        ]}
        value="a"
        onChange={change}
      />
    </>,
  );
  fireEvent.click(screen.getByRole("button", { name: "复习提纲" }));
  expect(open).toHaveBeenCalledWith("a");
  expect(screen.getByRole("button", { name: "笔记" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  fireEvent.click(screen.getByRole("button", { name: "资料" }));
  expect(change).toHaveBeenCalledWith("b");
});
it("preserves management rows after a failed row action", async () => {
  render(
    <ManagementTable
      title="笔记本"
      items={[{ id: "a", title: "线性代数" }]}
      columns={[{ id: "title", label: "名称", render: (i) => i.title }]}
      actions={[
        {
          id: "delete",
          label: "移除",
          confirm: () => "移除此笔记本？",
          run: () => Promise.reject(Error("暂时无法移除")),
        },
      ]}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "移除" }));
  fireEvent.click(screen.getByRole("button", { name: "确认" }));
  await screen.findByRole("alert");
  expect(screen.getByRole("cell", { name: "线性代数" })).toBeInTheDocument();
});
it("looks up note links and inserts the selected link into Markdown", async () => {
  vi.spyOn(window, "scrollBy").mockImplementation(() => {});
  let editor!: Editor;
  const suggestions = vi.fn(async () => [
    { id: "a", label: "线性映射", href: "/notes/linear" },
  ]);
  render(
    <MarkdownEditor
      markdown=""
      onReady={(value) => {
        editor = value;
      }}
      getSuggestions={suggestions}
    />,
  );
  await waitFor(() => expect(editor).toBeTruthy());
  vi.spyOn(editor.view, "coordsAtPos").mockReturnValue({
    left: 20,
    right: 20,
    top: 20,
    bottom: 40,
  });
  editor.commands.insertContent("[[");
  const option = await screen.findByRole("option", { name: "线性映射" });
  fireEvent.mouseDown(option);
  fireEvent.click(option);
  await waitFor(() =>
    expect(
      editor.getJSON().content?.[0].content?.[0].marks?.[0].attrs?.href,
    ).toBe("/notes/linear"),
  );
  expect(editor.getText()).toBe("线性映射");
});
it("renders upload failure actions from the editor node and delegates retry", async () => {
  const retry = vi.fn();
  render(
    <MarkdownEditor
      content={{
        type: "doc",
        content: [
          {
            type: "uploadPlaceholder",
            attrs: { uploadId: "upload", name: "讲义.pdf", error: "上传失败" },
          },
        ],
      }}
      onUploadAction={retry}
    />,
  );
  fireEvent.click(await screen.findByRole("button", { name: "重试" }));
  expect(retry).toHaveBeenCalledWith("upload", "retry");
  expect(screen.getByRole("alert")).toHaveTextContent("上传失败");
});
