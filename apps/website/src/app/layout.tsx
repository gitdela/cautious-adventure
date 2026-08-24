import type { Metadata } from "next";
import {
  resolveSanityConfig,
  resolveWebsiteUrl,
} from "@workspace/config/env";
import { Providers } from "./providers";
import { SiteShell } from "./site-shell";
import { ensureSanityConfigured } from "@/lib/sanity/config";
import { JsonLd } from "@/lib/json-ld";
import "./globals.css";

// Brand face is Verdana (system font — nothing to load); IBM Plex Mono is
// imported by @workspace/ui/globals.css for spec/data readouts.

export const metadata: Metadata = {
  metadataBase: new URL(resolveWebsiteUrl(process.env)),
  title: {
    default: "PETROSOL | energizing dreams!",
    template: "%s · PETROSOL",
  },
  description:
    "Whether you're looking for high-quality gasoline or innovative solutions to power your home or business, we've got you covered.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "PETROSOL",
    title: "PETROSOL | energizing dreams!",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The config seam: the app resolves validated env once, at the root, and
  // injects it. Shared packages never read process.env themselves.
  const websiteUrl = resolveWebsiteUrl(process.env);
  const sanityConfig = resolveSanityConfig(process.env);
  ensureSanityConfigured();

  // No `h-full`/`min-h-full` chain on html/body: lenis.css forces
  // `height: auto` on both while Lenis is active, so the sticky footer
  // relies on `min-h-dvh` instead.
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-dvh flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "PETROSOL",
            url: websiteUrl,
          }}
        />
        <Providers sanityConfig={sanityConfig}>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
