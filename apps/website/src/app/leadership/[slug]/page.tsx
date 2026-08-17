import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTeamMember, getTeamMembers } from "@/lib/sanity/data";

import { primaryGroupOf } from "../../team-card";
import { ProfileSections } from "./profile-sections";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  if (!member) return {};

  return {
    title: { absolute: `${member.name} — PETROSOL` },
    description:
      member.shortBio ??
      `${member.name}, ${member.role} at PETROSOL Platinum Energy.`,
    alternates: { canonical: `/leadership/${member.slug}` },
    openGraph: {
      title: member.name,
      description: `${member.role} at PETROSOL Platinum Energy.`,
      type: "profile",
    },
  };
}

export default async function TeamProfilePage({ params }: Props) {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  // An unknown slug 404s rather than falling back to the first profile as the
  // prototype did — a wrong person under a shared URL is worse than nothing.
  if (!member) notFound();

  // "More profiles" lists other people whose OWN profile belongs to this group.
  // Filtering by primary group, not mere membership: the CEO sits on the board
  // but his profile is a leadership profile, so he does not belong among "also
  // on the board".
  const group = primaryGroupOf(member);
  const others = (await getTeamMembers(group)).filter(
    (other) => other.slug !== member.slug && primaryGroupOf(other) === group,
  );

  return <ProfileSections member={member} others={others} />;
}
