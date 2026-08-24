import type { Metadata } from "next";

import { getLubricantCategories, getLubricantProducts } from "@/lib/sanity/data";

import { LubricantsSections } from "./lubricants-sections";

export const metadata: Metadata = {
  title: { absolute: "Lubricants | PETROSOL" },
  description:
    "Explore PETROSOL engine oils, motorcycle oils, transmission fluids, brake fluids, and coolants blended for performance and protection.",
  alternates: { canonical: "/lubricants" },
};

export default async function LubricantsPage() {
  const [products, categories] = await Promise.all([
    getLubricantProducts(),
    getLubricantCategories(),
  ]);

  return <LubricantsSections products={products} categories={categories} />;
}
