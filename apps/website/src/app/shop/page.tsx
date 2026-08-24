import type { Metadata } from "next";

import { ShopSections } from "./shop-sections";

export const metadata: Metadata = {
  title: { absolute: "Shops & Convenience | PETROSOL" },
  description:
    "PETROSOL Marts offer everyday essentials, snacks, beverages, and other useful items while you refuel or visit a FULLCARE bay.",
  alternates: { canonical: "/shops-and-convenience" },
};

export default function ShopPage() {
  return <ShopSections />;
}
