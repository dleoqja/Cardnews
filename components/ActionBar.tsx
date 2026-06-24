"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { NewsArticle } from "@/lib/types";
import { useInteractions } from "@/lib/store";
import { formatCount } from "@/lib/utils";
import {
  BookmarkIcon,
  HeartIcon,
  ShareIcon,
} from "./icons";

interface Props {
  article: NewsArticle;
  variant?: "feed" | "detail";
}

export function ActionBar({ article, variant = "feed" }: Props) {
  const { get, toggleLike, toggleBookmark } = useInteractions();
  const state = get(article.id);
  const [burst, setBurst] = useState(0);
  const [copied, setCopied] = useState(false);

  const likeCount = article.likeCount + (state.liked ? 1 : 0);

  function handleLike() {
    if (!state.liked) setBurst((b) => b + 1);
    void toggleLike(article);
    if (navigator.vibrate) navigator.vibrate(8);
  }

  async function handleShare() {
    const shareData = {
      title: article.title,
      text: article.summary,
      url:
        typeof window !== "undefined"
          ? `${window.location.origin}/?id=${article.id}`
          : article.sourceUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      /* user cancelled — ignore */
    }
  }

  const dark = variant === "feed";
  const btn =
    "flex flex-col items-center gap-1 select-none active:scale-90 transition-transform";
  const pill = dark
    ? "h-12 w-12 rounded-full grid place-items-center backdrop-blur-md bg-white/15 text-white"
    : "h-11 w-11 rounded-full grid place-items-center bg-black/5 dark:bg-white/10 text-ink dark:text-white";
  const label = dark
    ? "text-[11px] font-semibold text-white/90 tabular-nums"
    : "text-[11px] font-semibold text-ink/60 dark:text-white/60 tabular-nums";

  return (
    <div
      className={
        variant === "feed"
          ? "flex flex-col items-center gap-5"
          : "flex items-center gap-6"
      }
    >
      {/* Like */}
      <button onClick={handleLike} className={btn} aria-label="좋아요">
        <span className={`relative ${pill} ${state.liked ? "!bg-accent !text-white" : ""}`}>
          <HeartIcon filled={state.liked} className="h-6 w-6" />
          {/* burst particles */}
          <AnimatePresence>
            {burst > 0 && (
              <motion.span
                key={burst}
                initial={{ scale: 0, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 rounded-full bg-accent"
              />
            )}
          </AnimatePresence>
        </span>
        <AnimatedCount value={likeCount} className={label} />
      </button>

      {/* Bookmark */}
      <button
        onClick={() => {
          void toggleBookmark(article);
          if (navigator.vibrate) navigator.vibrate(8);
        }}
        className={btn}
        aria-label="북마크"
      >
        <span
          className={`${pill} ${state.bookmarked ? "!bg-white !text-ink dark:!bg-white dark:!text-ink" : ""}`}
        >
          <BookmarkIcon filled={state.bookmarked} className="h-[22px] w-[22px]" />
        </span>
        <span className={label}>저장</span>
      </button>

      {/* Share */}
      <button onClick={handleShare} className={btn} aria-label="공유">
        <span className={pill}>
          <ShareIcon className="h-5 w-5" />
        </span>
        <span className={label}>{copied ? "복사됨" : "공유"}</span>
      </button>
    </div>
  );
}

function AnimatedCount({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className={`relative block h-4 overflow-hidden ${className ?? ""}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="block"
        >
          {formatCount(value)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
