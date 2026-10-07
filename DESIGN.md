# Design

<!-- impeccable:design-schema 1 -->

## World

Rumí is a K-beauty (Korean skincare) storefront staged like a soft, sunlit vanity counter rather than a flat e-commerce grid. Every surface leans into pastel softness, generous whitespace, and fully rounded shapes — the visual language itself is meant to read as "gentle, safe for skin," reinforcing the product's trust claims (ingredientes seguros, cruelty free).

## Color

Defined in `tailwind.config.ts`.

- **Ink** — text: `ink` (#2B2320, headings/body), `ink/70`, `ink/60`, `ink/50`, `ink/40` for secondary text at decreasing emphasis.
- **Cream** — `#FFFDFB`, the page background.
- **Blush** (primary/brand) — 50→800 scale, `#FDF3F6` → `#8F2C4B`. `blush-500` (#E8688C) is the primary CTA/accent color; `blush-600` is hover/active.
- **Mint** — secondary accent (limpiadores, ingredientes seguros, bestseller badges). 50→700 scale.
- **Peach** — tertiary accent (sérums). 50→600 scale.
- **Lavender** — quaternary accent (protección solar). 50→600 scale.
- **Border** — `#EFE5E1`, used for hairline borders on cards/inputs.

Each of the four category tones (blush/mint/peach/lavender) is used consistently across category cards, product art, badges, and section accents — never mixed arbitrarily. When adding a new category, pick one of the four existing tones (don't introduce a fifth without deliberate reason).

**Important:** Tailwind class names must be static strings (never `` `bg-${tone}-100` ``) — this project hit that bug twice during the build. Use a `Record<Tone, string>` lookup object instead (see `TONE_BG` in `ProductCard.tsx` or `PRODUCT_TONE_BG` in `RoutineDetailView.tsx`).

## Type

- **Display** (`font-display` → Quicksand, 500/600/700) — all headings, buttons, badges, prices.
- **Body** (`font-body` → Inter) — body copy, form inputs, nav.
- **Script** (`font-script` → Caveat, 600/700) — the "Rumí" wordmark only. Never used for anything else.

Loaded via `next/font/google` in `src/app/layout.tsx`.

## Shape & elevation

- Cards: `rounded-xl2` (1.75rem) via `.card-surface` (`bg-white shadow-card`).
- Buttons/badges/pills: `rounded-pill` (999px) — every button, nav-active pill, category filter, and badge is a full pill.
- Large hero/banner blocks: `rounded-[2rem]` to `rounded-[2.5rem]`.
- Shadows are soft and blush-tinted, not neutral gray: `shadow-soft` (large blur, blush-tinted, for elevated overlays like the cart drawer), `shadow-card` (neutral, subtle, for product/content cards), `shadow-pop` (tight blush glow, for primary CTAs).

## Motion

- Buttons/pressables: `active:scale-[0.97]` at 150-160ms `ease-out-strong` (`cubic-bezier(0.23,1,0.32,1)`).
- Cards on hover: `-translate-y-1` or `scale-[1.04]` at 200-300ms `ease-out-strong`.
- Drawers (cart, mobile menu): `translate-x-full` ↔ `translate-x-0` at 300ms `ease-out-strong`, backdrop fades opacity in parallel. Both portaled to `document.body` (see Known gotchas below).
- Accordion (product description/how-to-use/ingredients): CSS grid-template-rows trick (`grid-rows-[0fr]` ↔ `grid-rows-[1fr]`) at 300ms — avoids animating `height: auto`.
- Toasts (add-to-cart feedback): translateY + opacity, 300ms, auto-dismiss after 2.6s.
- Reduced motion: global `@media (prefers-reduced-motion: reduce)` in `globals.css` collapses all durations to ~0.

## Components

- **ProductArt** (`src/components/illustrations/ProductArt.tsx`) — the product-photography stand-in. Seven container silhouettes (tube, dropper, toner, jar, pump, mist, stick) rendered as tone-gradient SVGs with a paper label showing the product's initials. Used everywhere a product image would go: cards, hero podium, cart lines, product detail. **Replace with real product photography as it becomes available** — swap the `<ProductArt>` usage for an `<Image>` per product without changing the surrounding layout.
- **ProductCard / CategoryCard** — the core catalog grid units. Category tone drives background + accent color.
- **CartDrawer / mobile menu** (in `Header.tsx`) — both use `createPortal(..., document.body)`. **Do not remove the portal** — see Known gotchas.
- **Toast, Wishlist, Cart** — three small React Contexts in `src/lib/`, each persisting to `localStorage` under its own key (`rumi:cart`, `rumi:wishlist`). No backend yet.

## Known gotchas (read before extending)

1. **`backdrop-blur` on `<header>` breaks child `position: fixed` overlays.** `backdrop-filter` (and `filter`, `transform`, `will-change` naming any of those) establishes a new containing block for fixed-position descendants in modern browsers. Because `Header` has `backdrop-blur` for its sticky glass effect, the cart drawer and mobile menu — originally nested inside it — were being positioned relative to the ~80px header box instead of the viewport, collapsing them to a sliver and letting page content show through. Fixed by portaling both overlays to `document.body` via `createPortal`, gated on a `mounted` state flag (portal targets don't exist during SSR). **Any new full-viewport overlay added inside `Header` must use the same portal pattern**, or live entirely outside any ancestor with `backdrop-filter`/`filter`/`transform`.
2. **Off-canvas elements can still widen the document's scrollable area even when translated out of view**, because the browser's scrollable-overflow calculation for `position: fixed` + `transform: translateX(100%)` content isn't clipped by an ancestor's `overflow: hidden`/`clip` unless that clip is on `html`/`body` specifically. This project sets `overflow-x: clip` on both `html` and `body` in `globals.css` as a blanket guard — keep it if adding more off-canvas panels.
3. **Dynamic Tailwind class strings don't work** (see Color section above) — Tailwind's compiler needs literal class names in the source; template-literal-constructed classes silently produce no CSS.

## Content status

Everything under `src/data/` is placeholder/example content built to match the pinned reference screenshot's aesthetic (see `.impeccable/surfaces/home.md` for the direction contract). Real product catalog, brand partnerships, and payment gateway are explicitly deferred per `PRODUCT.md` — replace data files in place; the types in `src/lib/types.ts` define the exact shape each page expects.
