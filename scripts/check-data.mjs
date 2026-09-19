import assert from "node:assert/strict";
import { sumDisplacement, parseDisplacementSeries, getDisplacement } from "../lib/displacement.ts";
import { getFundraising } from "../lib/fundraising.ts";

const population = { refugees: 10_000_000, asylum_seekers: "801119", idps: 20_000_000, oip: "-", stateless: 99999999, ooc: 99999999 };
assert.equal(sumDisplacement(population), 30_801_119);
assert.equal(sumDisplacement({ ...population, oip: "2000000" }), 32_801_119);
for (const invalid of [null, undefined, "", " ", "NaN", "1,000", -1, 1.5, Infinity, NaN, {}, true])
  assert.throws(() => sumDisplacement({ ...population, refugees: invalid }));
assert.throws(() => sumDisplacement({ ...population, idps: 900_000_000 }));
assert.throws(() => sumDisplacement({ refugees: 1, asylum_seekers: 1, idps: 1, oip: "-" }));
const items = Array.from({ length: 36 }, (_, i) => ({ year: String(1990 + i), ...population }));
const payload = { maxPages: 1, items };
assert.equal(parseDisplacementSeries(payload, 2025).length, 36);
assert.equal(parseDisplacementSeries({ ...payload, items: [...items].reverse() }, 2025)[0].year, 1990);
for (const invalid of [null, {}, { ...payload, maxPages: 2 }, { ...payload, items: [] },
  { ...payload, items: items.slice(1) }, { ...payload, items: [...items, items[0]] },
  { ...payload, items: [...items, { ...population, year: 2026 }] },
  { ...payload, items: items.filter(item => item.year !== "2001") }])
  assert.throws(() => parseDisplacementSeries(invalid, 2025));

const fallback = { value: 117800000, year: 2025, source: "https://www.unhcr.org/about-unhcr/overview/figures-glance" };
const originalFetch = globalThis.fetch;
try {
  const calls = [];
  globalThis.fetch = async (url, options) => { calls.push({ url, options }); return Response.json(payload); };
  const result = await getDisplacement(fallback);
  assert.equal(result.mode, "api");
  assert.equal(result.points.at(-1).value, 30_801_119);
  assert.equal(calls.length, 1);
  assert.ok(calls[0].url.includes(`yearFrom=1990&yearTo=${new Date().getUTCFullYear() - 1}`));
  assert.equal(calls[0].options.next.revalidate, 86400);
  for (const fail of [async () => { throw new Error("Simulated outage"); },
    async () => new Response("", { status: 503 }),
    async () => new Response("invalid JSON"),
    async () => Response.json({ maxPages: 1, items: [] }),
    async () => Response.json({ ...payload, items: [{ ...population, year: 2025, idps: 900000000 }] })]) {
    globalThis.fetch = fail;
    assert.equal((await getDisplacement(fallback)).mode, "saved");
  }
  for (const invalid of [{ ...fallback, value: null }, { ...fallback, year: new Date().getUTCFullYear() },
    { ...fallback, value: 1 }, { ...fallback, source: null }])
    assert.equal((await getDisplacement(invalid)).mode, "pending");
} finally { globalThis.fetch = originalFetch; }
const draft = { published: false, amount: 100, currency: "USD", date: "2026-09-01", financed: "A documented mission", source: "https://example.org/report" };
assert.equal(getFundraising(draft), null);
assert.equal(getFundraising({ ...draft, published: true, date: null }), null);
assert.equal(getFundraising({ ...draft, published: true, source: null }), null);
assert.equal(getFundraising({ ...draft, published: true, amount: 0 })?.amount, 0);
console.log("PASS: mixed types, exact categories, bounds, series integrity, one cached request, fallback states, and fundraising gates.");
