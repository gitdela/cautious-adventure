import type { Metadata } from "next";

import { resolveTurnstileSiteKey } from "@workspace/config/env";

import { ContactSections } from "./contact-sections";

export const metadata: Metadata = {
  title: { absolute: "Contact Us | PETROSOL" },
  description:
    "Contact PETROSOL Platinum Energy for product, service, station, career, media, and corporate enquiries in Ghana.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactPage() {
  // Env resolved in the server component and injected as a plain string, so the
  // client form never reads process.env itself.
  return <ContactSections turnstileSiteKey={resolveTurnstileSiteKey(process.env)} />;
}
