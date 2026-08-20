import type { MetadataRoute } from "next";

import { resolveWebsiteUrl } from "@workspace/config/env";

import { getBlogSlugs } from "@/lib/sanity/data";

// Published canonical content only. Per-version legal routes (/{kind}/v/{version})
// are intentionally excluded — they are noindex archives.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = resolveWebsiteUrl(process.env).replace(/\/$/, "");
  const postSlugs = await getBlogSlugs().catch(() => {
    console.warn("[website] sitemap: CMS unreachable, emitting static paths only");
    return [] as string[];
  });

  const staticPaths = [
    "",
    "/who-we-are",
    "/awards-and-recognition",
    "/leadership-team",
    "/board-of-directors",
    "/contact-us",
    "/fuels",
    "/lubricants",
    "/fullcare-vehicle-services",
    "/fuel-delivery",
    "/shops-and-convenience",
    "/find-a-station",
    "/sustainability-and-community",
    "/blog",
    "/events",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...postSlugs.map((slug) => ({
      url: `${base}/blog/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
