import { useEffect, useRef, useState, type Ref } from "react";
import { SelectField } from "./SelectField";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
export interface AudioPlayerProps {
  audioRef?: Ref<HTMLAudioElement>;
  onSeek?: (seconds: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  src: string;
  title?: string;
  startAt?: number;
  onTimeUpdate?: (seconds: number) => void;
  onEnded?: () => void;
  resolveSource?: (src: string, signal: AbortSignal) => Promise<string>;
}
const clock = (value: number) =>
  `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
/** Audio controls share the workspace keyboard and theme conventions. */
export function AudioPlayer({
  src,
  title = "音频",
  startAt = 0,
  onTimeUpdate,
  onEnded,
  resolveSource, audioRef, onSeek, onPlaybackRateChange,
}: AudioPlayerProps) {
  const audio = useRef<HTMLAudioElement>(null),
    version = useRef(0), resume = useRef(startAt), sourceId = useRef(src);
  const [rate, setRate] = useState(1);
  const [source, setSource] = useState(resolveSource ? "" : src),
    [playing, setPlaying] = useState(false),
    [time, setTime] = useState(0),
    [duration, setDuration] = useState(0),
    [volume, setVolume] = useState(1),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController(),
      run = ++version.current;
    if (sourceId.current !== src) { sourceId.current = src; resume.current = startAt; }
    setError("");
    setPlaying(false);
    setTime(resume.current);
    setDuration(0);
    setSource("");
    Promise.resolve(resolveSource ? resolveSource(src, controller.signal) : src)
      .then((value) => {
        if (!controller.signal.aborted && run === version.current)
          setSource(value);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("音频暂时无法加载，请重试。");
      });
    return () => controller.abort();
  }, [src, resolveSource, attempt]);
  const seek = (value: number) => {
    if (audio.current) {
      const next = Math.max(0, Math.min(duration || 0, value));
      audio.current.currentTime = next;
      setTime(next); resume.current = next;
    }
  };
  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused)
      void el.play().catch(() => setError("暂时无法播放，请重试。"));
    else el.pause();
  };
  return (
    <section
      className="fp-audio-player"
      aria-label={title}
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.target as HTMLElement).closest("button,input")) return;
        if ([" ", "k", "ArrowLeft", "ArrowRight", "m"].includes(event.key)) {
          event.preventDefault();
          if (event.key === " " || event.key === "k") toggle();
          else if (event.key === "m") {
            const next = volume ? 0 : 1;
            setVolume(next);
            if (audio.current) audio.current.volume = next;
          } else seek(time + (event.key === "ArrowLeft" ? -5 : 5));
        }
      }}
    >
      <audio
        ref={value => { audio.current = value; if (typeof audioRef === "function") audioRef(value); else if (audioRef) audioRef.current = value; }}
        src={source || undefined}
        preload="metadata"
        onLoadedMetadata={() => {
          const el = audio.current!;
          setDuration(Number.isFinite(el.duration) ? el.duration : 0);
          el.currentTime = Math.max(0, Math.min(resume.current, el.duration || 0));
          el.playbackRate = rate;
          el.volume = volume;
        }}
        onSeeked={() => onSeek?.(audio.current!.currentTime)}
        onRateChange={() => { const value = audio.current!.playbackRate; setRate(value); onPlaybackRateChange?.(value); }}
        onTimeUpdate={() => {
          resume.current = audio.current!.currentTime; setTime(resume.current);
          onTimeUpdate?.(audio.current!.currentTime);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          onEnded?.();
        }}
        onError={() => {
          if (source) setError("音频暂时无法加载，请重试。");
        }}
      />
      <div className="fp-audio-heading">
        <strong>{title}</strong>
        <span>
          {clock(time)} / {clock(duration)}
        </span>
      </div>
      <div className="fp-audio-controls">
        <SelectField label="播放速度" value={String(rate)} options={[.5,.75,1,1.25,1.5,1.75,2].map(value => ({value:String(value),label:`${value}×`}))} onChange={value => { setRate(Number(value)); if (audio.current) audio.current.playbackRate = Number(value); }} />
        <button
          type="button"
          aria-label={playing ? "暂停" : "播放"}
          disabled={!source || !!error}
          onClick={toggle}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <input
          aria-label="播放进度"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(time, duration)}
          disabled={!duration}
          onChange={(e) => seek(Number(e.target.value))}
        />
        <button
          type="button"
          aria-label={volume ? "静音" : "恢复音量"}
          onClick={() => {
            const next = volume ? 0 : 1;
            setVolume(next);
            if (audio.current) audio.current.volume = next;
          }}
        >
          {volume ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
        <input
          aria-label="音量"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => {
            const next = Number(e.target.value);
            setVolume(next);
            if (audio.current) audio.current.volume = next;
          }}
        />
      </div>
      {error && (
        <p role="alert">
          {error}
          <button type="button" onClick={() => setAttempt((n) => n + 1)}>
            重试
          </button>
        </p>
      )}
    </section>
  );
}
