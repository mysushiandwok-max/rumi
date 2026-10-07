import type { Metadata } from "next";
import { TiendaClient } from "@/components/TiendaClient";
import { getAllProducts } from "@/data/products";
import { getAllCategories } from "@/data/categories";
import { brands } from "@/data/brands";

export const metadata: Metadata = { title: "Tienda" };
export const dynamic = "force-dynamic";

export default function TiendaPage() {
  const products = getAllProducts();
  const categories = getAllCategories();
  return <TiendaClient products={products} categories={categories} brands={brands} />;
}
