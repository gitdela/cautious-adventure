/**
 * Runtime validation for load-bearing fields at the external-data boundary.
 *
 * Generated Sanity result types are structurally permissive (many fields are
 * `string | null`). Before content drives routing, SEO, or legal-version
 * identity, these guards assert the fields we actually depend on and fail
 * loudly on malformed data rather than rendering a broken page.
 */

export class CmsValidationError extends Error {
  constructor(message: string) {
    super(`[@workspace/cms] ${message}`)
    this.name = 'CmsValidationError'
  }
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** A URL-safe slug segment (lowercase, hyphen-separated). */
export function isValidSlug(value: unknown): value is string {
  return typeof value === 'string' && SLUG.test(value)
}

export function assertSlug(value: unknown, field = 'slug'): string {
  if (!isValidSlug(value)) {
    throw new CmsValidationError(
      `Invalid ${field}: expected a URL-safe slug, got ${JSON.stringify(value)}.`,
    )
  }
  return value
}

/** A parseable ISO-8601 datetime string. */
export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0) return false
  const t = Date.parse(value)
  return Number.isFinite(t)
}

export function assertIsoDate(value: unknown, field = 'date'): string {
  if (!isIsoDate(value)) {
    throw new CmsValidationError(
      `Invalid ${field}: expected an ISO-8601 date, got ${JSON.stringify(value)}.`,
    )
  }
  return value
}

/**
 * True when a document is publicly visible: it has a slug and its publish date
 * is now or in the past. Mirrors the GROQ list filter so callers can defend
 * against a single-document fetch that bypassed the list query.
 *
 * `now` is injectable because `Date.now()` is not deterministic in tests.
 */
export function isPublished(
  doc: { slug?: unknown; publishedAt?: unknown },
  now: number = Date.now(),
): boolean {
  if (!isValidSlug(doc.slug)) return false
  if (!isIsoDate(doc.publishedAt)) return false
  return Date.parse(doc.publishedAt as string) <= now
}

/**
 * Legal document versions are immutable identifiers used for acceptance audit.
 * A malformed version must never be treated as a valid accepted-version anchor.
 */
export function assertLegalVersion(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new CmsValidationError(
      `Invalid legal document version: ${JSON.stringify(value)}.`,
    )
  }
  return value
}
