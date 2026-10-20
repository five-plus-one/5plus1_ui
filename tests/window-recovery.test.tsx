import { useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContentImage, Figure, FloatingWindow, SurfaceBoundary, WindowChrome, constrainWindowGeometry } from "../src/lib";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("places close after additional actions, minimize and fullscreen and supports keyboard activation", async () => {
  const close = vi.fn();
  const { container } = render(<WindowChrome title="课程资料" actions={<button>分享</button>} onClose={close} onMinimize={() => {}} onFullscreen={() => {}}>正文</WindowChrome>);
  expect(Array.from(container.querySelectorAll("header button")).map((b) => b.getAttribute("aria-label") || b.textContent)).toEqual(["分享", "最小化窗口", "全屏", "关闭窗口"]);
  screen.getByRole("button", { name: "关闭窗口" }).focus();
  await userEvent.keyboard("{Enter}");
  expect(close).toHaveBeenCalledOnce();
});

it("allows title dragging while controls and additional actions do not initiate a drag", () => {
  vi.stubGlobal("PointerEvent", MouseEvent);
  const drag = vi.fn();
  render(<WindowChrome title="课程资料" actions={<button>分享</button>} onDragStart={drag} onClose={() => {}} onMinimize={() => {}} onFullscreen={() => {}}>正文</WindowChrome>);
  for (const button of screen.getAllByRole("button")) fireEvent.pointerDown(button, { button: 0 });
  expect(drag).not.toHaveBeenCalled();
  fireEvent.pointerDown(screen.getByText("课程资料"), { button: 0 });
  expect(drag).toHaveBeenCalledOnce();
  fireEvent.pointerDown(screen.getByText("课程资料"), { button: 2 });
  expect(drag).toHaveBeenCalledOnce();
});

it("keeps the entire window in a smaller workspace and clamps both size and position", () => {
  expect(constrainWindowGeometry({ x: 500, y: 300, width: 800, height: 600 }, { width: 280, height: 180 })).toEqual({ x: 0, y: 0, width: 280, height: 180 });
  expect(constrainWindowGeometry({ x: 900, y: 900, width: 400, height: 300 }, { width: 1024, height: 768 })).toEqual({ x: 624, y: 468, width: 400, height: 300 });
});

it("keeps keyboard window resizing within the viewport", () => {
  const change = vi.fn();
  render(<FloatingWindow title="课程" geometry={{ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }} onGeometryChange={change} onClose={() => {}}>正文</FloatingWindow>);
  fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
  expect(change.mock.calls[0][0].width).toBe(window.innerWidth);
});

it("recovers a failed image when its source changes and preserves the host error callback", () => {
  const error = vi.fn();
  const view = render(<ContentImage src="/missing.png" alt="课堂图示" onError={error} />);
  fireEvent.error(screen.getByRole("img"));
  expect(error).toHaveBeenCalledOnce();
  expect(screen.getByText("课堂图示")).toBeInTheDocument();
  view.rerender(<ContentImage src="/available.png" alt="课堂图示" />);
  expect(screen.getByRole("img")).toHaveAttribute("src", "/available.png");
});

it("retains figure caption and credit after an image failure", () => {
  render(<Figure src="/missing.png" alt="课堂图示" caption="图一" credit="课程资料" />);
  fireEvent.error(screen.getByRole("img"));
  expect(screen.getByText("课堂图示")).toBeInTheDocument();
  expect(screen.getByText("图一")).toBeInTheDocument();
  expect(screen.getByText("课程资料")).toBeInTheDocument();
});

function FallibleContent() {
  const [failed, setFailed] = useState(false);
  if (failed) throw new Error("private diagnostic");
  return <button onClick={() => setFailed(true)}>阅读正文</button>;
}
it("isolates a failed surface and remounts its content on retry", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const diagnostic = vi.fn();
  render(<><p>资料目录</p><SurfaceBoundary onError={diagnostic}><FallibleContent /></SurfaceBoundary></>);
  fireEvent.click(screen.getByRole("button", { name: "阅读正文" }));
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByText("资料目录")).toBeInTheDocument();
  expect(screen.queryByText("private diagnostic")).not.toBeInTheDocument();
  expect(diagnostic).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByRole("button", { name: "重新打开" }));
  expect(screen.getByRole("button", { name: "阅读正文" })).toBeInTheDocument();
});

it("opens the next document after a failed surface when its reset key changes", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const view = render(<SurfaceBoundary resetKey="a"><FallibleContent /></SurfaceBoundary>);
  fireEvent.click(screen.getByRole("button", { name: "阅读正文" }));
  view.rerender(<SurfaceBoundary resetKey="b"><p>另一篇笔记</p></SurfaceBoundary>);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByText("另一篇笔记")).toBeInTheDocument();
});
