import type { Metadata } from "next";

import { getAllPosts } from "@/lib/sanity/data";

import { NewsSections } from "./news-sections";

export const metadata: Metadata = {
  title: { absolute: "News — PETROSOL" },
  description:
    "News from across the PETROSOL network — leadership appointments, awards, CSR initiatives and life inside Ghana's leading indigenous oil marketing company.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const posts = await getAllPosts();
  return <NewsSections posts={posts} />;
}
