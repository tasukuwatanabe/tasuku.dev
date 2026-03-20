import axios from "axios";
import fs from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";

const SPEAKERDECK_USER_ID = "tasukuwatanabe";
const SPEAKERDECK_FEED_URL = `https://speakerdeck.com/${SPEAKERDECK_USER_ID}.atom`;

async function fetchSpeakerDeckSlides() {
  try {
    const response = await axios.get(SPEAKERDECK_FEED_URL);
    const $ = cheerio.load(response.data, { xmlMode: true });

    const slides = [];
    $("entry").each((_, el) => {
      const entry = $(el);

      const idTag = entry.find("id").text().trim();
      const idMatch = idTag.match(/\/(\d+)$/);
      const id = idMatch ? idMatch[1] : idTag;

      const title = entry.find("title").text().trim();
      const url = entry.find('link[rel="alternate"]').attr("href") || "";
      const published_at = entry.find("published").text().trim();
      const thumbnail =
        entry.find("media\\:thumbnail, thumbnail").attr("url") || "";

      slides.push({ id, title, url, published_at, thumbnail });
    });

    return slides;
  } catch (error) {
    console.error(
      "Error fetching SpeakerDeck slides:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

async function main() {
  const slides = await fetchSpeakerDeckSlides();

  const outputPath = path.join(
    process.cwd(),
    "src/data/speakerdeck-slides.json",
  );
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(slides, null, 2));
  console.log(
    `Fetched and saved ${slides.length} SpeakerDeck slides to ${outputPath}`,
  );
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
