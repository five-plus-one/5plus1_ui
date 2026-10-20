import { createRef } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ChatComposer,
  FileTree,
  MarkdownEditor,
  MemberAccess,
  VideoPlayer,
  MessageList,
  ModelSelector,
  WorkspaceLayout,
  Y,
  markdownToDocument,
  documentToMarkdown,
  type WorkspaceLayoutHandle,
} from "../src/lib";
import type { Editor } from "@tiptap/core";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it("delegates pasted editor files to the current editor instance", async () => {
  const files = vi.fn(),
    ready = vi.fn();
  render(
    <MarkdownEditor markdown="学习笔记" onFiles={files} onReady={ready} />,
  );
  await waitFor(() => expect(ready).toHaveBeenCalled());
  const file = new File(["notes"], "notes.txt", { type: "text/plain" });
  fireEvent.paste(screen.getByLabelText("笔记正文"), {
    clipboardData: { files: [file], getData: () => "", types: ["Files"] },
  });
  expect(files).toHaveBeenCalledWith([file], ready.mock.calls[0][0]);
});
it("retains an invitation on failure and delegates controlled permissions", async () => {
  const invite = vi
      .fn()
      .mockRejectedValueOnce(new Error("暂时无法发送"))
      .mockResolvedValueOnce(undefined),
    role = vi.fn();
  render(
    <MemberAccess
      canManage
      members={[
        { id: "owner", name: "所有者", role: "edit", editable: false },
        { id: "reader", name: "小林", role: "read" },
      ]}
      roles={[
        { value: "read", label: "可阅读" },
        { value: "edit", label: "可编辑" },
      ]}
      onInvite={invite}
      onRoleChange={role}
    />,
  );
  expect(screen.queryByLabelText("所有者的权限")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("combobox", { name: "小林的权限" }));
  fireEvent.click(screen.getByRole("option", { name: "可编辑" }));
  expect(role).toHaveBeenCalledWith("reader", "edit");
  fireEvent.change(screen.getByLabelText("邀请成员"), {
    target: { value: "reader@example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: "邀请" }));
  await screen.findByText("暂时无法发送");
  expect(screen.getByLabelText("邀请成员")).toHaveValue("reader@example.com");
  fireEvent.click(screen.getByRole("button", { name: "邀请" }));
  await screen.findByText("邀请已发送");
  expect(screen.getByLabelText("邀请成员")).toHaveValue("");
});
it("cancels stale video authorization and restores playback position", async () => {
  const requests: { signal: AbortSignal; resolve: (url: string) => void }[] =
    [];
  const resolveSource = vi.fn(
    (_src: string, signal: AbortSignal) =>
      new Promise<string>((resolve) => {
        requests.push({ signal, resolve });
      }),
  );
  const videoRef = createRef<HTMLVideoElement>();
  const view = render(
    <VideoPlayer
      src="first"
      resolveSource={resolveSource}
      startAt={42}
      videoRef={videoRef}
    />,
  );
  view.rerender(
    <VideoPlayer
      src="second"
      resolveSource={resolveSource}
      startAt={42}
      videoRef={videoRef}
    />,
  );
  expect(requests[0].signal.aborted).toBe(true);
  await act(async () => {
    requests[1].resolve("/second.mp4");
    requests[0].resolve("/first.mp4");
  });
  expect(videoRef.current).toHaveAttribute("src", "/second.mp4");
  fireEvent.loadedMetadata(videoRef.current!);
  expect(videoRef.current?.currentTime).toBe(42);
});
describe("model selection", () => {
  const groups = [
    {
      name: "通用模型",
      models: [
        { id: "fast", label: "快速版", contextWindow: 128000 },
        { id: "deep", label: "深度版", contextWindow: 200000 },
      ],
    },
  ];
  it("formats tokens and closes on outside click and Escape", async () => {
    render(
      <>
        <ModelSelector value="fast" groups={groups} onChange={() => {}} />
        <button>旁边</button>
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "选择模型" }));
    expect(screen.getByText("128K")).toBeInTheDocument();
    expect(screen.getByText("200K")).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByText("旁边"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "选择模型" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "选择模型" })).toHaveFocus();
  });
  it("supports keyboard selection and focus return", async () => {
    const change = vi.fn();
    render(<ModelSelector value="fast" groups={groups} onChange={change} />);
    const trigger = screen.getByRole("button", { name: "选择模型" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await waitFor(() =>
      expect(screen.getByRole("option", { name: /快速版/ })).toHaveFocus(),
    );
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(change).toHaveBeenCalledWith("deep");
    expect(trigger).toHaveFocus();
  });
});
it("supports controlled tree expansion and middle-click without selecting a file", () => {
  const toggle = vi.fn(),
    select = vi.fn(),
    middle = vi.fn(),
    prefetch = vi.fn();
  const items = [
    {
      id: "root",
      name: "课程",
      kind: "folder" as const,
      children: [{ id: "root/note", name: "笔记", kind: "file" as const }],
    },
  ];
  const view = render(
    <FileTree
      items={items}
      expandedIds={[]}
      onToggle={toggle}
      onSelect={select}
      onMiddleClick={middle}
      onPrefetch={prefetch}
    />,
  );
  fireEvent.click(screen.getByRole("treeitem"));
  expect(toggle).toHaveBeenCalledWith("root", true);
  expect(
    screen.queryByRole("treeitem", { name: "笔记" }),
  ).not.toBeInTheDocument();
  view.rerender(
    <FileTree
      items={items}
      expandedIds={["root"]}
      onSelect={select}
      onMiddleClick={middle}
      onPrefetch={prefetch}
    />,
  );
  fireEvent.mouseEnter(screen.getByText("笔记"));
  fireEvent(
    screen.getByText("笔记"),
    new MouseEvent("auxclick", { button: 1, bubbles: true }),
  );
  expect(middle).toHaveBeenCalledTimes(1);
  expect(prefetch).toHaveBeenCalled();
  expect(select).not.toHaveBeenCalled();
});
it("controls three panels through the workspace handle", () => {
  const ref = createRef<WorkspaceLayoutHandle>();
  render(
    <div style={{ width: 1000, height: 500 }}>
      <WorkspaceLayout
        ref={ref}
        panels={[
          {
            id: "files",
            label: "目录",
            content: "目录内容",
            defaultSize: 20,
            collapsible: true,
          },
          { id: "note", label: "笔记", content: "笔记内容", defaultSize: 50 },
          { id: "chat", label: "对话", content: "对话内容", defaultSize: 30 },
        ]}
      />
    </div>,
  );
  expect(screen.getAllByRole("separator")).toHaveLength(2);
  act(() => ref.current?.collapse("files"));
  expect(ref.current?.isCollapsed("files")).toBe(true);
  act(() => ref.current?.expand("files"));
  expect(ref.current?.isCollapsed("files")).toBe(false);
  act(() => ref.current?.setLayout([25, 45, 30]));
  expect(ref.current?.getLayout()).toEqual([25, 45, 30]);
});
it("preserves Chinese composition, blocks duplicate sends and accepts attachments", async () => {
  const send = vi.fn(),
    files = vi.fn();
  const view = render(
    <ChatComposer
      value="问题"
      onChange={() => {}}
      onSend={send}
      onFiles={files}
    />,
  );
  const input = screen.getByRole("textbox", { name: "消息" });
  fireEvent.compositionStart(input);
  fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
  expect(send).not.toHaveBeenCalled();
  fireEvent.compositionEnd(input);
  fireEvent.keyDown(input, { key: "Enter" });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(send).toHaveBeenCalledTimes(1);
  await act(async () => {});
  const file = new File(["hello"], "资料.txt", { type: "text/plain" });
  fireEvent.paste(input, { clipboardData: { files: [file] } });
  expect(files).toHaveBeenCalledWith([file]);
  view.rerender(
    <ChatComposer
      value="问题"
      onChange={() => {}}
      onSend={send}
      attachments={[{ id: "1", name: "资料", status: "uploading" }]}
    />,
  );
  expect(screen.getByRole("button", { name: "发送消息" })).toBeDisabled();
});
it("follows streamed growth while pinned and leaves the user reading older messages", () => {
  const view = render(
    <MessageList
      messages={[{ id: "1", role: "assistant", content: "开始" }]}
    />,
  );
  const region = screen.getByRole("region", { name: "对话记录" });
  let height = 600;
  Object.defineProperties(region, {
    scrollHeight: { get: () => height },
    clientHeight: { value: 200 },
  });
  view.rerender(
    <MessageList
      messages={[{ id: "1", role: "assistant", content: "内容增加" }]}
    />,
  );
  expect(region.scrollTop).toBe(600);
  region.scrollTop = 100;
  fireEvent.scroll(region);
  height = 800;
  view.rerender(
    <MessageList
      messages={[{ id: "1", role: "assistant", content: "仍在增加" }]}
      isLoading
    />,
  );
  expect(region.scrollTop).toBe(100);
  fireEvent.click(screen.getByRole("button", { name: "回到最新" }));
  expect(region.scrollTop).toBe(800);
});
it("round trips formulas, tables, cards, code languages and attachments", () => {
  const source =
    '# 标题\n\n公式 $x^2$。\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n:::note{label="说明"}\n卡片内容\n:::\n\n```python\nprint(1)\n```\n\n::attachment{name="notes.pdf" url="%2Fnotes.pdf" mediaType="application%2Fpdf"}\n';
  const doc = markdownToDocument(source);
  const types: string[] = [];
  const walk = (node: typeof doc) => {
    if (node.type) types.push(node.type);
    node.content?.forEach(walk);
  };
  walk(doc);
  expect(types).toEqual(
    expect.arrayContaining([
      "heading",
      "inlineMath",
      "table",
      "directiveBlock",
      "codeBlock",
      "attachment",
    ]),
  );
  const output = documentToMarkdown(doc);
  expect(output).toContain("x^2");
  expect(output).toContain(":::note");
  expect(output).toContain("```python");
  expect(output).toContain("::attachment");
  const second = markdownToDocument(output);
  const substantive = (nodes: typeof doc.content) =>
    nodes
      ?.filter((node) => node.type !== "paragraph" || node.content?.length)
      .map((node) => node.type);
  expect(substantive(second.content)).toEqual(substantive(doc.content));
  expect(
    second.content?.find((node) => node.type === "directiveBlock")?.attrs,
  ).toMatchObject({ name: "note", body: "卡片内容" });
  expect(
    second.content?.find((node) => node.type === "attachment")?.attrs,
  ).toMatchObject({
    name: "notes.pdf",
    url: "/notes.pdf",
    mediaType: "application/pdf",
  });
});
it("shares Markdown document content through Yjs and emits Markdown changes", async () => {
  const doc = new Y.Doc(),
    editors: Editor[] = [],
    change = vi.fn();
  const ready = (editor: Editor) => {
    editors.push(editor);
  };
  const view = render(
    <>
      <MarkdownEditor document={doc} onReady={ready} onChange={change} />
      <MarkdownEditor document={doc} onReady={ready} />
    </>,
  );
  await waitFor(() => expect(editors).toHaveLength(2));
  act(() => {
    editors[0].commands.setContent(
      markdownToDocument("## 共同学习\n\n一起编辑。"),
    );
  });
  await waitFor(() =>
    expect(
      view.container.querySelectorAll(".fp-editor-prose")[1],
    ).toHaveTextContent("共同学习"),
  );
  expect(change).toHaveBeenCalledWith(
    expect.stringContaining("共同学习"),
    expect.objectContaining({ type: "doc" }),
  );
  view.unmount();
  doc.destroy();
});
it("retains reading resource attributes and historical event details", () => {
  const source =
    '::audio{src="/lecture.wav" label="讲解"}\n\n:::event{year="1919" title="事件" location="北京" impact="交流"}\n正文\n:::\n';
  const doc = markdownToDocument(source);
  const output = documentToMarkdown(doc);
  expect(output).toContain("::audio");
  expect(output).toContain('src="/lecture.wav"');
  expect(output).toContain('location="北京"');
  expect(output).toContain('impact="交流"');
  expect(documentToMarkdown(markdownToDocument(output))).toBe(output);
});
