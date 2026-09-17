"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { imgSrc, type Figure } from "@/lib/labels";

const COUNTRIES: Record<string, { name: string; lon: number; lat: number }> = {
  ARG: { name: "Argentina", lon: -64, lat: -35 },
  HTI: { name: "Haiti", lon: -72.3, lat: 19 },
  MEX: { name: "Mexico", lon: -102, lat: 23 },
  UKR: { name: "Ukraine", lon: 32, lat: 49 },
  USA: { name: "United States", lon: -99, lat: 39 },
  VEN: { name: "Venezuela", lon: -66, lat: 7 },
};
export type MapRecord = {
  slug: string;
  title: string;
  countries: readonly string[];
  status: string;
  hero: Figure;
};

export function FieldMap({ records }: { records: MapRecord[] }) {
  const countries = Object.entries(COUNTRIES).filter(([code]) =>
    records.some((record) => record.countries.includes(code)),
  );
  const [selected, setSelected] = useState(
    countries.find(([code]) =>
      records.some(
        (record) =>
          record.countries.includes(code) && imgSrc(record.hero.image),
      ),
    )?.[0] ??
      countries[0]?.[0] ??
      "",
  );
  const panel = useId();
  const active = records.filter((record) =>
    record.countries.includes(selected),
  );
  return (
    <div className="field-map">
      <div>
        <div
          className="map-surface"
          role="group"
          aria-label="Explore action records by country"
        >
          {/* Natural Earth, public domain. Equirectangular projection, excluding Antarctica. */}
          <Image
            src="/images/world-map.svg"
            alt=""
            fill
            unoptimized
            className="map-land"
          />
          {countries.map(([code, country]) => (
            <button
              key={code}
              type="button"
              className="map-pin"
              style={{
                left: `${(country.lon + 180) / 3.6}%`,
                top: `${(90 - country.lat) / 1.5}%`,
              }}
              aria-label={`Explore ${country.name}`}
              aria-pressed={selected === code}
              aria-controls={panel}
              onClick={() => setSelected(code)}
            >
              <span />
              <span className="map-pin-name">{country.name}</span>
            </button>
          ))}
        </div>
        <div className="map-country-list" aria-label="Countries">
          {countries.map(([code, country]) => (
            <button
              key={code}
              type="button"
              onClick={() => setSelected(code)}
              aria-pressed={selected === code}
              aria-controls={panel}
            >
              {country.name}
            </button>
          ))}
        </div>
        <p className="map-note">
          Explore the records behind each location. Status and attribution are
          shown in each record.
        </p>
      </div>
      <div
        id={panel}
        className="map-records"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="eyebrow">
          {COUNTRIES[selected]?.name ?? "Field records"}
        </p>
        {active.length ? (
          active.map((record) => (
            <article key={record.slug}>
              {imgSrc(record.hero.image) && (
                <div className="map-photo">
                  <Image
                    src={imgSrc(record.hero.image)!}
                    alt={record.hero.alt}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 360px, calc(100vw - 64px)"
                    className="object-contain"
                  />
                </div>
              )}
              {record.hero.illustrative && (
                <p className="eyebrow">Illustrative render</p>
              )}
              <h3>{record.title}</h3>
              <p className="strip">
                {record.status === "pending"
                  ? "Documentation in progress"
                  : record.status}
              </p>
              <Link href={`/our-actions/${record.slug}`} className="text-link">
                Read the record ↗
              </Link>
            </article>
          ))
        ) : (
          <p>Explore our actions and the people behind them.</p>
        )}
        <Link href="/our-actions" className="text-link">
          All actions ↗
        </Link>
      </div>
    </div>
  );
}
