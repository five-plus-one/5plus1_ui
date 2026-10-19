/** VideoPlayer - 从课栈 video/InlinePlayer 提取
 *
 * 轻量视频播放器：原生 video 元素加自绘控制条，支持播放/暂停、
 * 进度、音量、全屏与画中画。不依赖第三方播放器库。
 */

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, PictureInPicture } from "lucide-react";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  /** 初始播放位置（秒） */
  startAt?: number;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function VideoPlayer({
  src,
  poster,
  title,
  startAt = 0,
  onTimeUpdate,
  onEnded,
}: VideoPlayerProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(startAt);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.currentTime = startAt;
  }, [src, startAt]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  };

  const pip = async () => {
    const el = video.current;
    if (!el) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await el.requestPictureInPicture();
      }
    } catch {
      /* 浏览器不支持时静默失败 */
    }
  };

  return (
    <div className="fp-video">
      <div className="fp-video-stage">
        <video
          ref={video}
          src={src}
          poster={poster}
          playsInline
          preload="metadata"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => {
            setTime(e.currentTarget.currentTime);
            onTimeUpdate?.(e.currentTarget.currentTime);
          }}
          onEnded={() => {
            setPlaying(false);
            onEnded?.();
          }}
          aria-label={title || "视频"}
        />
        {!playing && (
          <button
            type="button"
            className="fp-video-bigplay"
            aria-label="播放"
            onClick={toggle}
          >
            <Play size={26} fill="currentColor" />
          </button>
        )}
      </div>
      <div className="fp-video-controls">
        <button
          type="button"
          aria-label={playing ? "暂停" : "播放"}
          onClick={toggle}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <input
          type="range"
          className="fp-video-progress"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          aria-label="播放进度"
          onChange={(e) => {
            const next = Number(e.target.value);
            setTime(next);
            if (video.current) video.current.currentTime = next;
          }}
          style={{
            ["--fp-video-fill" as string]: `${
              duration ? (time / duration) * 100 : 0
            }%`,
          }}
        />
        <span className="fp-video-time">
          {formatTime(time)} / {formatTime(duration)}
        </span>
        <button
          type="button"
          aria-label={muted ? "取消静音" : "静音"}
          onClick={() => {
            const el = video.current;
            if (!el) return;
            el.muted = !el.muted;
            setMuted(el.muted);
          }}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          className="fp-video-volume"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          aria-label="音量"
          onChange={(e) => {
            const next = Number(e.target.value);
            setVolume(next);
            if (video.current) video.current.volume = next;
          }}
        />
        <button type="button" aria-label="画中画" onClick={pip}>
          <PictureInPicture size={16} />
        </button>
        <button
          type="button"
          aria-label="全屏"
          onClick={() => {
            const host = video.current?.parentElement?.parentElement;
            if (!host) return;
            if (document.fullscreenElement) void document.exitFullscreen();
            else void host.requestFullscreen?.();
          }}
        >
          <Maximize size={16} />
        </button>
      </div>
    </div>
  );
}
