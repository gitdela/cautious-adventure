import type { Metadata } from "next";

import { getCommunityGalleryEvents } from "@/lib/sanity/data";

import { CsrSections } from "./csr-sections";

export const metadata: Metadata = {
  title: { absolute: "Corporate Social Responsibility | PETROSOL" },
  description:
    "Explore PETROSOL's community investments in healthcare, education, public safety, and disaster response across Ghana.",
  alternates: { canonical: "/csr" },
};

export default async function CsrPage() {
  const events = await getCommunityGalleryEvents();

  return <CsrSections events={events} />;
}
