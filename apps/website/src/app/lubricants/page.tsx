import type { Metadata } from "next";

import { LubricantsSections } from "./lubricants-sections";

export const metadata: Metadata = {
  title: { absolute: "Lubricants — PETROSOL" },
  description:
    "Explore PETROSOL engine oils, motorcycle oils, transmission fluids, brake fluids, and coolants blended for performance and protection.",
  alternates: { canonical: "/lubricants" },
};

export default function LubricantsPage() {
  return <LubricantsSections />;
}
