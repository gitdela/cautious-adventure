import type { Metadata } from "next";

import { SustainabilitySections } from "./sustainability-sections";

export const metadata: Metadata = {
  title: { absolute: "Sustainability | PETROSOL" },
  description:
    "How PETROSOL is energizing a sustainable future: triple ISO certification, rooftop solar at our stations, clean fuel in full quantity, people development and community impact.",
  alternates: { canonical: "/sustainability" },
};

export default function SustainabilityPage() {
  return <SustainabilitySections />;
}
