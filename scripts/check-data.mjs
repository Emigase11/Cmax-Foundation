import assert from "node:assert/strict";
import { sumDisplacement, getDisplacement } from "../lib/displacement.ts";
import { getFundraising } from "../lib/fundraising.ts";

// Synthetic fixture: unwanted categories must never inflate the global total.
const population = { refugees: 100, asylum_seekers: 20, oip: 30, idps: 999, stateless: 999, returned_refugees: 999, hst: 999 };
assert.equal(sumDisplacement(population, { total: 200 }, { total: 40 }, 10), 380);
assert.throws(() => sumDisplacement({ ...population, refugees: null }, { total: 200 }, { total: 40 }, 10));
assert.throws(() => sumDisplacement(population, { total: 200 }, { total: 40 }, 41));
const draft = { published: false, amount: 100, currency: "USD", date: "2026-09-01", financed: "A documented mission", source: "https://example.org/report" };
assert.equal(getFundraising(draft), null);
assert.equal(getFundraising({ ...draft, published: true, date: null }), null);
assert.equal(getFundraising({ ...draft, published: true, source: null }), null);
assert.equal(getFundraising({ ...draft, published: true, amount: 0 })?.amount, 0);

const fallback = { value: 117800000, year: 2025, source: "https://www.unhcr.org/about-unhcr/overview/figures-glance", overlapYear: null, overlap: null };
const originalFetch = globalThis.fetch;
let called = [];
try {
  globalThis.fetch = async url => {
    called.push(url);
    const items = url.endsWith("years/") ? [{ year: 2027 }, { year: 2025 }]
      : [{ year: 2025, ...population, total: 200 }];
    return Response.json({ maxPages: 1, items });
  };
  const result = await getDisplacement(fallback);
  assert.equal(result.value, fallback.value, "Missing overlap must use the sourced total");
  assert.ok(called.every(url => !url.includes("year=2027")), "Future years must never be requested");
  globalThis.fetch = async () => { throw new Error("Simulated offline API"); };
  assert.equal((await getDisplacement(fallback)).mode, "published");
} finally { globalThis.fetch = originalFetch; }
console.log("PASS: population categories, overlap validation, future years, API outage fallback, and fundraising publication gates.");
