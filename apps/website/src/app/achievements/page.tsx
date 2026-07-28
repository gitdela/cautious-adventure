import type { Metadata } from "next";

import { AchievementsSections } from "./achievements-sections";

export const metadata: Metadata = {
  title: { absolute: "Our Achievements — PETROSOL" },
  description:
    "Explore PETROSOL's awards and recognition for quality, sustainability, leadership, safety, and service excellence since 2016.",
  alternates: { canonical: "/achievements" },
};

export default function AchievementsPage() {
  return <AchievementsSections />;
}
