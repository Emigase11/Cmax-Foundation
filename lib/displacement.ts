import { cache } from "react";
import type { DisplacementData, DisplacementPoint } from "./labels";

type DisplacementFallback = { value: number | null; year: number | null; source: string | null };
type Row = Record<string, unknown>;
const API = "https://api.unhcr.org/population/v1/population/";
const FIRST_YEAR = 1990;

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

export function sumDisplacement(row: Row): number {
  // This population series is not the separate global estimate (IDMC / UNRWA).
  const total = ["refugees", "asylum_seekers", "idps", "oip"]
    .reduce((sum, field) => sum + count(row[field]), 0);
  if (!reasonable(total)) throw new Error("UNHCR total outside expected range");
  return total;
}

export function parseDisplacementSeries(data: unknown, lastYear: number): DisplacementPoint[] {
  if (!data || typeof data !== "object") throw new Error("Invalid UNHCR response");
  const response = data as Row;
  if (!Array.isArray(response.items) || !response.items.length || Number(response.maxPages) !== 1)
    throw new Error("Empty or incomplete UNHCR response");
  const points = response.items.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("Invalid UNHCR row");
    const row = item as Row;
    const year = count(row.year);
    if (year < FIRST_YEAR || year > lastYear) throw new Error("Unexpected UNHCR year");
    return { year, value: sumDisplacement(row) };
  }).sort((a, b) => a.year - b.year);
  if (points.at(-1)!.year < 2015 || points.some((point, index) => point.year !== FIRST_YEAR + index))
    throw new Error("Missing or duplicate UNHCR years");
  return points;
}

export const getDisplacement = cache(async (fallback: DisplacementFallback): Promise<DisplacementData> => {
  const lastYear = new Date().getUTCFullYear() - 1;
  try {
    const response = await fetch(`${API}?limit=100&yearFrom=${FIRST_YEAR}&yearTo=${lastYear}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`UNHCR HTTP ${response.status}`);
    return { mode: "api", points: parseDisplacementSeries(await response.json(), lastYear) };
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
