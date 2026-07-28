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
    default: "Petrosol — energizing dreams!",
    template: "%s · Petrosol",
  },
  description:
    "Whether you're looking for high-quality gasoline or innovative solutions to power your home or business, we've got you covered.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Petrosol",
    title: "Petrosol — energizing dreams!",
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

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Petrosol",
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
