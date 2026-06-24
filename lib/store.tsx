"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { InteractionRecord, NewsArticle } from "./types";
import * as db from "./db";

interface StoreValue {
  ready: boolean;
  records: Map<number, InteractionRecord>;
  get: (id: number) => InteractionRecord;
  toggleLike: (a: NewsArticle) => Promise<void>;
  toggleBookmark: (a: NewsArticle) => Promise<void>;
  markRead: (a: NewsArticle) => void;
  refresh: () => Promise<void>;
}

const empty = (id: number): InteractionRecord => ({
  id,
  liked: false,
  bookmarked: false,
  read: false,
  likedAt: null,
  bookmarkedAt: null,
});

const StoreContext = createContext<StoreValue | null>(null);

export function InteractionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [records, setRecords] = useState<Map<number, InteractionRecord>>(
    new Map(),
  );
  const [ready, setReady] = useState(false);
  const pendingRead = useRef<Set<number>>(new Set());

  const load = useCallback(async () => {
    try {
      const all = await db.getAllInteractions();
      setRecords(new Map(all.map((r) => [r.id, r])));
    } catch (e) {
      console.error("Failed to load interactions", e);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const get = useCallback(
    (id: number) => records.get(id) ?? empty(id),
    [records],
  );

  const apply = useCallback((rec: InteractionRecord) => {
    setRecords((prev) => {
      const next = new Map(prev);
      next.set(rec.id, rec);
      return next;
    });
  }, []);

  const toggleLike = useCallback(
    async (a: NewsArticle) => {
      const current = records.get(a.id) ?? empty(a.id);
      // optimistic
      apply({
        ...current,
        liked: !current.liked,
        likedAt: !current.liked ? Date.now() : null,
      });
      try {
        const saved = await db.toggleLike(a);
        apply(saved);
      } catch (e) {
        console.error(e);
        apply(current); // rollback
      }
    },
    [records, apply],
  );

  const toggleBookmark = useCallback(
    async (a: NewsArticle) => {
      const current = records.get(a.id) ?? empty(a.id);
      apply({
        ...current,
        bookmarked: !current.bookmarked,
        bookmarkedAt: !current.bookmarked ? Date.now() : null,
      });
      try {
        const saved = await db.toggleBookmark(a);
        apply(saved);
      } catch (e) {
        console.error(e);
        apply(current);
      }
    },
    [records, apply],
  );

  const markRead = useCallback(
    (a: NewsArticle) => {
      const current = records.get(a.id) ?? empty(a.id);
      if (current.read || pendingRead.current.has(a.id)) return;
      pendingRead.current.add(a.id);
      apply({ ...current, read: true });
      void db.markRead(a).catch((e) => console.error(e));
    },
    [records, apply],
  );

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      records,
      get,
      toggleLike,
      toggleBookmark,
      markRead,
      refresh: load,
    }),
    [ready, records, get, toggleLike, toggleBookmark, markRead, load],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useInteractions(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useInteractions must be used within InteractionProvider");
  }
  return ctx;
}
