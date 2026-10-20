import { useState } from "react";
import {
  ResourcePreview,
  type PreviewResource,
} from "./workspace/ResourcePreview";
import {
  LectureWorkspace,
  type LectureUtterance,
  type LectureSection,
} from "./LectureWorkspace";
import { MarkdownContent } from "./MarkdownContent";
import type { AudioPlayerProps } from "./AudioPlayer";
export interface LearningSourceResource {
  title: string;
  resource?: PreviewResource;
  audio?: AudioPlayerProps;
  transcript?: LectureUtterance[];
  chapters?: LectureSection[];
  markdown?: string;
}
export function LearningSourceView({
  source,
}: {
  source: LearningSourceResource;
}) {
  const [notes, setNotes] = useState("");
  return source.audio ? (
    <LectureWorkspace
      title={source.title}
      media={{ kind: "audio", ...source.audio }}
      transcript={source.transcript || []}
      chapters={source.chapters}
      notes={notes}
      onNotesChange={setNotes}
    />
  ) : source.resource ? (
    <ResourcePreview resource={source.resource} />
  ) : (
    <section>
      <h3>{source.title}</h3>
      <MarkdownContent
        markdown={source.markdown || "此资料还没有可阅读的正文。"}
      />
    </section>
  );
}
