"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { imgSrc, type Figure } from "@/lib/labels";

export function ImageComparison({
  before,
  after,
}: {
  before: Figure;
  after: Figure;
}) {
  const [position, setPosition] = useState(50);
  const id = useId();
  const first = imgSrc(before.image),
    second = imgSrc(after.image);
  if (!first || !second) return null;
  return (
    <figure className="comparison">
      <div className="comparison-stage">
        <Image
          src={second}
          alt={after.alt}
          fill
          sizes="(min-width: 1320px) 1240px, (min-width: 1024px) calc(100vw - 80px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
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
            sizes="(min-width: 1320px) 1240px, (min-width: 1024px) calc(100vw - 80px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
            quality={90}
            className="object-contain"
          />
        </div>
        <div
          className="comparison-divider"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <span>↔</span>
        </div>
        <input
          id={id}
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Compare folded and opened Cmax Med unit"
          aria-valuetext={`${position}% folded image, ${100 - position}% opened image`}
        />
        <span className="comparison-label left">Folded</span>
        <span className="comparison-label right">Opened</span>
      </div>
      <figcaption>
        <label htmlFor={id}>Drag to explore · or use the arrow keys</label>
        <span>
          {before.credit} · Assembly photographs
          {before.illustrative || after.illustrative
            ? " · Illustrative render"
            : ""}
        </span>
      </figcaption>
    </figure>
  );
}
