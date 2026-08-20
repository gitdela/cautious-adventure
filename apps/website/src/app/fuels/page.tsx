import type { Metadata } from "next";

import { getFuelProducts, getPumpPrices } from "@/lib/sanity/data";

import { FuelSections } from "../fuel/fuel-sections";

export const metadata: Metadata = {
  title: { absolute: "Fuels — PETROSOL" },
  description:
    "Explore PETROSOL petrol, premium gasoline, and low sulfur diesel supplied clean, in full quantity, and to local and international standards.",
  alternates: { canonical: "/fuels" },
};

export default async function FuelsPage() {
  const [products, priceBoard] = await Promise.all([
    getFuelProducts(),
    getPumpPrices(),
  ]);

  return <FuelSections products={products} priceBoard={priceBoard} />;
}
