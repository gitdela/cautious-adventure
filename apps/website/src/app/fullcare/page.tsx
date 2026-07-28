import type { Metadata } from "next";

import { FullcareSections } from "./fullcare-sections";

export const metadata: Metadata = {
  title: { absolute: "FullCare — PETROSOL" },
  description:
    "PETROSOL FULLCARE offers all-round, professional vehicle servicing — genuine parts, top-of-the-range lubricants, and full diagnostics at FULLCARE Centers across Ghana.",
  alternates: { canonical: "/fullcare" },
};

export default function FullcarePage() {
  return <FullcareSections />;
}
