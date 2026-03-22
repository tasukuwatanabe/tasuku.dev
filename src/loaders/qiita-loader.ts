import type { Loader } from "astro/loaders";
import * as cheerio from "cheerio";

const QIITA_USER_ID = "tasukuwatanabe";

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

export function qiitaLoader(): Loader {
  return {
    name: "qiita-loader",
    load: async ({ store, logger }) => {
      logger.info("Fetching Qiita articles...");
      const res = await fetch(
        `https://qiita.com/api/v2/users/${QIITA_USER_ID}/items?per_page=100`,
      );
      const articles = await res.json();

      for (const item of articles) {
        const cached = store.get(item.id);
        const ogImage = cached?.data.ogImage ?? (await fetchOGImage(item.url));
        store.set({
          id: item.id,
          data: {
            title: item.title,
            url: item.url,
            created_at: item.created_at,
            updated_at: item.updated_at,
            user_id: item.user.id,
            user_icon: item.user.profile_image_url,
            tags: item.tags.map((t: { name: string }) => t.name),
            likes_count: item.likes_count,
            ogImage,
          },
        });
      }

      logger.info(`Loaded ${articles.length} Qiita articles`);
    },
  };
}
