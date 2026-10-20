import { useRef, useState, type ReactNode } from "react";
import type { Editor } from "@tiptap/core";
import { ContextMenu, type ContextMenuItem } from "../ContextMenu";
import { moveEditorBlock, deleteEditorBlock } from "./blockOperations";
/** Uses the editor selection rather than the menu's DOM focus for editing actions. */
export function EditorContextMenu({
  editor,
  children,
}: {
  editor: Editor | null;
  children: ReactNode;
}) {
  const [message, setMessage] = useState("");
  const link = useRef("");
  const clipboard = async (kind: "copy" | "cut" | "paste") => {
    if (!editor) return;
    const { from, to } = editor.state.selection,
      doc = editor.state.doc;
    try {
      if (kind === "paste") {
        const text = await navigator.clipboard.readText();
        if (!text) return;
        if (!editor.isDestroyed && editor.state.doc === doc)
          editor
            .chain()
            .focus()
            .insertContentAt({ from, to }, { type: "text", text })
            .run();
      } else {
        await navigator.clipboard.writeText(doc.textBetween(from, to, "\n"));
        if (kind === "cut" && !editor.isDestroyed && editor.state.doc === doc)
          editor.chain().focus().deleteRange({ from, to }).run();
      }
      setMessage(
        kind === "paste" ? "已粘贴" : kind === "cut" ? "已剪切" : "已复制",
      );
    } catch {
      setMessage("暂时无法访问剪贴板，请使用键盘快捷键。");
    }
  };
  const items = (): ContextMenuItem[] => {
    if (!editor) return [];
    const readonly = !editor.isEditable,
      empty = editor.state.selection.empty;
    return [
      {
        id: "cut",
        label: "剪切",
        shortcut: "Ctrl+X",
        disabled: readonly || empty || !navigator.clipboard?.writeText,
        onSelect: () => void clipboard("cut"),
      },
      {
        id: "copy",
        label: "复制",
        shortcut: "Ctrl+C",
        disabled: empty || !navigator.clipboard?.writeText,
        onSelect: () => void clipboard("copy"),
      },
      {
        id: "paste",
        label: "粘贴为纯文本",
        shortcut: "Ctrl+Shift+V",
        disabled: readonly || !navigator.clipboard?.readText,
        onSelect: () => void clipboard("paste"),
      },
      {
        id: "all",
        label: "全选",
        shortcut: "Ctrl+A",
        onSelect: () => editor.chain().focus().selectAll().run(),
      },
      ...(link.current
        ? [
            {
              id: "copy-link",
              label: "复制链接地址",
              disabled: !navigator.clipboard?.writeText,
              onSelect: () => {
                void navigator.clipboard.writeText(link.current).then(
                  () => setMessage("链接已复制"),
                  () => setMessage("请使用键盘快捷键复制链接。"),
                );
              },
            },
            {
              id: "unlink",
              label: "取消链接",
              disabled: readonly,
              onSelect: () =>
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run(),
            },
          ]
        : []),
      {
        id: "format",
        label: "文字格式",
        separator: true,
        disabled: readonly,
        children: [
          {
            id: "bold",
            label: "粗体",
            checked: editor.isActive("bold"),
            onSelect: () => editor.chain().focus().toggleBold().run(),
          },
          {
            id: "italic",
            label: "斜体",
            checked: editor.isActive("italic"),
            onSelect: () => editor.chain().focus().toggleItalic().run(),
          },
          {
            id: "clear",
            label: "清除格式",
            onSelect: () => editor.chain().focus().unsetAllMarks().run(),
          },
        ],
      },
      {
        id: "block",
        label: "段落操作",
        disabled: readonly,
        children: [
          {
            id: "move-up",
            label: "向上移动",
            disabled: editor.state.selection.$from.index(0) === 0,
            onSelect: () => moveEditorBlock(editor, "up"),
          },
          {
            id: "move-down",
            label: "向下移动",
            disabled:
              editor.state.selection.$from.index(0) >=
              editor.state.doc.childCount - 1,
            onSelect: () => moveEditorBlock(editor, "down"),
          },
          {
            id: "delete-block",
            label: "删除这一块",
            danger: true,
            onSelect: () => deleteEditorBlock(editor),
          },
        ],
      },
      ...(editor.isActive("table")
        ? [
            {
              id: "table",
              label: "表格操作",
              disabled: readonly,
              children: [
                {
                  id: "row-before",
                  label: "向上插入行",
                  onSelect: () => editor.chain().focus().addRowBefore().run(),
                },
                {
                  id: "row-after",
                  label: "向下插入行",
                  onSelect: () => editor.chain().focus().addRowAfter().run(),
                },
                {
                  id: "column-before",
                  label: "向左插入列",
                  onSelect: () =>
                    editor.chain().focus().addColumnBefore().run(),
                },
                {
                  id: "column-after",
                  label: "向右插入列",
                  onSelect: () => editor.chain().focus().addColumnAfter().run(),
                },
                {
                  id: "merge",
                  label: "合并单元格",
                  disabled: !editor.can().mergeCells(),
                  onSelect: () => editor.chain().focus().mergeCells().run(),
                },
                {
                  id: "split",
                  label: "拆分单元格",
                  disabled: !editor.can().splitCell(),
                  onSelect: () => editor.chain().focus().splitCell().run(),
                },
                {
                  id: "delete-row",
                  label: "删除当前行",
                  danger: true,
                  separator: true,
                  onSelect: () => editor.chain().focus().deleteRow().run(),
                },
                {
                  id: "delete-column",
                  label: "删除当前列",
                  danger: true,
                  onSelect: () => editor.chain().focus().deleteColumn().run(),
                },
                {
                  id: "delete-table",
                  label: "删除表格",
                  danger: true,
                  onSelect: () => editor.chain().focus().deleteTable().run(),
                },
              ],
            },
          ]
        : []),
      {
        id: "undo",
        label: "撤销",
        separator: true,
        shortcut: "Ctrl+Z",
        disabled: readonly || !editor.can().undo(),
        onSelect: () => editor.chain().focus().undo().run(),
      },
      {
        id: "redo",
        label: "重做",
        shortcut: "Ctrl+Shift+Z",
        disabled: readonly || !editor.can().redo(),
        onSelect: () => editor.chain().focus().redo().run(),
      },
    ];
  };
  return (
    <ContextMenu
      label="笔记快捷操作"
      tabIndex={-1}
      disabled={!editor}
      items={items}
      onOpen={(event) => {
        if (!editor) return false;
        const target = event.target as Element;
        if (target.closest("input,textarea,math-field,button")) return false;
        link.current = target.closest("a")?.getAttribute("href") || "";
        if ("clientX" in event) {
          const pos = editor.view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (
            pos &&
            (editor.state.selection.empty ||
              pos.pos < editor.state.selection.from ||
              pos.pos > editor.state.selection.to)
          )
            editor.commands.setTextSelection(pos.pos);
        }
        setMessage("");
      }}
    >
      {children}
      {message && (
        <span className="fp-visually-hidden" role="status">
          {message}
        </span>
      )}
    </ContextMenu>
  );
}
