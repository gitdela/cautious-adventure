import type { MetadataRoute } from "next";

import { resolveWebsiteUrl } from "@workspace/config/env";

export default function robots(): MetadataRoute.Robots {
  const base = resolveWebsiteUrl(process.env).replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Preview + webhook + internal API endpoints are not for crawlers.
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
