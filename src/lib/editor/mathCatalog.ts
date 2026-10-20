import { mathKeyboards } from "./mathKeyboard";
export type MathSymbol = { id: string; category: string; categories: string[]; label: string; latex: string; insert: string; aliases: string };
export const symbolCategories = [
  ["basic", "常用"], ["letters", "字母"], ["calculus", "微积分"], ["discrete", "集合与逻辑"], ["linear", "线性代数"], ["probability", "概率统计"],
  ["relations", "关系与运算"], ["arrows", "箭头"], ["greek", "希腊字母"], ["accents", "修饰与括号"], ["fonts", "数学字体"],
] as const;
const entries: MathSymbol[] = [];
const seen = new Map<string, MathSymbol>();
function add(category: string, latex: string, label: string, insert = latex) {
  const existing = seen.get(insert);
  if (existing) { if (!existing.categories.includes(category)) existing.categories.push(category); existing.aliases += ` ${label.toLowerCase()}`; return; }
  const entry = { id: encodeURIComponent(insert), category, categories: [category], latex, label, insert, aliases: `${label} ${latex} ${insert}`.toLowerCase() };
  seen.set(insert, entry); entries.push(entry);
}
for (const keyboard of mathKeyboards) {
  if (typeof keyboard.layout === "string" || !("rows" in keyboard.layout)) continue;
  for (const row of keyboard.layout.rows.slice(0, -1)) for (const key of row) {
    const latex = typeof key === "string" ? key : key.latex;
    if (!latex || latex.startsWith("[")) continue;
    add(keyboard.id, latex, typeof key === "string" ? key.replaceAll("\\", "") : key.tooltip ?? latex.replace(/\\textstyle\s*/g, "").replaceAll("\\", ""), typeof key === "string" ? key : key.insert ?? latex);
  }
}
function symbols(category: string, specification: string) {
  for (const item of specification.split("|")) {
    const [command, label] = item.split(":");
    add(category, `\\${command}`, label ?? command);
  }
}
symbols("relations", "leq:小于等于|geq:大于等于|neq:不等于|ll:远小于|gg:远大于|lesssim:小于或近似|gtrsim:大于或近似|lessapprox:小于或约等于|gtrapprox:大于或约等于|prec:先于|succ:后于|preceq:先于或等于|succeq:后于或等于|simeq:渐近相等|cong:全等|asymp:渐近等价|propto:成比例|doteq:定义等于|triangleq:定义等于三角|leqq:小于双等号|geqq:大于双等号|lneq:小于且不等于|gneq:大于且不等于|nless:不小于|ngtr:不大于|nleq:不小于等于|ngeq:不大于等于|ncong:不全等|nsim:不相似|parallel:平行|nparallel:不平行|mid:整除|nmid:不整除|mp:减加|div:除法|ast:星号乘法|star:星形运算|circ:复合运算|bullet:点积实心点|diamond:菱形运算|odot:圈点积|ominus:圈减|oslash:圈除|bigcirc:圆运算|amalg:并合|wr:环绕积|dagger:匕首伴随|ddagger:双匕首|angle:角|measuredangle:有向角|sphericalangle:球面角|degree:度");
symbols("discrete", "ni:包含元素|subsetneq:真子集|supset:超集|supseteq:超集或相等|supsetneq:真超集|nsubseteq:不是子集|nsupseteq:不是超集|emptyset:空集|uplus:不交并|sqcup:方并|sqcap:方交|sqsubseteq:方子集|sqsupseteq:方超集|bigcup:大并集|bigcap:大交集|biguplus:大不交并|bigsqcup:大方并|bigvee:大析取|bigwedge:大合取|wedge:合取|vee:析取|lnot:逻辑非|nexists:不存在|top:真|bot:假|vDash:语义蕴涵|Vdash:强制|dashv:逆推出|nvdash:不可推导|nvDash:不语义蕴涵|therefore:所以|because:因为|aleph:阿列夫基数|beth:贝斯基数|complement:补集|triangleleft:左三角关系|triangleright:右三角关系");
symbols("arrows", "leftarrow:左箭头|rightarrow:右箭头|leftrightarrow:双向箭头|Leftarrow:左双箭头|Rightarrow:右双箭头|Leftrightarrow:左右双箭头|longleftarrow:长左箭头|longrightarrow:长右箭头|longleftrightarrow:长双向箭头|Longleftarrow:长左双箭头|Longrightarrow:长右双箭头|Longleftrightarrow:长左右双箭头|longmapsto:长映射箭头|hookleftarrow:左钩箭头|hookrightarrow:右钩箭头|uparrow:上箭头|downarrow:下箭头|updownarrow:上下箭头|Uparrow:上双箭头|Downarrow:下双箭头|Updownarrow:上下双箭头|nearrow:右上箭头|searrow:右下箭头|swarrow:左下箭头|nwarrow:左上箭头|leftharpoonup:左上鱼叉|leftharpoondown:左下鱼叉|rightharpoonup:右上鱼叉|rightharpoondown:右下鱼叉|rightleftharpoons:可逆反应|leftrightharpoons:左右鱼叉|twoheadrightarrow:满射|twoheadleftarrow:左双头箭头|rightarrowtail:单射尾箭头|leftarrowtail:左尾箭头|rightsquigarrow:波浪箭头|leadsto:导向|curvearrowleft:左弯箭头|curvearrowright:右弯箭头|circlearrowleft:逆时针箭头|circlearrowright:顺时针箭头|nrightarrow:非右箭头|nleftarrow:非左箭头|nRightarrow:不蕴涵|nLeftrightarrow:不等价");
symbols("greek", "alpha:阿尔法 alpha|beta:贝塔 beta|gamma:伽马 gamma|delta:德尔塔 delta|epsilon:艾普西隆 epsilon|zeta:泽塔 zeta|eta:伊塔 eta|theta:西塔 theta|iota:约塔 iota|kappa:卡帕 kappa|lambda:兰姆达 lambda|mu:缪 mu|nu:纽 nu|xi:克西 xi|omicron:奥米克戎 omicron|pi:派 pi|rho:柔 rho|sigma:西格玛 sigma|tau:陶 tau|upsilon:宇普西隆 upsilon|phi:斐 phi|chi:卡 chi|psi:普西 psi|omega:欧米伽 omega|Gamma:大写伽马|Delta:大写德尔塔|Theta:大写西塔|Lambda:大写兰姆达|Xi:大写克西|Pi:大写派|Sigma:大写西格玛|Upsilon:大写宇普西隆|Phi:大写斐|Psi:大写普西|Omega:大写欧米伽|varepsilon:变体艾普西隆|vartheta:变体西塔|varpi:变体派|varrho:变体柔|varsigma:末尾西格玛|varphi:变体斐|varkappa:变体卡帕");
symbols("calculus", "partial:偏导 partial|infty:无穷 infinity|nabla:梯度 nabla|hbar:约化普朗克常量|ell:花体长度|Re:实部|Im:虚部|prime:一阶导撇号");
for (const name of ["sin", "cos", "tan", "cot", "sec", "csc", "arcsin", "arccos", "arctan", "sinh", "cosh", "tanh", "coth", "exp", "ln", "log", "lg", "min", "max", "inf", "sup", "liminf", "limsup", "gcd", "arg"]) add("calculus", `\\${name}`, `${name} 函数`, `\\${name}\\left(#?\\right)`);
for (const [name, label] of [["hat", "帽"], ["widehat", "宽帽"], ["bar", "横线"], ["overline", "上划线"], ["underline", "下划线"], ["vec", "向量"], ["overrightarrow", "右向量"], ["overleftarrow", "左向量"], ["overleftrightarrow", "双向量"], ["dot", "一阶点导数"], ["ddot", "二阶点导数"], ["tilde", "波浪修饰"], ["widetilde", "宽波浪"], ["check", "抑扬符"], ["breve", "短音符"], ["acute", "尖音符"], ["grave", "重音符"]]) add("accents", `\\${name}{x}`, label, `\\${name}{#0}`);
for (const [left, right, label] of [["(", ")", "圆括号"], ["[", "]", "方括号"], ["\\{", "\\}", "集合花括号"], ["|", "|", "绝对值"], ["\\lVert", "\\rVert", "范数"], ["\\langle", "\\rangle", "内积括号"], ["\\lfloor", "\\rfloor", "向下取整"], ["\\lceil", "\\rceil", "向上取整"]]) add("accents", `\\left${left} x\\right${right}`, label, `\\left${left} #0\\right${right}`);
for (const [font, chars, label] of [["mathbb", "NZQRCFHP", "黑板粗体"], ["mathcal", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "花体"], ["mathfrak", "gabh", "哥特体"], ["mathbf", "ABuvx", "粗体"]]) for (const char of chars) add("fonts", `\\${font}{${char}}`, `${label} ${char}`);
for (const [latex, label, insert] of [
  ["\\underbrace{x+y}_{n}", "下括注", "\\underbrace{#0}_{#?}"], ["\\overbrace{x+y}^{n}", "上括注", "\\overbrace{#0}^{#?}"],
  ["\\overset{a}{=}", "上方标注", "\\overset{#?}{#0}"], ["\\underset{a}{=}", "下方标注", "\\underset{#?}{#0}"],
  ["\\xrightarrow{f}", "带标注箭头", "\\xrightarrow{#?}"], ["\\begin{aligned}a&=b\\\\c&=d\\end{aligned}", "多行对齐方程", "\\begin{aligned}#? &= #? \\\\ #? &= #?\\end{aligned}"],
]) add("accents", latex, label, insert);
for (const char of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") add("letters", char, `字母 ${char}`);
export const mathCatalog: readonly MathSymbol[] = entries;
export function searchMathSymbols(query: string) { const terms = query.trim().toLowerCase().split(/\s+/); return mathCatalog.filter(symbol => terms.every(term => symbol.aliases.includes(term))); }
