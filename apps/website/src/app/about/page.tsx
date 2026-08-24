import type { Metadata } from "next";

import { AboutSections } from "./about-sections";

export const metadata: Metadata = {
  title: { absolute: "Who We Are | PETROSOL" },
  description:
    "Learn about PETROSOL Platinum Energy, our purpose, values, certifications, and commitment to service excellence across Ghana.",
  alternates: { canonical: "/who-we-are" },
};

export default function AboutPage() {
  return <AboutSections />;
}
