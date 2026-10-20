import type { NodeViewRendererProps } from "@tiptap/core";
import { BlockMath, InlineMath } from "@tiptap/extension-mathematics";
import katex from "katex";
import { mathMacros } from "./mathRendering";
import { NodeSelection } from "@tiptap/pm/state";

export type MathNodeHost = HTMLElement & { mathPosition: () => number | undefined };

type MathClick = (latex: string, position: number) => void;

const pending = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;

function visibilityObserver() {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const render = pending.get(entry.target);
        if (!render) continue;
        pending.delete(entry.target);
        observer?.unobserve(entry.target);
        render();
      }
    }, { rootMargin: "600px 0px" });
  }
  return observer;
}

function createLazyMathNodeView(
  { node: initialNode, getPos, editor }: NodeViewRendererProps,
  displayMode: boolean,
  onClick?: MathClick,
) {
  let node = initialNode;
  let rendered = false;
  let stopped = false;
  const host = document.createElement(displayMode ? "div" : "span") as MathNodeHost;
  host.mathPosition = () => stopped ? undefined : getPos();
  const content = document.createElement(displayMode ? "div" : "span");
  host.className = "tiptap-mathematics-render is-deferred";
  host.dataset.type = displayMode ? "block-math" : "inline-math";
  host.contentEditable = "false";
  host.draggable = false;
  content.className = "math-node-content";
  host.append(content);
  const slot = document.createElement(displayMode ? "div" : "span");
  slot.className = "math-node-editor-slot";
  host.append(slot);
  // Embedded input owns pointer selection; block movement uses the external grip.
  const preventDrag = (event: DragEvent) => { event.preventDefault(); event.stopPropagation(); };
  host.addEventListener("dragstart", preventDrag);
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "math-node-edit";
  editButton.textContent = "编辑公式";
  editButton.setAttribute("aria-label", "编辑公式");
  if (onClick) host.append(editButton);

  const showPlaceholder = () => {
    const latex = String(node.attrs.latex || "");
    host.dataset.latex = latex;
    host.setAttribute("aria-label", `公式：${latex}`);
    content.textContent = latex;
  };
  const render = () => {
    if (stopped) return;
    const latex = String(node.attrs.latex || "");
    try {
      katex.render(latex || "\\;", content, { throwOnError: false, displayMode, macros: mathMacros });
      host.classList.remove(displayMode ? "block-math-error" : "inline-math-error");
    } catch {
      content.textContent = latex;
      host.classList.add(displayMode ? "block-math-error" : "inline-math-error");
    }
    if (!latex) content.textContent = "点击输入公式";
    host.classList.toggle("is-empty-math", !latex);
    host.classList.remove("is-deferred");
    rendered = true;
  };
  const watch = () => {
    const viewport = visibilityObserver();
    if (!viewport) {
      render();
      return;
    }
    pending.set(host, render);
    viewport.observe(host);
  };
  const unwatch = () => {
    pending.delete(host);
    observer?.unobserve(host);
  };
  const open = (event: Event) => {
    if (slot.contains(event.target as globalThis.Node) || !editor.isEditable) return;
    event.preventDefault();
    event.stopPropagation();
    const position = getPos();
    if (typeof position === "number") onClick?.(String(node.attrs.latex || ""), position);
  };
  const click = (event: Event) => {
    if (slot.contains(event.target as globalThis.Node)) return;
    event.preventDefault();
    event.stopPropagation();
    const position = getPos();
    if (typeof position === "number" && editor.isEditable) {
      editor.commands.setNodeSelection(position);
      onClick?.(String(node.attrs.latex || ""), position);
    }
  };
  editButton.addEventListener("click", open);
  host.addEventListener("dblclick", open);

  showPlaceholder();
  watch();
  if (onClick) host.addEventListener("click", click);


  return {
    dom: host,
    selectNode() { host.classList.add("ProseMirror-selectednode"); host.draggable = false; },
    deselectNode() { host.classList.remove("ProseMirror-selectednode"); host.draggable = false; },
    stopEvent: (event: Event) => slot.contains(event.target as globalThis.Node) || editButton.contains(event.target as globalThis.Node),
    ignoreMutation: () => true,
    update(nextNode: typeof initialNode) {
      if (nextNode.type !== node.type) return false;
      node = nextNode;
      host.dataset.latex = String(node.attrs.latex || "");
      host.setAttribute("aria-label", `公式：${node.attrs.latex || ""}`);
      if (rendered) render();
      else showPlaceholder();
      return true;
    },
    destroy() {
      stopped = true;
      host.removeEventListener("dragstart", preventDrag);
      unwatch();
      host.removeEventListener("click", click);
      host.removeEventListener("dblclick", open);
      editButton.removeEventListener("click", open);
    },
  };
}

export function createLazyMathExtensions(callbacks: {
  onInlineClick?: MathClick;
  onBlockClick?: MathClick;
}) {
  const shortcuts = (editor: NodeViewRendererProps["editor"], name: string, callback?: MathClick) => ({
    Enter: () => {
      const selection = editor.state.selection;
      if (!(selection instanceof NodeSelection) || selection.node.type.name !== name || !callback) return false;
      callback(String(selection.node.attrs.latex || ""), selection.from);
      return true;
    },
  });
  const LazyInlineMath = InlineMath.extend({
    addKeyboardShortcuts() { return shortcuts(this.editor, "inlineMath", callbacks.onInlineClick); },
    addNodeView() {
      return props => createLazyMathNodeView(props, false, callbacks.onInlineClick);
    },
  });
  const LazyBlockMath = BlockMath.extend({
    addKeyboardShortcuts() { return shortcuts(this.editor, "blockMath", callbacks.onBlockClick); },
    addNodeView() {
      return props => createLazyMathNodeView(props, true, callbacks.onBlockClick);
    },
  });
  return [LazyBlockMath, LazyInlineMath];
}
