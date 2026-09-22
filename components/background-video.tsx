"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A silent, looping backdrop for a heading.
 *
 * The site's rule is that videos play on demand. A decorative backdrop is the
 * documented exception: it carries no information, so nothing is lost by never
 * playing it. That is what makes the reduced-motion path honest rather than a
 * degraded experience, and why the poster frame is the real content here.
 *
 * Playback only ever starts when the viewer has not asked for less motion and
 * the section is actually on screen; scrolling away pauses it.
 */
export function BackgroundVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAllowed(!motion.matches);
    apply();
    motion.addEventListener("change", apply);
    return () => motion.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = video.current;
    if (!node || !allowed) return;
    if (!("IntersectionObserver" in window)) {
      void node.play().catch(() => {});
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // A backdrop nobody can see is bandwidth and battery spent on nothing.
          if (entry.isIntersecting) void node.play().catch(() => {});
          else node.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [allowed]);

  return (
    <video
      ref={video}
      className={className}
      poster={poster}
      // Never start on the server or before the motion preference is known:
      // the poster stands in until playback is both allowed and in view.
      preload={allowed ? "auto" : "none"}
      muted
      loop
      playsInline
      // Decorative by definition. Naming it to assistive technology would
      // announce a video that carries nothing worth announcing.
      aria-hidden="true"
      tabIndex={-1}
    >
      {allowed && <source src={src} type="video/mp4" />}
    </video>
  );
}
