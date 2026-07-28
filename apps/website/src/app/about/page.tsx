import type { Metadata } from "next";

import { AboutSections } from "./about-sections";

export const metadata: Metadata = {
  title: { absolute: "About PETROSOL — energizing dreams!" },
  description:
    "Learn about PETROSOL Platinum Energy, our purpose, values, certifications, and commitment to service excellence across Ghana.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutSections />;
}
