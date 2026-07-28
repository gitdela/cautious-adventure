import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type {
  LegalCurrentByKindQueryResult,
  LegalByKindAndVersionQueryResult,
  LegalKindVersionsQueryResult,
} from '../generated/sanity.types'

// The current approved, effective version for a kind: highest effectiveAt that
// is now-or-past, in the approved state. Superseded versions are excluded.
export const legalCurrentByKindQuery = defineQuery(`
  *[
    _type == "legalDocument" &&
    documentKind == $kind &&
    approvalState == "approved" &&
    effectiveAt <= now()
  ] | order(effectiveAt desc)[0] {
    _id,
    documentKind,
    title,
    version,
    "slug": slug.current,
    effectiveAt,
    publishedAt,
    body,
    jurisdiction,
    seo
  }
`)

// A specific immutable version, served at its per-version URL (noindex). Not
// gated on effectiveAt/approval so a superseded version stays retrievable for
// acceptance audit.
export const legalByKindAndVersionQuery = defineQuery(`
  *[
    _type == "legalDocument" &&
    documentKind == $kind &&
    version == $version
  ][0] {
    _id,
    documentKind,
    title,
    version,
    "slug": slug.current,
    effectiveAt,
    publishedAt,
    approvalState,
    body,
    jurisdiction,
    seo
  }
`)

// Version index for a kind (for per-version URL generation).
export const legalKindVersionsQuery = defineQuery(`
  *[_type == "legalDocument" && documentKind == $kind && approvalState in ["approved", "superseded"]]
    | order(effectiveAt desc) {
    documentKind,
    version,
    effectiveAt,
    approvalState
  }
`)

export async function fetchCurrentLegalDocument(
  kind: string,
  client: SanityClient = getPublishedClient(),
): Promise<LegalCurrentByKindQueryResult> {
  return client.fetch(legalCurrentByKindQuery, { kind })
}

export async function fetchLegalDocumentVersion(
  kind: string,
  version: string,
  client: SanityClient = getPublishedClient(),
): Promise<LegalByKindAndVersionQueryResult> {
  return client.fetch(legalByKindAndVersionQuery, { kind, version })
}

export async function fetchLegalKindVersions(
  kind: string,
  client: SanityClient = getPublishedClient(),
): Promise<LegalKindVersionsQueryResult> {
  return client.fetch(legalKindVersionsQuery, { kind })
}
