import type { VirtualKeyboardLayout, VirtualKeyboardKeycap } from "mathlive";

type Key = string | Partial<VirtualKeyboardKeycap>;
const key = (latex: string, insert = latex, tooltip?: string): Key => ({ latex: `\\textstyle ${latex}`, insert, tooltip, class: "small" });
const navigation: Key[] = ["[undo]", "[redo]", "[left]", "[right]", { label: "下一格", tooltip: "移到下一个占位框", command: ["performWithFeedback", "moveToNextPlaceholder"], width: 2 }, { label: "[backspace]", width: 2 }];
const layout = (id: string, rows: Key[][]): VirtualKeyboardLayout => ({ id, label: "", displayEditToolbar: false, rows: [...rows, navigation] });

export const mathKeyboards = [
  { id: "basic", label: "常用", layout: layout("note-basic", [
    ["7", "8", "9", "+", "-", key("\\frac{a}{b}", "\\frac{#0}{#?}", "分数"), key("\\sqrt{x}", "\\sqrt{#0}", "根号"), key("x^n", "#0^{#?}", "上标")],
    ["4", "5", "6", "\\times", "\\div", "(", ")", key("x_n", "#0_{#?}", "下标")],
    ["1", "2", "3", "=", "\\ne", "<", ">", "\\pi"],
    ["0", ".", "x", "y", "\\le", "\\ge", "\\pm", "\\infty"],
  ]) },
  { id: "calculus", label: "高等数学", layout: layout("note-calculus", [
    [key("\\lim", "\\lim_{x\\to #?} #?", "极限"), key("\\frac{d}{dx}", "\\frac{d #?}{d x}", "导数"), key("\\frac{\\partial}{\\partial x}", "\\frac{\\partial #?}{\\partial x}", "偏导数"), key("\\int", "\\int #?\\,d x", "不定积分"), key("\\int_a^b", "\\int_{#?}^{#?} #?\\,d x", "定积分"), key("\\iint", "\\iint_{#?} #?\\,d x\\,d y", "二重积分"), key("\\iiint", "\\iiint_{#?} #?\\,d V", "三重积分"), key("\\oint", "\\oint_{#?} #?\\,d s", "曲线积分")],
    [key("\\sum", "\\sum_{n=#?}^{#?} #?", "求和"), key("\\prod", "\\prod_{n=#?}^{#?} #?", "连乘"), key("e^x", "e^{#?}"), key("\\ln", "\\ln\\left(#?\\right)"), key("\\log_a", "\\log_{#?}\\left(#?\\right)"), key("\\sqrt[n]{x}", "\\sqrt[#?]{#0}"), "\\infty", "\\to"],
    [key("\\sin", "\\sin\\left(#?\\right)"), key("\\cos", "\\cos\\left(#?\\right)"), key("\\tan", "\\tan\\left(#?\\right)"), key("\\arcsin", "\\arcsin\\left(#?\\right)"), "\\pi", "\\theta", "\\Delta", "\\nabla"],
    [key("f'(x)", "f^{\\prime}(#?)"), key("\\frac{d^2}{dx^2}", "\\frac{d^2 #?}{d x^2}"), key("|x|", "\\left|#0\\right|"), key("\\{\\cdots", "\\begin{cases}#? & #? \\\\ #? & #?\\end{cases}", "分段函数"), "x", "n", "=", "\\approx"],
  ]) },
  { id: "discrete", label: "离散数学", layout: layout("note-discrete", [
    ["\\neg", "\\land", "\\lor", "\\oplus", "\\implies", "\\iff", "\\forall", "\\exists"],
    ["\\in", "\\notin", "\\subset", "\\subseteq", "\\cup", "\\cap", "\\setminus", "\\varnothing"],
    [key("\\{x\\}", "\\left\\{#0\\right\\}"), key("|A|", "\\left|#0\\right|", "集合基数"), "\\mathbb{N}", "\\mathbb{Z}", "\\mathbb{Q}", "\\mathbb{R}", "\\times", "\\mathcal{P}"],
    [key("\\binom{n}{k}", "\\binom{#?}{#?}", "组合数"), key("n!", "#0!", "阶乘"), key("\\sum", "\\sum_{#?}^{#?}#?"), "\\equiv", key("\\pmod{n}", "\\pmod{#?}", "模运算"), "\\mapsto", "\\vdash", "\\models"],
  ]) },
  { id: "linear", label: "线性代数", layout: layout("note-linear", [
    [key("\\vec{a}", "\\vec{#0}", "向量"), key("\\mathbf{A}", "\\mathbf{#0}", "粗体矩阵"), key("A^{\\mathsf T}", "#0^{\\mathsf T}", "转置"), key("A^{-1}", "#0^{-1}", "逆矩阵"), key("\\det A", "\\det\\left(#?\\right)", "行列式"), key("\\operatorname{rank}", "\\operatorname{rank}\\left(#?\\right)", "秩"), key("\\operatorname{tr}", "\\operatorname{tr}\\left(#?\\right)", "迹"), "\\lambda"],
    [key("\\lVert x\\rVert", "\\left\\lVert #0\\right\\rVert", "范数"), key("\\langle u,v\\rangle", "\\left\\langle #?,#?\\right\\rangle", "内积"), "\\cdot", "\\times", "\\otimes", "\\perp", "\\mathbb{R}", "\\mathbb{C}"],
    [key("\\operatorname{span}", "\\operatorname{span}\\left(#?\\right)"), key("\\ker", "\\ker\\left(#?\\right)"), key("\\operatorname{Im}", "\\operatorname{Im}\\left(#?\\right)"), key("\\operatorname{diag}", "\\operatorname{diag}\\left(#?\\right)"), "\\alpha", "\\beta", "\\mu", "\\sigma"],
    ["a", "b", "x", "=", "\\sim", "\\cdots", "\\vdots", "\\ddots"],
  ]) },
  { id: "probability", label: "概率统计", layout: layout("note-probability", [
    [key("P(A)", "P\\left(#?\\right)", "概率"), key("P(A\\mid B)", "P\\left(#?\\mid #?\\right)", "条件概率"), key("E(X)", "E\\left(#?\\right)", "期望"), key("\\operatorname{Var}", "\\operatorname{Var}\\left(#?\\right)", "方差"), key("\\operatorname{Cov}", "\\operatorname{Cov}\\left(#?,#?\\right)", "协方差"), "\\mu", "\\sigma", "\\rho"],
    [key("\\bar{x}", "\\bar{#0}", "均值"), key("\\hat{\\theta}", "\\hat{#0}", "估计量"), key("\\binom{n}{k}", "\\binom{#?}{#?}"), key("n!", "#0!"), key("\\sum", "\\sum_{i=1}^{#?}#?"), key("\\prod", "\\prod_{i=1}^{#?}#?"), key("\\frac{1}{n}", "\\frac{1}{#?}"), key("x^2", "#0^2")],
    [key("\\mathcal{N}", "\\mathcal{N}\\left(#?,#?\\right)", "正态分布"), key("\\operatorname{Bin}", "\\operatorname{Bin}\\left(#?,#?\\right)", "二项分布"), key("\\operatorname{Pois}", "\\operatorname{Pois}\\left(#?\\right)", "泊松分布"), "\\sim", "\\Phi", "\\phi", "\\chi^2", "\\alpha"],
    ["X", "Y", "n", "p", "\\cap", "\\cup", "\\le", "\\ge"],
  ]) },
  { id: "letters", label: "abc", layout: "alphabetic" },
  { id: "greek", label: "αβγ", layout: "greek" },
] as const;

export const matrixStyles = [
  ["pmatrix", "圆括号 ( )"], ["bmatrix", "方括号 [ ]"], ["vmatrix", "行列式 | |"],
  ["Vmatrix", "双竖线 ‖ ‖"], ["Bmatrix", "花括号 { }"], ["matrix", "无括号"],
] as const;
export type MatrixStyle = typeof matrixStyles[number][0];

export function matrixTemplate(rows: number, columns: number, style: MatrixStyle): string {
  if (!Number.isInteger(rows) || !Number.isInteger(columns) || rows < 1 || columns < 1 || rows > 10 || columns > 10) throw new RangeError("Matrix dimensions must be between 1 and 10");
  if (!matrixStyles.some(([name]) => name === style)) throw new RangeError("Unsupported matrix style");
  return `\\begin{${style}}${Array.from({ length: rows }, () => Array(columns).fill("#?").join(" & ")).join(" \\\\ ")}\\end{${style}}`;
}
