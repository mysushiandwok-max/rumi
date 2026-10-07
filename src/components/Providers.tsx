"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { ToastProvider } from "@/lib/toast-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <ToastProvider>{children}</ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
