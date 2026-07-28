import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/cms", "@workspace/content"],
  images: {
    remotePatterns: [
      {
        // Sanity image CDN. `search` is intentionally omitted so the image
        // builder's transform query string (?w=&h=&auto=format) is allowed.
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/3tmnavlv/**",
      },
    ],
  },
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url)),
  },
};

export default nextConfig;
