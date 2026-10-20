"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Download, Minus, Plus, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import HorizontalScrollbar from "./HorizontalScrollbar";
import { AnimatedSize } from '../AnimatedSize';

type PageImage = { n: number; url: string };
type PageManifest = { pages: PageImage[]; pageCount: number };

function PdfPage({
  page,
  zoom,
  aspect,
  onAspect,
  expanded,
}: {
  expanded: boolean;
  page: PageImage;
  zoom: number;
  aspect: number;
  onAspect: (value: number) => void;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(page.n <= 2);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (visible || !holder.current) return;
    const root = expanded
      ? holder.current.closest<HTMLElement>(".resource-detail")
      : holder.current.closest<HTMLElement>(".pdf-preview-pages");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { root, rootMargin: "700px 0px" },
    );
    observer.observe(holder.current);
    return () => observer.disconnect();
  }, [visible, expanded]);

  useEffect(() => {
    setFailed(false);
    setRetry(0);
  }, [page.url]);
  const width = `${Math.round(zoom * 100)}%`;
  return (
    <div
      ref={holder}
      data-pdf-sheet={page.n}
      style={{
        width,
        aspectRatio: loaded ? undefined : String(aspect),
        margin: zoom <= 1 ? "0 auto 12px" : "0 0 12px",
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,.12)",
      }}
    >
      {visible &&
        (failed ? (
          <div role="alert" className="pdf-preview-message">
            第 {page.n} 页加载失败。
            <button
              type="button"
              onClick={() => {
                setFailed(false);
                setRetry((value) => value + 1);
              }}
            >
              重试
            </button>
          </div>
        ) : (
          <img
            src={
              retry
                ? `${page.url}${page.url.includes("?") ? "&" : "?"}retry=${retry}`
                : page.url
            }
            alt={`第 ${page.n} 页`}
            draggable={false}
            onLoad={(event) => {
              const image = event.currentTarget;
              if (
                page.n === 1 &&
                image.naturalWidth > 0 &&
                image.naturalHeight > 0
              )
                onAspect(image.naturalWidth / image.naturalHeight);
              setLoaded(true);
            }}
            onError={() => {
              setLoaded(false);
              setFailed(true);
            }}
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        ))}
    </div>
  );
}

export default function PdfPreview({
  url,
  name,
  downloadUrl,
}: {
  url: string;
  name: string;
  downloadUrl?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const pagesHost = useRef<HTMLDivElement>(null);
  const pagesId = useId();
  const pan = useRef<{ x: number; left: number } | null>(null);
  const [visible, setVisible] = useState(false);
  const [manifest, setManifest] = useState<PageManifest | null>(null);
  const [state, setState] = useState<
    "loading" | "rendering" | "ready" | "error"
  >("loading");
  const [current, setCurrent] = useState(1);
  const [jumpTo, setJumpTo] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pageAspect, setPageAspect] = useState(0.707);
  const [attempt, setAttempt] = useState(0);
  const [horizontal, setHorizontal] = useState({ left: 0, max: 0 });

  useEffect(() => {
    if (!host.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    let contentHash = "";
    setManifest(null);
    setState("loading");
    const poll = async () => {
      try {
        const endpoint = new URL(url, window.location.href);
        endpoint.searchParams.set("view", "pages");
        endpoint.searchParams.delete("download");
        if (contentHash) endpoint.searchParams.set("hash", contentHash);
        const response = await fetch(endpoint.href, {
          credentials: "include",
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("preview unavailable");
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (typeof data.contentHash === "string")
          contentHash = data.contentHash;
        if (data.status === "ready" && data.manifest?.pages?.length) {
          setManifest({
            pages: data.manifest.pages,
            pageCount: data.manifest.pageCount || data.manifest.pages.length,
          });
          setState("ready");
          attempts = 0;
          timer = setTimeout(() => void poll(), 30 * 60 * 1000);
        } else if (data.status === "failed") {
          setState("error");
        } else {
          attempts++;
          setState("rendering");
          timer = setTimeout(
            () => void poll(),
            attempts < 15 ? 2000 : attempts < 60 ? 5000 : 10000,
          );
        }
      } catch {
        if (!controller.signal.aborted) setState("error");
      }
    };
    void poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [url, visible, attempt]);

  const jump = useCallback(
    (page: number) => {
      const target = Math.max(1, Math.min(manifest?.pageCount || 1, page));
      const container = pagesHost.current;
      const sheet = container?.querySelector<HTMLElement>(
        `[data-pdf-sheet="${target}"]`,
      );
      if (container && sheet) {
        if (expanded)
          sheet.scrollIntoView({ block: "start", behavior: "smooth" });
        else
          container.scrollTo({
            top:
              container.scrollTop +
              sheet.getBoundingClientRect().top -
              container.getBoundingClientRect().top,
            behavior: "smooth",
          });
      }
      setCurrent(target);
    },
    [manifest?.pageCount, expanded],
  );

  useEffect(() => {
    const element = pagesHost.current;
    if (element)
      element.scrollLeft = Math.max(
        0,
        (element.scrollWidth - element.clientWidth) / 2,
      );
  }, [zoom, state]);

  useEffect(() => {
    const element = pagesHost.current;
    if (!element) return;
    const update = () =>
      setHorizontal({
        left: element.scrollLeft,
        max: Math.max(0, element.scrollWidth - element.clientWidth),
      });
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(element);
    const frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [zoom, state, manifest]);

  const scrollHorizontally = (left: number) => {
    if (pagesHost.current) pagesHost.current.scrollLeft = left;
    setHorizontal((value) => ({ ...value, left }));
  };

  return (
    <div
      ref={host}
      className={`pdf-preview pdf-preview-scroll${expanded ? " pdf-preview-expanded" : " pdf-preview-windowed"}`}
      aria-label={`${name} 预览`}
    >
      <div className="pdf-preview-controls">
        <div className="pdf-page-navigation">
          <span>
            <input
              type="number"
              min={1}
              max={manifest?.pageCount || 1}
              value={jumpTo || current}
              onChange={(event) => setJumpTo(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  jump(Number(jumpTo || current));
                  setJumpTo("");
                }
              }}
              aria-label="跳转到页码"
            />{" "}
            / {manifest?.pageCount || "…"} 页
          </span>
          <button
            type="button"
            disabled={state !== "ready"}
            onClick={() => {
              jump(Number(jumpTo || current));
              setJumpTo("");
            }}
          >
            跳转
          </button>
        </div>
        <div className="pdf-zoom-controls">
          <button
            type="button"
            disabled={zoom <= 0.5 || state !== "ready"}
            onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))}
            aria-label="缩小"
          >
            <Minus />
          </button>
          <button
            type="button"
            className="pdf-zoom-value"
            title="恢复适合宽度"
            onClick={() => setZoom(1)}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            disabled={zoom >= 3 || state !== "ready"}
            onClick={() => setZoom((value) => Math.min(3, value + 0.25))}
            aria-label="放大"
          >
            <Plus />
          </button>
        </div>
        <button
          type="button"
          className="pdf-expand-toggle"
          aria-label={expanded ? "固定窗口" : "完整展开"}
          title={expanded ? "固定窗口" : "完整展开"}
          aria-pressed={expanded}
          aria-controls={pagesId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
          <span>{expanded ? "固定窗口" : "完整展开"}</span>
        </button>
        <a
          className="pdf-download"
          aria-label="下载原文件"
          title="下载原文件"
          href={
            downloadUrl || `${url}${url.includes("?") ? "&" : "?"}download=1`
          }
          download
        >
          <Download />
        </a>
        {horizontal.max > 1 && (
          <div className="pdf-preview-horizontal">
            <HorizontalScrollbar
              value={horizontal.left}
              max={horizontal.max}
              viewport={pagesHost.current?.clientWidth || 1}
              controls={pagesId}
              onChange={scrollHorizontally}
            />
          </div>
        )}
      </div>
      <AnimatedSize>{state === "error" ? (
        <div role="alert" className="pdf-preview-message">
          暂时无法预览此文件。
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            <RotateCcw />
            重试
          </button>
        </div>
      ) : state !== "ready" ? (
        <div role="status" className="pdf-preview-message">
          正在准备预览…
        </div>
      ) : (
        <div
          ref={pagesHost}
          id={pagesId}
          className="pdf-preview-pages"
          style={{ cursor: zoom > 1 ? "grab" : undefined }}
          onScroll={(event) => {
            const left = event.currentTarget.scrollLeft;
            setHorizontal((value) =>
              value.left === left ? value : { ...value, left },
            );
          }}
          onPointerDown={(event) => {
            if (
              zoom <= 1 ||
              event.pointerType !== "mouse" ||
              event.button !== 0
            )
              return;
            pan.current = {
              x: event.clientX,
              left: event.currentTarget.scrollLeft,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.style.cursor = "grabbing";
          }}
          onPointerMove={(event) => {
            if (pan.current)
              event.currentTarget.scrollLeft =
                pan.current.left - (event.clientX - pan.current.x);
          }}
          onPointerUp={(event) => {
            pan.current = null;
            event.currentTarget.style.cursor = "grab";
          }}
          onPointerCancel={() => {
            pan.current = null;
          }}
        >
          {manifest?.pages.map((page) => (
            <PdfPage
              key={page.n}
              page={page}
              zoom={zoom}
              aspect={pageAspect}
              onAspect={setPageAspect}
              expanded={expanded}
            />
          ))}
        </div>
      )}</AnimatedSize>
    </div>
  );
}
