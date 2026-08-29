import type { Metadata } from "next";

import { SustainabilitySections } from "./sustainability-sections";

export const metadata: Metadata = {
  title: { absolute: "Sustainability | PETROSOL" },
  description:
    "Discover PETROSOL's green energy initiatives, including solar power at selected stations and responsible environmental management.",
  alternates: { canonical: "/sustainability" },
};

export default function SustainabilityPage() {
  return <SustainabilitySections />;
}
