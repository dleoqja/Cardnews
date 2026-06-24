import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import type { NewsArticle, NewsCategory } from "@/lib/types";
import { feedsForCategory, type FeedSource } from "@/lib/feeds";

// The route reads query params (category/page) so it renders dynamically.
// Upstream RSS fetches are cached for 10 minutes via their own revalidate
// option, which keeps the feed fresh without hammering the sources.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true,
});

/** Stable positive integer hash from a string (djb2). Used for article ids. */
function hashId(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  // Keep within a safe positive range.
  return Math.abs(h % 2_000_000_000) + 1;
}

function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

/** Pull the first usable image URL out of a feed item, if any. */
function extractImage(item: Record<string, unknown>): string | null {
  const candidates: unknown[] = [
    item["media:content"],
    item["media:thumbnail"],
    item["enclosure"],
  ];
  for (const c of candidates) {
    const arr = Array.isArray(c) ? c : c ? [c] : [];
    for (const entry of arr) {
      const url = (entry as Record<string, string>)?.["@_url"];
      const type = (entry as Record<string, string>)?.["@_type"];
      if (url && (!type || type.startsWith("image"))) return url;
    }
  }
  // Fall back to the first <img> embedded in the description / content.
  const htmlFields = [item["content:encoded"], item["description"], item["summary"]];
  for (const field of htmlFields) {
    const html = typeof field === "string" ? field : "";
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m?.[1]) return m[1];
  }
  return null;
}

function getText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const t = (value as Record<string, unknown>)["#text"];
    if (typeof t === "string") return t;
  }
  return "";
}

function parseDate(item: Record<string, unknown>): string {
  const raw =
    getText(item["pubDate"]) ||
    getText(item["dc:date"]) ||
    getText(item["published"]) ||
    getText(item["updated"]);
  const d = raw ? new Date(raw) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function itemLink(item: Record<string, unknown>): string {
  const link = item["link"];
  if (typeof link === "string") return link;
  if (Array.isArray(link)) {
    const alt = link.find(
      (l) => (l as Record<string, string>)?.["@_rel"] !== "self",
    );
    return (
      (alt as Record<string, string>)?.["@_href"] ||
      (link[0] as Record<string, string>)?.["@_href"] ||
      ""
    );
  }
  if (link && typeof link === "object") {
    return (link as Record<string, string>)["@_href"] || "";
  }
  return getText(item["guid"]) || getText(item["id"]);
}

async function fetchFeed(feed: FeedSource): Promise<NewsArticle[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CardNewsBot/1.0)" },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const data = parser.parse(xml);

    const rawItems: Record<string, unknown>[] =
      data?.rss?.channel?.item ??
      data?.feed?.entry ??
      data?.["rdf:RDF"]?.item ??
      [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    const out: NewsArticle[] = [];
    for (const item of items) {
      const link = itemLink(item);
      const title = stripHtml(getText(item["title"]));
      if (!title || !link) continue;

      const bodyHtml =
        getText(item["content:encoded"]) ||
        getText(item["description"]) ||
        getText(item["summary"]) ||
        "";
      const body = stripHtml(bodyHtml);
      const id = hashId(link);
      const image =
        extractImage(item) ??
        `https://picsum.photos/seed/${id}/900/1100`;

      out.push({
        id,
        title: truncate(title, 80),
        summary: truncate(body || title, 140),
        image,
        content: body || title,
        source: feed.source,
        sourceUrl: link,
        publishedAt: parseDate(item),
        category: feed.category,
        // RSS has no like counts; derive a stable pseudo-count from the id so
        // the number doesn't jump around between reloads.
        likeCount: (id % 4000) + 50,
      });
    }
    return out;
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") || "전체") as NewsCategory;
  const page = Math.max(0, parseInt(searchParams.get("page") || "0", 10));

  const feeds = feedsForCategory(category);
  const results = await Promise.all(feeds.map(fetchFeed));

  // Merge, dedupe by id, sort newest first.
  const byId = new Map<number, NewsArticle>();
  for (const list of results) {
    for (const article of list) {
      if (!byId.has(article.id)) byId.set(article.id, article);
    }
  }
  const all = Array.from(byId.values()).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  // Signal to the client that live data was unavailable so it can fall back.
  if (all.length === 0) {
    return NextResponse.json({ items: [], hasMore: false, empty: true });
  }

  const start = page * PAGE_SIZE;
  const items = all.slice(start, start + PAGE_SIZE);
  const hasMore = start + PAGE_SIZE < all.length;

  return NextResponse.json({ items, hasMore, empty: false });
}
