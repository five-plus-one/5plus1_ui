import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import {
  Button,
  FileTree,
  CollaborativeEditor,
  Y,
  CommandMenu,
  ResourcePreview,
} from "../src/lib";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
it("keeps ordinary actions from submitting a surrounding form", () => {
  let submit = vi.fn((e) => e.preventDefault());
  render(
    <form onSubmit={submit}>
      <Button>保存草稿</Button>
      <Button type="submit">提交</Button>
    </form>,
  );
  fireEvent.click(screen.getByText("保存草稿"));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("提交"));
  expect(submit).toHaveBeenCalledTimes(1);
});
it("supports expanding a folder and selecting a file entirely by keyboard", async () => {
  let select = vi.fn();
  render(
    <FileTree
      items={[
        {
          id: "course",
          name: "课程",
          kind: "folder",
          children: [{ id: "note", name: "学习笔记", kind: "file" }],
        },
      ]}
      onSelect={select}
    />,
  );
  let folder = screen.getByRole("treeitem", { name: "课程" });
  folder.focus();
  fireEvent.keyDown(folder, { key: "ArrowRight" });
  expect(folder).toHaveAttribute("aria-expanded", "true");
  fireEvent.keyDown(folder, { key: "ArrowRight" });
  await waitFor(() =>
    expect(screen.getByRole("treeitem", { name: "学习笔记" })).toHaveFocus(),
  );
  fireEvent.keyDown(document.activeElement!, { key: "Enter" });
  expect(select).toHaveBeenCalledWith(expect.objectContaining({ id: "note" }));
  fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" });
  await waitFor(() => expect(folder).toHaveFocus());
});
it("keeps file menus independent from file selection", () => {
  let select = vi.fn(),
    rename = vi.fn();
  render(
    <FileTree
      items={[{ id: "note", name: "笔记", kind: "file" }]}
      onSelect={select}
      onRename={rename}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "操作" }));
  fireEvent.click(screen.getByText("重命名"));
  expect(rename).toHaveBeenCalledTimes(1);
  expect(select).not.toHaveBeenCalled();
});
it("shares edits between editor instances using the same CRDT document", async () => {
  let document = new Y.Doc();
  let editors: import("@tiptap/core").Editor[] = [];
  let ready = (editor: import("@tiptap/core").Editor) => editors.push(editor);
  let view = render(
    <>
      <CollaborativeEditor
        document={document}
        onReady={ready}
        user={{ id: "a", name: "甲", color: "#356348" }}
      />
      <CollaborativeEditor
        document={document}
        onReady={ready}
        user={{ id: "b", name: "乙", color: "#a64d18" }}
      />
    </>,
  );
  await waitFor(() => expect(editors).toHaveLength(2));
  act(() => {
    editors[0].commands.setContent("<p>Shared design</p>");
  });
  await waitFor(() =>
    expect(
      view.container.querySelectorAll("[contenteditable=true]")[1],
    ).toHaveTextContent("Shared design"),
  );
  view.unmount();
  document.destroy();
});
it("renders text files as text rather than interpreting markup", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response("<script>alert(1)</script>")),
  );
  let view = render(
    <ResourcePreview
      resource={{
        name: "readme.txt",
        url: "/readme.txt",
        mediaType: "text/plain",
      }}
    />,
  );
  await screen.findByText("<script>alert(1)</script>");
  expect(view.container.querySelector("script")).toBeNull();
});

