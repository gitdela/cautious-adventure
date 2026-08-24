import type { Metadata } from "next";

import { FullcareSections } from "../fullcare/fullcare-sections";

export const metadata: Metadata = {
  title: { absolute: "FULLCARE Vehicle Services | PETROSOL" },
  description:
    "PETROSOL FULLCARE provides professional vehicle servicing, genuine parts, premium lubricants and diagnostics at FULLCARE Centers across Ghana.",
  alternates: { canonical: "/fullcare-vehicle-services" },
};

export default function FullcareVehicleServicesPage() {
  return <FullcareSections />;
}
