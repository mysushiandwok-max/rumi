import { NextResponse } from "next/server";
import { getAllProducts } from "@/data/products";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getAllProducts());
}
