import sharp from "sharp";

const names = [
  "un-panel-intervention",
  "un-ecosoc-chamber-delegates",
  "un-intervention-cmax-nameplate",
  "unhcr-office-meeting",
];
for (const name of names) {
  await sharp(`assets/imagenes/${name}.jpg`)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(`public/images/content/stories/${name}.webp`);
}
console.log(`Prepared ${names.length} UN archive photographs.`);
