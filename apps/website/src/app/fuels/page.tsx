import type { Metadata } from "next";

import { getFuelProducts, getPumpPrices } from "@/lib/sanity/data";

import { FuelSections } from "./fuel-sections";

export const metadata: Metadata = {
  title: { absolute: "Fuels | PETROSOL" },
  description:
    "Explore PETROSOL petrol and diesel, supported by careful handling, full quantity, and dependable service from depot to tank.",
  alternates: { canonical: "/fuels" },
};

export default async function FuelsPage() {
  const [products, priceBoard] = await Promise.all([
    getFuelProducts(),
    getPumpPrices(),
  ]);

  return <FuelSections products={products} priceBoard={priceBoard} />;
}
