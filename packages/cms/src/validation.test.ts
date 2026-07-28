import { describe, expect, it } from 'vitest'

import {
  CmsValidationError,
  assertIsoDate,
  assertLegalVersion,
  assertSlug,
  isIsoDate,
  isPublished,
  isValidSlug,
} from './validation'

describe('isValidSlug / assertSlug', () => {
  it('accepts url-safe slugs', () => {
    expect(isValidSlug('bitcoin-basics')).toBe(true)
    expect(isValidSlug('solana')).toBe(true)
    expect(assertSlug('a1-b2')).toBe('a1-b2')
  })

  it('rejects malformed slugs', () => {
    expect(isValidSlug('Bad Slug')).toBe(false)
    expect(isValidSlug('trailing-')).toBe(false)
    expect(isValidSlug('')).toBe(false)
    expect(isValidSlug(null)).toBe(false)
    expect(() => assertSlug('Not A Slug')).toThrow(CmsValidationError)
  })
})

describe('isIsoDate / assertIsoDate', () => {
  it('accepts parseable ISO datetimes', () => {
    expect(isIsoDate('2026-05-22T10:00:00Z')).toBe(true)
    expect(assertIsoDate('2026-05-22')).toBe('2026-05-22')
  })

  it('rejects non-dates', () => {
    expect(isIsoDate('not-a-date')).toBe(false)
    expect(isIsoDate(123)).toBe(false)
    expect(() => assertIsoDate('nope')).toThrow(CmsValidationError)
  })
})

describe('isPublished', () => {
  const NOW = Date.parse('2026-07-18T00:00:00Z')

  it('is true for a slugged, past-dated doc', () => {
    expect(
      isPublished({ slug: 'x', publishedAt: '2026-05-01T00:00:00Z' }, NOW),
    ).toBe(true)
  })

  it('is false for a future-dated doc', () => {
    expect(
      isPublished({ slug: 'x', publishedAt: '2026-09-01T00:00:00Z' }, NOW),
    ).toBe(false)
  })

  it('is false without a valid slug or date', () => {
    expect(isPublished({ publishedAt: '2026-05-01T00:00:00Z' }, NOW)).toBe(false)
    expect(isPublished({ slug: 'x' }, NOW)).toBe(false)
  })
})

describe('assertLegalVersion', () => {
  it('accepts a non-empty version', () => {
    expect(assertLegalVersion('2026-07')).toBe('2026-07')
  })

  it('rejects empty/blank versions', () => {
    expect(() => assertLegalVersion('')).toThrow(CmsValidationError)
    expect(() => assertLegalVersion('   ')).toThrow(CmsValidationError)
    expect(() => assertLegalVersion(undefined)).toThrow(CmsValidationError)
  })
})
