export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  image: string;
  content: string;
  source: string;
  sourceUrl: string;
  publishedAt: string; // ISO date string
  category: NewsCategory;
  likeCount: number;
}

export type NewsCategory =
  | "전체"
  | "속보"
  | "경제"
  | "기술"
  | "문화"
  | "스포츠"
  | "과학";

export const CATEGORIES: NewsCategory[] = [
  "전체",
  "속보",
  "경제",
  "기술",
  "문화",
  "스포츠",
  "과학",
];

/** A user interaction record persisted in IndexedDB. */
export interface InteractionRecord {
  id: number; // article id
  liked: boolean;
  bookmarked: boolean;
  read: boolean;
  likedAt: number | null; // epoch ms — used for "latest first" sorting
  bookmarkedAt: number | null;
}
