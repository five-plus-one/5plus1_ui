import { useEffect, useRef, useState } from "react";
import { AudioPlayer, type AudioPlayerProps } from "./AudioPlayer";
import { VideoPlayer, type VideoPlayerProps } from "./VideoPlayer";
import { MarkdownEditor } from "./editor/MarkdownEditor";
import { MarkdownContent } from "./MarkdownContent";
import { AnimatedSize } from "./AnimatedSize";
import { SettingsTabs, WorkspaceSection } from "./WorkspaceForms";
export interface LectureUtterance {
  id?: string;
  text: string;
  start: number;
  end: number;
  words?: { text: string; start: number; end: number }[];
}
export interface LectureSection {
  id: string;
  title: string;
  start: number;
  markdown?: string;
}
export interface LectureWorkspaceProps {
  title: string;
  media:
    | ({ kind: "audio" } & AudioPlayerProps)
    | ({ kind: "video" } & VideoPlayerProps);
  transcript: LectureUtterance[];
  chapters?: LectureSection[];
  notes: string;
  onNotesChange: (markdown: string) => void;
  onPositionChange?: (seconds: number) => void;
  onCite?: (reference: { title: string; time: number; text: string }) => void;
}
const timeLabel = (time: number) =>
  `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;
export function LectureWorkspace({
  title,
  media,
  transcript,
  chapters = [],
  notes,
  onNotesChange,
  onPositionChange,
  onCite,
}: LectureWorkspaceProps) {
  const [time, setTime] = useState(media.startAt || 0),
    [tab, setTab] = useState("transcript"),
    [follow, setFollow] = useState(true),
    element = useRef<HTMLMediaElement | null>(null),
    active = useRef<HTMLDivElement | null>(null);
  const current = transcript.findIndex(
      (line) => time >= line.start && time < line.end,
    ),
    chapter = [...chapters].reverse().find((item) => item.start <= time);
  useEffect(() => {
    if (!follow || tab !== "transcript" || !active.current) return;
    const line = active.current,
      pane = line.parentElement;
    if (!pane) return;
    const box = line.getBoundingClientRect(),
      bounds = pane.getBoundingClientRect();
    if (box.top < bounds.top || box.bottom > bounds.bottom)
      pane.scrollTo?.({
        top: pane.scrollTop + box.top - bounds.top - 16,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }, [current, follow, tab]);
  useEffect(() => {
    setTime(media.startAt || 0);
  }, [media.src, media.startAt]);
  useEffect(() => {
    if (tab === "chapter" && !chapter?.markdown) setTab("transcript");
  }, [tab, chapter?.markdown]);
  const position = (next: number) => {
    setTime(next);
    onPositionChange?.(next);
    media.onTimeUpdate?.(next);
  };
  const seek = (next: number) => {
    if (element.current) {
      element.current.currentTime = Math.max(0, next);
      position(next);
    }
  };
  return (
    <section className="fp-workspace-form fp-lecture-workspace">
      <WorkspaceSection title={title}>
        {media.kind === "audio" ? (
          <AudioPlayer
            {...media}
            audioRef={(value) => {
              element.current = value;
              const ref = media.audioRef;
              if (typeof ref === "function") ref(value);
              else if (ref) ref.current = value;
            }}
            onTimeUpdate={position}
          />
        ) : (
          <VideoPlayer
            {...media}
            videoRef={(value) => {
              element.current = value;
              const ref = media.videoRef;
              if (typeof ref === "function") ref(value);
              else if (ref) ref.current = value;
            }}
            onTimeUpdate={position}
          />
        )}
        {chapters.length > 0 && (
          <nav className="fp-lecture-chapters" aria-label="课堂章节">
            {chapters.map((item) => (
              <button
                type="button"
                key={item.id}
                className="fp-button fp-secondary"
                aria-current={chapter?.id === item.id ? "step" : undefined}
                onClick={() => seek(item.start)}
              >
                <span>{timeLabel(item.start)}</span>
                {item.title}
              </button>
            ))}
          </nav>
        )}
        <SettingsTabs
          label="课堂内容"
          value={tab}
          onChange={setTab}
          items={[
            { id: "transcript", label: "讲稿" },
            { id: "notes", label: "课堂笔记" },
            ...(chapter?.markdown
              ? [{ id: "chapter", label: "章节内容" }]
              : []),
          ]}
        />
        <AnimatedSize>
          <div className="fp-lecture-content">
            {tab === "notes" ? (
              <MarkdownEditor
                markdown={notes}
                onChange={onNotesChange}
                placeholder="记录课堂中的想法…"
              />
            ) : tab === "chapter" ? (
              <MarkdownContent markdown={chapter?.markdown || ""} />
            ) : (
              <>
                <div className="fp-workspace-actions">
                  <button
                    type="button"
                    className="fp-button fp-secondary"
                    aria-pressed={follow}
                    onClick={() => setFollow(!follow)}
                  >
                    跟随播放
                  </button>
                </div>
                <div className="fp-lecture-transcript" aria-label="课堂讲稿">
                  {transcript.length ? (
                    transcript.map((line, index) => (
                      <div
                        key={line.id || `${line.start}-${index}`}
                        ref={index === current ? active : undefined}
                        className="fp-lecture-line"
                        data-active={index === current || undefined}
                      >
                        <button
                          type="button"
                          className="fp-lecture-timestamp"
                          onClick={() => seek(line.start)}
                          aria-label={`跳转至 ${timeLabel(line.start)}`}
                        >
                          {timeLabel(line.start)}
                        </button>
                        <p>
                          {line.words?.length ? (
                            line.words.map((word, wordIndex) => (
                              <button
                                type="button"
                                key={wordIndex}
                                className="fp-lecture-word"
                                data-active={
                                  (time >= word.start && time < word.end) ||
                                  undefined
                                }
                                onClick={() => seek(word.start)}
                              >
                                {word.text}
                              </button>
                            ))
                          ) : (
                            <button
                              type="button"
                              className="fp-lecture-word"
                              onClick={() => seek(line.start)}
                            >
                              {line.text}
                            </button>
                          )}
                        </p>
                        {onCite && (
                          <button
                            type="button"
                            className="fp-button fp-ghost"
                            onClick={() =>
                              onCite({
                                title,
                                time: line.start,
                                text: line.text,
                              })
                            }
                          >
                            引用
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="fp-workspace-empty">还没有可用的课堂讲稿。</p>
                  )}
                </div>
              </>
            )}
          </div>
        </AnimatedSize>
      </WorkspaceSection>
    </section>
  );
}
