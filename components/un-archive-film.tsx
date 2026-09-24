"use client";

import { useEffect, useRef, useState } from "react";

const timestamp = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

export function UNArchiveFilm() {
  const film = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const video = film.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (motion.matches || document.hidden || pausedByUser.current)
        video.pause();
      else void video.play().catch(() => {});
    };
    const onFullscreen = () =>
      setFullscreen(document.fullscreenElement === frame.current);
    sync();
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      video.pause();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, []);

  const toggle = () => {
    const video = film.current;
    if (!video) return;
    pausedByUser.current = !video.paused;
    if (video.paused)
      void video
        .play()
        .catch(() => setNotice("Playback could not start. Please try again."));
    else video.pause();
  };

  return (
    <section className="un-cinema" aria-labelledby="un-film-title">
      <div className="un-cinema-heading">
        <p className="eyebrow">CMAX / Motion archive</p>
        <span>Beyond the photograph</span>
      </div>
      <div ref={frame} className="un-cinema-frame" data-playing={playing}>
        <video
          ref={film}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/content/stories/un-background-poster.webp"
          aria-label="CMAX Foundation global advocacy archive film"
          onPlay={() => {
            setPlaying(true);
            setNotice("");
          }}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={(event) =>
            setDuration(
              Number.isFinite(event.currentTarget.duration)
                ? event.currentTarget.duration
                : 0,
            )
          }
          onTimeUpdate={(event) => {
            setTime(event.currentTarget.currentTime);
            if (Number.isFinite(event.currentTarget.duration))
              setDuration(event.currentTarget.duration);
          }}
          onError={() =>
            setNotice(
              "The film could not load. Please reload the page to try again.",
            )
          }
        >
          <source src="/video/un-background.mp4" type="video/mp4" />
        </video>
        <div className="un-cinema-overlay" aria-hidden="true" />
        <div className="un-cinema-topline">
          <span className="un-cinema-status">
            <span className="un-cinema-bars" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            {playing ? "In motion" : "Paused"}
          </span>
          <span>CMAX Foundation · United Nations</span>
        </div>
        <div className="un-cinema-caption">
          <span className="eyebrow">Local experience. Global dialogue.</span>
          <h2 id="un-film-title">
            A seat at <em>the table.</em>
          </h2>
        </div>
        <div className="un-cinema-controls">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause archive film" : "Play archive film"}
          >
            <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
            <span>{playing ? "Pause" : "Play"}</span>
          </button>
          <span className="un-cinema-time" aria-hidden="true">
            {timestamp(time)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={Math.min(time, duration || 1)}
            disabled={!duration}
            aria-label="Film position"
            aria-valuetext={`${timestamp(time)} of ${timestamp(duration)}`}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (film.current) film.current.currentTime = next;
              setTime(next);
            }}
          />
          <span className="un-cinema-time" aria-hidden="true">
            {timestamp(duration)}
          </span>
          <button
            type="button"
            aria-label={fullscreen ? "Exit fullscreen" : "View film fullscreen"}
            onClick={async () => {
              try {
                if (document.fullscreenElement) await document.exitFullscreen();
                else if (frame.current?.requestFullscreen)
                  await frame.current.requestFullscreen();
                else setNotice("Fullscreen is not available in this browser.");
              } catch {
                setNotice("Fullscreen is not available in this browser.");
              }
            }}
          >
            <span aria-hidden="true">{fullscreen ? "↙" : "↗"}</span>
            <span className="un-cinema-expand-label">
              {fullscreen ? "Close" : "Expand"}
            </span>
          </button>
        </div>
      </div>
      <div className="un-cinema-footer">
        <p>Humanitarian innovation, in conversation.</p>
        <span>Film archive / Continuous loop</span>
      </div>
      <p className="un-cinema-notice" role="status">
        {notice}
      </p>
    </section>
  );
}
