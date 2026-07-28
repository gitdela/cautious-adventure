import type { Metadata } from "next";

import { LegalCanonical, legalMetadata } from "@/lib/legal-page";

export const revalidate = 3600;

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata("terms", "/terms", "Terms of Service");
}

export default function TermsPage() {
  return <LegalCanonical kind="terms" />;
}
