"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";

export type CartLine = {
  productSlug: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (productSlug: string, quantity?: number) => void;
  removeItem: (productSlug: string) => void;
  setQuantity: (productSlug: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
  isReady: boolean;
  getProduct: (productSlug: string) => Product | undefined;
  isOpen: boolean;
  // origin (coordenadas de pantalla): el drawer se abre como un círculo que crece desde ahí en vez de deslizarse.
  openCart: (origin?: { x: number; y: number }) => void;
  revealFrom: { x: number; y: number } | null;
  closeCart: () => void;
  // Productos recién agregados (en orden) y un contador que sube en cada agregado: el drawer lo usa para
  // repetir la animación de entrada aunque el producto ya estuviera en el carrito.
  lastAdded: string[];
  addedNonce: number;
  // En qué agregado (addedNonce) entró por última vez cada producto; sirve de key estable para la animación.
  addedAt: Record<string, number>;
  markAdded: (productSlugs: string | string[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "rumi:cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [catalog, setCatalog] = useState<Map<string, Product>>(new Map());
  const [isOpen, setIsOpen] = useState(false);
  const [revealFrom, setRevealFrom] = useState<{ x: number; y: number } | null>(null);
  const [lastAdded, setLastAdded] = useState<string[]>([]);
  const [addedNonce, setAddedNonce] = useState(0);
  const addedNonceRef = useRef(0);
  const [addedAt, setAddedAt] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage, unavailable during SSR render
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed local storage
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((products: Product[]) => {
        setCatalog(new Map(products.map((product) => [product.slug, product])));
      })
      .catch(() => {
        // catalog fetch failed; cart still works, prices just won't show until it succeeds
      });
  }, []);

  const getProduct = useCallback((productSlug: string) => catalog.get(productSlug), [catalog]);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable; cart still works in-memory
    }
  }, [lines, isReady]);

  const addItem = useCallback((productSlug: string, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.productSlug === productSlug);
      if (existing) {
        return prev.map((line) =>
          line.productSlug === productSlug
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }
      return [...prev, { productSlug, quantity }];
    });
  }, []);

  const removeItem = useCallback((productSlug: string) => {
    setLines((prev) => prev.filter((line) => line.productSlug !== productSlug));
  }, []);

  const setQuantity = useCallback((productSlug: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) {
        return prev.filter((line) => line.productSlug !== productSlug);
      }
      return prev.map((line) =>
        line.productSlug === productSlug ? { ...line, quantity } : line
      );
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const openCart = useCallback((origin?: { x: number; y: number }) => {
    setRevealFrom(origin ?? null);
    setIsOpen(true);
  }, []);
  const closeCart = useCallback(() => {
    setRevealFrom(null);
    setIsOpen(false);
  }, []);

  const markAdded = useCallback((productSlugs: string | string[]) => {
    const nonce = ++addedNonceRef.current;
    const slugs = Array.isArray(productSlugs) ? productSlugs : [productSlugs];
    setLastAdded(slugs);
    setAddedNonce(nonce);
    setAddedAt((current) => ({ ...current, ...Object.fromEntries(slugs.map((slug) => [slug, nonce])) }));
    window.setTimeout(() => {
      // Solo limpia si nadie agregó otra cosa mientras tanto.
      if (addedNonceRef.current === nonce) setLastAdded([]);
    }, 2200);
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const product = catalog.get(line.productSlug);
        return product ? sum + product.price * line.quantity : sum;
      }, 0),
    [lines, catalog]
  );

  const value = useMemo(
    () => ({
      lines,
      addItem,
      removeItem,
      setQuantity,
      clear,
      itemCount,
      subtotal,
      isReady,
      getProduct,
      isOpen,
      openCart,
      closeCart,
      revealFrom,
      lastAdded,
      addedNonce,
      addedAt,
      markAdded,
    }),
    [
      lines,
      addItem,
      removeItem,
      setQuantity,
      clear,
      itemCount,
      subtotal,
      isReady,
      getProduct,
      isOpen,
      openCart,
      closeCart,
      revealFrom,
      lastAdded,
      addedNonce,
      addedAt,
      markAdded,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
