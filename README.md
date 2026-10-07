# Rumí — Tienda de K-beauty

Tienda online de skincare coreano construida con Next.js (App Router), React y Tailwind CSS.

## Empezar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) (o el puerto que indique la terminal si el 3000 está ocupado).

## Estructura

- `src/app/` — páginas (Inicio, Tienda, Producto, Categoría, Marcas, Rutinas, Blog, Sobre nosotros, Carrito, Checkout, Cuenta)
- `src/components/` — componentes de UI reutilizables (header, footer, tarjetas de producto/categoría, carrito, etc.)
- `src/components/illustrations/ProductArt.tsx` — sistema de ilustración de envases (tubos, frascos, droppers) usado como placeholder de fotografía de producto
- `src/data/` — catálogo de ejemplo: productos, marcas, categorías, rutinas y artículos de blog
- `src/lib/` — contexto de carrito, favoritos y notificaciones (persistidos en `localStorage`)

## Estado actual (fase 1)

- **Catálogo**: productos de ejemplo con marcas K-beauty reales (Anua, innisfree, Beauty of Joseon, etc.) para ilustrar la estética — reemplázalos por tu catálogo real en `src/data/products.ts`, `brands.ts`, `categories.ts`.
- **Checkout**: el flujo de envío → pago → confirmación es completamente funcional, pero el pago está **simulado** (no hay cobros reales) hasta que se conecte una pasarela real (Wompi, MercadoPago, etc.).
- **Cuenta**: formularios de inicio de sesión/registro construidos, pendientes de conectar a un backend de autenticación real.
- **Imágenes de producto**: en vez de fotografía, se usa un sistema de ilustraciones SVG de envases (tubos, droppers, frascos) coloreado por categoría, ya que aún no hay fotografía real del catálogo. Cuando tengas fotos reales, reemplázalas en `ProductCard`, `ProductDetailView`, `HeroPodium`, etc.

## Sistema de diseño

Definido en `tailwind.config.ts` (colores `blush`/`mint`/`peach`/`lavender`, tipografías `display` = Quicksand, `body` = Inter, `script` = Caveat) y `src/app/globals.css`. Pensado para extenderse fácilmente cuando lleguen más referencias visuales.
