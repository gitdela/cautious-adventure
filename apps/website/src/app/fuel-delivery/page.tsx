import type { Metadata } from "next";

import { FuelDeliverySections } from "./fuel-delivery-sections";

export const metadata: Metadata = {
  title: { absolute: "Fuel Delivery Service — PETROSOL" },
  description:
    "PETROSOL delivers quality fuel straight to your home, business or site — sealed, metered, and in full quantity: for each liter paid, an exact liter is received.",
  alternates: { canonical: "/fuel-delivery" },
};

export default function FuelDeliveryPage() {
  return <FuelDeliverySections />;
}
