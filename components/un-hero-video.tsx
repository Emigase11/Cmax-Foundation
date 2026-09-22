"use client";

import { useEffect, useRef, useState } from "react";

export function UNHeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (motion.matches || document.hidden || manuallyPaused.current)
        video.pause();
      else void video.play().catch(() => {});
    };
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, []);

  return (
    <>
      <video
        ref={ref}
        className="un-story-film"
        muted
        loop
        playsInline
        preload="none"
        poster="/images/content/stories/un-background-poster.webp"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setFailed(true);
        }}
      >
        <source src="/video/un-background.mp4" type="video/mp4" />
      </video>
      {!failed && (
        <button
          type="button"
          className="un-film-toggle"
          aria-label={
            playing ? "Pause background video" : "Play background video"
          }
          onClick={() => {
            const video = ref.current;
            if (!video) return;
            manuallyPaused.current = !video.paused;
            if (video.paused) void video.play().catch(() => {});
            else video.pause();
          }}
        >
          <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
          {playing ? "Pause film" : "Play film"}
        </button>
      )}
    </>
  );
}
