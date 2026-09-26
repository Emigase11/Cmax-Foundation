import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";

// Integration smoke check against a running local dev or production server.
// Only invalid form payloads are submitted: no inquiry or email is created.
const origin = process.env.CHECK_SITE_URL ?? "http://localhost:3000";
for (const [source, target] of [
  ["/campaigns", "/our-actions"],
  ["/impact", "/our-actions"],
  ["/cmax-for-covid-19", "/our-actions/covid-19-response"],
  ["/cmax-foundation-launches-in-mexico-a-public-private-network-for-drr", "/our-actions/mexico-public-private-network-for-disaster-risk-reduction"],
  ["/el-primer-laboratorio-de-innovacion-social-para-la-emergencia-lise", "/our-actions/mexico-social-innovation-lab-for-emergencies"],
]) {
  const response = await fetch(new URL(source, origin), { redirect: "manual" });
  assert.equal(response.status, 308, `Expected permanent redirect: ${source}`);
  assert.equal(new URL(response.headers.get("location"), origin).pathname, target);
  assert.equal((await fetch(new URL(target, origin))).status, 200, `Redirect target failed: ${target}`);
}
const routes = new Set([
  "/", "/approach", "/about/press", "/about", "/about/team", "/about/transparency",
  "/our-actions", "/campaigns", "/global-advocacy",
  "/global-advocacy/united-nations", "/support",
]);
for (const [collection, route] of [["programs", "our-work"], ["actions", "our-actions"], ["campaigns", "campaigns"]]) {
  const files = await readdir(`content/${collection}`);
  files.filter((file) => file.endsWith(".mdoc")).forEach((file) => routes.add(`/${route}/${file.slice(0, -5)}`));
}
const assets = new Set();
const links = new Set();
for (const route of routes) {
  const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `Page failed: ${route}`);
  const html = await response.text();
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `Expected one h1: ${route}`);
  for (const [, href] of html.matchAll(/href="(\/[^"#]*)"/g)) {
    if (!href.startsWith("/_next/") && !href.startsWith("/favicon")) links.add(href.replaceAll("&amp;", "&"));
  }
  for (const [, src] of html.matchAll(/src="([^" ]+)"/g)) {
    if (src.startsWith("/_next/image?")) {
      const url = new URL(src.replaceAll("&amp;", "&"), origin).searchParams.get("url");
      if (url?.startsWith("/images/")) assets.add(url);
    } else if (src.startsWith("/images/") || src.startsWith("/video/")) assets.add(src);
  }
}
for (const link of links) {
  if (routes.has(link)) continue;
  const response = await fetch(new URL(link, origin), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `Internal link failed: ${link}`);
}
for (const asset of assets) {
  const response = await fetch(new URL(asset, origin), { method: "HEAD", signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `Missing asset: ${asset}`);
}
for (const [body, expected] of [["null", 400], ["[]", 400], ["{", 400], ["{}", 422]]) {
  const response = await fetch(new URL("/api/support", origin), {
    method: "POST", headers: { "Content-Type": "application/json" }, body,
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, expected, `Invalid request was not rejected: ${body}`);
  assert.equal((await response.json()).ok, false);
}
const missing = await fetch(new URL("/our-work/nonexistent-smoke-check", origin));
assert.equal(missing.status, 404, "Missing program must return 404");
console.log(`PASS: ${routes.size} pages, ${links.size} internal links, ${assets.size} assets, 4 invalid requests, and a 404.`);
