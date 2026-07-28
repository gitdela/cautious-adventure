import type { Metadata } from "next";

import { ContactSections } from "./contact-sections";

export const metadata: Metadata = {
  title: { absolute: "Contact Us — PETROSOL" },
  description:
    "Contact PETROSOL Platinum Energy for product, service, station, career, media, and corporate enquiries in Ghana.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactSections />;
}
