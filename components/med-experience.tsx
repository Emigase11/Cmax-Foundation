"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { medImages, type MedImage } from "@/lib/cmax-med";

export function MedPhoto({
  photo,
  priority = false,
  sizes = "(min-width: 1320px) 1240px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 32px)",
}: {
  photo: MedImage;
  priority?: boolean;
  sizes?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  return (
    <figure className="med-photo">
      <button
        ref={opener}
        type="button"
        className="med-photo-open"
        aria-label={`Enlarge image: ${photo.caption}`}
        aria-haspopup="dialog"
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
        <span className="med-photo-zoom" aria-hidden="true">
          ↗
        </span>
      </button>
      <figcaption>
        <span>{photo.caption}</span>
        <span>{photo.kind}</span>
      </figcaption>
      <dialog
        ref={dialog}
        className="med-lightbox"
        aria-label={photo.caption}
        onClose={() => opener.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="med-lightbox-toolbar">
          <span>{photo.kind}</span>
          <button
            type="button"
            autoFocus
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
          className="med-lightbox-image"
        />
        <p>{photo.caption}</p>
      </dialog>
    </figure>
  );
}

const features = [
  {
    title: "A considered entrance",
    text: "An entrance ramp is shown in this layout. Access and positioning are planned with the receiving institution.",
    x: 31,
    y: 71,
  },
  {
    title: "Space for privacy",
    text: "Curtains divide the illustrated bed spaces. The interior arrangement can adapt to the intended use.",
    x: 70,
    y: 51,
  },
  {
    title: "A defined working surface",
    text: "A rigid, elevated floor provides a washable surface for the team’s working space.",
    x: 56,
    y: 81,
  },
];

export function MedInterior() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  return (
    <div className="med-interior-explorer">
      <div className="med-cutaway">
        <Image
          src={medImages.cutaway.src}
          alt={medImages.cutaway.alt}
          width={medImages.cutaway.width}
          height={medImages.cutaway.height}
          sizes="(min-width: 1320px) 820px, (min-width: 900px) 65vw, calc(100vw - 32px)"
        />
        {features.map((feature, index) => (
          <button
            key={feature.title}
            type="button"
            className="med-hotspot"
            style={{ left: `${feature.x}%`, top: `${feature.y}%` }}
            aria-label={`Explore ${feature.title.toLowerCase()}`}
            aria-pressed={selected === index}
            aria-controls={id}
            onClick={() => setSelected(index)}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
        <span className="med-cutaway-label">Illustrative interior layout</span>
      </div>
      <div className="med-feature-panel">
        <p className="med-eyebrow">Explore the details</p>
        <div className="med-feature-list">
          {features.map((feature, index) => (
            <button
              type="button"
              key={feature.title}
              aria-pressed={selected === index}
              aria-controls={id}
              onClick={() => setSelected(index)}
            >
              <span>0{index + 1}</span>
              {feature.title}
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div id={id} className="med-feature-copy" aria-live="polite">
          <span aria-hidden="true" className="med-feature-number">
            0{selected + 1}
          </span>
          <h3>{features[selected].title}</h3>
          <p>{features[selected].text}</p>
        </div>
      </div>
    </div>
  );
}

const scenarios = [
  {
    label: "Hospital support",
    title: "When the hospital needs more room.",
    text: "A proposed space for triage, isolation or patient reception alongside existing infrastructure.",
    photo: medImages.hospital,
  },
  {
    label: "Inside the unit",
    title: "See the space teams work in.",
    text: "An illustrative view of a medical layout, with beds and space for the care team.",
    photo: medImages.field,
  },
  {
    label: "Field hospital",
    title: "One unit. A wider possibility.",
    text: "Explore an illustrative arrangement of multiple units. Layout and clinical use are defined with the receiving institution.",
    photo: medImages.modular,
  },
  {
    label: "At camp scale",
    title: "Part of a coordinated response.",
    text: "An illustrative camp setting, placing medical spaces within a wider network of access, logistics and support.",
    photo: medImages.camp,
  },
];

export function MedScenarios() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const current = scenarios[selected];
  return (
    <div className="med-scenarios">
      <div
        role="tablist"
        aria-label="Explore Cmax Med settings"
        className="med-tabs"
      >
        {scenarios.map((scenario, index) => (
          <button
            type="button"
            role="tab"
            key={scenario.label}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            id={`${id}-tab-${index}`}
            aria-selected={selected === index}
            aria-controls={`${id}-panel`}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight")
                next = (index + 1) % scenarios.length;
              else if (event.key === "ArrowLeft")
                next = (index - 1 + scenarios.length) % scenarios.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = scenarios.length - 1;
              else return;
              event.preventDefault();
              setSelected(next);
              buttons.current[next]?.focus();
            }}
          >
            <span>0{index + 1}</span>
            {scenario.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${selected}`}
        tabIndex={0}
        className={`med-scenario-panel ${selected === 2 ? "med-scenario-portrait" : ""}`}
      >
        <div className="med-scenario-copy">
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          <span className="med-eyebrow">{current.photo.kind}</span>
        </div>
        <MedPhoto
          key={current.photo.src}
          photo={current.photo}
          sizes={
            selected === 2
              ? "(min-width: 900px) 55vw, calc(100vw - 32px)"
              : undefined
          }
        />
      </div>
    </div>
  );
}

export function MedReadiness() {
  const [stage, setStage] = useState<"before" | "during">("before");
  return (
    <div className="med-readiness">
      <div
        className="med-stage-switch"
        role="group"
        aria-label="Explore the response sequence"
      >
        <button
          type="button"
          aria-pressed={stage === "before"}
          onClick={() => setStage("before")}
        >
          Before a crisis
        </button>
        <button
          type="button"
          aria-pressed={stage === "during"}
          onClick={() => setStage("during")}
        >
          During a response
        </button>
      </div>
      <div className="med-stage-content" aria-live="polite">
        <h3>
          {stage === "before"
            ? "Prepared before it is needed."
            : "More space, where it matters."}
        </h3>
        <p>
          {stage === "before"
            ? "Plan the location. Store the unit. Train the team. Readiness starts with an institution and a documented need."
            : "Coordinate delivery, configure the space and support the receiving team. The unit becomes part of a locally led response."}
        </p>
        <ol>
          {(stage === "before"
            ? ["Identify a need", "Plan the logistics", "Prepare the team"]
            : [
                "Coordinate delivery",
                "Configure the space",
                "Document the action",
              ]
          ).map((step, index) => (
            <li key={step}>
              <span>0{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
