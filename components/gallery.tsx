"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { imgSrc, type Figure } from "@/lib/labels";

export function Gallery({
  figures,
  sizes = "(min-width: 1320px) 604px, (min-width: 640px) calc((100vw - 80px) / 2), calc(100vw - 32px)",
}: {
  figures: readonly Figure[];
  sizes?: string;
}) {
  const images = figures.filter((f) => imgSrc(f.image));
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState(0);
  const current = images[index];
  if (!current) return null;
  const step = (offset: number) =>
    setIndex((i) => (i + offset + images.length) % images.length);
  return (
    <>
      <div className="gallery-grid">
        {images.map((figure, i) => (
          <figure key={`${figure.image}-${i}`}>
            <button
              type="button"
              className="gallery-thumb"
              aria-label={`Open photograph ${i + 1}: ${figure.alt || figure.caption}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                opener.current = event.currentTarget;
                setIndex(i);
                dialog.current?.showModal();
              }}
            >
              <Image
                src={imgSrc(figure.image)!}
                alt={figure.alt}
                fill
                sizes={sizes}
                quality={90}
                className="object-contain"
              />
              <span aria-hidden="true">↗</span>
            </button>
            <figcaption>
              {figure.caption}
              {figure.credit && ` · ${figure.credit}`}
              {figure.illustrative && <strong> · Illustrative render</strong>}
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label="Photograph viewer"
        onClose={() => opener.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
        }}
      >
        <div className="gallery-toolbar">
          <span>
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            Close ×
          </button>
        </div>
        <div className="gallery-full">
          <Image
            src={imgSrc(current.image)!}
            alt={current.alt}
            fill
            quality={90}
            sizes="90vw"
            className="object-contain"
          />
        </div>
        <div className="gallery-bottom">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={images.length === 1}
            aria-label="Previous photograph"
          >
            ←
          </button>
          <p aria-live="polite">
            {current.caption} · {current.credit}
            {current.illustrative && " · Illustrative render"}
          </p>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={images.length === 1}
            aria-label="Next photograph"
          >
            →
          </button>
        </div>
      </dialog>
    </>
  );
}
