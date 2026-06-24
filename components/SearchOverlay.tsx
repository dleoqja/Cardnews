"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { NewsArticle } from "@/lib/types";
import { CloseIcon, SearchIcon } from "./icons";
import { timeAgo } from "@/lib/utils";

interface Props {
  articles: NewsArticle[];
  open: boolean;
  onClose: () => void;
  onSelect: (article: NewsArticle) => void;
}

export function SearchOverlay({ articles, open, onClose, onSelect }: Props) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    // De-duplicate by id (the feed can repeat items across loops).
    const seen = new Set<number>();
    return articles.filter((n) => {
      if (seen.has(n.id)) return false;
      const match =
        n.title.toLowerCase().includes(query) ||
        n.summary.toLowerCase().includes(query) ||
        n.source.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query);
      if (match) seen.add(n.id);
      return match;
    });
  }, [q, articles]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex flex-col bg-paper dark:bg-ink"
        >
          <div className="flex items-center gap-2 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-ink/5 px-4 py-3 dark:bg-white/10">
              <SearchIcon className="h-5 w-5 shrink-0 text-ink/40 dark:text-white/40" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="기사 검색"
                className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink/40 dark:text-white dark:placeholder:text-white/40"
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="지우기">
                  <CloseIcon className="h-4 w-4 text-ink/40 dark:text-white/40" />
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-1 text-sm font-bold text-ink/70 dark:text-white/70"
            >
              취소
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
            {q.trim() === "" ? (
              <p className="mt-16 text-center text-sm text-ink/40 dark:text-white/40">
                제목, 출처, 카테고리로 검색해 보세요
              </p>
            ) : results.length === 0 ? (
              <p className="mt-16 text-center text-sm text-ink/40 dark:text-white/40">
                &lsquo;{q}&rsquo;에 대한 결과가 없어요
              </p>
            ) : (
              <ul className="space-y-2">
                {results.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => onSelect(a)}
                      className="flex w-full items-center gap-3 rounded-2xl p-2 text-left active:bg-ink/5 dark:active:bg-white/5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.image}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                          {a.category}
                          <span className="text-ink/40 dark:text-white/40">
                            · {timeAgo(a.publishedAt)}
                          </span>
                        </span>
                        <span className="line-clamp-2 text-sm font-bold leading-snug text-ink dark:text-white">
                          {a.title}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
