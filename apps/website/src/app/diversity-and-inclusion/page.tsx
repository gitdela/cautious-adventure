import type { Metadata } from "next";

import { getPwnConferenceEvents } from "@/lib/sanity/data";

import { DiversityAndInclusionSections } from "./diversity-and-inclusion-sections";

export const metadata: Metadata = {
  title: { absolute: "Diversity & Inclusion | PETROSOL" },
  description:
    "Meet the PETROSOL Women Network and explore its Women in Leadership conferences, professional development, and inclusion initiatives.",
  alternates: { canonical: "/diversity-and-inclusion" },
};

export default async function DiversityAndInclusionPage() {
  const conferences = await getPwnConferenceEvents();

  return <DiversityAndInclusionSections conferences={conferences} />;
}
