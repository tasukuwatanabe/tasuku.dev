/**
 * VRT Comparison Script
 * Compares before/after screenshots using pixelmatch
 * Usage: node vrt/compare.mjs
 */
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BEFORE_DIR = path.join(__dirname, "screenshots", "before");
const AFTER_DIR = path.join(__dirname, "screenshots", "after");
const DIFF_DIR = path.join(__dirname, "screenshots", "diff");

mkdirSync(DIFF_DIR, { recursive: true });

const files = readdirSync(BEFORE_DIR).filter((f) => f.endsWith(".png"));
let hasFailure = false;

for (const filename of files) {
  const beforePath = path.join(BEFORE_DIR, filename);
  const afterPath = path.join(AFTER_DIR, filename);

  let afterExists = true;
  try {
    readFileSync(afterPath);
  } catch {
    afterExists = false;
  }

  if (!afterExists) {
    console.warn(`⚠ MISSING after screenshot: ${filename}`);
    continue;
  }

  const before = PNG.sync.read(readFileSync(beforePath));
  const after = PNG.sync.read(readFileSync(afterPath));

  // Crop both images to the minimum shared dimensions for comparison
  const width = Math.min(before.width, after.width);
  const height = Math.min(before.height, after.height);

  // Extract shared region from both images
  const cropPNG = (src, w, h) => {
    const dst = new PNG({ width: w, height: h });
    PNG.bitblt(src, dst, 0, 0, w, h, 0, 0);
    return dst;
  };

  const beforeCropped = cropPNG(before, width, height);
  const afterCropped = cropPNG(after, width, height);

  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    beforeCropped.data,
    afterCropped.data,
    diff.data,
    width,
    height,
    { threshold: 0.1, includeAA: false }
  );

  const totalPixels = width * height;
  const diffPercent = ((numDiffPixels / totalPixels) * 100).toFixed(2);
  const diffPngPath = path.join(DIFF_DIR, filename);
  writeFileSync(diffPngPath, PNG.sync.write(diff));

  const sizeDiff =
    before.height !== after.height
      ? ` (height: ${before.height} → ${after.height})`
      : "";
  const status = numDiffPixels === 0 ? "✅ PASS" : `❌ DIFF`;
  console.log(
    `${status}  ${filename.padEnd(35)} diff: ${diffPercent}%  (${numDiffPixels} px)${sizeDiff}`
  );

  if (numDiffPixels > 0) hasFailure = true;
}

console.log("\n─────────────────────────────────────────");
if (hasFailure) {
  console.log(`❌ Visual differences detected. Check vrt/screenshots/diff/`);
  process.exit(1);
} else {
  console.log(`✅ No visual differences detected.`);
}
