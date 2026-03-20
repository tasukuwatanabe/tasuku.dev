/**
 * VRT Screenshot Capture Script
 * Usage: node vrt/capture.mjs <label> <port>
 *   label: "before" or "after"
 *   port: preview server port (default: 4321)
 */
import { chromium } from "@playwright/test";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const label = process.argv[2] ?? "before";
const port = process.argv[3] ?? "4321";
const BASE_URL = `http://localhost:${port}`;
const OUT_DIR = path.join(__dirname, "screenshots", label);

const PAGES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "blog-post", path: "/blog/markdown-syntax-complete-guide" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();

  for (const p of PAGES) {
    await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "networkidle" });
    // Wait for fonts to load
    await page.waitForTimeout(500);
    const filename = `${p.name}-${viewport.name}.png`;
    await page.screenshot({
      path: path.join(OUT_DIR, filename),
      fullPage: true,
    });
    console.log(`Captured: ${label}/${filename}`);
  }

  await context.close();
}

await browser.close();
console.log(`\nAll screenshots saved to vrt/screenshots/${label}/`);
