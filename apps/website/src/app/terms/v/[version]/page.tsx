import type { Metadata } from "next";

import { LegalVersion, legalVersionMetadata } from "@/lib/legal-page";
import { getLegalVersions } from "@/lib/sanity/data";

type Props = { params: Promise<{ version: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const versions = await getLegalVersions("terms");
    return versions.map((version) => ({ version }));
  } catch {
    console.warn("[website] generateStaticParams: CMS unreachable, skipping prerender");
    return [];
  }
}

export function generateMetadata(): Metadata {
  return legalVersionMetadata("Terms of Service");
}

export default async function TermsVersionPage({ params }: Props) {
  const { version } = await params;
  return <LegalVersion kind="terms" version={version} />;
}
