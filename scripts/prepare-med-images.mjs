import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const sources = {
  field: "public/images/content/solutions/cmaxmed-field-render.jpg",
  cutaway: "assets/imagenes/cmaxmed-interior-cutaway.jpg",
  hospital: "assets/imagenes/cmaxmed-hospital-isolation-ward.jpg",
  camp: "assets/imagenes/cmax-camp-aerial-desert.png",
  modular: "public/images/content/solutions/cmaxmed-field-hospital-render.jpg",
  interior: "public/images/content/solutions/cmaxmed-interior-photo.jpg",
};
await mkdir("public/images/content/cmax-med", { recursive: true });
const manifest = {};
for (const [key, source] of Object.entries(sources)) {
  const destination = `/images/content/cmax-med/${key}.webp`;
  const result = await sharp(source)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(`public${destination}`);
  manifest[key] = {
    src: destination,
    width: result.width,
    height: result.height,
  };
}
await writeFile(
  "data/cmax-med-images.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log("Prepared six Cmax Med images at their original aspect ratios.");
