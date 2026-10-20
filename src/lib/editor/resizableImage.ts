
import Image from "@tiptap/extension-image";

export const ResizableImage = Image.extend<{ resolveUrl: (url: string) => string } & import("@tiptap/extension-image").ImageOptions>({
  addOptions() { return { ...this.parent?.(), resolveUrl: (url: string) => url } as import("@tiptap/extension-image").ImageOptions & { resolveUrl: (url: string) => string }; },
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute("data-width") || element.style.width || null,
        renderHTML: attributes => attributes.width ? { "data-width": attributes.width, style: `width:${attributes.width};max-width:100%` } : {},
      },
    };
  },
  addNodeView() {
    return ({ node: initialNode, getPos, editor }) => {
      let node = initialNode;
      const wrapper = document.createElement("span");
      wrapper.className = "visual-image-node";
      wrapper.contentEditable = "false";
      wrapper.dataset.noteObject = "image";
      const image = document.createElement("img");
      const caption = document.createElement("input");
      caption.type = "text"; caption.className = "visual-image-caption";
      caption.setAttribute("aria-label", "图片名称"); caption.placeholder = "添加图片名称";
      caption.addEventListener("keydown", event => { event.stopPropagation(); if (event.key === "Enter" && !event.isComposing) { event.preventDefault(); caption.blur(); } });
      caption.addEventListener("blur", () => { const pos = getPos(); if (typeof pos === "number" && caption.value !== String(node.attrs.title || node.attrs.alt || "")) editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, alt: caption.value, title: caption.value })); });
      const handle = document.createElement("button");
      handle.type = "button";
      handle.className = "visual-image-resize";
      handle.setAttribute("aria-label", "调整图片大小");
      const apply = () => {
        image.src = this.options.resolveUrl(String(node.attrs.src || ""));
        image.alt = String(node.attrs.alt || "");
        image.title = String(node.attrs.title || "");
        if (document.activeElement !== caption) caption.value = String(node.attrs.title || node.attrs.alt || "");
        image.style.width = node.attrs.width ? String(node.attrs.width) : "";
      };
      handle.addEventListener("pointerdown", event => {
        event.preventDefault();
        event.stopPropagation();
        const startX = event.clientX;
        const startWidth = image.getBoundingClientRect().width;
        handle.setPointerCapture(event.pointerId);
        const move = (moveEvent: PointerEvent) => {
          const max = Math.max(180, wrapper.parentElement?.clientWidth || 900);
          image.style.width = `${Math.round(Math.min(max, Math.max(120, startWidth + moveEvent.clientX - startX)))}px`;
        };
        const finish = (upEvent: PointerEvent) => {
          handle.releasePointerCapture(upEvent.pointerId);
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", finish);
          const pos = getPos();
          if (typeof pos === "number") editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, width: image.style.width }));
        };
        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", finish);
      });
      wrapper.append(image, handle, caption);
      apply();
      return {
        dom: wrapper,
        stopEvent(event) { return event.target === caption; },
        update(nextNode) {
          if (nextNode.type !== node.type) return false;
          node = nextNode;
          apply();
          return true;
        },
        selectNode() { wrapper.classList.add("is-selected"); },
        deselectNode() { wrapper.classList.remove("is-selected"); },
      };
    };
  },
});
