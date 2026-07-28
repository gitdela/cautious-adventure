import type { Metadata } from "next";

import { HomeSections } from "./home-sections";

export const metadata: Metadata = {
  title: { absolute: "Petrosol — your energy solutions provider" },
  description:
    "High-quality gasoline and innovative energy solutions for homes and businesses across Ghana.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeSections />;
}
