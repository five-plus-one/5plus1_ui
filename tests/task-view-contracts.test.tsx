import { afterEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import {
  InvitationList,
  MarkdownContent,
  QuizWorkspace,
  RecallContent,
  RecycleBin,
  ResourceExplorer,
  ReviewDashboard,
  RecordingPlayback,
} from "../src/lib";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("locks both invitation choices during a response and permits retry after failure", async () => {
  let reject!: (reason: Error) => void;
  const respond = vi.fn(
    () =>
      new Promise<void>((_yes, no) => {
        reject = no;
      }),
  );
  render(
    <InvitationList
      items={[{ id: "a", name: "课程笔记", from: "同学", role: "一起编辑" }]}
      onRespond={respond}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "接受" }));
  expect(screen.getByRole("button", { name: "婉拒" })).toBeDisabled();
  reject(Error("暂时无法接受"));
  await screen.findByRole("alert");
  expect(screen.getByRole("button", { name: "婉拒" })).toBeEnabled();
  expect(respond).toHaveBeenCalledOnce();
});
it("requires confirmation for deleting recycled resources and retains their context on failure", async () => {
  const remove = vi.fn().mockRejectedValue(Error("暂时无法删除"));
  render(
    <RecycleBin
      items={[
        {
          id: "a",
          name: "课堂笔记",
          originalPath: "第一章",
          deletedAt: "今天",
        },
      ]}
      selectedIds={["a"]}
      onSelectionChange={() => {}}
      onRestore={() => {}}
      onDelete={remove}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "永久删除" }));
  expect(remove).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "确认", exact: true }));
  await screen.findByRole("alert");
  expect(screen.getByText("第一章")).toBeInTheDocument();
  expect(remove).toHaveBeenCalledWith(["a"]);
});
it("filters review records before beginning the selected review session", () => {
  const begin = vi.fn();
  render(
    <ReviewDashboard
      items={[
        { id: "a", title: "概念", due: "今天", status: "new" },
        { id: "b", title: "应用", due: "今天", status: "review" },
      ]}
      onReview={begin}
      onPreview={() => {}}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "复习范围" }));
  fireEvent.click(screen.getByRole("option", { name: "定期复习" }));
  fireEvent.click(screen.getByRole("button", { name: "开始复习" }));
  expect(begin).toHaveBeenCalledWith(["b"]);
});
it("confirms a quiz with unanswered questions before submitting", () => {
  const submit = vi.fn();
  render(
    <QuizWorkspace
      title="练习"
      items={[{ id: "a", label: "1", answered: false }]}
      activeId="a"
      onNavigate={() => {}}
      onSubmit={submit}
    >
      题目
    </QuizWorkspace>,
  );
  fireEvent.click(screen.getByRole("button", { name: "提交答题" }));
  expect(screen.getByText("还有 1 题未完成，仍要提交？")).toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
});
it("reveals each cloze independently while preserving its surrounding sentence", () => {
  render(
    <RecallContent>
      <p>
        保持<strong>加法</strong>与<strong>数乘</strong>。
      </p>
    </RecallContent>,
  );
  expect(screen.queryByText("加法")).toBeNull();
  fireEvent.click(screen.getAllByRole("button", { name: "点击回忆" })[0]);
  expect(screen.getByRole("button", { name: "加法" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(screen.getAllByRole("button", { name: "点击回忆" })).toHaveLength(1);
});
it("renders history locations and timeline directives with their attributes", () => {
  render(
    <MarkdownContent
      markdown={
        ':::historymap{title="事件地点" points="南京:60:60,北京:50:25"}\n:::\n\n:::timeline{period="本学期"}\n- 第一周\n- 第二周\n:::'
      }
    />,
  );
  expect(screen.getByRole("button", { name: /南京/ })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "时间轴 · 本学期" }),
  ).toBeInTheDocument();
});
it("restricts a resource selection rectangle to intersecting visible rows", () => {
  vi.stubGlobal("PointerEvent", MouseEvent);
  function Example() {
    const [ids, setIds] = useState<string[]>([]);
    return (
      <>
        <ResourceExplorer
          items={[
            { id: "a", name: "第一章", kind: "file" },
            { id: "b", name: "第二章", kind: "file" },
          ]}
          selectedIds={ids}
          onSelectionChange={setIds}
          onFolderChange={() => {}}
          onOpen={() => {}}
        />
        <output>{ids.join(",")}</output>
      </>
    );
  }
  const { container } = render(<Example />);
  const content = container.querySelector(
    ".fp-explorer-content",
  ) as HTMLElement;
  content.setPointerCapture = vi.fn();
  vi.spyOn(content, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    width: 400,
    height: 200,
  } as DOMRect);
  container
    .querySelectorAll<HTMLElement>("[data-resource-id]")
    .forEach((row, index) =>
      vi.spyOn(row, "getBoundingClientRect").mockReturnValue({
        left: 10,
        top: 10 + (row.dataset.resourceId === "a" ? 0 : 1) * 70,
        width: 200,
        height: 50,
      } as DOMRect),
    );
  fireEvent.pointerDown(content, {
    button: 0,
    clientX: 0,
    clientY: 0,
    pointerId: 1,
  });
  fireEvent.pointerMove(content, { clientX: 230, clientY: 65, pointerId: 1 });
  fireEvent.pointerUp(content, { pointerId: 1 });
  expect(screen.getByRole("status")).toHaveTextContent("a");
});
it("seeks recording keyframes without implicitly changing playback state", () => {
  const seek = vi.fn(),
    play = vi.fn();
  render(
    <RecordingPlayback
      title="回放"
      frames={[{ time: 12, label: "推导" }]}
      time={0}
      duration={30}
      playing={false}
      onTimeChange={seek}
      onPlayingChange={play}
    >
      画布
    </RecordingPlayback>,
  );
  fireEvent.click(screen.getByRole("button", { name: "推导" }));
  expect(seek).toHaveBeenCalledWith(12);
  expect(play).not.toHaveBeenCalled();
});
