import { Extension } from "@tiptap/core";
import { Plugin, NodeSelection } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
/** Native ProseMirror drag handling serializes the selected block, retaining rich node attributes. */
export const BlockDragHandles = Extension.create({
  name: "blockDragHandles",
  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        props: {
          decorations(state) {
            if (!editor.isEditable) return DecorationSet.empty;
            const decorations: Decoration[] = [];
            state.doc.forEach((node, pos) => {
              if (!NodeSelection.isSelectable(node)) return;
              decorations.push(
                Decoration.widget(
                  pos,
                  (view, getPos) => {
                    const host = document.createElement("span");
                    host.className = "fp-block-handle";
                    host.contentEditable = "false";
                    const button = document.createElement("button");
                    button.type = "button";
                    button.draggable = true;
                    button.tabIndex = -1;
                    button.title = "拖动段落";
                    button.setAttribute("aria-label", "拖动段落");
                    button.textContent = "⠿";
                    button.addEventListener("mousedown", (event) => {
                      const position = getPos();
                      if (position === undefined || event.button !== 0) return;
                      event.stopPropagation();
                      view.dispatch(
                        view.state.tr.setSelection(
                          NodeSelection.create(view.state.doc, position),
                        ),
                      );
                      view.focus();
                    });
                    host.append(button);
                    return host;
                  },
                  { side: -1, key: `block-${pos}` },
                ),
              );
            });
            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
