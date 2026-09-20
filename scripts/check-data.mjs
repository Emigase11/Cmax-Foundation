import assert from "node:assert/strict";
import {
  sumDisplacement,
  parseUnrwaSeries,
  parseDisplacementSeries,
  getDisplacement,
} from "../lib/displacement.ts";
import { getFundraising } from "../lib/fundraising.ts";

/* The six categories behind UNHCR's published headline. `oip: "-"` is how the
   API reports a category that did not exist in that year, and it counts as 0.
   Stateless people are deliberately not part of the sum. */
const population = {
  refugees: 10_000_000,
  asylum_seekers: "801119",
  idps: 20_000_000,
  oip: "-",
  stateless: 99_999_999,
  ooc: 2_000_000,
};
const UNRWA_PER_YEAR = 5_000_000;
const POPULATION_SUM = 32_801_119;
const MERGED = POPULATION_SUM + UNRWA_PER_YEAR;

assert.equal(sumDisplacement(population), POPULATION_SUM);
assert.equal(sumDisplacement({ ...population, oip: "2000000" }), POPULATION_SUM + 2_000_000);
// Others of concern belong in the headline; stateless people never do.
assert.equal(sumDisplacement({ ...population, ooc: 0 }), POPULATION_SUM - 2_000_000);
assert.equal(sumDisplacement({ ...population, stateless: 0 }), POPULATION_SUM);
for (const invalid of [null, undefined, "", " ", "NaN", "1,000", -1, 1.5, Infinity, NaN, {}, true]) {
  assert.throws(() => sumDisplacement({ ...population, refugees: invalid }));
  assert.throws(() => sumDisplacement({ ...population, ooc: invalid }));
}
assert.throws(() => sumDisplacement({ refugees: 1, asylum_seekers: 1, idps: 1, oip: "-" }));

const years = Array.from({ length: 11 }, (_, i) => 2015 + i);
const items = years.map((year) => ({ year: String(year), ...population }));
const payload = { maxPages: 1, items };
const unrwaItems = years.map((year) => ({ year: String(year), total: UNRWA_PER_YEAR }));
const unrwaPayload = { maxPages: 1, items: unrwaItems };
const unrwa = parseUnrwaSeries(unrwaPayload, 2025);

assert.equal(unrwa.size, 11);
assert.equal(unrwa.get(2025), UNRWA_PER_YEAR);
for (const invalid of [null, {}, { ...unrwaPayload, maxPages: 2 }, { ...unrwaPayload, items: [] },
  { ...unrwaPayload, items: [{ year: "2026", total: 1 }] },
  { ...unrwaPayload, items: [{ year: "2020", total: "x" }] }])
  assert.throws(() => parseUnrwaSeries(invalid, 2025));

const series = parseDisplacementSeries(payload, 2025, unrwa);
assert.equal(series.length, 11);
// Palestine refugees are added on top of the population row, not folded into it.
assert.equal(series.at(-1).value, MERGED);
assert.equal(parseDisplacementSeries({ ...payload, items: [...items].reverse() }, 2025, unrwa)[0].year, 2015);
for (const invalid of [null, {}, { ...payload, maxPages: 2 }, { ...payload, items: [] },
  { ...payload, items: items.slice(1) }, { ...payload, items: [...items, items[0]] },
  { ...payload, items: [...items, { ...population, year: 2026 }] },
  { ...payload, items: items.filter((item) => item.year !== "2020") }])
  assert.throws(() => parseDisplacementSeries(invalid, 2025, unrwa));
// An implausible merged total is refused rather than published.
assert.throws(() =>
  parseDisplacementSeries({ ...payload, items: items.map((item) => ({ ...item, idps: 900_000_000 })) }, 2025, unrwa));
// A year the UNRWA series does not cover would silently undercount, so it fails.
assert.throws(() => parseDisplacementSeries(payload, 2025, new Map([[2015, UNRWA_PER_YEAR]])));

const fallback = { value: 117_800_000, year: 2025, source: "https://www.unhcr.org/about-unhcr/overview/figures-glance" };
const originalFetch = globalThis.fetch;
try {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return Response.json(String(url).includes("/unrwa/") ? unrwaPayload : payload);
  };
  const result = await getDisplacement(fallback);
  assert.equal(result.mode, "api");
  assert.equal(result.points.at(-1).value, MERGED);
  // Both series, each cached for a day.
  assert.equal(calls.length, 2);
  assert.ok(calls.some((call) => String(call.url).includes("/population/")));
  assert.ok(calls.some((call) => String(call.url).includes("/unrwa/")));
  const lastYear = new Date().getUTCFullYear() - 1;
  for (const call of calls) {
    assert.ok(String(call.url).includes(`yearFrom=2015&yearTo=${lastYear}`));
    assert.equal(call.options.next.revalidate, 86400);
  }

  const failures = [
    async () => { throw new Error("Simulated outage"); },
    async () => new Response("", { status: 503 }),
    async () => new Response("invalid JSON"),
    async () => Response.json({ maxPages: 1, items: [] }),
    async (url) => Response.json(String(url).includes("/unrwa/")
      ? unrwaPayload
      : { ...payload, items: [{ ...population, year: 2025, idps: 900_000_000 }] }),
    // The population series alone must never be published without UNRWA.
    async (url) => String(url).includes("/unrwa/")
      ? new Response("", { status: 500 })
      : Response.json(payload),
  ];
  for (const fail of failures) {
    globalThis.fetch = fail;
    assert.equal((await getDisplacement(fallback)).mode, "saved");
  }
  for (const invalid of [{ ...fallback, value: null }, { ...fallback, year: new Date().getUTCFullYear() },
    { ...fallback, value: 1 }, { ...fallback, source: null }])
    assert.equal((await getDisplacement(invalid)).mode, "pending");
} finally {
  globalThis.fetch = originalFetch;
}

const draft = { published: false, amount: 100, currency: "USD", date: "2026-09-01", financed: "A documented mission", source: "https://example.org/report" };
assert.equal(getFundraising(draft), null);
assert.equal(getFundraising({ ...draft, published: true, date: null }), null);
assert.equal(getFundraising({ ...draft, published: true, source: null }), null);
assert.equal(getFundraising({ ...draft, published: true, amount: 0 })?.amount, 0);

console.log("PASS: six categories plus UNRWA, mixed types, bounds, series integrity, two cached requests, fallback states, and fundraising gates.");
