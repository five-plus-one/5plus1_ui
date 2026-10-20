/**
 * 文本级归一：把 Obsidian callout 语法改写为本项目 `:::callout{...}` 指令。
 *
 *   > [!warning] 标题
 *   > 正文
 * →
 *   :::callout{kind=pitfall label="标题"}
 *   正文
 *   :::
 *
 * 规则：
 *   - 仅处理 blockquote 首行 `> [!type]` / `> [!type]-`（默认收起）/ `> [!type]+`（展开）
 *   - quote/cite 不转（保持普通引用）
 *   - 未知类型回退为 note
 *   - 代码围栏内一律跳过
 *   - 普通 `> 引用` 绝不转换
 *
 * 在 normalizeDirectiveLabels 之前调用（指令归一再处理 label 引号定界），
 * 同时挂在编辑器 markdownToDocument 入口。
 */
import { isSkippedObsidianCallout, resolveObsidianCallout } from "./calloutTypes";

// `> [!type]` / `> [!type]-` / `> [!type]+`，可选缩进，title 可为空
const CALLOUT_OPEN = /^(\s*)>\s*\[!([A-Za-z]+)\]([+-])?\s*(.*)$/;
// 后续 blockquote 行（含空引用行 `>`）
const QUOTE_CONT = /^(\s*)>( ?)(.*)$/;

function escapeLabel(value: string): string {
  // label 值用 ASCII 双引号定界；内部直引号转成弯引号，避免破坏定界
  let doubleOpen = true;
  let singleOpen = true;
  return value.replace(/["']/g, char => {
    if (char === '"') {
      const next = doubleOpen ? "“" : "”";
      doubleOpen = !doubleOpen;
      return next;
    }
    const next = singleOpen ? "‘" : "’";
    singleOpen = !singleOpen;
    return next;
  });
}

export function normalizeObsidianCallouts(src: string): string {
  if (!src || src.indexOf("[!") === -1) return src;

  const lines = src.split("\n");
  const out: string[] = [];
  let inFence = false;
  let fenceChar = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 跟踪围栏代码块状态，块内不做任何替换
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
      i++;
      continue;
    }
    if (inFence) {
      out.push(line);
      i++;
      continue;
    }

    const open = line.match(CALLOUT_OPEN);
    if (!open) {
      out.push(line);
      i++;
      continue;
    }

    const [, indent, rawType, collapseFlag, rawTitle] = open;
    if (isSkippedObsidianCallout(rawType)) {
      // quote/cite：保持普通引用
      out.push(line);
      i++;
      continue;
    }

    const kind = resolveObsidianCallout(rawType);
    const title = rawTitle.trim();
    const attrs = [`kind=${kind}`];
    if (title) attrs.push(`label="${escapeLabel(title)}"`);
    if (collapseFlag === "-") attrs.push("collapsed=true");

    out.push(`${indent}:::callout{${attrs.join(" ")}}`);

    // 消费后续连续 blockquote 行作为 callout 正文
    i++;
    while (i < lines.length) {
      const body = lines[i];
      // 非引用行结束 callout
      if (!/^\s*>/.test(body)) break;
      // 围栏在引用内出现时也停止，避免吞掉后续结构（罕见，保守处理）
      const innerFence = body.match(/^\s*>\s*(`{3,}|~{3,})/);
      if (innerFence) break;
      const cont = body.match(QUOTE_CONT);
      if (cont) {
        // 保留 `>` 后的内容（去掉可选的一个空格）
        out.push(cont[3]);
      } else {
        out.push(body.replace(/^\s*>\s?/, ""));
      }
      i++;
    }

    out.push(`${indent}:::`);
  }

  return out.join("\n");
}

export default normalizeObsidianCallouts;
