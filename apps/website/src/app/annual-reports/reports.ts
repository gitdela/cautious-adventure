type ReportDocument = {
  year: number;
  title: string;
  fileName: string;
};

// Add each supplied PDF to public/reports/ and list it here.
// Keep each title specific about whether the PDF is annual or unaudited.
export const reportDocuments: ReportDocument[] = [
  {
    year: 2026,
    title: "Unaudited financial statements — 30 September 2026",
    fileName: "petrosol-unaudited-financial-statements-2026-09-30.pdf",
  },
];
