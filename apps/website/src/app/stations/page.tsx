import type { Metadata } from "next";

import { getStationTerritories, getStations } from "@/lib/sanity/data";

import { StationsSections } from "./stations-sections";

export const metadata: Metadata = {
  title: { absolute: "Find our Station | PETROSOL" },
  description:
    "Find your nearest PETROSOL fuel station in Ghana: search the station directory by territory, station name or manager, with shop, washroom and FULLCARE amenities listed.",
  alternates: { canonical: "/find-a-station" },
};

export default async function StationsPage() {
  const [stations, territories] = await Promise.all([
    getStations(),
    getStationTerritories(),
  ]);

  return <StationsSections stations={stations} territories={territories} />;
}
