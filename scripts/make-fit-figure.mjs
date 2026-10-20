// One-off: turns the KBT fit export (labels and coloured areas baked in) into
//  - public/kbt/kbt-figure-clean.jpg: the grey reference figure with no labels, lines, dots or tints
//  - public/kbt/fit-masks/<area>.png: the exact shape of each fit area, as an alpha mask
// so the hero can draw its own callouts and recolour each area per size (S / M / L).
// Source: src/assets/kbt-fit-hero-source.jpg (591×1280). Run: node scripts/make-fit-figure.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "src/assets/kbt-fit-hero-source.jpg";
const CROP = { left: 0, top: 270, width: 591, height: 560 }; // same crop as kbt-fit-hero.jpg

const { data, info } = await sharp(SRC).extract(CROP).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, C = info.channels;
const img = Float32Array.from(data);
const idx = (x, y) => (y * W + x) * C;
const get = (a, x, y) => { const i = idx(x, y); return [a[i], a[i + 1], a[i + 2]]; };
const put = (a, x, y, p) => { const i = idx(x, y); a[i] = p[0]; a[i + 1] = p[1]; a[i + 2] = p[2]; };
const mix = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];

// Geometry measured from the export (crop coordinates).
const DOTS = [[250, 164], [290, 179], [290, 267], [283, 336]];
const DOT_BY_COLUMN = new Set([3]); // thigh dot: its row neighbours fall in the gap between the legs
const DOT_R = 14; // dot plus its white ring
const LINES = [ // [x0, x1, yCentre]
  [130, 252, 164.5], [140, 292, 267], [288, 460, 179], [281, 460, 336],
];
const CARDS = [ // [x0, y0, x1, y1] incl. the soft drop shadow (kept clear of the hands)
  [0, 118, 148, 214], [0, 222, 148, 316], [442, 133, 590, 229], [442, 289, 590, 385],
];
// offset: how much the tint darkened the body there (untinted body nearby minus the tinted area,
// measured once on this export: e.g. the waist band averages 182 vs 203.5 just above and below it).
const AREAS = {
  shoulders: { box: [205, 112, 372, 178], tint: ([r, , b]) => (r - b - 14) / 40, offset: 0 },
  chest: { box: [236, 96, 352, 205], tint: ([r, g]) => (g - r - 4) / 30, offset: 2 },
  waist: { box: [246, 232, 344, 284], tint: ([r, , b]) => (b - r - 2) / 30, offset: 21.5 },
  thigh: { box: [244, 270, 302, 430], tint: ([r, g]) => (g - r - 4) / 26, offset: -1 },
};

const isBg = ([r, g, b]) => { const l = (r + g + b) / 3; return l > 226 && r - b >= 5 && r - b <= 18; };

// Repair a pixel set by interpolating from outside it, row-wise (dots) or column-wise (lines, cards).
function fillRows(a, x0, x1, y0, y1, inside) {
  for (let y = Math.max(0, y0); y <= Math.min(H - 1, y1); y++) {
    let x = x0;
    while (x <= x1) {
      if (!inside(x, y)) { x++; continue; }
      const s = x; while (x <= x1 && inside(x, y)) x++;
      const L = get(a, Math.max(0, s - 2), y), R = get(a, Math.min(W - 1, x + 1), y);
      for (let k = s; k < x; k++) put(a, k, y, mix(L, R, (k - s + 1) / (x - s + 1)));
    }
  }
}
function fillCols(a, x0, x1, y0, y1, inside = () => true) {
  for (let x = Math.max(0, x0); x <= Math.min(W - 1, x1); x++) {
    const T = get(a, x, Math.max(0, y0 - 2)), B = get(a, x, Math.min(H - 1, y1 + 2));
    for (let y = y0; y <= y1; y++) if (inside(x, y)) put(a, x, y, mix(T, B, (y - y0 + 1) / (y1 - y0 + 2)));
  }
}

// 1. Masks from the original tints (alpha 0–255), before anything is cleaned.
const masks = {};
for (const [name, { box, tint }] of Object.entries(AREAS)) {
  const m = new Float32Array(W * H * C); // reuse RGB layout so the same repair helpers work
  for (let y = box[1]; y <= box[3]; y++)
    for (let x = box[0]; x <= box[2]; x++) {
      const p = get(img, x, y);
      const t = isBg(p) ? 0 : Math.max(0, Math.min(1, tint(p)));
      put(m, x, y, [t * 255, t * 255, t * 255]);
    }
  masks[name] = m;
}

// 2. Remove dots, connector lines and label cards from both the image and the masks.
const inDot = (x, y) => DOTS.some(([cx, cy]) => (x - cx) ** 2 + (y - cy) ** 2 <= DOT_R ** 2);
for (const a of [img, ...Object.values(masks)]) {
  DOTS.forEach(([cx, cy], i) =>
    DOT_BY_COLUMN.has(i)
      ? fillCols(a, cx - DOT_R, cx + DOT_R, cy - DOT_R - 1, cy + DOT_R + 1, inDot)
      : fillRows(a, cx - DOT_R - 1, cx + DOT_R + 1, cy - DOT_R, cy + DOT_R, inDot),
  );
  for (const [x0, x1, yc] of LINES) fillCols(a, x0, x1, Math.floor(yc - 4), Math.ceil(yc + 4)); // line + light outline
}
for (const [x0, y0, x1, y1] of CARDS) fillCols(img, x0, x1, y0, y1);

// 3. Strip the coloured tints: make tinted pixels neutral grey and add back the brightness the tint took.
const lum = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;
for (const [name, { box, offset }] of Object.entries(AREAS)) {
  const m = masks[name];
  for (let y = box[1]; y <= box[3]; y++)
    for (let x = box[0]; x <= box[2]; x++) {
      const p = get(img, x, y);
      if (isBg(p)) continue;
      const a = m[idx(x, y)] / 255;
      if (a <= 0 && Math.max(...p) - Math.min(...p) < 6) continue; // untouched body
      const l = lum(p) + offset * a;
      put(img, x, y, [l + 1, l, l - 1]);
    }
}

await mkdir("public/kbt/fit-masks", { recursive: true });
await sharp(Buffer.from(Uint8ClampedArray.from(img)), { raw: { width: W, height: H, channels: C } })
  .jpeg({ quality: 88, mozjpeg: true, progressive: true })
  .toFile("public/kbt/kbt-figure-clean.jpg");
for (const [name, m] of Object.entries(masks)) {
  const alpha = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) alpha[i] = Math.max(0, Math.min(255, m[i * C]));
  await sharp(alpha, { raw: { width: W, height: H, channels: 1 } })
    .blur(0.6)
    .toColourspace("b-w")
    .png({ compressionLevel: 9 })
    .toBuffer()
    .then((g) => sharp({ create: { width: W, height: H, channels: 3, background: "#fff" } }).joinChannel(g).png({ compressionLevel: 9 }).toFile(`public/kbt/fit-masks/${name}.png`));
}
console.log("wrote public/kbt/kbt-figure-clean.jpg and public/kbt/fit-masks/*.png");
