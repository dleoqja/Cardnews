"use client";

import { motion, type PanInfo } from "framer-motion";
import { useState } from "react";
import type { NewsArticle } from "@/lib/types";
import { useInteractions } from "@/lib/store";
import { ActionBar } from "./ActionBar";
import { ChevronUpIcon } from "./icons";
import { timeAgo } from "@/lib/utils";

interface Props {
  article: NewsArticle;
  onOpenDetail: () => void;
}

export function NewsCard({ article, onOpenDetail }: Props) {
  const { get } = useInteractions();
  const read = get(article.id).read;
  const [loaded, setLoaded] = useState(false);

  function handlePillDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y < -60 || info.velocity.y < -500) onOpenDetail();
  }

  return (
    <section className="relative h-[100svh] w-full snap-start snap-always overflow-hidden bg-ink">
      {/* Background image */}
      <div className="absolute inset-0">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-surface-dark to-ink" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image}
          alt=""
          onLoad={() => setLoaded(true)}
          draggable={false}
          className={`h-full w-full object-cover transition-all duration-700 ${
            loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />
        {/* Scrims: top for status, bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      </div>

      {/* Right action rail */}
      <div className="absolute bottom-44 right-3 z-10">
        <ActionBar article={article} variant="feed" />
      </div>

      {/* Content block */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
        <div className="max-w-[88%] pr-12">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-white/70">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                article.category === "속보"
                  ? "bg-accent text-white"
                  : "bg-white/20 text-white"
              }`}
            >
              {article.category === "속보" ? "● 속보" : article.category}
            </span>
            <span className="font-bold text-white/90">{article.source}</span>
            <span aria-hidden>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
            {read && <span className="text-white/55">· 읽음</span>}
          </div>

          <h2 className="text-[26px] font-extrabold leading-[1.22] tracking-[-0.02em] text-white drop-shadow-sm [text-wrap:balance]">
            {article.title}
          </h2>

          <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-white/80">
            {article.summary}
          </p>
        </div>

        {/* Open-detail affordance: tap or swipe up */}
        <motion.button
          onClick={onOpenDetail}
          drag="y"
          dragSnapToOrigin
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.5, bottom: 0 }}
          onDragEnd={handlePillDragEnd}
          whileTap={{ scale: 0.97 }}
          className="group mt-5 flex w-full touch-pan-x items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 py-3.5 text-sm font-bold text-white backdrop-blur-xl"
          aria-label="기사 자세히 보기"
        >
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <ChevronUpIcon className="h-4 w-4" />
            기사 보기
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
}
