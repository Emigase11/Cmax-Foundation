import fs from "node:fs/promises";
// Natural Earth 1:110m, public-domain cartography. Original geometry is retained in data/.
const data = JSON.parse(await fs.readFile("data/world-countries.geojson", "utf8"));
const ringPath = ring => ring.map(([lon, lat], i) => `${i ? "L" : "M"}${((lon + 180) * 2).toFixed(1)},${((90 - lat) * 2).toFixed(1)}`).join(" ") + "Z";
const paths = data.features.filter(f => f.properties.ADMIN !== "Antarctica").map(f => {
  const polygons = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  return `<path d="${polygons.flatMap(p => p.map(ringPath)).join(" ")}"/>`;
});
await fs.writeFile("public/images/world-map.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 300" fill="#ccc4b3" stroke="#f2f0e9" stroke-width=".6"><title>World map — Natural Earth, public domain</title>${paths.join("")}</svg>`);
