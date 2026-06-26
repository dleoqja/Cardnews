"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES, type NewsArticle, type NewsCategory } from "@/lib/types";
import { fetchNewsPage, getArticleById } from "@/lib/data";
import { useInteractions } from "@/lib/store";
import { useTheme } from "./ThemeProvider";
import { NewsCard } from "./NewsCard";
import { SkeletonCard } from "./SkeletonCard";
import { ArticleDetail } from "./ArticleDetail";
import { SearchOverlay } from "./SearchOverlay";
import { MoonIcon, SearchIcon, SunIcon } from "./icons";

export function NewsFeed() {
  const { markRead } = useInteractions();
  const { theme, toggle } = useTheme();

  const [items, setItems] = useState<NewsArticle[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<NewsCategory>("전체");
  const [detail, setDetail] = useState<NewsArticle | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const dwellTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const loadMore = useCallback(
    async (reset = false) => {
      if (loadingRef.current) return;
      if (!hasMoreRef.current && !reset) return;
      loadingRef.current = true;
      setLoading(true);
      const nextPage = reset ? 0 : pageRef.current;
      const { items: newItems, hasMore: more } = await fetchNewsPage(
        nextPage,
        category,
      );
      pageRef.current = nextPage + 1;
      hasMoreRef.current = more;
      setItems((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(more);
      setLoading(false);
      loadingRef.current = false;
      // sentinel이 여전히 뷰포트 안에 있으면 다음 페이지를 즉시 로드
      if (more && sentinelRef.current && scrollerRef.current) {
        const sentinel = sentinelRef.current.getBoundingClientRect();
        const container = scrollerRef.current.getBoundingClientRect();
        if (sentinel.top <= container.bottom + 600) {
          void loadMore();
        }
      }
    },
    [category],
  );

  // Initial + category change load
  useEffect(() => {
    pageRef.current = 0;
    hasMoreRef.current = true;
    setItems([]);
    setHasMore(true);
    if (scrollerRef.current) scrollerRef.current.scrollTo({ top: 0 });
    void loadMore(true);
  }, [category, loadMore]);

  // Deep link: /?id=123 opens detail
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      void getArticleById(Number(id)).then((article) => {
        if (article) setDetail(article);
      });
    }
  }, []);

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          void loadMore();
        }
      },
      { root: scrollerRef.current, rootMargin: "120%" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  // Mark read after dwelling on a card
  const handleCardRef = useCallback(
    (node: HTMLElement | null, article: NewsArticle) => {
      if (!node) return;
      const io = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          if (e.intersectionRatio >= 0.8) {
            if (!dwellTimers.current.has(article.id)) {
              const t = setTimeout(() => markRead(article), 1300);
              dwellTimers.current.set(article.id, t);
            }
          } else {
            const t = dwellTimers.current.get(article.id);
            if (t) {
              clearTimeout(t);
              dwellTimers.current.delete(article.id);
            }
          }
        },
        { threshold: [0, 0.8] },
      );
      io.observe(node);
    },
    [markRead],
  );

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-ink">
      {/* Top header */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="pointer-events-auto flex items-center gap-1.5 text-lg font-extrabold tracking-tight text-white">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-accent text-sm">
              ⚡
            </span>
            오늘의 카드
          </span>
          <div className="pointer-events-auto flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="검색"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md active:scale-90"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            <button
              onClick={toggle}
              aria-label="테마 전환"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md active:scale-90"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className="pointer-events-auto flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold backdrop-blur-md transition-colors ${
                category === c
                  ? "bg-white text-ink"
                  : "bg-white/10 text-white/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {/* Feed scroller */}
      <div
        ref={scrollerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ overflowAnchor: "none" }}
      >
        {items.length === 0 && loading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((article) => (
              <div
                key={article.id}
                ref={(node) => handleCardRef(node, article)}
              >
                <NewsCard
                  article={article}
                  onOpenDetail={() => setDetail(article)}
                />
              </div>
            ))}

        {/* Sentinel은 SkeletonCard 앞에 배치해 마지막 카드 도달 시 미리 로딩 시작 */}
        <div ref={sentinelRef} className="h-1 w-full" />
        {hasMore && items.length > 0 && <SkeletonCard />}

        {!hasMore && items.length > 0 && (
          <div className="grid h-[100svh] w-full snap-start place-items-center bg-ink px-8 text-center">
            <div>
              <p className="text-2xl font-extrabold text-white">
                오늘 소식은 여기까지예요
              </p>
              <p className="mt-2 text-sm text-white/50">
                위로 스와이프해 다시 둘러보거나, 다른 카테고리를 골라보세요.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {detail && (
          <ArticleDetail article={detail} onClose={() => setDetail(null)} />
        )}
      </AnimatePresence>

      {/* Search */}
      <SearchOverlay
        articles={items}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(a) => {
          setSearchOpen(false);
          setDetail(a);
        }}
      />
    </div>
  );
}
