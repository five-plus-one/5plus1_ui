import { createContext, useContext, type ReactNode } from "react";
/** Course documents stay with the host; this slot receives its authenticated reading view. */
export const LearningSourceContext = createContext<
  ((id: string, kind: "audio" | "document" | "transcript") => ReactNode) | null
>(null);
function Source({
  id,
  kind = "document",
}: {
  id: string;
  kind?: "audio" | "document" | "transcript";
}) {
  const render = useContext(LearningSourceContext);
  return (
    <section className="fp-learning-source">
      {render ? render(id, kind) : <p>请从课程资料中打开此内容。</p>}
    </section>
  );
}
export const RecordingOne = () => <Source id="rec-01" kind="audio" />;
export const RecordingTwo = () => <Source id="rec-02" kind="audio" />;
export const Slides = () => <Source id="slides" />;
export const Textbook = () => <Source id="textbook-6" />;
export const ReferenceTextbook = () => <Source id="textbook-reference" />;
export const TranscriptOne = () => <Source id="rec-01" kind="transcript" />;
export const TranscriptTwo = () => <Source id="rec-02" kind="transcript" />;
export const SlidesThreeFour = () => <Source id="slides-03-04" />;
export const SlidesFiveSix = () => <Source id="slides-05-06" />;
export const SlidesSevenEight = () => <Source id="slides-07-08" />;
