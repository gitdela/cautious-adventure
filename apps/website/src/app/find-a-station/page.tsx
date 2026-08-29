import type { Metadata } from "next";

import { getStationRegions, getStations } from "@/lib/sanity/data";

import { StationsSections } from "./stations-sections";

export const metadata: Metadata = {
  title: { absolute: "Find our Station | PETROSOL" },
  description:
    "Find your nearest PETROSOL fuel station in Ghana. Browse by region or search by station name or manager, with available amenities listed.",
  alternates: { canonical: "/find-a-station" },
};

export default async function FindAStationPage() {
  const [stations, regions] = await Promise.all([
    getStations(),
    getStationRegions(),
  ]);

  return <StationsSections stations={stations} regions={regions} />;
}
