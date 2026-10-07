import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";

// Fuentes locales (paquetes @fontsource): next/font/google descarga de Google en cada build y falla en Hostinger.
const quicksand = localFont({
  src: [
    { path: "../../node_modules/@fontsource/quicksand/files/quicksand-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/quicksand/files/quicksand-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/quicksand/files/quicksand-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-quicksand",
  display: "swap",
});

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

const caveat = localFont({
  src: [
    { path: "../../node_modules/@fontsource/caveat/files/caveat-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/caveat/files/caveat-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rumí — K-beauty coreano para tu piel",
    template: "%s · Rumí",
  },
  description:
    "Tienda online de skincare coreano en Colombia. Fórmulas suaves, ingredientes efectivos y rutinas hechas para tu piel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" className={`${quicksand.variable} ${inter.variable} ${caveat.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
