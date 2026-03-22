import type { Loader } from "astro/loaders";
import * as cheerio from "cheerio";

const ZENN_USER_ID = "tasukuwatanabe";
const ZENN_API_URL = "https://zenn.dev/api/articles";

async function fetchOGImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const $ = cheerio.load(await res.text());
    return (
      $('meta[property="og:image"]').attr("content") ??
      $('meta[name="twitter:image"]').attr("content") ??
      null
    );
  } catch {
    return null;
  }
}

export function zennLoader(): Loader {
  return {
    name: "zenn-loader",
    load: async ({ store, logger }) => {
      logger.info("Fetching Zenn articles...");

      const allArticles = [];
      let page = 1;

      while (true) {
        const res = await fetch(
          `${ZENN_API_URL}?username=${ZENN_USER_ID}&order=latest&page=${page}`,
        );
        const { articles, next_page } = await res.json();
        allArticles.push(...articles);
        if (!next_page) break;
        page = next_page;
      }

      for (const item of allArticles) {
        const url = `https://zenn.dev/${ZENN_USER_ID}/articles/${item.slug}`;
        const cached = store.get(item.slug);
        const ogImage = cached?.data.ogImage ?? (await fetchOGImage(url));
        store.set({
          id: item.slug,
          data: {
            slug: item.slug,
            title: item.title,
            url,
            published_at: item.published_at,
            liked_count: item.liked_count,
            emoji: item.emoji,
            ogImage,
          },
        });
      }

      logger.info(`Loaded ${allArticles.length} Zenn articles`);
    },
  };
}
