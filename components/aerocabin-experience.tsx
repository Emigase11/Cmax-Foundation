"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { aeroImages, type AeroImage } from "@/lib/aerocabin";

export function AeroPhoto({
  photo,
  priority = false,
  sizes = "(min-width: 1320px) 1240px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 32px)",
}: {
  photo: AeroImage;
  priority?: boolean;
  sizes?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  return (
    <figure className="aero-photo">
      <button
        ref={opener}
        type="button"
        className="aero-photo-open"
        aria-haspopup="dialog"
        aria-label={`Enlarge image: ${photo.caption}`}
        onClick={() => dialog.current?.showModal()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          priority={priority}
        />
        <span aria-hidden="true" className="aero-photo-expand">
          ↗
        </span>
      </button>
      <figcaption>
        <span>{photo.caption}</span>
        <span>{photo.kind}</span>
      </figcaption>
      <dialog
        ref={dialog}
        className="aero-lightbox"
        aria-label={photo.caption}
        onClose={() => opener.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div>
          <span>{photo.kind}</span>
          <button
            autoFocus
            type="button"
            onClick={() => dialog.current?.close()}
          >
            Close ×
          </button>
        </div>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="94vw"
        />
        <p>{photo.caption}</p>
      </dialog>
    </figure>
  );
}

const details = [
  {
    title: "An open cabin",
    text: "The studio view reveals the cabin’s interior and its large openings. Explore the form before considering a proposed use.",
    x: 40,
    y: 52,
  },
  {
    title: "Inflatable construction",
    text: "A compact form that takes shape through inflation. The cutaway illustrates the panel construction.",
    x: 57,
    y: 33,
  },
  {
    title: "A recognizable form",
    text: "Turquoise surfaces and orange edges define the cabin, from the studio view to the photographs beside the lake.",
    x: 80,
    y: 57,
  },
];

export function AeroDetails() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  return (
    <div className="aero-details-grid">
      <div className="aero-studio">
        <Image
          src={aeroImages.studio.src}
          alt={aeroImages.studio.alt}
          width={aeroImages.studio.width}
          height={aeroImages.studio.height}
          sizes="(min-width: 1320px) 720px, (min-width: 900px) 58vw, calc(100vw - 32px)"
        />
        {details.map((item, index) => (
          <button
            type="button"
            key={item.title}
            className="aero-pin"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            aria-label={`Explore ${item.title.toLowerCase()}`}
            aria-pressed={selected === index}
            aria-controls={id}
            onClick={() => setSelected(index)}
          >
            0{index + 1}
          </button>
        ))}
        <span className="aero-studio-label">Product illustration</span>
      </div>
      <div className="aero-detail-copy">
        <p className="aero-kicker">Select a point. Take a closer look.</p>
        <div className="aero-detail-choices">
          {details.map((item, index) => (
            <button
              type="button"
              key={item.title}
              aria-pressed={selected === index}
              aria-controls={id}
              onClick={() => setSelected(index)}
            >
              <span>0{index + 1}</span>
              {item.title}
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div id={id} aria-live="polite" className="aero-detail-description">
          <span aria-hidden="true">0{selected + 1}</span>
          <h3>{details[selected].title}</h3>
          <p>{details[selected].text}</p>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    photo: aeroImages.unfold,
    title: "A compact starting point.",
    text: "The illustrated sequence begins with the cabin laid flat, showing its packed form.",
  },
  {
    photo: aeroImages.inflate,
    title: "A cabin takes shape.",
    text: "The second illustration shows the transition from a flat pack to an inflated enclosure.",
  },
  {
    photo: aeroImages.check,
    title: "Preparation includes checks.",
    text: "The final illustration shows a check of an opening. Operational preparation belongs with trained teams and the manufacturer’s documentation.",
  },
];

export function AeroSequence() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = steps[index];
  return (
    <div className="aero-sequence">
      <div
        className="aero-step-tabs"
        role="tablist"
        aria-label="Illustrated cabin sequence"
      >
        {steps.map((step, i) => (
          <button
            key={step.photo.caption}
            type="button"
            role="tab"
            id={`${id}-${i}`}
            aria-controls={`${id}-panel`}
            aria-selected={index === i}
            tabIndex={index === i ? 0 : -1}
            ref={(node) => {
              refs.current[i] = node;
            }}
            onClick={(event) => {
              setAnimate(event.detail > 0);
              setIndex(i);
            }}
            onKeyDown={(event) => {
              let next = i;
              if (event.key === "ArrowRight") next = (i + 1) % steps.length;
              else if (event.key === "ArrowLeft")
                next = (i - 1 + steps.length) % steps.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = steps.length - 1;
              else return;
              event.preventDefault();
              setAnimate(false);
              setIndex(next);
              refs.current[next]?.focus();
            }}
          >
            <span>0{i + 1}</span>
            {step.photo.caption}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${index}`}
        tabIndex={0}
        className="aero-step-panel"
      >
        <div className="aero-step-copy">
          <p className="aero-kicker">The form, in three moments</p>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          <div className="aero-step-controls">
            <span>{index + 1} / 3</span>
            <button
              type="button"
              disabled={index === 0}
              aria-label="Previous illustration"
              onClick={(event) => {
                setAnimate(event.detail > 0);
                setIndex(index - 1);
              }}
            >
              ←
            </button>
            <button
              type="button"
              disabled={index === 2}
              aria-label="Next illustration"
              onClick={(event) => {
                setAnimate(event.detail > 0);
                setIndex(index + 1);
              }}
            >
              →
            </button>
          </div>
        </div>
        <div className="aero-step-image">
          <Image
            key={index}
            data-animate={animate}
            src={current.photo.src}
            alt={current.photo.alt}
            width={current.photo.width}
            height={current.photo.height}
            sizes="360px"
          />
          <span>Illustrated overview · Not an operating procedure</span>
        </div>
      </div>
    </div>
  );
}

export function AeroPurpose() {
  const [stage, setStage] = useState<"during" | "after">("during");
  return (
    <div className="aero-purpose-card">
      <div
        role="group"
        aria-label="Explore proposed uses"
        className="aero-purpose-switch"
      >
        <button
          type="button"
          aria-pressed={stage === "during"}
          onClick={() => setStage("during")}
        >
          During evacuation
        </button>
        <button
          type="button"
          aria-pressed={stage === "after"}
          onClick={() => setStage("after")}
        >
          After reaching land
        </button>
      </div>
      <div aria-live="polite">
        <p className="aero-kicker">Proposed role / {stage}</p>
        <h3>
          {stage === "during"
            ? "Support the response team."
            : "Continue the protection."}
        </h3>
        <p>
          {stage === "during"
            ? "AeroCabin is proposed as a cabin towed behind a rescue boat, within an evacuation led by trained responders."
            : "Once on dry land, the proposal is for the same cabin to offer immediate temporary protection while further shelter is arranged."}
        </p>
      </div>
    </div>
  );
}
