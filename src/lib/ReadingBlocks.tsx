import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { CollapseTransition } from "./CollapseTransition";
import { ContentImage } from "./ContentImage";
export function EventCard({
  title,
  date,
  children,
  defaultOpen = false,
  fields = [],
}: {
  title: string;
  date?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  fields?: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <article className="fp-event-card">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronRight
          size={16}
          style={{ transform: open ? "rotate(90deg)" : undefined }}
        />
        <span>
          <strong>{title}</strong>
          {date && <time>{date}</time>}
        </span>
      </button>
      {!!fields.length && (
        <dl className="fp-event-fields">
          {fields.map((field) => (
            <div key={field.label}>
              <dt>{field.label}</dt>
              <dd>{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <CollapseTransition isOpen={open}>
        <div className="fp-reading-body">{children}</div>
      </CollapseTransition>
    </article>
  );
}
export function Figure({
  src,
  alt,
  caption,
  credit,
  onOpen,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  credit?: ReactNode;
  onOpen?: () => void;
}) {
  return (
    <figure className="fp-reading-figure">
      {onOpen ? (
        <button type="button" aria-label={`查看${alt}`} onClick={onOpen}>
          <ContentImage src={src} alt={alt} />
        </button>
      ) : (
        <ContentImage src={src} alt={alt} />
      )}
      {(caption || credit) && (
        <figcaption>
          {caption}
          {credit && <small>{credit}</small>}
        </figcaption>
      )}
    </figure>
  );
}
export function MemoryCard({
  question,
  answer,
  revealed,
  onReveal,
  onGrade,
}: {
  question: ReactNode;
  answer: ReactNode;
  revealed: boolean;
  onReveal: () => void;
  onGrade?: (grade: "again" | "hard" | "good" | "easy") => void;
}) {
  return (
    <article className="fp-memory-card">
      <div>{question}</div>
      <CollapseTransition isOpen={revealed}>
        <div className="fp-memory-answer">{answer}</div>
      </CollapseTransition>
      <div className="fp-pattern-actions">
        {!revealed ? (
          <button type="button" onClick={onReveal}>
            查看答案
          </button>
        ) : (
          onGrade &&
          (["again", "hard", "good", "easy"] as const).map((grade, index) => (
            <button type="button" key={grade} onClick={() => onGrade(grade)}>
              {["再学一次", "有些困难", "已经掌握", "很轻松"][index]}
            </button>
          ))
        )}
      </div>
    </article>
  );
}
export interface HistoryEvent {
  id: string;
  title: string;
  date: string;
  description?: ReactNode;
  relatedIds?: string[];
}
export function HistoryMap({
  events,
  selectedId,
  onSelect,
}: {
  events: HistoryEvent[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="fp-history-map" aria-label="历史脉络">
      <ol>
        {events.map((event) => (
          <li key={event.id} data-active={selectedId === event.id || undefined}>
            <button
              type="button"
              aria-pressed={selectedId === event.id}
              onClick={() => onSelect(event.id)}
            >
              <time>{event.date}</time>
              <strong>{event.title}</strong>
            </button>
            <CollapseTransition isOpen={selectedId === event.id}>
              <div className="fp-reading-body">
                {event.description}
                {event.relatedIds?.map((id) => {
                  const target = events.find((e) => e.id === id);
                  return target ? (
                    <button type="button" key={id} onClick={() => onSelect(id)}>
                      关联：{target.title}
                    </button>
                  ) : null;
                })}
              </div>
            </CollapseTransition>
          </li>
        ))}
      </ol>
    </section>
  );
}
export function LearningAnimation({
  title,
  children,
  sourceUrl,
  caption,
}: {
  title: string;
  children: ReactNode;
  sourceUrl?: string;
  caption?: ReactNode;
}) {
  return (
    <figure className="fp-learning-animation">
      <header>
        <strong>{title}</strong>
        {sourceUrl && (
          <a href={sourceUrl} download>
            下载源文件
            <ExternalLink size={13} />
          </a>
        )}
      </header>
      <div>{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
export function NoteLink({
  title,
  detail,
  onOpen,
}: {
  title: string;
  detail?: string;
  onOpen: () => void;
}) {
  return (
    <button type="button" className="fp-note-link" onClick={onOpen}>
      <span>
        <strong>{title}</strong>
        {detail && <small>{detail}</small>}
      </span>
      <ExternalLink size={15} />
    </button>
  );
}
export function VennDiagram({
  leftLabel,
  rightLabel,
  leftCount,
  rightCount,
  intersection,
  total,
}: {
  leftLabel: string;
  rightLabel: string;
  leftCount: number;
  rightCount: number;
  intersection: number;
  total?: number;
}) {
  return (
    <figure
      className="fp-venn"
      aria-label={`${leftLabel} ${leftCount}，${rightLabel} ${rightCount}，交集 ${intersection}${total === undefined ? "" : `，总数 ${total}`}`}
    >
      <svg viewBox="0 0 360 210" role="img">
        <title>集合关系</title>
        <rect
          x="8"
          y="8"
          width="344"
          height="194"
          rx="8"
          fill="none"
          stroke="var(--fp-line)"
        />
        <circle
          cx="139"
          cy="106"
          r="73"
          fill="var(--fp-primary-soft)"
          stroke="var(--fp-action)"
        />
        <circle
          cx="221"
          cy="106"
          r="73"
          fill="var(--fp-primary-soft)"
          fillOpacity=".65"
          stroke="var(--fp-action)"
        />
        <text x="112" y="70" textAnchor="middle">
          {leftLabel}
        </text>
        <text x="249" y="70" textAnchor="middle">
          {rightLabel}
        </text>
        <text x="112" y="120" textAnchor="middle">
          {Math.max(0, leftCount - intersection)}
        </text>
        <text x="180" y="120" textAnchor="middle">
          {intersection}
        </text>
        <text x="249" y="120" textAnchor="middle">
          {Math.max(0, rightCount - intersection)}
        </text>
        {total !== undefined && (
          <text x="325" y="184" textAnchor="end">
            {Math.max(0, total - leftCount - rightCount + intersection)}
          </text>
        )}
      </svg>
    </figure>
  );
}

/** Reveals marked words and checklist items without flattening Markdown formatting. */
export function RecallContent({
  children,
  mode = "cloze",
}: {
  children: ReactNode;
  mode?: string;
}) {
  const [shown, setShown] = useState<string[]>([]);
  const walk = (nodes: ReactNode, path = "root"): ReactNode =>
    Children.map(nodes, (child, index) => {
      const key = `${path}.${index}`;
      if (!isValidElement(child)) return child;
      const element = child as ReactElement<{
        children?: ReactNode;
        className?: string;
      }>;
      const conceal =
        (mode === "cloze" && element.type === "strong") ||
        (mode !== "cloze" && element.type === "li");
      if (conceal)
        return (
          <span className="fp-recall-item">
            <button
              type="button"
              aria-expanded={shown.includes(key)}
              onClick={() =>
                setShown((current) =>
                  current.includes(key)
                    ? current.filter((id) => id !== key)
                    : [...current, key],
                )
              }
            >
              {shown.includes(key) ? element.props.children : "点击回忆"}
            </button>
          </span>
        );
      return cloneElement(element, {}, walk(element.props.children, key));
    });
  return <div className="fp-recall-content">{walk(children)}</div>;
}
export interface MapLocation {
  name: string;
  x: number;
  y: number;
}
export function HistoryLocationMap({
  title = "历史地图",
  points,
  caption,
  onSelect,
}: {
  title?: string;
  points: MapLocation[];
  caption?: ReactNode;
  onSelect?: (point: MapLocation) => void;
}) {
  return (
    <figure className="fp-location-map">
      <figcaption>{title}</figcaption>
      <div>
        {points.map((point, index) => (
          <button
            type="button"
            key={index}
            style={{
              left: `${Math.max(0, Math.min(100, point.x))}%`,
              top: `${Math.max(0, Math.min(100, point.y))}%`,
            }}
            onClick={() => onSelect?.(point)}
          >
            <span aria-hidden="true">●</span>
            {point.name}
          </button>
        ))}
      </div>
      {caption && <p>{caption}</p>}
    </figure>
  );
}
export function ReadingTimeline({
  title = "时间轴",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="fp-reading-timeline">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
