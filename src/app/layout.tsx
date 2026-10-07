import type { Metadata } from "next";
import { Quicksand, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
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
