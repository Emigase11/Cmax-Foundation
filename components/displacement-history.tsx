"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import type { DisplacementData, DisplacementPoint } from "@/lib/labels";

const millions = (value: number) => (value / 1_000_000).toFixed(1);
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
      node.textContent = millions(value);
    };
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 650);
      current.current = from + (value - from) * (1 - (1 - progress) ** 3);
      node.textContent = millions(current.current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const preferenceChanged = () => { if (motion.matches) finish(); };
    if (motion.matches || from === value) finish();
    else { node.textContent = millions(from); frame = requestAnimationFrame(tick); }
    motion.addEventListener("change", preferenceChanged);
    return () => { cancelAnimationFrame(frame); motion.removeEventListener("change", preferenceChanged); };
  }, [value]);
  return <span ref={element} aria-hidden="true">{millions(value)}</span>;
}

function History({ points }: { points: DisplacementPoint[] }) {
  const id = useId();
  const [year, setYear] = useState(points[points.length - 1].year);
  const [previewYear, setPreviewYear] = useState<number | null>(null);
  const selectedIndex = points.findIndex(point => point.year === year);
  const selected = points[selectedIndex];
  const preview = points.find(point => point.year === previewYear) ?? selected;
  const previous = points[selectedIndex - 1];
  const change = previous ? (selected.value - previous.value) / previous.value * 100 : null;
  const first = points[0].year;
  const last = points[points.length - 1].year;
  const ceiling = Math.ceil(Math.max(...points.map(point => point.value)) / 40_000_000) * 40_000_000;
  const x = (year: number) => 48 + (year - first) / Math.max(1, last - first) * 520;
  const y = (value: number) => 236 - value / ceiling * 194;
  const path = points.map((point, i) => `${i ? "L" : "M"}${x(point.year)},${y(point.value)}`).join(" ");
  const choose = (nextYear: number) => { setYear(nextYear); setPreviewYear(null); };
  const pointerYear = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const index = Math.round(((event.clientX - rect.left) / rect.width * 600 - 48) / 520 * (points.length - 1));
    return points[Math.max(0, Math.min(points.length - 1, index))].year;
  };
  return <>
    <div className="scale-heading">
      <h2>Displacement,<br /><em>in perspective.</em></h2>
      <p>A decade of change.<br />Millions of lives behind the curve.</p>
    </div>
    <div className="scale-panel">
      <div className="scale-metric">
        <div className="scale-year-control">
          <label htmlFor={`${id}-year`}>Reference year</label>
          <select id={`${id}-year`} value={year} onChange={event => choose(Number(event.target.value))}>
            {[...points].reverse().map(point => <option key={point.year} value={point.year}>{point.year}</option>)}
          </select>
        </div>
        <p className="scale-number"><TransitionNumber value={selected.value} /><span>million people</span></p>
        <p className="scale-series-label">Displaced · UNHCR population series</p>
        <div className="scale-change">
          {change !== null ? <><span className={change < 0 ? "scale-decrease" : "scale-increase"}>{change < 0 ? "↓" : change > 0 ? "↑" : "–"} {Math.abs(change).toFixed(1)}%</span><span>vs. {previous.year}</span></> : <span>Starting year of this series</span>}
        </div>
        <a className="scale-source" href={source(year)}>UNHCR · End of {year}<span>{format(selected.value)} people ↗</span></a>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">UNHCR population series, end of {year}: {format(selected.value)} people.{change !== null ? ` ${Math.abs(change).toFixed(1)} percent ${change < 0 ? "lower" : "higher"} than ${previous.year}.` : ""}</p>
      </div>
      <div className="scale-chart-panel">
        <div className="scale-chart-heading"><p>Annual trend <span>{first}–{last}</span></p><span>People, in millions</span></div>
        <figure className="scale-chart">
          <figcaption className="scale-readout"><span>UNHCR · {preview.year}</span><strong>{format(preview.value)}</strong></figcaption>
          <svg viewBox="0 0 600 275" role="img" aria-labelledby={`${id}-title ${id}-desc`}
            onPointerMove={event => { if (event.pointerType !== "touch") setPreviewYear(pointerYear(event)); }}
            onPointerLeave={() => setPreviewYear(null)}
            onPointerDown={event => choose(pointerYear(event))}>
            <title id={`${id}-title`}>UNHCR population series, {first} to {last}</title>
            <desc id={`${id}-desc`}>Explore years with the selector or timeline slider. Exact values and sources are in the table below.</desc>
            <defs><linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d66a32" stopOpacity=".23" /><stop offset="100%" stopColor="#d66a32" stopOpacity=".015" /></linearGradient></defs>
            {[0, ceiling / 3, ceiling * 2 / 3, ceiling].map(value => <g key={value}><line x1="48" x2="568" y1={y(value)} y2={y(value)} className="scale-grid" /><text x="36" y={y(value) + 4} textAnchor="end">{Math.round(value / 1_000_000)}</text></g>)}
            <path d={`${path} L${x(last)},236 L48,236 Z`} fill={`url(#${id}-fill)`} />
            <path d={path} fill="none" className="scale-line" />
            <line x1={x(preview.year)} x2={x(preview.year)} y1="30" y2="236" className="scale-crosshair" />
            {points.map(point => <circle key={point.year} cx={x(point.year)} cy={y(point.value)} r="3" className="scale-dot" />)}
            <circle cx={x(preview.year)} cy={y(preview.value)} r="12" className="scale-point-halo" />
            <circle cx={x(preview.year)} cy={y(preview.value)} r="5" className="scale-point" />
            {[...new Set([first, Math.round((first + last) / 2), last])].map(year => <text key={year} x={x(year)} y="265" textAnchor="middle">{year}</text>)}
          </svg>
        </figure>
        <div className="scale-timeline">
          <label htmlFor={`${id}-timeline`}>Explore the years <span>Drag or use arrow keys</span></label>
          <input id={`${id}-timeline`} type="range" min={first} max={last} step="1" value={year}
            onChange={event => choose(Number(event.target.value))}
            aria-valuetext={`UNHCR, ${year}: ${format(selected.value)} people`} />
          <div aria-hidden="true"><span>{first}</span><span>{year}</span><span>{last}</span></div>
        </div>
      </div>
    </div>
    <div className="scale-bottom"><p>Annual figures, not a live count. This series differs from UNHCR’s global estimate.</p><a href="https://www.unhcr.org/refugee-statistics/">Source: UNHCR ↗</a></div>
    <details className="scale-details">
      <summary>Methodology &amp; data table</summary>
      <p>The six categories behind UNHCR’s published headline: refugees under UNHCR’s mandate, asylum-seekers, internally displaced people, other people in need of international protection, other groups of concern, and Palestine refugees under UNRWA’s mandate, which UNHCR reports as a separate series. Stateless people are excluded, because statelessness is a legal status rather than displacement and those who have been displaced are already counted. Internal displacement covers UNHCR operations. Historical figures may be revised. Data is fetched on the server and refreshed daily.</p>
      <div className="scale-table-wrap"><table>
        <caption>UNHCR population series · Year-end figures</caption>
        <thead><tr><th scope="col">Year</th><th scope="col">People</th><th scope="col">Source</th></tr></thead>
        <tbody>{[...points].reverse().map(point => <tr key={point.year}><th scope="row">{point.year}</th><td>{format(point.value)}</td><td><a href={source(point.year)}>UNHCR · {point.year}</a></td></tr>)}</tbody>
      </table></div>
    </details>
    <noscript><p>Interactive controls require JavaScript. All years and exact figures are available in the data table above.</p></noscript>
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
