import type { Metadata } from "next";

import { ShopSections } from "./shop-sections";

export const metadata: Metadata = {
  title: { absolute: "Shop — PETROSOL" },
  description:
    "Shops at PETROSOL service stations are properly stocked with assorted quality items to meet the grocery needs of our customers — at every station, on your route.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopSections />;
}
