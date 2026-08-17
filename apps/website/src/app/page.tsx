import type { Metadata } from "next";

import { getFeaturedPosts, getPumpPrices } from "@/lib/sanity/data";

import { HomeSections } from "./home-sections";

export const metadata: Metadata = {
  title: { absolute: "PETROSOL — your energy solutions provider" },
  description:
    "High-quality gasoline and innovative energy solutions for homes and businesses across Ghana.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [priceBoard, featuredPosts] = await Promise.all([
    getPumpPrices(),
    getFeaturedPosts(),
  ]);
  return <HomeSections priceBoard={priceBoard} featuredPosts={featuredPosts} />;
}
