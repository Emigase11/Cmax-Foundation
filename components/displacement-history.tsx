"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import type { DisplacementData, DisplacementPoint } from "@/lib/labels";

const format = (value: number) => Math.round(value).toLocaleString("en-US");
const source = (year: number) => `https://api.unhcr.org/population/v1/population/?limit=1&yearFrom=${year}&yearTo=${year}`;

function TransitionNumber({ value }: { value: number }) {
  const element = useRef<HTMLSpanElement>(null);
  const current = useRef(value);
  useLayoutEffect(() => {
    const node = element.current;
    if (!node) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const from = current.current;
    const start = performance.now();
    const finish = () => {
      cancelAnimationFrame(frame);
      current.current = value;
      node.textContent = format(value);
    };
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 650);
      current.current = from + (value - from) * (1 - (1 - progress) ** 3);
      node.textContent = format(current.current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const preferenceChanged = () => { if (motion.matches) finish(); };
    if (motion.matches || from === value) finish();
    else { node.textContent = format(from); frame = requestAnimationFrame(tick); }
    motion.addEventListener("change", preferenceChanged);
    return () => { cancelAnimationFrame(frame); motion.removeEventListener("change", preferenceChanged); };
  }, [value]);
  return <span ref={element} aria-hidden="true">{format(value)}</span>;
}

function History({ points }: { points: DisplacementPoint[] }) {
  const id = useId();
  const [year, setYear] = useState(points[points.length - 1].year);
  const selected = points.find(point => point.year === year)!;
  const chart = points.filter(point => point.year >= 2015);
  const first = chart[0].year;
  const last = chart[chart.length - 1].year;
  const ceiling = Math.ceil(Math.max(...chart.map(point => point.value)) / 20_000_000) * 20_000_000;
  const x = (year: number) => 65 + (year - first) / Math.max(1, last - first) * 700;
  const y = (value: number) => 220 - value / ceiling * 190;
  const path = chart.map((point, i) => `${i ? "L" : "M"}${x(point.year)},${y(point.value)}`).join(" ");
  return <>
    <div className="history-toolbar">
      <h2>People displaced. A history of growing need.</h2>
      <div className="history-select">
        <label htmlFor={`${id}-year`}>Reference year</label>
        <select id={`${id}-year`} value={year} onChange={event => setYear(Number(event.target.value))} aria-describedby={`${id}-method`}>
          {[...points].reverse().map(point => <option key={point.year} value={point.year}>{point.year}</option>)}
        </select>
      </div>
    </div>
    <p className="history-number"><TransitionNumber value={selected.value} /></p>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">UNHCR population series, end of {year}: {format(selected.value)} people.</p>
    <p className="source-line"><a href={source(year)}>UNHCR · End of {year} · {format(selected.value)} people</a><span>Annual data · refreshed daily, not a live count.</span></p>
    <figure className="history-chart">
      <figcaption>UNHCR population series · {first}–{last}</figcaption>
      <svg viewBox="0 0 800 260" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>People displaced, UNHCR population series, {first} to {last}</title>
        <desc id={`${id}-desc`}>Annual counts in millions. Exact values and sources for every year are in the table below.</desc>
        {[0, ceiling / 2, ceiling].map(value => <g key={value}><line x1="65" x2="765" y1={y(value)} y2={y(value)} className="history-grid" /><text x="54" y={y(value) + 4} textAnchor="end">{value / 1_000_000}m</text></g>)}
        <path d={path} fill="none" className="history-line" />
        {chart.map(point => <circle key={point.year} cx={x(point.year)} cy={y(point.value)} r={point.year === year ? 7 : 3} className={point.year === year ? "history-point selected" : "history-point"} />)}
        {[...new Set([first, Math.round((first + last) / 2), last])].map(year => <text key={year} x={x(year)} y="249" textAnchor="middle">{year}</text>)}
      </svg>
    </figure>
    <p className="history-method" id={`${id}-method`}>Sum of refugees, asylum-seekers, internally displaced people and other people in need of international protection in UNHCR’s population API. Stateless people and “others of concern” are excluded. This series covers UNHCR-reported internal displacement and excludes UNRWA refugees; it differs from the separately published global estimate. Historical figures may be revised.</p>
    <noscript><p>Choose a year from the table below. The interactive selector requires JavaScript.</p></noscript>
    <details className="history-table">
      <summary>View all years and exact figures ({points[0].year}–{last})</summary>
      <table>
        <caption>UNHCR population series · Year-end figures</caption>
        <thead><tr><th scope="col">Year</th><th scope="col">People</th><th scope="col">Source</th></tr></thead>
        <tbody>{[...points].reverse().map(point => <tr key={point.year}><th scope="row">{point.year}</th><td>{format(point.value)}</td><td><a href={source(point.year)}>UNHCR · {point.year}</a></td></tr>)}</tbody>
      </table>
    </details>
  </>;
}

export function DisplacementHistory({ data }: { data: DisplacementData }) {
  if (data.mode === "api") return <History points={data.points} />;
  if (data.mode === "saved") return <>
    <h2>People forcibly displaced worldwide.</h2>
    <p className="history-number">{format(data.point.value)}</p>
    <p className="source-line"><a href={data.source}>UNHCR · End of {data.point.year}</a></p>
    <p className="history-method">Saved editorial value, not live data. The historical API series is currently unavailable. This is the separately published global estimate; it is not a point in the historical series.</p>
  </>;
  return <><h2>Every displaced person deserves a safe beginning.</h2><p>Historical data unavailable. A verified reference figure is pending.</p><a href="https://www.unhcr.org/refugee-statistics/">Explore UNHCR data</a></>;
}
