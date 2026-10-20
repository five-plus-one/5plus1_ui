import type { Editor } from "@tiptap/core";
import { Selection } from "@tiptap/pm/state";
/** Move a whole top-level block while retaining its node attributes and descendants. */
export function moveEditorBlock(editor: Editor, direction: "up" | "down") {
  if (!editor.isEditable || editor.isDestroyed) return false;
  const { state } = editor,
    depth = state.selection.$from.depth;
  if (!depth) return false;
  const index = state.selection.$from.index(0),
    positions: number[] = [];
  state.doc.forEach((_node, offset) => positions.push(offset));
  const nextIndex = index + (direction === "up" ? -1 : 1);
  if (nextIndex < 0 || nextIndex >= state.doc.childCount) return false;
  const node = state.doc.child(index),
    pos = positions[index],
    other = state.doc.child(nextIndex);
  const destination =
    direction === "up"
      ? positions[nextIndex]
      : positions[nextIndex] + other.nodeSize - node.nodeSize;
  return editor.commands.command(({ tr }) => {
    tr.delete(pos, pos + node.nodeSize);
    tr.insert(destination, node);
    tr.setSelection(
      Selection.near(
        tr.doc.resolve(Math.min(tr.doc.content.size, destination + 1)),
      ),
    );
    return true;
  });
}
export function deleteEditorBlock(editor: Editor) {
  if (!editor.isEditable || !editor.state.selection.$from.depth) return false;
  const index = editor.state.selection.$from.index(0);
  let position = 0;
  for (let i = 0; i < index; i++)
    position += editor.state.doc.child(i).nodeSize;
  return editor.commands.deleteRange({
    from: position,
    to: position + editor.state.doc.child(index).nodeSize,
  });
}
