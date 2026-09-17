import fs from "node:fs/promises";

// Idempotent migration: only add explicit map codes where the existing record names a country.
const codes = {
  "argentina-emergency-preparedness": "ARG",
  "haiti-emergency-support": "HTI",
  "mexico-social-innovation-lab-for-emergencies": "MEX",
  "mexico-public-private-network-for-disaster-risk-reduction": "MEX",
  "ukraine-supporting-frontline-medical-response": "UKR",
};
for (const [slug, code] of Object.entries(codes)) {
  const path = `content/actions/${slug}.mdoc`;
  let text = await fs.readFile(path, "utf8");
  if (!text.includes("mapCountries:")) text = text.replace(/\ncountry: ([^\n]+)/, `\nmapCountries:\n  - ${code}\ncountry: $1`);
  if (slug === "haiti-emergency-support") text = text.replace("image: ''\n  alt: ''\n  caption: ''\n  credit: ''", "image: stories/haiti-community.webp\n  alt: Nicolás García Mayor with a child during a visit in Haiti.\n  caption: A visit in Haiti. Dates and action details remain under review.\n  credit: CMAX archive");
  await fs.writeFile(path, text);
}
await fs.mkdir("content/press", { recursive: true });
await fs.mkdir("public/images/content/press", { recursive: true });
const outlets = [
  ["cnn", "CNN", "CNN-Nico-garcia-mayor.png"],
  ["forbes", "Forbes", "Forbes-nico-garcia-mayor.png"],
  ["fox-news", "Fox News", "Fox-News-Nicolas-garcia-mayor-cmax-system.png"],
  ["nbc", "NBC", "NBC-news-nicolas-garcia-mayor.png"],
  ["newsweek", "Newsweek", "Newsweek-nico-garcia-mayor-cmax-system.png"],
  ["univision", "Univision", "Univision-nico-garcia-mayor.png"],
  ["washington-post", "Washington Post", "washington-Post-nicolas-garcia-mayor.png"],
];
for (const [slug, name, original] of outlets) {
  await fs.copyFile(`assets/imagenes/${original}`, `public/images/content/press/${slug}.png`);
  const path = `content/press/${slug}.yaml`;
  try { await fs.access(path); } catch {
    await fs.writeFile(path, `title: ${name} — article pending verification\noutlet: ${name}\nlogo: /images/content/press/${slug}.png\npublished: false\n`);
  }
}
