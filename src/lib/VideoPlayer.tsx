/** VideoPlayer - 从课栈 video/InlinePlayer 提取
 *
 * 轻量视频播放器：原生 video 元素加自绘控制条，支持播放/暂停、
 * 进度、音量、全屏与画中画。不依赖第三方播放器库。
 */

import { useEffect, useRef, useState, type Ref } from "react";
import { SelectField } from "./SelectField";
import { Play, Pause, Volume2, VolumeX, Maximize, PictureInPicture } from "lucide-react";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  /** 初始播放位置（秒） */
  startAt?: number;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
  resolveSource?: (src: string, signal: AbortSignal) => Promise<string>;
  videoRef?: Ref<HTMLVideoElement>;
  onSeek?: (time: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onPlaybackError?: (error: string) => void;
  tracks?: { src: string; label: string; language: string; default?: boolean }[];
  /** 仅在播放器内获得焦点时响应快捷键 */
  keyboardShortcuts?: boolean;
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
  resolveSource,
  videoRef,
  onSeek,
  onPlaybackRateChange,
  onPlaybackError,
  tracks = [],
  keyboardShortcuts = true,
}: VideoPlayerProps) {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(startAt);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [resolved, setResolved] = useState(resolveSource ? '' : src);
  const [error, setError] = useState('');
  const [generation, retry] = useState(0);
  const [rate, setRate] = useState(1);
  const callbacks = useRef({ onPlaybackError }); callbacks.current = { onPlaybackError };
  const reportError = (message: string) => { setError(message); callbacks.current.onPlaybackError?.(message); };
  useEffect(() => {
    const controller = new AbortController();
    setError(''); setPlaying(false); setTime(startAt); setDuration(0);
    if (!resolveSource) { setResolved(src); return; }
    setResolved('');
    void resolveSource(src, controller.signal).then(url => { if (!controller.signal.aborted) setResolved(url); }).catch(cause => { if (!controller.signal.aborted) reportError(cause instanceof Error ? cause.message : '视频暂时无法播放'); });
    return () => controller.abort();
  }, [src, resolveSource, generation]);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.currentTime = startAt;
  }, [src, startAt]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => reportError('暂时无法播放，请重试'));
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

  const fullscreen = async () => {
    try {
      if (document.fullscreenElement === host.current) await document.exitFullscreen();
      else await host.current?.requestFullscreen?.();
    } catch { reportError('暂时无法进入全屏，请重试'); }
  };

  const seek = (next: number) => {
    const el = video.current;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
    el.currentTime = Math.max(0, Math.min(el.duration, next));
    setTime(el.currentTime);
  };

  return (
    <div className="fp-video" ref={host} tabIndex={0} role="region" aria-label={title ? `${title}视频播放器` : '视频播放器'}
      aria-keyshortcuts={keyboardShortcuts ? 'Space k j l ArrowLeft ArrowRight ArrowUp ArrowDown m f Home End' : undefined}
      onKeyDown={event => {
        if (!keyboardShortcuts || event.defaultPrevented || event.nativeEvent.isComposing || event.ctrlKey || event.altKey || event.metaKey) return;
        if ((event.target as HTMLElement).closest('input,textarea,select,button,[contenteditable="true"],[role="combobox"],[role="menu"]')) return;
        const el = video.current;
        if (!el) return;
        const key = event.key.toLowerCase();
        if (![' ', 'k', 'j', 'l', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'm', 'f', 'home', 'end', ',', '.'].includes(key) && !/^[0-9]$/.test(key)) return;
        event.preventDefault(); event.stopPropagation();
        if (event.repeat && [' ', 'k', 'm', 'f'].includes(key)) return;
        if (key === ' ' || key === 'k') toggle();
        else if (key === 'j' || key === 'arrowleft') seek(el.currentTime - (key === 'j' ? 10 : 5));
        else if (key === 'l' || key === 'arrowright') seek(el.currentTime + (key === 'l' ? 10 : 5));
        else if (key === 'home') seek(0);
        else if (key === 'end') seek(el.duration);
        else if (/^[0-9]$/.test(key)) seek(el.duration * Number(key) / 10);
        else if (key === 'arrowup' || key === 'arrowdown') {
          el.volume = Math.max(0, Math.min(1, el.volume + (key === 'arrowup' ? .05 : -.05)));
          if (key === 'arrowup') el.muted = false;
          setVolume(el.volume); setMuted(el.muted);
        } else if (key === 'm') { el.muted = !el.muted; setMuted(el.muted); }
        else if (key === 'f') void fullscreen();
        else if (el.paused) seek(el.currentTime + (key === '.' ? 1 / 30 : -1 / 30));
      }}>
      <div className="fp-video-stage">
        <video
          ref={element => { video.current = element; if (typeof videoRef === 'function') videoRef(element); else if (videoRef) videoRef.current = element; }}
          src={resolved || undefined}
          poster={poster}
          playsInline
          preload="metadata"
          onClick={() => { host.current?.focus({ preventScroll: true }); toggle(); }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={(e) => { setDuration(e.currentTarget.duration); e.currentTarget.currentTime = Math.max(0, Math.min(startAt, e.currentTarget.duration || startAt)); }}
          onError={() => { if (resolved) reportError('视频暂时无法播放，请重试'); }}
          onSeeked={e => onSeek?.(e.currentTarget.currentTime)}
          onRateChange={e => { setRate(e.currentTarget.playbackRate); onPlaybackRateChange?.(e.currentTarget.playbackRate); }}
          onVolumeChange={e => { setVolume(e.currentTarget.volume); setMuted(e.currentTarget.muted); }}
          onTimeUpdate={(e) => {
            setTime(e.currentTarget.currentTime);
            onTimeUpdate?.(e.currentTarget.currentTime);
          }}
          onEnded={() => {
            setPlaying(false);
            onEnded?.();
          }}
          aria-label={title || "视频"}
        >{tracks.map(track => <track key={track.src} kind="subtitles" src={track.src} srcLang={track.language} label={track.label} default={track.default} />)}</video>
        {error && <div className="fp-video-error" role="alert"><span>{error}</span><button type="button" onClick={() => { if (!resolveSource) video.current?.load(); retry(n => n + 1); }}>重新加载</button></div>}
        {!error && !resolved && <div className="fp-video-error" role="status">正在准备视频…</div>}
        {!playing && !error && resolved && (
          <button
            type="button"
            className="fp-video-bigplay"
            aria-label="播放"
            onClick={() => { host.current?.focus({ preventScroll: true }); toggle(); }}
          >
            <Play size={26} fill="currentColor" />
          </button>
        )}
      </div>
      <div className="fp-video-controls">
        <SelectField label="播放速度" value={String(rate)} onChange={value=>{if(video.current)video.current.playbackRate=Number(value);}} options={[.5,.75,1,1.25,1.5,2].map(speed=>({value:String(speed),label:`${speed}×`}))} />
        <button
          type="button"
          aria-label={playing ? "暂停" : "播放"}
          title="播放／暂停（空格或 K）"
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
          title="静音（M）"
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
          title="全屏（F）"
          onClick={() => void fullscreen()}
        >
          <Maximize size={16} />
        </button>
      </div>
    </div>
  );
}
