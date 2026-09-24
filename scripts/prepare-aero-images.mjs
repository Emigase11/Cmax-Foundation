import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const sources = {
  rescue: "Cmax-air-x2-family-rescue (1).png",
  daylight: "aerocabin-lake-daylight.jpg",
  dusk: "aerocabin-lake-dusk.jpg",
  studio: "aerocabin-open-studio.jpg",
  unfold: "aerocabin-step-1-unfold.png",
  inflate: "aerocabin-step-2-inflate.png",
  check: "aerocabin-step-3-check.png",
  flood: "flooding-cmax-air-x2.png",
};
await mkdir("public/images/content/aerocabin", { recursive: true });
const manifest = {};
for (const [key, filename] of Object.entries(sources)) {
  const src = `/images/content/aerocabin/${key}.webp`;
  const result = await sharp(`assets/imagenes/${filename}`)
    .rotate()
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(`public${src}`);
  manifest[key] = { src, width: result.width, height: result.height };
}
await writeFile(
  "data/aerocabin-images.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log("Prepared eight AeroCabin images without cropping or enlargement.");
