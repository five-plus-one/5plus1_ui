import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import rehypeKatex from "rehype-katex";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import { MermaidPreview } from "./editor/VisualCodeBlock";
import { normalizeObsidianCallouts } from "./editor/normalizeObsidianCallouts";
import { canonicalDirectiveName, CALLOUT_META } from "./editor/calloutTypes";
import {
  ConceptCard,
  Derivation,
  KeyPoint,
  CompareTable,
  CauseEffect,
} from "./NoteBlocks";
import {
  EventCard,
  Figure,
  RecallContent,
  HistoryLocationMap,
  ReadingTimeline,
  LearningAnimation,
} from "./ReadingBlocks";
import { VideoPlayer } from "./VideoPlayer";
import { AudioPlayer } from "./AudioPlayer";
import { ContentImage } from "./ContentImage";
import "katex/dist/katex.min.css";
export interface RenderDirectiveProps {
  name: string;
  attributes: Record<string, string>;
  children: ReactNode;
}
export interface MarkdownContentProps {
  markdown: string;
  resolveResourceUrl?: (url: string) => string;
  renderDirective?: (props: RenderDirectiveProps) => ReactNode;
  onOpenResource?: (attributes: Record<string, string>, kind: string) => void;
  onOpenLink?: (href: string) => void;
}
function directiveNodes() {
  return (tree: Root) => {
    visit(tree, (node) => {
      const directive = node as unknown as {
        type: string;
        name?: string;
        attributes?: Record<string, string>;
        data?: Record<string, unknown>;
      };
      if (
        !["containerDirective", "leafDirective", "textDirective"].includes(
          directive.type,
        )
      )
        return;
      directive.data = {
        ...directive.data,
        hName: "fp-directive",
        hProperties: {
          "data-name": directive.name,
          "data-attributes": JSON.stringify(directive.attributes || {}),
        },
      };
    });
  };
}
const safeUrl = (url: string) =>
  /^\s*(?:javascript|vbscript|data):/i.test(url) ? "" : url;
/** Markdown reading and editing share named directives; host renderers supply specialist engines. */
export function MarkdownContent({
  markdown,
  resolveResourceUrl,
  renderDirective,
  onOpenResource,
  onOpenLink,
}: MarkdownContentProps) {
  const resolve = (url: string) => safeUrl(resolveResourceUrl?.(url) ?? url);
  const render = ({
    name,
    attributes,
    children,
  }: RenderDirectiveProps): ReactNode => {
    const canonical = canonicalDirectiveName(name),
      title =
        attributes.title ||
        attributes.label ||
        CALLOUT_META[canonical]?.label ||
        "学习内容";
    if (renderDirective) {
      const custom = renderDirective({ name: canonical, attributes, children });
      if (custom !== undefined) return custom;
    }
    if (["concept", "conceptcard"].includes(canonical))
      return (
        <ConceptCard term={attributes.term || title}>{children}</ConceptCard>
      );
    if (canonical === "derivation")
      return <Derivation label={title}>{children}</Derivation>;
    if (canonical === "keypoint")
      return <KeyPoint label={title}>{children}</KeyPoint>;
    if (["compare", "comparetable"].includes(canonical))
      return <CompareTable title={title}>{children}</CompareTable>;
    if (canonical === "causeeffect")
      return <CauseEffect>{children}</CauseEffect>;
    if (["event", "eventcard"].includes(canonical))
      return (
        <EventCard
          title={title}
          date={attributes.date || attributes.year}
          fields={[
            ["location", "地点"],
            ["people", "人物"],
            ["result", "结果"],
            ["impact", "影响"],
          ]
            .filter(([key]) => !!attributes[key])
            .map(([key, label]) => ({ label, value: attributes[key] }))}
        >
          {children}
        </EventCard>
      );
    if (["figure", "figuremedia"].includes(canonical) && attributes.src)
      return (
        <Figure
          src={resolve(attributes.src)}
          alt={attributes.alt || title}
          caption={attributes.caption}
          credit={attributes.credit}
        />
      );
    if (["memory", "memorycard"].includes(canonical))
      return (
        <EventCard title={title}>
          <RecallContent mode={attributes.mode || "checklist"}>
            {children}
          </RecallContent>
        </EventCard>
      );
    if (canonical === "timeline")
      return (
        <ReadingTimeline
          title={attributes.period ? `时间轴 · ${attributes.period}` : title}
        >
          {children}
        </ReadingTimeline>
      );
    if (canonical === "historymap")
      return (
        <HistoryLocationMap
          title={title}
          caption={attributes.caption}
          points={(attributes.points || "")
            .split(",")
            .filter(Boolean)
            .map((value) => {
              const [name, x, y] = value.split(":");
              return {
                name,
                x: Number.isFinite(Number(x)) ? Number(x) : 50,
                y: Number.isFinite(Number(y)) ? Number(y) : 50,
              };
            })}
        />
      );
    if (["learninganimation", "learning-animation"].includes(canonical))
      return (
        <LearningAnimation
          title={title}
          sourceUrl={attributes.source ? resolve(attributes.source) : undefined}
          caption={attributes.caption}
        >
          {attributes.src ? (
            <VideoPlayer src={resolve(attributes.src)} title={title} />
          ) : (
            children
          )}
        </LearningAnimation>
      );
    if (canonical === "mediaembed" && attributes.src)
      return /audio/i.test(attributes.type || "") ? (
        <AudioPlayer src={resolve(attributes.src)} title={title} />
      ) : (
        <VideoPlayer src={resolve(attributes.src)} title={title} />
      );
    if (canonical === "video" && attributes.src)
      return <VideoPlayer src={resolve(attributes.src)} title={title} />;
    if (canonical === "audio" && attributes.src)
      return <AudioPlayer src={resolve(attributes.src)} title={title} />;
    if (
      [
        "interactive",
        "plot",
        "functionplot",
        "canvas",
        "svgcanvas",
        "svg",
        "attachment",
        "noteattachment",
        "learning-animation",
      ].includes(canonical) &&
      onOpenResource
    )
      return (
        <section className="fp-reader-resource">
          <strong>{title}</strong>
          {children}
          <button
            type="button"
            onClick={() => onOpenResource(attributes, canonical)}
          >
            打开内容
          </button>
        </section>
      );
    return (
      <aside className="fp-reader-callout" data-kind={canonical}>
        <strong>{title}</strong>
        {children}
      </aside>
    );
  };
  const components = {
    "fp-directive": ({
      node,
      children,
    }: {
      node?: { properties?: Record<string, unknown> };
      children?: ReactNode;
    }) => {
      const properties = node?.properties || {};
      let attributes: Record<string, string> = {};
      try {
        attributes = JSON.parse(
          String(
            properties["data-attributes"] || properties.dataAttributes || "{}",
          ),
        );
      } catch {
        /* A malformed optional attribute uses default presentation. */
      }
      return render({
        name: String(properties["data-name"] || properties.dataName || "note"),
        attributes,
        children,
      });
    },
    img: ({ src, alt }: { src?: string; alt?: string }) =>
      resolve(src || "") ? (
        <ContentImage src={resolve(src || "")} alt={alt || ""} />
      ) : (
        <span>{alt || "图片暂时无法显示。"}</span>
      ),
    a: ({ href, children }: { href?: string; children?: ReactNode }) => (
      <a
        href={href}
        onClick={(e) => {
          if (href && onOpenLink && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            e.preventDefault();
            onOpenLink(href);
          }
        }}
      >
        {children}
      </a>
    ),
    pre: ({ children }: { children?: ReactNode }) => (
      <div className="fp-reader-code">{children}</div>
    ),
    code: ({
      className,
      children,
    }: {
      className?: string;
      children?: ReactNode;
    }) =>
      className?.includes("language-mermaid") ? (
        <MermaidPreview code={String(children).trimEnd()} />
      ) : (
        <code className={className}>{children}</code>
      ),
  } as unknown as Components;
  return (
    <article className="fp-markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkDirective, directiveNodes]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {normalizeObsidianCallouts(markdown)}
      </ReactMarkdown>
    </article>
  );
}
