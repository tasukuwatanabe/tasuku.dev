import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { qiitaLoader } from "./loaders/qiita-loader";
import { zennLoader } from "./loaders/zenn-loader";
import { speakerdeckLoader } from "./loaders/speakerdeck-loader";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    noindex: z.boolean().optional(),
  }),
});

const qiita = defineCollection({
  loader: qiitaLoader(),
  schema: z.object({
    title: z.string(),
    url: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    user_id: z.string(),
    user_icon: z.string(),
    tags: z.array(z.string()),
    likes_count: z.number(),
    ogImage: z.string().nullable().optional(),
  }),
});

const zenn = defineCollection({
  loader: zennLoader(),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    url: z.string(),
    published_at: z.string(),
    liked_count: z.number(),
    emoji: z.string(),
    ogImage: z.string().nullable().optional(),
  }),
});

const speakerdeck = defineCollection({
  loader: speakerdeckLoader(),
  schema: z.object({
    title: z.string(),
    url: z.string(),
    published_at: z.string(),
    thumbnail: z.string(),
  }),
});

export const collections = { blog, qiita, zenn, speakerdeck };
