/** 笔记内容块 - 从课栈 shared/directives 提取
 *
 * KeyPoint / ConceptCard / CompareTable / CauseEffect / Derivation
 * 都是正文中的语义块。它们共享容器与折叠逻辑，这里合并在一个模块，
 * 避免为每种块重复实现一份展开/收起。
 */

import { CollapseTransition } from "./CollapseTransition";
import { useId, useState, type ReactNode } from "react";
import { BookOpen, ChevronRight, ArrowDown } from "lucide-react";

/* ---------------- KeyPoint ---------------- */

export interface KeyPointProps {
  label?: string;
  children: ReactNode;
}

export function KeyPoint({ label = "核心要点", children }: KeyPointProps) {
  return (
    <aside className="fp-keypoint">
      <span className="fp-keypoint-label">{label}</span>
      <div className="fp-keypoint-body">{children}</div>
    </aside>
  );
}

/* ---------------- ConceptCard ---------------- */

export interface ConceptCardProps {
  term: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ConceptCard({
  term,
  children,
  defaultOpen = false,
}: ConceptCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="fp-concept">
      <button
        type="button"
        className="fp-concept-head"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="fp-concept-icon" aria-hidden="true">
          <BookOpen size={16} />
        </span>
        <span className="fp-concept-term">{term}</span>
        <span className="fp-concept-hint">{open ? "点击收起" : "点击展开"}</span>
        <ChevronRight size={16} className="fp-concept-chevron" />
      </button>
      <div id={id} className="fp-concept-body" inert={!open} aria-hidden={!open} data-open={open || undefined}>
        <div className="fp-concept-clip">
          <div className="fp-concept-inner">{children}</div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CompareTable ---------------- */

export interface CompareTableProps {
  title?: string;
  children: ReactNode;
}

export function CompareTable({ title, children }: CompareTableProps) {
  return (
    <section className="fp-compare">
      {title && <header className="fp-compare-title">{title}</header>}
      <div className="fp-compare-body">{children}</div>
    </section>
  );
}

/* ---------------- CauseEffect ---------------- */

export type CauseEffectKind = "cause" | "effect" | "result";

export interface CauseEffectItem {
  kind?: CauseEffectKind;
  text: ReactNode;
}

const KIND_LABEL: Record<CauseEffectKind, string> = {
  cause: "因",
  effect: "影响",
  result: "结果",
};

export interface CauseEffectProps {
  /** 简洁写法：按顺序排列的链条 */
  items?: CauseEffectItem[];
  /** 段落写法：每行以「因：」「影响：」「结果：」开头 */
  text?: string;
  children?: ReactNode;
}

function parse(text: string): CauseEffectItem[] {
  return text
    .split("\n")
    .map((line) => line.trim().replace(/^[-*]\s*/, ""))
    .filter(Boolean)
    .map((line) => {
      if (/^(因|原因)[：:]/.test(line))
        return { kind: "cause" as const, text: line.replace(/^(因|原因)[：:]/, "").trim() };
      if (/^(果|结果)[：:]/.test(line))
        return { kind: "result" as const, text: line.replace(/^(果|结果)[：:]/, "").trim() };
      if (/^(影响|后果)[：:]/.test(line))
        return { kind: "effect" as const, text: line.replace(/^(影响|后果)[：:]/, "").trim() };
      return { kind: undefined, text: line };
    });
}

export function CauseEffect({ items, text, children }: CauseEffectProps) {
  const chain = items ?? (text ? parse(text) : []);
  return (
    <div className="fp-cause-effect">
      {chain.map((item, i) => {
        const kind: CauseEffectKind =
          item.kind ?? (i === 0 ? "cause" : "effect");
        return (
          <div className="fp-cause-node" data-kind={kind} key={i}>
            <span className="fp-cause-label">{KIND_LABEL[kind]}</span>
            <div className="fp-cause-text">{item.text}</div>
            {i < chain.length - 1 && (
              <ArrowDown size={16} className="fp-cause-arrow" aria-hidden="true" />
            )}
          </div>
        );
      })}
      {children}
    </div>
  );
}

/* ---------------- Derivation ---------------- */

export interface DerivationProps {
  label?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Derivation({
  label = "推导过程",
  children,
  defaultOpen = false,
}: DerivationProps) {
  const [open,setOpen]=useState(defaultOpen);const id=useId();
  return <section className="fp-derivation" data-open={open||undefined}><button type="button" className="fp-derivation-trigger" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(value=>!value)}><ChevronRight size={15} className="fp-derivation-chevron"/>{label}</button><CollapseTransition isOpen={open}><div id={id} className="fp-derivation-body">{children}</div></CollapseTransition></section>;
}
