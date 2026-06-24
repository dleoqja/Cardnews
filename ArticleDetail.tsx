"use client";

import { motion, type PanInfo } from "framer-motion";
import { useEffect } from "react";
import type { NewsArticle } from "@/lib/types";
import { useInteractions } from "@/lib/store";
import { ActionBar } from "./ActionBar";
import { CloseIcon, ExternalIcon } from "./icons";
import { formatDate } from "@/lib/utils";

interface Props {
  article: NewsArticle;
  onClose: () => void;
}

export function ArticleDetail({ article, onClose }: Props) {
  const { markRead } = useInteractions();

  useEffect(() => {
    markRead(article);
    // lock background scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [article, markRead]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  }

  const paragraphs = article.content.split("\n").filter((p) => p.trim());

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 320 }}
      drag="y"
      dragDirectionLock
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={handleDragEnd}
      className="fixed inset-0 z-50 flex flex-col bg-paper dark:bg-ink"
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
    >
      {/* Top bar */}
      <div className="relative z-10 flex shrink-0 items-center justify-between px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mx-auto h-1.5 w-12 -translate-y-1 rounded-full bg-ink/15 dark:bg-white/20" />
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] grid h-10 w-10 place-items-center rounded-full bg-ink/5 text-ink active:scale-90 dark:bg-white/10 dark:text-white"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <article className="mx-auto max-w-2xl px-5 pb-28">
          {/* Hero image */}
          <div className="-mx-5 mb-6 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt=""
              className="aspect-[4/3] w-full object-cover"
              draggable={false}
            />
          </div>

          <div className="mb-3 flex items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-accent">
              {article.category}
            </span>
            <span className="text-ink/45 dark:text-white/45">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h1 className="text-[28px] font-extrabold leading-[1.25] tracking-[-0.02em] text-ink dark:text-white">
            {article.title}
          </h1>

          <p className="mt-4 border-l-[3px] border-accent pl-4 text-[17px] font-medium leading-relaxed text-ink/70 dark:text-white/70">
            {article.summary}
          </p>

          <div className="mt-7 space-y-5">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.85] tracking-[-0.01em] text-ink/85 dark:text-white/80"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Source */}
          <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-surface-dark">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 dark:text-white/40">
              출처
            </p>
            <p className="mt-1 text-base font-bold text-ink dark:text-white">
              {article.source}
            </p>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3.5 text-sm font-bold text-white active:scale-[0.98] dark:bg-white dark:text-ink"
            >
              원문 보기
              <ExternalIcon className="h-4 w-4" />
            </a>
          </div>
        </article>
      </div>

      {/* Floating actions */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto rounded-full border border-ink/10 bg-white/90 px-5 py-2.5 shadow-card backdrop-blur-xl dark:border-white/10 dark:bg-surface-dark/90">
          <ActionBar article={article} variant="detail" />
        </div>
      </div>
    </motion.div>
  );
}
