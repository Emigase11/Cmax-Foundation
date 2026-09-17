import { cache } from "react";

export type DisplacementFallback = {
  value: number | null;
  year: number | null;
  source: string | null;
  overlapYear: number | null;
  overlap: number | null;
};
type Row = Record<string, unknown>;
const API = "https://api.unhcr.org/population/v1";

async function rows(path: string): Promise<Row[]> {
  const response = await fetch(`${API}/${path}`, {
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(6000),
  });
  if (!response.ok) throw new Error(`UNHCR HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.items) || Number(data.maxPages) !== 1)
    throw new Error("Incomplete UNHCR response");
  return data.items;
}

export function sumDisplacement(
  population: Row,
  idmc: Row,
  unrwa: Row,
  overlap: number,
): number {
  // UNHCR's IDP field only covers its operations; global conflict IDPs come from IDMC.
  // Exclude returnees, stateless people, host communities and 'others of concern'.
  const values = [
    population.refugees,
    population.asylum_seekers,
    population.oip,
    idmc.total,
    unrwa.total,
  ];
  if (
    values.some(
      (v) => typeof v !== "number" || !Number.isSafeInteger(v) || v < 0,
    ) ||
    !Number.isSafeInteger(overlap) ||
    overlap < 0 ||
    overlap > Number(unrwa.total)
  )
    throw new Error("Invalid displacement categories");
  return (values as number[]).reduce((sum, value) => sum + value, 0) - overlap;
}

export const getDisplacement = cache(async (fallback: DisplacementFallback) => {
  const backup =
    fallback.value && fallback.year && fallback.source
      ? {
          value: fallback.value,
          year: fallback.year,
          source: fallback.source,
          mode: "published" as const,
        }
      : null;
  try {
    const years = (await rows("years/"))
      .map((r) => Number(r.year))
      .filter(
        (y) =>
          Number.isInteger(y) &&
          y < new Date().getUTCFullYear() &&
          y >= (fallback.year ?? 2020),
      )
      .sort((a, b) => b - a);
    for (const year of years.slice(0, 3)) {
      const [population, idmc, unrwa] = await Promise.all([
        rows(`population/?year=${year}`),
        rows(`idmc/?year=${year}`),
        rows(`unrwa/?year=${year}`),
      ]);
      if (
        population.length !== 1 ||
        idmc.length !== 1 ||
        unrwa.length !== 1 ||
        [population[0], idmc[0], unrwa[0]].some(
          (row) => Number(row.year) !== year,
        )
      )
        continue;
      // From 2024 onward, UNRWA / IDMC overlap is not exposed by these endpoints.
      // Never invent the adjustment or reuse one from a different year.
      if (
        year >= 2024 &&
        (fallback.overlapYear !== year || fallback.overlap == null)
      )
        return backup;
      const total = sumDisplacement(
        population[0],
        idmc[0],
        unrwa[0],
        year >= 2024 ? fallback.overlap! : 0,
      );
      if (total <= 0) continue;
      return {
        value: total,
        year,
        source: "https://www.unhcr.org/refugee-statistics/",
        mode: "api" as const,
      };
    }
  } catch (error) {
    console.warn(
      "UNHCR data unavailable; using the sourced editorial fallback.",
      error instanceof Error ? error.message : "Invalid data",
    );
  }
  return backup;
});
