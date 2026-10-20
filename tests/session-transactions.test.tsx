import { useState } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import {
  NoteEditorWorkspace,
  type EditableNote,
} from "../src/lib/NoteEditorWorkspace";
import { CanvasFullscreenPortal } from "../src/lib/canvas/CanvasFullscreenPortal";
import { CanvasWorkspace } from "../src/lib/CanvasWorkspace";
import { LectureWorkspace } from "../src/lib/LectureWorkspace";
import {
  AISettingsWorkspace,
  createEditableAIModel,
  type AISettings,
} from "../src/lib/AISettingsWorkspace";
import { AnchoredPanel } from "../src/lib/AnchoredPanel";
import { SelectField } from "../src/lib/SelectField";
import { useRef } from "react";
import { WorkspaceField } from "../src/lib/WorkspaceForms";
import { NotebookManagerWorkspace } from "../src/lib/NotebookManagerWorkspace";
import { CourseContentWorkspace } from "../src/lib/CourseContentWorkspace";
vi.mock("../src/lib/editor/MarkdownEditor", () => ({
  MarkdownEditor: ({ markdown, onChange, editable = true }: any) => (
    <textarea
      aria-label="笔记正文"
      value={markdown}
      disabled={!editable}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const note: EditableNote = {
  id: "one",
  title: "课堂笔记",
  markdown: "初稿",
  revision: "r1",
};
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
it("preserves text entered while an earlier snapshot saves and advances its revision", async () => {
  const pending = deferred<EditableNote>(),
    save = vi
      .fn()
      .mockReturnValueOnce(pending.promise)
      .mockImplementation(async (n) => ({ ...n, revision: "r3" }));
  render(
    <NoteEditorWorkspace document={note} onSave={save} autosaveDelay={0} />,
  );
  fireEvent.change(screen.getByLabelText("笔记正文"), {
    target: { value: "第二稿" },
  });
  fireEvent.click(screen.getByRole("button", { name: "保存" }));
  fireEvent.change(screen.getByLabelText("笔记正文"), {
    target: { value: "第三稿" },
  });
  await act(async () =>
    pending.resolve({ ...note, markdown: "第二稿", revision: "r2" }),
  );
  expect(screen.getByLabelText("笔记正文")).toHaveValue("第三稿");
  fireEvent.click(screen.getByRole("button", { name: "保存" }));
  await waitFor(() =>
    expect(save).toHaveBeenLastCalledWith(
      expect.objectContaining({ markdown: "第三稿", revision: "r2" }),
      expect.any(AbortSignal),
    ),
  );
});
it("aborts a pending save when changing document identity", async () => {
  const pending = deferred<EditableNote>(),
    save = vi.fn(() => pending.promise),
    view = render(
      <NoteEditorWorkspace document={note} onSave={save} autosaveDelay={0} />,
    );
  fireEvent.change(screen.getByLabelText("笔记正文"), {
    target: { value: "第二稿" },
  });
  fireEvent.click(screen.getByRole("button", { name: "保存" }));
  view.rerender(
    <NoteEditorWorkspace
      document={{ ...note, id: "two", markdown: "另一篇笔记" }}
      onSave={save}
      autosaveDelay={0}
    />,
  );
  expect(save.mock.calls[0][1].aborted).toBe(true);
  await act(async () =>
    pending.resolve({ ...note, markdown: "第二稿", revision: "r2" }),
  );
  expect(screen.getByLabelText("笔记正文")).toHaveValue("另一篇笔记");
});
it("retains a failed draft and keeps a navigation guard closed until it saves", async () => {
  let guard!: () => Promise<boolean>;
  const register = (next: typeof guard) => {
      guard = next;
      return () => {};
    },
    save = vi
      .fn()
      .mockRejectedValueOnce(new Error("连接暂不可用。"))
      .mockImplementation(async (n) => ({ ...n, revision: "r2" }));
  render(
    <NoteEditorWorkspace
      document={note}
      onSave={save}
      registerNavigationGuard={register}
      autosaveDelay={0}
    />,
  );
  fireEvent.change(screen.getByLabelText("笔记正文"), {
    target: { value: "保留这段内容" },
  });
  let canLeave = true;
  await act(async () => {
    canLeave = await guard();
  });
  expect(canLeave).toBe(false);
  expect(screen.getByLabelText("笔记正文")).toHaveValue("保留这段内容");
  await act(async () => {
    canLeave = await guard();
  });
  expect(canLeave).toBe(true);
});
it("requires an explicit choice when a remote revision meets a dirty local draft", async () => {
  const save = vi
      .fn()
      .mockImplementation(async (n) => ({ ...n, revision: "r3" })),
    view = render(
      <NoteEditorWorkspace document={note} onSave={save} autosaveDelay={0} />,
    );
  fireEvent.change(screen.getByLabelText("笔记正文"), {
    target: { value: "本地修改" },
  });
  view.rerender(
    <NoteEditorWorkspace
      document={{ ...note, markdown: "远程修改", revision: "r2" }}
      onSave={save}
      autosaveDelay={0}
    />,
  );
  expect(screen.getByLabelText("笔记正文")).toHaveValue("本地修改");
  expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "继续编辑当前内容" }));
  fireEvent.click(screen.getByRole("button", { name: "保存" }));
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ markdown: "本地修改", revision: "r2" }),
      expect.any(AbortSignal),
    ),
  );
});
it("moves a canvas into full screen and back with the same live view", () => {
  function Sample() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setOpen(!open)}>
          全屏切换
        </button>
        <CanvasFullscreenPortal open={open} onExit={() => setOpen(false)}>
          <input aria-label="画布参数" defaultValue="原值" />
        </CanvasFullscreenPortal>
      </>
    );
  }
  render(<Sample />);
  const input = screen.getByLabelText("画布参数");
  fireEvent.change(input, { target: { value: "调整后" } });
  fireEvent.click(screen.getByRole("button", { name: "全屏切换" }));
  expect(screen.getByRole("dialog")).toContainElement(input);
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.getByLabelText("画布参数")).toBe(input);
  expect(input).toHaveValue("调整后");
});
it("stages a revised plot before applying it to the host", async () => {
  const change = vi.fn(),
    revise = vi
      .fn()
      .mockResolvedValue({
        kind: "plot",
        title: "新的振幅",
        fn: "2*sin(x)",
        attrs: {},
      });
  render(
    <CanvasWorkspace
      value={{ kind: "plot", fn: "sin(x)", attrs: {} }}
      onChange={change}
      onRevise={revise}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "修改画布" }));
  fireEvent.change(screen.getByLabelText("希望如何调整画布"), {
    target: { value: "把振幅加倍" },
  });
  fireEvent.click(screen.getByRole("button", { name: "生成修改" }));
  await screen.findByRole("button", { name: "采用此版本" });
  expect(change).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "采用此版本" }));
  expect(change).toHaveBeenCalledWith(
    expect.objectContaining({ fn: "2*sin(x)" }),
  );
});
it("jumps from lecture text to its media time and cites the complete utterance", () => {
  const cite = vi.fn();
  const view = render(
    <LectureWorkspace
      title="课堂"
      media={{ kind: "audio", src: "/audio.wav" }}
      transcript={[
        {
          text: "检查例题。",
          start: 12,
          end: 20,
          words: [
            { text: "检查", start: 12, end: 14 },
            { text: "例题。", start: 14, end: 20 },
          ],
        },
      ]}
      notes=""
      onNotesChange={() => {}}
      onCite={cite}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "例题。" }));
  expect(view.container.querySelector("audio")!.currentTime).toBe(14);
  fireEvent.click(screen.getByRole("button", { name: "引用" }));
  expect(cite).toHaveBeenCalledWith({
    title: "课堂",
    time: 12,
    text: "检查例题。",
  });
});
it("keeps a parent anchored surface open while choosing in a nested menu", async () => {
  function Sample() {
    const anchor = useRef<HTMLButtonElement>(null),
      [open, setOpen] = useState(false),
      [value, setValue] = useState("a");
    return (
      <>
        <button ref={anchor} type="button" onClick={() => setOpen(true)}>
          打开面板
        </button>
        <AnchoredPanel
          anchor={anchor}
          label="面板"
          open={open}
          onClose={() => setOpen(false)}
        >
          <SelectField
            label="阅读偏好"
            value={value}
            onChange={setValue}
            options={[
              { value: "a", label: "清晰" },
              { value: "b", label: "舒展" },
            ]}
          />
        </AnchoredPanel>
      </>
    );
  }
  render(<Sample />);
  fireEvent.click(screen.getByRole("button", { name: "打开面板" }));
  fireEvent.click(screen.getByRole("button", { name: "阅读偏好" }));
  fireEvent.click(screen.getByRole("option", { name: "舒展" }));
  expect(screen.getByRole("dialog", { name: "面板" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "阅读偏好" })).toHaveTextContent(
    "舒展",
  );
});
it("updates default model references when a custom model is renamed", async () => {
  const save = vi.fn(),
    value: AISettings = {
      groups: [
        {
          id: "group",
          name: "学习",
          baseUrl: "https://example.com",
          apiKey: "",
          models: [{ ...createEditableAIModel(), id: "old", label: "模型" }],
        },
      ],
      defaultModel: "group:old",
      excerptModel: "group:old",
      selectionModel: "",
      imageTextModel: "",
      fallbackModel: "",
      defaultThinking: false,
      defaultSearch: false,
      thinkingEffort: "medium",
      globalContext: "",
      disabledTools: [],
      imageEnabled: false,
    };
  render(<AISettingsWorkspace value={value} onSave={save} />);
  fireEvent.click(screen.getByRole("button", { name: /模型 文本模型/ }));
  fireEvent.change(screen.getByLabelText("模型名称"), {
    target: { value: "new" },
  });
  fireEvent.click(screen.getByRole("button", { name: "保存更改" }));
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultModel: "group:new",
        excerptModel: "group:new",
      }),
    ),
  );
});

it("allows a numeric field to retain the decimal point while entering a fractional price", () => {
  function Sample() {
    const [price, setPrice] = useState(1);
    return (
      <WorkspaceField
        label="价格"
        value={price}
        numeric
        onChange={(text) => setPrice(Number(text))}
      />
    );
  }
  render(<Sample />);
  const input = screen.getByLabelText("价格");
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "1." } });
  expect(input).toHaveValue("1.");
  fireEvent.change(input, { target: { value: "1.25" } });
  fireEvent.blur(input);
  expect(input).toHaveValue("1.25");
});
it("filters notebook releases and opens the complete publishing workflow", () => {
  render(
    <NotebookManagerWorkspace
      notebooks={[
        {
          id: "one",
          title: "线性代数",
          sourcePrefix: "课程",
          syncMode: "review",
          currentRelease: "r1",
        },
        {
          id: "two",
          title: "概率论",
          sourcePrefix: "课程",
          syncMode: "auto",
          currentRelease: "r1",
        },
      ]}
      drafts={[
        {
          id: "draft",
          notebookId: "one",
          title: "新章节",
          sections: 1,
          resources: 0,
          structureChanged: false,
          items: [
            {
              id: "note",
              title: "向量",
              kind: "note",
              content: "理解向量空间。",
            },
          ],
        },
      ]}
      onPrepare={async () => {
        throw Error();
      }}
      onPublish={() => {}}
    />,
  );
  fireEvent.click(screen.getByRole("tab", { name: "有待发布内容" }));
  expect(screen.queryByRole("button", { name: /概率论/ })).toBeNull();
  fireEvent.click(
    screen.getByRole("button", { name: /线性代数 有内容等待发布/ }),
  );
  expect(
    screen.getByRole("heading", { name: "待发布内容" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /新章节/ })).toBeInTheDocument();
});
it("keeps the course editor open when saving before a tab change fails", async () => {
  const save = vi.fn().mockRejectedValue(new Error("连接暂不可用。"));
  render(
    <CourseContentWorkspace
      document={note}
      onSave={save}
      autosaveDelay={0}
      examples={[{ id: "example", title: "例题", markdown: "示例正文。" }]}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "编辑笔记" }));
  await screen.findByLabelText("笔记正文");
  fireEvent.change(screen.getByLabelText("笔记正文"), {
    target: { value: "当前草稿" },
  });
  fireEvent.click(screen.getByRole("tab", { name: "例题 1" }));
  await screen.findAllByRole("alert");
  expect(screen.getByLabelText("笔记正文")).toHaveValue("当前草稿");
  expect(screen.getByRole("tab", { name: "正文" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
