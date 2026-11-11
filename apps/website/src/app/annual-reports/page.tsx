import type { Metadata } from "next";
import { RiDownloadLine, RiFilePdf2Line } from "@remixicon/react";

import { ContentEmpty } from "@workspace/content";

import { MosaicPageHeader } from "../mosaic-page-header";
import { SiteBreadcrumbs } from "../site-breadcrumbs";
import { reportDocuments } from "./reports";

export const metadata: Metadata = {
  title: { absolute: "Annual Reports | PETROSOL" },
  description: "Read and download PETROSOL annual reports and financial statements.",
  alternates: { canonical: "/annual-reports" },
};

export default function AnnualReportsPage() {
  const reports = [...reportDocuments].sort((a, b) => b.year - a.year);

  return (
    <>
      <MosaicPageHeader
        title="Annual Reports"
        breadcrumbs={
          <SiteBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "About" },
              { label: "Annual Reports" },
            ]}
          />
        }
      />
      <main className="ps-container py-[var(--section-y)]">
        <div className="mb-10 max-w-[65ch]">
          <h2 className="font-display text-[length:var(--size-display-sm)] font-bold tracking-[-0.02em] text-navy-900">
            Reports and financial statements
          </h2>
          <p className="mt-4 text-muted-foreground">
            Browse PETROSOL&apos;s published reports and financial statements. Read
            a document in your browser or download a copy for later.
          </p>
        </div>

        {reports.length === 0 ? (
          <ContentEmpty
            title="No reports available yet"
            description="Published reports will appear here when they become available."
          />
        ) : (
          <ul className="grid gap-4">
            {reports.map((report) => {
              const href = `/reports/${encodeURIComponent(report.fileName)}`;

              return (
                <li
                  key={report.fileName}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-brand sm:size-12">
                      <RiFilePdf2Line className="size-5 sm:size-6" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground sm:text-sm">
                        {report.year}
                      </p>
                      <h3 className="font-display text-base leading-snug font-bold text-navy-900 sm:text-lg">
                        {report.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:shrink-0 sm:gap-3">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Read ${report.title} in a new tab`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-border px-4 text-sm font-semibold text-navy-900 transition-colors hover:border-brand hover:text-brand sm:flex-none sm:px-5 sm:text-base"
                    >
                      Read
                    </a>
                    <a
                      href={href}
                      download={report.fileName}
                      aria-label={`Download ${report.title}`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand/90 sm:flex-none sm:px-5 sm:text-base"
                    >
                      <RiDownloadLine className="size-4" aria-hidden="true" />
                      Download
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
