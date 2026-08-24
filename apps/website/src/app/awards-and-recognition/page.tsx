import type { Metadata } from "next";

import { AchievementsSections } from "../achievements/achievements-sections";

export const metadata: Metadata = {
  title: { absolute: "Awards & Recognition | PETROSOL" },
  description:
    "Explore PETROSOL's awards and recognition for quality, sustainability, leadership, safety and service excellence since 2016.",
  alternates: { canonical: "/awards-and-recognition" },
};

export default function AwardsAndRecognitionPage() {
  return <AchievementsSections />;
}
