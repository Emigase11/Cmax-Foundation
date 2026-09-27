"use client";
import { useId, useState } from "react";

export function AboutHistory({ milestones }: { milestones: readonly { year: string; text: string }[] }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  if (!milestones.length) return null;
  return <div>
    <div className="about-years" role="group" aria-label="Explore history by year">
      {milestones.map((item, index) => <button key={item.year} type="button" aria-pressed={index === selected} aria-controls={id} onClick={() => setSelected(index)}>{item.year}</button>)}
    </div>
    <div className="about-history-story" id={id} aria-live="polite">
      <span className="about-history-year" aria-hidden="true">{milestones[selected].year}</span>
      <div><p className="about-kicker">Milestone / {milestones[selected].year}</p><h3>{milestones[selected].text}</h3>
        <div className="about-history-controls"><span>{String(selected + 1).padStart(2, "0")} / {String(milestones.length).padStart(2, "0")}</span>
          <button type="button" aria-label="Previous milestone" disabled={selected === 0} onClick={() => setSelected(selected - 1)}>←</button>
          <button type="button" aria-label="Next milestone" disabled={selected === milestones.length - 1} onClick={() => setSelected(selected + 1)}>→</button>
        </div>
      </div>
    </div>
  </div>;
}
