"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { NewsArticle } from "@/lib/types";
import { getLikedArticles } from "@/lib/db";
import { useInteractions } from "@/lib/store";
import { useTheme } from "@/components/ThemeProvider";
import { ArticleDetail } from "@/components/ArticleDetail";
import {
  HeartIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "@/components/icons";
import { timeAgo } from "@/lib/utils";

export default function LikedPage() {
  const { records, ready, toggleLike, get } = useInteractions();
  const { theme, toggle } = useTheme();
  const [liked, setLiked] = useState<NewsArticle[]>([]);
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  // Reload list whenever interaction records change (e.g. unlike).
  useEffect(() => {
    let cancelled = false;
    getLikedArticles().then((list) => {
      if (!cancelled) {
        setLiked(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [records]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    // Keep only items still liked (in case of optimistic unlike).
    const stillLiked = liked.filter((a) => get(a.id).liked);
    if (!query) return stillLiked;
    return stillLiked.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.source.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query),
    );
  }, [liked, q, get]);

  return (
    <div className="min-h-[100svh] bg-paper pb-24 dark:bg-ink">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-paper/85 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl dark:bg-ink/85">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-ink dark:text-white">
            <HeartIcon filled className="h-6 w-6 text-accent" />
            좋아요한 기사
          </h1>
          <button
            onClick={toggle}
            aria-label="테마 전환"
            className="grid h-10 w-10 place-items-center rounded-full bg-ink/5 text-ink active:scale-90 dark:bg-white/10 dark:text-white"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-ink/5 px-4 py-3 dark:bg-white/10">
          <SearchIcon className="h-5 w-5 shrink-0 text-ink/40 dark:text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="저장한 기사 검색"
            className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink/40 dark:text-white dark:placeholder:text-white/40"
          />
        </div>
      </header>

      {/* List */}
      <div className="px-4 pt-3">
        {!ready || loading ? (
          <SkeletonList />
        ) : filtered.length === 0 ? (
          <EmptyState hasQuery={q.trim().length > 0} />
        ) : (
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {filtered.map((a) => (
                <motion.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-3xl border border-ink/[0.06] bg-surface-light shadow-sm dark:border-white/[0.06] dark:bg-surface-dark"
                >
                  <button
                    onClick={() => setDetail(a)}
                    className="flex w-full items-stretch gap-3 p-3 text-left active:bg-ink/[0.03] dark:active:bg-white/[0.03]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.image}
                      alt=""
                      className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-accent">
                        {a.category}
                        <span className="font-medium text-ink/40 dark:text-white/40">
                          · {a.source} · {timeAgo(a.publishedAt)}
                        </span>
                      </span>
                      <span className="line-clamp-2 text-[15px] font-extrabold leading-snug text-ink dark:text-white">
                        {a.title}
                      </span>
                      <span className="mt-auto flex items-center justify-end pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            void toggleLike(a);
                          }}
                          className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent active:scale-95"
                          aria-label="좋아요 취소"
                        >
                          <HeartIcon filled className="h-4 w-4" />
                          좋아요 취소
                        </button>
                      </span>
                    </div>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <AnimatePresence>
        {detail && (
          <ArticleDetail article={detail} onClose={() => setDetail(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="grid place-items-center px-8 pt-28 text-center">
      <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-accent/10">
        <HeartIcon className="h-9 w-9 text-accent" />
      </div>
      <p className="text-lg font-extrabold text-ink dark:text-white">
        {hasQuery ? "검색 결과가 없어요" : "아직 좋아요한 기사가 없어요"}
      </p>
      <p className="mt-1.5 max-w-xs text-sm text-ink/50 dark:text-white/50">
        {hasQuery
          ? "다른 검색어로 다시 시도해 보세요."
          : "피드에서 마음에 드는 기사에 하트를 눌러보세요. 여기에 모아드릴게요."}
      </p>
    </div>
  );
}

function SkeletonList() {
  return (
    <ul className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-3xl border border-ink/[0.06] bg-surface-light p-3 dark:border-white/[0.06] dark:bg-surface-dark"
        >
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-2xl bg-ink/5 dark:bg-white/5" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 w-24 animate-pulse rounded bg-ink/5 dark:bg-white/5" />
            <div className="h-4 w-full animate-pulse rounded bg-ink/5 dark:bg-white/5" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-ink/5 dark:bg-white/5" />
          </div>
        </li>
      ))}
    </ul>
  );
}
