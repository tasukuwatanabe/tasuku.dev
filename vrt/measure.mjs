/**
 * Measures element heights to find the source of height differences
 */
import { chromium } from "@playwright/test";

const port = process.argv[2] ?? "4322";
const BASE_URL = `http://localhost:${port}`;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const page = await context.newPage();

await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const measurements = await page.evaluate(() => {
  const measure = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      height: rect.height,
      marginTop: parseFloat(style.marginTop),
      marginBottom: parseFloat(style.marginBottom),
      paddingTop: parseFloat(style.paddingTop),
      paddingBottom: parseFloat(style.paddingBottom),
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
    };
  };

  return {
    body: { scrollHeight: document.body.scrollHeight },
    main: measure("main"),
    header: measure("header"),
    blogSection: measure("section:first-of-type"),
    qiitaSection: measure("section:nth-of-type(2)"),
    sectionTitle: measure(".section-title"),
    firstCard: measure("article:first-of-type"),
    cardThumbnail: measure("article:first-of-type .aspect-\\[16\\/9\\]"),
    footer: measure("footer"),
  };
});

console.log(JSON.stringify(measurements, null, 2));

await context.close();
await browser.close();
