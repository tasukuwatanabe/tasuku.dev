import type { CollectionEntry } from "astro:content";

export type ArticleItem = {
  type: "blog";
  title: string;
  description: string;
  pubDate: Date;
  url: string;
  post: CollectionEntry<"blog">;
};
