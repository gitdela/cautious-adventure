import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTeamMember, getTeamMembers } from "@/lib/sanity/data";

import { ProfileSections } from "../../leadership/[slug]/profile-sections";
import { primaryGroupOf } from "../../team-card";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  if (!member) return {};

  return {
    title: { absolute: `${member.name} | PETROSOL` },
    description:
      member.shortBio ??
      `${member.name}, ${member.role} at PETROSOL Platinum Energy.`,
    alternates: { canonical: `/leadership-team/${member.slug}` },
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
  if (!member) notFound();

  const group = primaryGroupOf(member);
  const others = (await getTeamMembers(group)).filter(
    (other) => other.slug !== member.slug && primaryGroupOf(other) === group,
  );

  return <ProfileSections member={member} others={others} />;
}
