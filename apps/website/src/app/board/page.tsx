import type { Metadata } from "next";

import { getTeamMembers } from "@/lib/sanity/data";

import { BoardSections } from "./board-sections";

export const metadata: Metadata = {
  title: { absolute: "Board of Directors — PETROSOL" },
  description:
    "Meet PETROSOL Platinum Energy's Board of Directors and learn about the governance principles guiding the company's long-term direction.",
  alternates: { canonical: "/board" },
};

export default async function BoardPage() {
  const members = await getTeamMembers("board");

  return <BoardSections members={members} />;
}
