import type { NextConfig } from "next";

// CSP parcial a propósito: solo lo que no puede romper scripts, estilos ni los embeds de TikTok/Instagram.
// ponytail: sin script-src/img-src; añadir una CSP completa (con nonce) si se quiere frenar XSS de terceros.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [],
    qualities: [75, 95],
  },
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    // Las reseñas aceptan hasta 3 fotos de celular (8 MB c/u); el límite por defecto de 1 MB no alcanza.
    serverActions: {
      bodySizeLimit: "26mb",
      allowedOrigins: ["rumiskincare.com", "www.rumiskincare.com"],
    },
  },
};

export default nextConfig;
