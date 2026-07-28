import type { Metadata } from "next";

import { LegalVersion, legalVersionMetadata } from "@/lib/legal-page";
import { getLegalVersions } from "@/lib/sanity/data";

type Props = { params: Promise<{ version: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const versions = await getLegalVersions("privacy");
    return versions.map((version) => ({ version }));
  } catch {
    console.warn("[website] generateStaticParams: CMS unreachable, skipping prerender");
    return [];
  }
}

export function generateMetadata(): Metadata {
  return legalVersionMetadata("Privacy Policy");
}

export default async function PrivacyVersionPage({ params }: Props) {
  const { version } = await params;
  return <LegalVersion kind="privacy" version={version} />;
}
