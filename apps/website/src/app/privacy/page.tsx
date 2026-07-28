import type { Metadata } from "next";

import { LegalCanonical, legalMetadata } from "@/lib/legal-page";

export const revalidate = 3600;

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata("privacy", "/privacy", "Privacy Policy");
}

export default function PrivacyPage() {
  return <LegalCanonical kind="privacy" />;
}
