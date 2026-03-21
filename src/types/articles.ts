import type { CollectionEntry } from "astro:content";

export interface QiitaArticle {
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_icon: string;
  tags: string[];
  likes_count: number;
  ogImage?: string | null;
  body: string;
}

export interface ZennArticle {
  slug: string;
  title: string;
  url: string;
  published_at: string;
  liked_count: number;
  emoji: string;
  ogImage?: string | null;
}

export interface SpeakerDeckSlide {
  id: string;
  title: string;
  url: string;
  published_at: string;
  thumbnail: string;
}

export type ArticleItem = {
  type: "blog";
  title: string;
  description: string;
  pubDate: Date;
  url: string;
  post: CollectionEntry<"blog">;
};
