"use client";

import { BlogListing, type BlogPostSummary } from "@workspace/content";

import { contentAdapters } from "@/lib/content-adapters";

/**
 * Client boundary for the interactive blog listing. The server `/blog` page
 * passes only serializable data (posts + basePath); the adapters (which hold
 * component functions) are wired here, inside the client boundary, so nothing
 * unserializable crosses the RSC edge.
 */
export function BlogListingClient({
  posts,
  basePath,
}: {
  posts: BlogPostSummary[];
  basePath: string;
}) {
  return (
    <BlogListing posts={posts} basePath={basePath} adapters={contentAdapters} />
  );
}
