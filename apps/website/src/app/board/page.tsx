import type { Metadata } from "next";

import { BoardSections } from "./board-sections";

export const metadata: Metadata = {
  title: { absolute: "Board of Directors — PETROSOL" },
  description:
    "Meet PETROSOL Platinum Energy's Board of Directors and learn about the governance principles guiding the company's long-term direction.",
  alternates: { canonical: "/board" },
};

export default function BoardPage() {
  return <BoardSections />;
}
