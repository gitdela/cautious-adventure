import type { Metadata } from "next";

import { FullcareSections } from "./fullcare-sections";

export const metadata: Metadata = {
  title: { absolute: "FULLCARE Vehicle Services | PETROSOL" },
  description:
    "PETROSOL FULLCARE offers all-round, professional vehicle servicing: genuine parts, top-of-the-range lubricants, and full diagnostics at FULLCARE Centers across Ghana.",
  alternates: { canonical: "/fullcare-vehicle-services" },
};

export default function FullcarePage() {
  return <FullcareSections />;
}
