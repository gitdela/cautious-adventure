import type { Metadata } from "next";

import { FuelSections } from "./fuel-sections";

export const metadata: Metadata = {
  title: { absolute: "Fuel — PETROSOL" },
  description:
    "Explore PETROSOL petrol, premium gasoline, and low sulfur diesel supplied clean, in full quantity, and to local and international standards.",
  alternates: { canonical: "/fuel" },
};

export default function FuelPage() {
  return <FuelSections />;
}
