import type { Root, Element, Text, RootContent } from "hast";

/** HTML tables preserve merged cells; their text needs math recognition after HTML parsing. */
export default function rehypeTableMath() {
  return (tree: Root) => {
    function walk(parent: Root | Element, insideCell = false) {
      if (parent.type === "element" && ["code", "pre", "script", "style", "math"].includes(parent.tagName)) return;
      const cell = insideCell || (parent.type === "element" && ["td", "th"].includes(parent.tagName));
      for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];
        if (node.type === "element") { walk(node, cell); continue; }
        if (!cell || node.type !== "text" || !node.value.includes("$")) continue;
        const parts: RootContent[] = [];
        const expression = /(?<!\\)\$(?!\$)([^$\n]+?)(?<!\\)\$(?!\$)/g;
        let previous = 0, match: RegExpExecArray | null;
        while ((match = expression.exec(node.value))) {
          if (match.index > previous) parts.push({ type: "text", value: node.value.slice(previous, match.index) } as Text);
          parts.push({ type: "element", tagName: "span", properties: { className: ["math-inline", "language-math"] }, children: [{ type: "text", value: match[1] }] });
          previous = match.index + match[0].length;
        }
        if (!parts.length) continue;
        if (previous < node.value.length) parts.push({ type: "text", value: node.value.slice(previous) });
        parent.children.splice(i, 1, ...parts as Element["children"]);
        i += parts.length - 1;
      }
    }
    walk(tree);
  };
}
