import fs from "node:fs/promises";
import path from "node:path";

// Keystatic's image field strips publicPath when locating the source asset.
// Old relative values rendered through imgSrc, but were lost when edited in CMS.
async function normalize(directory) {
  for (const file of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, file.name);
    if (file.isDirectory()) { await normalize(filename); continue; }
    if (!/\.(yaml|mdoc)$/.test(file.name)) continue;
    const original = await fs.readFile(filename, "utf8");
    const updated = original.replace(/^(\s*(?:-\s*)?(?:image|photo|logo):\s*)((?:stories|solutions|actions|press|brand)\/[^\r\n]+)$/gm, "$1/images/content/$2");
    if (original !== updated) {
      await fs.writeFile(filename, updated);
      console.log(filename);
    }
  }
}
await normalize("content");
