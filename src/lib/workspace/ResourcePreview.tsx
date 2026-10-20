import { Fragment, useEffect, useState, type ReactNode } from "react";
import PdfPreview from "./PdfPreview";
import { Download } from "lucide-react";
import { AnimatedSize } from "../AnimatedSize";
import { VideoPlayer, type VideoPlayerProps } from "../VideoPlayer";
import { AudioPlayer, type AudioPlayerProps } from "../AudioPlayer";
export type PreviewResource = {
  name: string;
  url: string;
  mediaType?: string;
  bytes?: number;
  previewUrl?: string;
  downloadUrl?: string;
};
export function ResourcePreview({
  resource,
  renderVideoExtra,
  videoProps,
  audioProps,
}: {
  resource: PreviewResource;
  renderVideoExtra?: ReactNode;
  videoProps?: Omit<VideoPlayerProps, "src" | "title">;
  audioProps?: Omit<AudioPlayerProps, "src" | "title">;
}) {
  let { name, url, mediaType = "", previewUrl, bytes = 0 } = resource;
  let [text, setText] = useState(""),
    [error, setError] = useState(false);
  let plain =
    /^(text\/(plain|markdown|csv)|application\/json)$/.test(mediaType) ||
    /\.(txt|md|csv|json)$/i.test(name);
  let office =
    /\.(pdf|pptx?|docx?|xlsx?|odt|odp|ods)$/i.test(name) ||
    mediaType === "application/pdf";
  const ContentSize = office ? Fragment : AnimatedSize;
  useEffect(() => {
    setText("");
    setError(false);
    if (!plain || bytes > 2_000_000) return;
    let c = new AbortController();
    fetch(url, { signal: c.signal, credentials: "include" })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.text();
      })
      .then((value) => {
        if (!c.signal.aborted) setText(value);
      })
      .catch(() => {
        if (!c.signal.aborted) setError(true);
      });
    return () => c.abort();
  }, [url, plain, bytes]);
  return (
    <section className="fp-resource-preview">
      <header className="fp-resource-header">
        <span>
          <strong>{name}</strong>
          <small>
            {office
              ? "文档预览"
              : mediaType.startsWith("image/")
                ? "图片预览"
                : "文件预览"}
          </small>
        </span>
        {!office && (
          <a href={resource.downloadUrl || url} download={name}>
            <Download size={16} aria-hidden="true" />
            下载原文件
          </a>
        )}
      </header>
      <ContentSize>
        {office ? (
          <PdfPreview
            url={previewUrl || url}
            name={name}
            downloadUrl={resource.downloadUrl || url}
          />
        ) : mediaType.startsWith("image/") ? (
          <img className="fp-preview-image" src={url} alt={name} />
        ) : mediaType.startsWith("video/") ? (
          <>
            <VideoPlayer {...videoProps} src={url} title={name} />
            {renderVideoExtra}
          </>
        ) : mediaType.startsWith("audio/") ? (
          <AudioPlayer {...audioProps} src={url} title={name} />
        ) : plain && bytes <= 2_000_000 ? (
          <pre className="fp-preview-text">
            {error ? "暂时无法读取，请下载查看。" : text || "正在阅读文件…"}
          </pre>
        ) : (
          <div className="pdf-preview-message">此文件可以下载后查看。</div>
        )}
      </ContentSize>
    </section>
  );
}
