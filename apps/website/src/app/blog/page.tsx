import type { Metadata } from "next";

import { getAllPosts } from "@/lib/sanity/data";

import { NewsSections } from "../news/news-sections";

export const metadata: Metadata = {
  title: { absolute: "Blog | PETROSOL" },
  description:
    "Stories from across the PETROSOL network, including leadership updates, awards, community initiatives and life at PETROSOL.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <NewsSections posts={posts} />;
}
