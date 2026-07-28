import type { Metadata } from "next";

import { StationsSections } from "./stations-sections";

export const metadata: Metadata = {
  title: { absolute: "Find a Station — PETROSOL" },
  description:
    "Find your nearest PETROSOL fuel station in Ghana — search the station directory by territory, station name or manager, with shop, washroom and FULLCARE amenities listed.",
  alternates: { canonical: "/stations" },
};

export default function StationsPage() {
  return <StationsSections />;
}
