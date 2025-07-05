import axios from "axios";
import fs from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";

const QIITA_USER_ID = "tasukuwatanabe";
const QIITA_API_KEY = process.env.QIITA_API_KEY || "";
const QIITA_API_URL = `https://qiita.com/api/v2/users/${QIITA_USER_ID}/items`;

async function fetchQiitaArticles() {
  try {
    const headers = QIITA_API_KEY
      ? { Authorization: `Bearer ${QIITA_API_KEY}` }
      : {};
    const response = await axios.get(QIITA_API_URL, {
      headers,
      params: {
        per_page: 100,
        page: 1,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Qiita articles:", error.message);
    return [];
  }
}

async function getOGImageUrl(articleUrl) {
  try {
    const response = await axios.get(articleUrl);
    const $ = cheerio.load(response.data);

    // Look for og:image meta tag
    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) {
      return ogImage;
    }

    // Fallback to twitter:image
    const twitterImage = $('meta[name="twitter:image"]').attr("content");
    if (twitterImage) {
      return twitterImage;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching OG image for ${articleUrl}:`, error.message);
    return null;
  }
}

async function main() {
  const articles = await fetchQiitaArticles();

  const mapped = [];
  for (const item of articles) {
    const ogImageUrl = await getOGImageUrl(item.url);

    mapped.push({
      id: item.id,
      title: item.title,
      url: item.url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      user_id: item.user.id,
      user_icon: item.user.profile_image_url,
      tags: item.tags.map((t) => t.name),
      likes_count: item.likes_count,
      ogImage: ogImageUrl,
      body: item.body,
    });
  }

  const outputPath = path.join(process.cwd(), "src/data/qiita-articles.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(mapped, null, 2));
  console.log(
    `Fetched and saved ${mapped.length} Qiita articles to ${outputPath}`
  );
}

main();
