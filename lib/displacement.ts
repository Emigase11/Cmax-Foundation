import { cache } from "react";
import type { DisplacementData, DisplacementPoint } from "./labels";

type DisplacementFallback = { value: number | null; year: number | null; source: string | null };
type Row = Record<string, unknown>;
const API = "https://api.unhcr.org/population/v1/population/";
/** Palestine refugees sit in their own series; UNHCR counts them in the headline. */
const UNRWA_API = "https://api.unhcr.org/population/v1/unrwa/";
const FIRST_YEAR = 2015;

function count(value: unknown): number {
  if (value === "-") return 0;
  const parsed = typeof value === "string" && /^\d+$/.test(value.trim()) ? Number(value) : value;
  if (typeof parsed !== "number" || !Number.isSafeInteger(parsed) || parsed < 0)
    throw new Error("Invalid UNHCR category");
  return parsed;
}

function reasonable(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 1_000_000 && value <= 500_000_000;
}

/**
 * The six categories behind UNHCR's own headline. Palestine refugees arrive
 * from the separate UNRWA series and are added by the caller, so summing the
 * population row alone deliberately falls short of the published figure.
 */
export function sumDisplacement(row: Row): number {
  return ["refugees", "asylum_seekers", "idps", "oip", "ooc"]
    .reduce((sum, field) => sum + count(row[field]), 0);
}

/** Year -> Palestine refugees under UNRWA's mandate. */
export function parseUnrwaSeries(data: unknown, lastYear: number): Map<number, number> {
  if (!data || typeof data !== "object") throw new Error("Invalid UNRWA response");
  const response = data as Row;
  if (!Array.isArray(response.items) || !response.items.length || Number(response.maxPages) !== 1)
    throw new Error("Empty or incomplete UNRWA response");
  const totals = new Map<number, number>();
  for (const item of response.items) {
    if (!item || typeof item !== "object") throw new Error("Invalid UNRWA row");
    const row = item as Row;
    const year = count(row.year);
    if (year < FIRST_YEAR || year > lastYear) throw new Error("Unexpected UNRWA year");
    totals.set(year, count(row.total));
  }
  return totals;
}

export function parseDisplacementSeries(data: unknown, lastYear: number, unrwa: Map<number, number>): DisplacementPoint[] {
  if (!data || typeof data !== "object") throw new Error("Invalid UNHCR response");
  const response = data as Row;
  if (!Array.isArray(response.items) || !response.items.length || Number(response.maxPages) !== 1)
    throw new Error("Empty or incomplete UNHCR response");
  const points = response.items.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("Invalid UNHCR row");
    const row = item as Row;
    const year = count(row.year);
    if (year < FIRST_YEAR || year > lastYear) throw new Error("Unexpected UNHCR year");
    const palestine = unrwa.get(year);
    if (palestine === undefined) throw new Error("Missing UNRWA year");
    const value = sumDisplacement(row) + palestine;
    if (!reasonable(value)) throw new Error("UNHCR total outside expected range");
    return { year, value };
  }).sort((a, b) => a.year - b.year);
  if (points.at(-1)!.year < 2015 || points.some((point, index) => point.year !== FIRST_YEAR + index))
    throw new Error("Missing or duplicate UNHCR years");
  return points;
}

export const getDisplacement = cache(async (fallback: DisplacementFallback): Promise<DisplacementData> => {
  const lastYear = new Date().getUTCFullYear() - 1;
  try {
    const query = `?limit=100&yearFrom=${FIRST_YEAR}&yearTo=${lastYear}`;
    const options = {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(10000),
    };
    const [population, palestine] = await Promise.all([
      fetch(`${API}${query}`, options),
      fetch(`${UNRWA_API}${query}`, options),
    ]);
    if (!population.ok) throw new Error(`UNHCR HTTP ${population.status}`);
    if (!palestine.ok) throw new Error(`UNRWA HTTP ${palestine.status}`);
    const unrwa = parseUnrwaSeries(await palestine.json(), lastYear);
    return {
      mode: "api",
      points: parseDisplacementSeries(await population.json(), lastYear, unrwa),
    };
  } catch (error) {
    console.warn("UNHCR history unavailable; using the editorial fallback.", error instanceof Error ? error.message : "Invalid data");
    if (fallback.value !== null && reasonable(fallback.value) && fallback.year !== null &&
        Number.isInteger(fallback.year) && fallback.year >= FIRST_YEAR && fallback.year <= lastYear &&
        fallback.source && /^https?:\/\//.test(fallback.source)) {
      return { mode: "saved", point: { value: fallback.value, year: fallback.year }, source: fallback.source };
    }
    return { mode: "pending" };
  }
});
