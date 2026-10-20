/**
 * 编辑态 lowlight 实例（共享）。
 * schema 与测试都从这里取，避免多处 createLowlight。
 */
import { common, createLowlight } from "lowlight";

/** highlight.js 常用语言：js / ts / py / bash / json / html(xml) / css / md / xml / yaml / cpp / java 等。 */
export const noteLowlight = createLowlight(common);
