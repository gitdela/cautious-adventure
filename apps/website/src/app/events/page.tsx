import type { Metadata } from "next";

import { getGalleryEvents } from "@/lib/sanity/data";

import { EventsSections } from "./events-sections";

export const metadata: Metadata = {
  title: { absolute: "Events | PETROSOL" },
  description:
    "Explore PETROSOL events, awards ceremonies, conferences, community programmes and celebrations from across our network.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const events = await getGalleryEvents();

  return <EventsSections events={events} />;
}
