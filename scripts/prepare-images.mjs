import fs from "node:fs/promises";
import sharp from "sharp";

// Keep originals intact. Named derivatives are safe to regenerate.
const images = [
  ["nico-garcia-mayor-haiti-1100x564.jpg", "haiti-community", 1500],
  [
    "Cmax-system-flat-pack-nico-garcia-mayor-1100x564.jpeg",
    "cmax-ready-to-deploy",
    1600,
  ],
  [
    "Nicolas-Garcia-Mayor-vulnerable-neighborhood-1100x564.jpg",
    "community-visit",
    1200,
  ],
  ["Nicolas-garcia-Mayor-Una-ilusion-1100x564.jpg", "community-together", 1200],
  [
    "Nicolas-Garcia-Mayor-Interamerican-Development-Bank-1100x564.jpg",
    "humanitarian-innovation",
    1200,
  ],
  ["Captura de pantalla 2026-09-16 143914.png", "meeting-pope-francis", 800],
  ["Captura de pantalla 2026-09-16 144613.png", "community-gathering", 800],
  ["Cmax-air-x2-family-rescue (1).png", "aerocabin-rescue-concept", 1600],
  ["flooding-cmax-air-x2.png", "aerocabin-flood-concept", 1400],
];
await fs.mkdir("public/images/content/stories", { recursive: true });
for (const [source, name, width] of images) {
  const destination = `public/images/content/stories/${name}.webp`;
  await sharp(`assets/imagenes/${source}`)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(destination);
  const { size } = await fs.stat(destination);
  console.log(`${name}: ${Math.round(size / 1024)} KB`);
}
