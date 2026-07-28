import type { Metadata } from "next";

import { GallerySections } from "./gallery-sections";

export const metadata: Metadata = {
  title: { absolute: "Gallery — PETROSOL" },
  description:
    "PETROSOL in pictures — moments from awards nights, conferences, community projects and celebrations across the network.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return <GallerySections />;
}
