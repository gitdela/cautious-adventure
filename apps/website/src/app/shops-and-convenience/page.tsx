import type { Metadata } from "next";

import { ShopSections } from "../shop/shop-sections";

export const metadata: Metadata = {
  title: { absolute: "Shops & Convenience — PETROSOL" },
  description:
    "Discover quality groceries and convenience items available from shops at PETROSOL service stations across Ghana.",
  alternates: { canonical: "/shops-and-convenience" },
};

export default function ShopsAndConveniencePage() {
  return <ShopSections />;
}
