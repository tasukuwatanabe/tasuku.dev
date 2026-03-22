import type { Loader } from "astro/loaders";
import * as cheerio from "cheerio";

const SPEAKERDECK_USER_ID = "tasukuwatanabe";
const SPEAKERDECK_FEED_URL = `https://speakerdeck.com/${SPEAKERDECK_USER_ID}.atom`;

export function speakerdeckLoader(): Loader {
  return {
    name: "speakerdeck-loader",
    load: async ({ store, logger }) => {
      logger.info("Fetching SpeakerDeck slides...");

      const res = await fetch(SPEAKERDECK_FEED_URL);
      const $ = cheerio.load(await res.text(), { xmlMode: true });

      $("entry").each((_, el) => {
        const entry = $(el);

        const idTag = entry.find("id").text().trim();
        const idMatch = idTag.match(/\/(\d+)$/);
        const id = idMatch ? idMatch[1] : idTag;

        const title = entry.find("title").text().trim();
        const url = entry.find('link[rel="alternate"]').attr("href") ?? "";
        const published_at = entry.find("published").text().trim();
        const thumbnail =
          entry.find("media\\:thumbnail, thumbnail").attr("url") ?? "";

        store.set({ id, data: { title, url, published_at, thumbnail } });
      });

      logger.info(`Loaded SpeakerDeck slides`);
    },
  };
}
