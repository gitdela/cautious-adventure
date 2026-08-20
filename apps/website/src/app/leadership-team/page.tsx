import type { Metadata } from "next";

import { getTeamMembers } from "@/lib/sanity/data";

import { LeadershipSections } from "../leadership/leadership-sections";

export const metadata: Metadata = {
  title: { absolute: "Leadership Team — PETROSOL" },
  description:
    "Meet the experienced leadership team guiding PETROSOL Platinum Energy's operations, growth and service excellence across Ghana.",
  alternates: { canonical: "/leadership-team" },
};

export default async function LeadershipTeamPage() {
  const members = await getTeamMembers("leadership");
  return <LeadershipSections members={members} />;
}
