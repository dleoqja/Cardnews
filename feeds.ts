import type { NewsCategory } from "./types";

/**
 * Curated Korean news RSS sources.
 *
 * Each feed is mapped to one of the app's categories. The API route fetches
 * these server-side (avoiding browser CORS limits), skips any feed that is
 * unreachable, and merges the rest into a single freshest-first timeline.
 *
 * Feeds occasionally change or go offline — that's expected. The aggregator
 * degrades gracefully: dead feeds are skipped, and if *every* feed fails the
 * app falls back to bundled sample articles. To add/remove a source, just edit
 * this list.
 */
export interface FeedSource {
  url: string;
  source: string; // display name shown on the card
  category: NewsCategory;
}

export const FEEDS: FeedSource[] = [
  // 속보 / 종합 (headline)
  { url: "https://www.yna.co.kr/rss/news.xml", source: "연합뉴스", category: "속보" },
  { url: "https://fs.jtbc.co.kr/RSS/newsflash.xml", source: "JTBC", category: "속보" },
  { url: "https://rss.nocutnews.co.kr/nocutnews.xml", source: "노컷뉴스", category: "속보" },
  { url: "https://www.hani.co.kr/rss/", source: "한겨레", category: "속보" },

  // 경제
  { url: "https://www.yna.co.kr/rss/economy.xml", source: "연합뉴스", category: "경제" },
  { url: "https://www.khan.co.kr/rss/rssdata/economy.xml", source: "경향신문", category: "경제" },
  { url: "https://rss.donga.com/economy.xml", source: "동아일보", category: "경제" },
  { url: "https://www.hani.co.kr/rss/economy/", source: "한겨레", category: "경제" },

  // 기술 (IT)
  { url: "https://www.yna.co.kr/rss/it.xml", source: "연합뉴스", category: "기술" },
  { url: "https://www.khan.co.kr/rss/rssdata/itnews.xml", source: "경향신문", category: "기술" },

  // 과학
  { url: "https://rss.donga.com/science.xml", source: "동아일보", category: "과학" },
  { url: "https://www.hani.co.kr/rss/science/", source: "한겨레", category: "과학" },

  // 문화
  { url: "https://www.yna.co.kr/rss/culture.xml", source: "연합뉴스", category: "문화" },
  { url: "https://www.khan.co.kr/rss/rssdata/culture.xml", source: "경향신문", category: "문화" },
  { url: "https://rss.donga.com/culture.xml", source: "동아일보", category: "문화" },

  // 스포츠
  { url: "https://www.yna.co.kr/rss/sports.xml", source: "연합뉴스", category: "스포츠" },
  { url: "https://www.khan.co.kr/rss/rssdata/kh_sports.xml", source: "경향신문", category: "스포츠" },
  { url: "https://rss.donga.com/sports.xml", source: "동아일보", category: "스포츠" },
];

/** Feeds for a given category. "전체" returns every source. */
export function feedsForCategory(category: NewsCategory): FeedSource[] {
  if (category === "전체") return FEEDS;
  return FEEDS.filter((f) => f.category === category);
}
