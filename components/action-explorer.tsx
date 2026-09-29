"use client";
import { useId, useState } from "react";
import { ActionRow, type ActionEntry } from "./records";

export function ActionExplorer({ actions }: { actions: ActionEntry[] }) {
  const [country, setCountry] = useState("");
  const id = useId();
  const countries = [...new Set(actions.map(action => action.entry.country).filter(Boolean))].sort();
  const visible = actions.filter(action => !country || action.entry.country === country);
  return <div>
    <div className="actions-filterbar">
      <fieldset><legend>Explore by country or region</legend><div className="actions-filters">
        {["", ...countries].map(value => <button key={value} type="button" aria-pressed={country === value} aria-controls={id} onClick={() => setCountry(value)}>{value || "All places"}</button>)}
      </div></fieldset>
      <p role="status">{visible.length} {visible.length === 1 ? "record" : "records"}{country ? ` in ${country}` : " in the archive"}</p>
    </div>
    <ul id={id} className="unified-record-list">{visible.map(action => <ActionRow key={action.slug} action={action} />)}</ul>
  </div>;
}
