import type { Metadata } from "next";

import { getBlogPosts } from "@/lib/sanity/data";
import { BlogListingClient } from "./blog-listing-client";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "What the Petrosol team is thinking, building, and learning.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts(1);

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 py-12 lg:px-10 lg:py-20">
      <header className="pb-12">
        <div className="mb-5 text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground/50">
          The Petrosol Blog
        </div>
        <h1 className="max-w-3xl text-[36px] font-semibold leading-[1.05] tracking-tight sm:text-[48px] lg:text-[64px]">
          What we&apos;re thinking, building, and learning.
        </h1>
      </header>

      <BlogListingClient posts={posts} basePath="/blog" />
    </main>
  );
}
