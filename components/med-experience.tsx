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

const heroExterior = {
  src: "/images/content/cmax-med/exterior-cutout.png",
  width: 1559,
  height: 1009,
  alt: "Cmax Med unit with white walls, an orange entrance and triangular windows, isolated from its background.",
  caption: "Care, closer to where it is needed.",
  kind: "Exterior view",
};

export function MedHeroStage() {
  const [inside, setInside] = useState(false);
  return (
    <div className="med-hero-stage" data-view={inside ? "interior" : "exterior"}>
      <div className="med-stage-orbit" aria-hidden="true" />
      <div className="med-stage-topline">
        <span>ONE UNIT. HUMAN POSSIBILITIES.</span>
        <div className="med-view-switch" role="group" aria-label="Choose a unit view">
          <button type="button" aria-pressed={!inside} onClick={() => setInside(false)}>Exterior</button>
          <button type="button" aria-pressed={inside} onClick={() => setInside(true)}>Interior</button>
        </div>
      </div>
      <div className="med-stage-product">
        <MedPhoto photo={inside ? medImages.cutaway : heroExterior} priority sizes="(min-width: 1024px) 840px, 90vw" />
      </div>
      <div className="med-stage-caption" aria-live="polite">
        <span>{inside ? "02 / Inside the unit · Illustrative concept" : "01 / Meet the unit"}</span>
        <p>{inside ? "A closer look at the space for care." : "A place for care. A possibility for communities."}</p>
        <span className="med-stage-instruction">Select the image to explore in full ↗</span>
      </div>
      <div className="med-stage-principles">
        <span><b>01</b> Foldable</span><span><b>02</b> Adaptable</span><span><b>03</b> Relocatable</span>
      </div>
    </div>
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
  return (
    <div className="med-editorial">
      {scenarios.map((scenario, index) => (
        <article className="med-editorial-row" key={scenario.label}>
          <MedPhoto
            photo={scenario.photo}
            sizes="(min-width: 1320px) 584px, (min-width: 768px) 45vw, calc(100vw - 32px)"
          />
          <div className="med-editorial-copy">
            <span className="med-editorial-number">{String(index + 1).padStart(2, "0")}</span>
            <p className="med-eyebrow">{scenario.label}</p>
            <h3>{scenario.title}</h3>
            <p>{scenario.text}</p>
            <span className="med-editorial-kind">{scenario.photo.kind}</span>
          </div>
        </article>
      ))}
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
