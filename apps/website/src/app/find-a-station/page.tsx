import type { Metadata } from "next";

import { getStationTerritories, getStations } from "@/lib/sanity/data";

import { StationsSections } from "../stations/stations-sections";

export const metadata: Metadata = {
  title: { absolute: "Find our Station | PETROSOL" },
  description:
    "Find your nearest PETROSOL fuel station in Ghana and search by territory, station name or manager, with available amenities listed.",
  alternates: { canonical: "/find-a-station" },
};

export default async function FindAStationPage() {
  const [stations, territories] = await Promise.all([
    getStations(),
    getStationTerritories(),
  ]);

  return <StationsSections stations={stations} territories={territories} />;
}
