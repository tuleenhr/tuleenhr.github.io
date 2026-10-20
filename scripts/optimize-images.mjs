// Shrinks the screenshots in public/ in place so phones don't download 2000px files.
// Run once after adding new screenshots: `node scripts/optimize-images.mjs`
// (kbt-fit-hero.jpg, fiddlie-client-dashboard-top.jpg and fiddlie-all-projects.jpg were
// exported separately at their display sizes. Files already within the limits are skipped.)
import sharp from "sharp";
import { readdir, rename } from "node:fs/promises";
import path from "node:path";

const MAX = {
  // phone screenshots are shown at most 300px wide; 600px covers 2x screens
  kbt: { jpg: 600 },
  // desktop screenshots are shown up to ~1100px wide
  fiddlie: { jpg: 1600 },
};

for (const dir of Object.keys(MAX)) {
  const abs = path.join("public", dir);
  for (const file of await readdir(abs)) {
    const ext = path.extname(file).slice(1);
    const max = MAX[dir][ext];
    if (!max || file.includes("poster")) continue;
    const src = path.join(abs, file);
    // Already small enough: leave it alone rather than re-encode (each pass loses quality).
    if ((await sharp(src).metadata()).width <= max) continue;
    const tmp = src + ".tmp";
    const img = sharp(src).resize({ width: max, withoutEnlargement: true });
    await img.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(tmp);
    await rename(tmp, src);
    const { width, height } = await sharp(src).metadata();
    console.log(`${dir}/${file} ${width}x${height}`);
  }
}
