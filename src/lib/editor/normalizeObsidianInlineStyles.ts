/**
 * Obsidian 内联样式归一：
 *   ==text==                          → <mark>text</mark>
 *   <font color="X">t</font>          → <span style="color:X">t</span>
 *   <span style="background:X">t</span> → <mark data-color="X">t</mark>
 *
 * 在 normalizeObsidianCallouts / normalizeDirectiveLabels 之前调用。
 * 跳过代码围栏。
 */

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function normalizeObsidianInlineStyles(src: string): string {
  if (!src) return src;
  if (!/(==[^=\n]+==)|<font\s|<span\s[^>]*background/i.test(src)) return src;

  const lines = src.split("\n");
  const out: string[] = [];
  let inFence = false;
  let fenceChar = "";

  for (const line of lines) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      const ch = fence[1][0];
      if (!inFence) {
        inFence = true;
        fenceChar = ch;
      } else if (ch === fenceChar) {
        inFence = false;
        fenceChar = "";
      }
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }

    let next = line;
    // ==highlight==（避免跨行、避免 = 单独出现）
    next = next.replace(/==([^\n=]+)==/g, "<mark>$1</mark>");
    // <font color="X">text</font>
    next = next.replace(
      /<font\s+color=["']([^"']+)["']\s*>([\s\S]*?)<\/font>/gi,
      (_m, color: string, body: string) => `<span style="color:${color}">${body}</span>`,
    );
    // <span style="background:COLOR">text</span> 或 background-color
    next = next.replace(
      /<span\s+[^>]*style=["'][^"']*background(?:-color)?:\s*([^;"']+)["'][^>]*>([\s\S]*?)<\/span>/gi,
      (_m, color: string, body: string) => `<mark data-color="${color.trim()}">${body}</mark>`,
    );
    out.push(next);
  }
  return out.join("\n");
}

export default normalizeObsidianInlineStyles;
