import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

const HASHTAG_RE = /#[\p{L}\p{N}_][\p{L}\p{N}_-]{0,48}/gu;

export const HashtagHighlight = Extension.create({
  name: "hashtagHighlight",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("hashtagHighlight"),
        props: {
          decorations(state) {
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            doc.descendants((node, pos) => {
              if (!node.isText || !node.text) return;
              // 光标所在文本不装饰，避免输入时闪烁打断
              const cursorInside =
                selection.empty &&
                selection.from >= pos &&
                selection.from <= pos + node.nodeSize;
              if (cursorInside) return;
              const text = node.text;
              HASHTAG_RE.lastIndex = 0;
              let match: RegExpExecArray | null;
              while ((match = HASHTAG_RE.exec(text)) !== null) {
                const start = pos + match.index;
                const end = start + match[0].length;
                decorations.push(
                  Decoration.inline(start, end, { class: "note-inline-tag" }),
                );
              }
            });
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
