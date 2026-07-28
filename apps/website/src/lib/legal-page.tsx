import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalDocumentPage } from "@workspace/content";

import { contentAdapters } from "./content-adapters";
import { getCurrentLegal, getLegalVersion } from "./sanity/data";

/**
 * Shared legal route helpers. Each of /privacy, /terms, /cookies, /disclosures
 * is a thin wrapper over these so behavior (notFound, noindex, version notice)
 * stays identical across kinds.
 */

export async function LegalCanonical({ kind }: { kind: string }) {
  const doc = await getCurrentLegal(kind);
  if (!doc) notFound();
  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 py-12 lg:px-10 lg:py-16">
      <LegalDocumentPage document={doc} adapters={contentAdapters} />
    </main>
  );
}

export async function LegalVersion({
  kind,
  version,
}: {
  kind: string;
  version: string;
}) {
  const doc = await getLegalVersion(kind, version);
  if (!doc) notFound();
  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 py-12 lg:px-10 lg:py-16">
      <LegalDocumentPage
        document={doc}
        adapters={contentAdapters}
        versionNotice={`You are viewing version ${version}, which may not be the current policy. See the canonical page for the version in effect.`}
      />
    </main>
  );
}

export async function legalMetadata(
  kind: string,
  path: string,
  fallbackTitle: string,
): Promise<Metadata> {
  const doc = await getCurrentLegal(kind);
  return {
    title: doc?.title ?? fallbackTitle,
    alternates: { canonical: path },
  };
}

// Per-version pages are immutable archives — never indexed; only the canonical
// current version is.
export function legalVersionMetadata(fallbackTitle: string): Metadata {
  return {
    title: `${fallbackTitle} — archived version`,
    robots: { index: false, follow: false },
  };
}
