import type { Metadata } from "next";

import { CsrSections } from "./csr-sections";

export const metadata: Metadata = {
  title: { absolute: "CSR — PETROSOL" },
  description:
    "PETROSOL supports worthy causes across Ghana — free reconstructive surgeries with the Graft Foundation, disaster relief, hospital PPEs, LPG safety education, girls' education and more.",
  alternates: { canonical: "/csr" },
};

export default function CsrPage() {
  return <CsrSections />;
}
