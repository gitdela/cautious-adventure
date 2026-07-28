import type { Metadata } from "next";

import { LeadershipSections } from "./leadership-sections";

export const metadata: Metadata = {
  title: { absolute: "Leadership — PETROSOL" },
  description:
    "Meet the experienced leadership team guiding PETROSOL Platinum Energy's operations, growth, and service excellence across Ghana.",
  alternates: { canonical: "/leadership" },
};

export default function LeadershipPage() {
  return <LeadershipSections />;
}
