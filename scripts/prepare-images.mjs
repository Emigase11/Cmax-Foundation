import fs from "node:fs/promises";
import sharp from "sharp";

// Keep originals intact. Named derivatives are safe to regenerate.
const images = [
  ["nico-garcia-mayor-haiti-1100x564.jpg", "haiti-community", 1600],
  [
    "Cmax-system-flat-pack-nico-garcia-mayor-1100x564.jpeg",
    "cmax-ready-to-deploy",
    2800,
  ],
  [
    "Nicolas-Garcia-Mayor-vulnerable-neighborhood-1100x564.jpg",
    "community-visit",
    1600,
  ],
  ["Nicolas-garcia-Mayor-Una-ilusion-1100x564.jpg", "community-together", 2400],
  [
    "Nicolas-Garcia-Mayor-Interamerican-Development-Bank-1100x564.jpg",
    "humanitarian-innovation",
    1600,
  ],
  ["Captura de pantalla 2026-09-16 143914.png", "meeting-pope-francis", 800],
  ["Captura de pantalla 2026-09-16 144613.png", "community-gathering", 800],
  ["Cmax-air-x2-family-rescue (1).png", "aerocabin-rescue-concept", 2400],
  ["flooding-cmax-air-x2.png", "aerocabin-flood-concept", 1200],
];
await fs.mkdir("public/images/content/stories", { recursive: true });
const report = [];
for (const [source, name, width] of images) {
  const original = `assets/imagenes/${source}`;
  const metadata = await sharp(original).metadata();
  const isRender = name.includes("concept");
  // Documentary images: classical Lanczos only, never more than 2x.
  // Render originals keep their native resolution until a reviewed upscale exists.
  const maxWidth = Math.min(width, metadata.width * (isRender ? 1 : 2));
  const widths = [...new Set([600, 1200, 1600, 2400, 2800, maxWidth].filter(w => w <= maxWidth))].sort((a,b) => a-b);
  for (const outputWidth of widths) {
    const destination = `public/images/content/stories/${name}-${outputWidth}.webp`;
    await sharp(original).rotate().resize({ width: outputWidth, kernel: "lanczos3" }).webp({ quality: 92 }).toFile(destination);
  }
  await fs.copyFile(`public/images/content/stories/${name}-${maxWidth}.webp`, `public/images/content/stories/${name}.webp`);
  const warning = metadata.width < width ? `Original ${metadata.width}px is below ${width}px target; derivative ${maxWidth}px. Resampling does not recover detail.` : null;
  if (warning) console.warn(`${name}: ${warning}`);
  report.push({ source, name, originalWidth: metadata.width, targetWidth: width, outputWidth: maxWidth, widths, method: isRender ? "native" : "classical-lanczos-max-2x", warning });
}
await fs.writeFile("data/image-report.json", JSON.stringify(report, null, 2) + "\n");
console.log(`Prepared ${images.length} images and width variants. See data/image-report.json.`);
