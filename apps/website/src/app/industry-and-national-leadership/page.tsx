import type { Metadata } from "next";

import {
  getIndustryLeadershipEvents,
  getNationalLeadershipProfiles,
} from "@/lib/sanity/data";

import { IndustryAndNationalLeadershipSections } from "./industry-and-national-leadership-sections";

export const metadata: Metadata = {
  title: { absolute: "Industry & National Leadership | PETROSOL" },
  description:
    "Discover how PETROSOL contributes to policy dialogue, industry best practices, leadership advocacy and national energy platforms.",
  alternates: { canonical: "/industry-and-national-leadership" },
};

export default async function IndustryAndNationalLeadershipPage() {
  const [events, profiles] = await Promise.all([
    getIndustryLeadershipEvents(),
    getNationalLeadershipProfiles(),
  ]);

  return (
    <IndustryAndNationalLeadershipSections
      events={events}
      profiles={profiles}
    />
  );
}
