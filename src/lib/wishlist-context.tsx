"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WishlistContextValue = {
  slugs: string[];
  toggle: (productSlug: string) => void;
  has: (productSlug: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "rumi:wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage, unavailable during SSR render
      if (raw) setSlugs(JSON.parse(raw));
    } catch {
      // ignore malformed local storage
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      // storage unavailable; wishlist still works in-memory
    }
  }, [slugs, isReady]);

  const toggle = useCallback((productSlug: string) => {
    setSlugs((prev) =>
      prev.includes(productSlug)
        ? prev.filter((slug) => slug !== productSlug)
        : [...prev, productSlug]
    );
  }, []);

  const has = useCallback((productSlug: string) => slugs.includes(productSlug), [slugs]);

  const value = useMemo(() => ({ slugs, toggle, has }), [slugs, toggle, has]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
