import axios from "axios";
import fs from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";

const ZENN_USER_ID = "tasukuwatanabe";
const ZENN_API_URL = `https://zenn.dev/api/articles`;

async function fetchZennArticles() {
  const allArticles = [];
  let page = 1;

  while (true) {
    try {
      const response = await axios.get(ZENN_API_URL, {
        params: {
          username: ZENN_USER_ID,
          order: "latest",
          page,
        },
      });

      const { articles, next_page } = response.data;
      allArticles.push(...articles);

      if (!next_page) break;
      page = next_page;
    } catch (error) {
      console.error(
        "Error fetching Zenn articles:",
        error instanceof Error ? error.message : error,
      );
      break;
    }
  }

  return allArticles;
}

async function getOGImageUrl(articleUrl) {
  try {
    const response = await axios.get(articleUrl);
    const $ = cheerio.load(response.data);

    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) {
      return ogImage;
    }

    const twitterImage = $('meta[name="twitter:image"]').attr("content");
    if (twitterImage) {
      return twitterImage;
    }

    return null;
  } catch (error) {
    console.error(
      `Error fetching OG image for ${articleUrl}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

async function main() {
  const articles = await fetchZennArticles();

  const mapped = [];
  for (const item of articles) {
    const url = `https://zenn.dev/${ZENN_USER_ID}/articles/${item.slug}`;
    const ogImage = await getOGImageUrl(url);

    mapped.push({
      slug: item.slug,
      title: item.title,
      url,
      published_at: item.published_at,
      liked_count: item.liked_count,
      emoji: item.emoji,
      ogImage,
    });
  }

  const outputPath = path.join(process.cwd(), "src/data/zenn-articles.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(mapped, null, 2));
  console.log(
    `Fetched and saved ${mapped.length} Zenn articles to ${outputPath}`,
  );
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
