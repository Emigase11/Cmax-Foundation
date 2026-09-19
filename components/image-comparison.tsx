"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { imgSrc, type Figure } from "@/lib/labels";

/** Shared by both plates: they are registered 2:1 frames of the same width. */
const PLATE_SIZES =
  "(min-width: 1320px) 1240px, (min-width: 1024px) calc(100vw - 80px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)";

const REST = 50;

function DragIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 7 4.5 12 9 17M15 7l4.5 5-4.5 5" />
    </svg>
  );
}

export function ImageComparison({
  before,
  after,
}: {
  before: Figure;
  after: Figure;
}) {
  const [position, setPosition] = useState(REST);
  const stage = useRef<HTMLDivElement>(null);
  const hinted = useRef(false);
  const id = useId();
  const first = imgSrc(before.image);
  const second = imgSrc(after.image);

  /**
   * A still comparison does not announce that it can be dragged. The first time
   * it scrolls into view the divider sweeps once and settles back, which reads
   * as an invitation without becoming decoration that repeats.
   */
  useEffect(() => {
    const node = stage.current;
    if (!node || hinted.current) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        hinted.current = true;
        timer = setTimeout(() => {
          const start = performance.now();
          const duration = 1500;
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // Out and back, eased, so it ends exactly where it started.
            const sweep = Math.sin(t * Math.PI);
            const eased = 1 - (1 - sweep) ** 2;
            setPosition(REST + eased * 22);
            if (t < 1) frame = requestAnimationFrame(step);
            else setPosition(REST);
          };
          frame = requestAnimationFrame(step);
        }, 450);
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);

  if (!first || !second) return null;

  /** Once dragged past a side, that side's label steps back. */
  const dimFolded = position < 18;
  const dimUnfolded = position > 82;

  return (
    <figure className="comparison">
      <div
        className="comparison-stage"
        ref={stage}
        style={{ "--pos": `${position}%` } as React.CSSProperties}
      >
        <Image
          src={second}
          alt={after.alt}
          fill
          sizes={PLATE_SIZES}
          quality={90}
          className="object-contain"
        />
        <div
          className="comparison-layer"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={first}
            alt={before.alt}
            fill
            sizes={PLATE_SIZES}
            quality={90}
            className="object-contain"
          />
        </div>
        <div className="comparison-divider" aria-hidden="true" />
        {/* The handle is a sibling of the line so it can stay clear of the
            stage edges when the divider is pushed all the way over. */}
        <div className="comparison-handle" aria-hidden="true">
          <DragIcon />
        </div>
        <input
          id={id}
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={position}
          onChange={(event) => {
            hinted.current = true;
            setPosition(Number(event.target.value));
          }}
          aria-label="Compare the folded and unfolded Cmax Med unit"
          aria-valuetext={`${Math.round(position)}% folded, ${Math.round(100 - position)}% unfolded`}
        />
        <span className="comparison-label left" data-dim={String(dimFolded)}>
          Folded
        </span>
        <span className="comparison-label right" data-dim={String(dimUnfolded)}>
          Unfolded
        </span>
      </div>
      <figcaption>
        <label htmlFor={id}>Drag to explore · or use the arrow keys</label>
        <span>
          {before.credit} · {before.caption} / {after.caption}
          {before.illustrative || after.illustrative
            ? " · Illustrative render"
            : ""}
        </span>
      </figcaption>
    </figure>
  );
}
