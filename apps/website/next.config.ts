import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/cms", "@workspace/content"],
  // Preserve legacy links while Blog and Events own the public canonicals.
  async redirects() {
    return [
      { source: "/news", destination: "/blog", permanent: true },
      { source: "/news/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/gallery", destination: "/events", permanent: true },
      { source: "/fuel", destination: "/fuels", permanent: true },
      { source: "/stations", destination: "/find-a-station", permanent: true },
      {
        source: "/fullcare",
        destination: "/fullcare-vehicle-services",
        permanent: true,
      },
      {
        source: "/shop",
        destination: "/shops-and-convenience",
        permanent: true,
      },
      { source: "/about", destination: "/who-we-are", permanent: true },
      {
        source: "/leadership",
        destination: "/leadership-team",
        permanent: true,
      },
      {
        source: "/leadership/:slug",
        destination: "/leadership-team/:slug",
        permanent: true,
      },
      { source: "/board", destination: "/board-of-directors", permanent: true },
      {
        source: "/achievements",
        destination: "/awards-and-recognition",
        permanent: true,
      },
      {
        source: "/sustainability-and-community",
        destination: "/sustainability",
        permanent: true,
      },
      { source: "/contact", destination: "/contact-us", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        // Sanity image CDN. `search` is intentionally omitted so the image
        // builder's transform query string (?w=&h=&auto=format) is allowed.
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/3tmnavlv/**",
      },
      {
        // Mux's own thumbnail endpoint — the poster for a video event, and the
        // same source the home hero already uses for its clips. `search` is
        // omitted so the `?time=` frame selector is allowed.
        protocol: "https",
        hostname: "image.mux.com",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url)),
  },
};

export default nextConfig;
