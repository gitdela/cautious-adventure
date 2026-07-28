import type { MetadataRoute } from "next";

import { resolveWebsiteUrl } from "@workspace/config/env";

import { getBlogSlugs } from "@/lib/sanity/data";

import { newsArticles } from "./news/news-data";

// Published canonical content only. Per-version legal routes (/{kind}/v/{version})
// are intentionally excluded — they are noindex archives.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = resolveWebsiteUrl(process.env).replace(/\/$/, "");
  const blogSlugs = await getBlogSlugs().catch(() => {
    console.warn("[website] sitemap: CMS unreachable, emitting static paths only");
    return [] as string[];
  });

  const staticPaths = [
    "",
    "/blog",
    "/help",
    "/about",
    "/achievements",
    "/leadership",
    "/board",
    "/contact",
    "/fuel",
    "/lubricants",
    "/fullcare",
    "/fuel-delivery",
    "/shop",
    "/stations",
    "/csr",
    "/news",
    "/gallery",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...newsArticles.map((article) => ({
      url: `${base}/news/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${base}/blog/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
