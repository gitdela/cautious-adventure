import type { Metadata } from "next";

import { getCommunityGalleryEvents } from "@/lib/sanity/data";

import { CsrSections } from "./csr-sections";

export const metadata: Metadata = {
  title: { absolute: "Sustainability & Community | PETROSOL" },
  description:
    "Explore PETROSOL's approach to environmental responsibility, safe and ethical operations, and community investment across Ghana.",
  alternates: { canonical: "/sustainability-and-community" },
};

export default async function CsrPage() {
  const events = await getCommunityGalleryEvents();

  return <CsrSections events={events} />;
}
