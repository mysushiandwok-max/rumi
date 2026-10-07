# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js + React (user's explicit choice). Deploy target not yet specified.

## Users

Primary users are Colombian consumers (predominantly women, roughly 18–40) interested in Korean skincare (K-beauty), shopping in Colombian pesos (COP). They come to build or refine a skincare routine, discover specific Korean brands/ingredients, and buy products online with delivery across Colombia.

## Product Purpose

Rumi is a fully functional online store for Korean skincare (K-beauty) products, serving the Colombian market. It exists to give customers an approachable, trustworthy way to discover, learn about, and buy authentic Korean skincare — organized by category, brand, and skincare routine — and to check out with real order placement (payment gateway to be connected later).

## Positioning

Rumi frames skincare shopping around routines and ingredients ("tu rutina, tu momento, tu piel") rather than a flat product grid — pairing curated K-beauty brand selection with routine-building guidance (cleansers → hydrators → serums → sun protection), which a generic import/reseller storefront does not do.

## Operating Context

- Customers browse by category (Limpiadores, Hidratantes, Sérums, Protección solar), by brand, and by routine.
- Customers read blog content (skincare education/routines) and an "Sobre nosotros" (About) page.
- Customers add products to a cart, go through checkout (shipping info in Colombia, order summary), and place an order.
- Pricing displayed in COP (e.g., "$150.000").
- Free-shipping threshold promotion shown sitewide (top announcement bar).
- Customers can create an account / log in to manage orders (scope of full account features to be confirmed as it's built).

## Capabilities and Constraints

- Confirmed: full multi-page store — Inicio (home), Tienda/catálogo, página de producto individual, páginas de categoría, Marcas, Rutinas, Blog (listado + artículo), Sobre nosotros, Carrito, Checkout, Cuenta/login.
- Confirmed: cart and checkout flow must be real/functional in the frontend (state, totals, shipping form, order summary) but payment is **simulated** for now — no live payment gateway credentials exist yet. User has chosen **Bold** (Colombian payment gateway) as the provider for when real payment integration is built; will provide API keys at that time. Checkout must be structured so a real gateway can be dropped in without a rework.
- Decided: full backend (database, real auth, real payment integration, admin panel) is intentionally deferred — user wants the frontend/design phase finished first (more reference images incoming) before starting backend work.
- Confirmed: product catalog is **placeholder/example data** for now (realistic K-beauty products/brands, e.g. Anua, Innisfree, Centella-style names, matching the reference screenshot), structured so the user can swap in their real catalog later.
- Open: real backend/persistence, real payment integration, real account system (auth provider), and real inventory — all deferred until the user provides the missing pieces (payment provider choice + keys, real product data).
- Open: the user will send additional reference images over time to complete/extend pages beyond the homepage; the design system must be established cleanly enough to extend without rework.

## Brand Commitments

- Name: **Rumi**, wordmark set in a pink script/handwritten-style typeface with a small leaf mark, centered in the header.
- Visual reference provided by user (homepage screenshot) is binding for aesthetic direction: soft pastel palette (pink primary, mint green, peach, lavender as category accent colors), warm/rounded friendly typography, generous whitespace, soft rounded cards, K-beauty/Korean-skincare visual vibe. Full direction captured in DESIGN.md.
- Voice: Spanish (Colombia), warm and approachable, not clinical.

## Evidence on Hand

- One reference image (homepage) supplied by the user, described in detail (announcement bar, header/nav, hero, 4 category cards, "Lo más amado" product grid). This is the binding visual authority for the homepage and the seed for the rest of the system.
- No real product catalog, no brand assets beyond the wordmark concept, no payment provider account yet. Future work must not fabricate real testimonials, press mentions, or specific brand partnerships beyond what the user confirms.

## Product Principles

1. Routine-first framing: organize discovery around skin routines and categories, not just a raw product list.
2. Trust through softness: the pastel, rounded, high-whitespace aesthetic itself signals gentleness/safety — consistent with "Ingredientes seguros" / "Cruelty free" messaging.
3. Build for extension: checkout, catalog, and design system must be swappable (real payment gateway, real product data, more reference imagery) without structural rework.
4. Colombia-local commerce details: COP pricing formatting, national shipping framing, and Spanish (Colombia) copy throughout.

## Accessibility & Inclusion

No product-specific accessibility requirement was established beyond standard web accessibility practice (to be upheld as a baseline during build).
