import type { Metadata } from "next";

import { NewsSections } from "./news-sections";

export const metadata: Metadata = {
  title: { absolute: "News — PETROSOL" },
  description:
    "News from across the PETROSOL network — leadership appointments, awards, CSR initiatives and life inside Ghana's leading indigenous oil marketing company.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return <NewsSections />;
}
