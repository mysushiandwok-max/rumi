import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    qualities: [75, 95],
  },
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    // Las reseñas aceptan hasta 3 fotos de celular (8 MB c/u); el límite por defecto de 1 MB no alcanza.
    serverActions: { bodySizeLimit: "26mb" },
  },
};

export default nextConfig;
