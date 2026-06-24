import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { InteractionRecord, NewsArticle } from "./types";

interface CardNewsDB extends DBSchema {
  interactions: {
    key: number;
    value: InteractionRecord;
    indexes: { likedAt: number; bookmarkedAt: number };
  };
  // Cache article snapshots so the "liked" page works fully offline,
  // even for items no longer in the current feed.
  articles: {
    key: number;
    value: NewsArticle;
  };
}

const DB_NAME = "cardnews-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<CardNewsDB>> | null = null;

function getDB() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }
  if (!dbPromise) {
    dbPromise = openDB<CardNewsDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore("interactions", { keyPath: "id" });
        store.createIndex("likedAt", "likedAt");
        store.createIndex("bookmarkedAt", "bookmarkedAt");
        db.createObjectStore("articles", { keyPath: "id" });
      },
    });
  }
  return dbPromise;
}

const empty = (id: number): InteractionRecord => ({
  id,
  liked: false,
  bookmarked: false,
  read: false,
  likedAt: null,
  bookmarkedAt: null,
});

export async function getInteraction(id: number): Promise<InteractionRecord> {
  const db = await getDB();
  return (await db.get("interactions", id)) ?? empty(id);
}

export async function getAllInteractions(): Promise<InteractionRecord[]> {
  const db = await getDB();
  return db.getAll("interactions");
}

async function upsert(
  id: number,
  patch: Partial<InteractionRecord>,
  article?: NewsArticle,
): Promise<InteractionRecord> {
  const db = await getDB();
  const current = (await db.get("interactions", id)) ?? empty(id);
  const next: InteractionRecord = { ...current, ...patch, id };
  await db.put("interactions", next);
  // Keep a snapshot of the article for offline rendering of the liked list.
  if (article) await db.put("articles", article);
  return next;
}

export async function toggleLike(
  article: NewsArticle,
): Promise<InteractionRecord> {
  const current = await getInteraction(article.id);
  const liked = !current.liked;
  return upsert(
    article.id,
    { liked, likedAt: liked ? Date.now() : null },
    article,
  );
}

export async function toggleBookmark(
  article: NewsArticle,
): Promise<InteractionRecord> {
  const current = await getInteraction(article.id);
  const bookmarked = !current.bookmarked;
  return upsert(
    article.id,
    { bookmarked, bookmarkedAt: bookmarked ? Date.now() : null },
    article,
  );
}

export async function markRead(article: NewsArticle): Promise<void> {
  const current = await getInteraction(article.id);
  if (current.read) return;
  await upsert(article.id, { read: true }, article);
}

/** Liked articles, newest first. Reads from the cached article snapshots. */
export async function getLikedArticles(): Promise<NewsArticle[]> {
  const db = await getDB();
  const all = await db.getAll("interactions");
  const liked = all
    .filter((r) => r.liked)
    .sort((a, b) => (b.likedAt ?? 0) - (a.likedAt ?? 0));

  const out: NewsArticle[] = [];
  for (const rec of liked) {
    const art = await db.get("articles", rec.id);
    if (art) out.push(art);
  }
  return out;
}

export async function getBookmarkedArticles(): Promise<NewsArticle[]> {
  const db = await getDB();
  const all = await db.getAll("interactions");
  const marked = all
    .filter((r) => r.bookmarked)
    .sort((a, b) => (b.bookmarkedAt ?? 0) - (a.bookmarkedAt ?? 0));

  const out: NewsArticle[] = [];
  for (const rec of marked) {
    const art = await db.get("articles", rec.id);
    if (art) out.push(art);
  }
  return out;
}
