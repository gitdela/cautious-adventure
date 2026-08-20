import { describe, expect, it } from 'vitest'

import {
  resolveSanityApiVersion,
  resolveSanityConfig,
  resolveSanityDataset,
  resolveSanityProjectId,
  resolveTurnstileSiteKey,
  sanityApiVersionFallback,
  turnstileTestSiteKey,
} from './env'

describe('resolveSanityProjectId', () => {
  it('reads the project id from any supported key', () => {
    expect(
      resolveSanityProjectId({ NEXT_PUBLIC_SANITY_PROJECT_ID: 'abc123' }),
    ).toBe('abc123')
    expect(resolveSanityProjectId({ VITE_SANITY_PROJECT_ID: 'v1' })).toBe('v1')
    expect(resolveSanityProjectId({ SANITY_STUDIO_PROJECT_ID: 's1' })).toBe('s1')
  })

  it('throws when the project id is missing (no safe fallback)', () => {
    expect(() => resolveSanityProjectId({})).toThrow(/Missing Sanity project id/i)
  })
})

describe('resolveSanityDataset', () => {
  it('returns an allowlisted dataset', () => {
    expect(
      resolveSanityDataset({ NEXT_PUBLIC_SANITY_DATASET: 'production' }),
    ).toBe('production')
  })

  it('rejects an unknown dataset name', () => {
    expect(() =>
      resolveSanityDataset({ VITE_SANITY_DATASET: 'staging' }),
    ).toThrow(/Unknown Sanity dataset/i)
  })

  it('falls back to development when unset in a non-production env', () => {
    expect(resolveSanityDataset({})).toBe('development')
  })

  it('never silently defaults to a dataset in production — it throws', () => {
    expect(() => resolveSanityDataset({ NODE_ENV: 'production' })).toThrow(
      /production must never fall back/i,
    )
    expect(() => resolveSanityDataset({ MODE: 'production' })).toThrow()
  })
})

describe('resolveSanityApiVersion', () => {
  it('accepts a pinned date string', () => {
    expect(
      resolveSanityApiVersion({ NEXT_PUBLIC_SANITY_API_VERSION: '2026-07-01' }),
    ).toBe('2026-07-01')
  })

  it('rejects a non-date (e.g. dynamic) version', () => {
    expect(() =>
      resolveSanityApiVersion({ VITE_SANITY_API_VERSION: 'vX' }),
    ).toThrow(/Invalid Sanity API version/i)
  })

  it('falls back to the pinned constant in development', () => {
    expect(resolveSanityApiVersion({})).toBe(sanityApiVersionFallback)
  })

  it('throws when missing in production', () => {
    expect(() =>
      resolveSanityApiVersion({ NODE_ENV: 'production' }),
    ).toThrow(/Missing Sanity API version/i)
  })
})

describe('resolveSanityConfig', () => {
  it('aggregates a full valid config', () => {
    expect(
      resolveSanityConfig({
        VITE_SANITY_PROJECT_ID: 'abc123xy',
        VITE_SANITY_DATASET: 'development',
        VITE_SANITY_API_VERSION: '2026-07-01',
      }),
    ).toEqual({
      projectId: 'abc123xy',
      dataset: 'development',
      apiVersion: '2026-07-01',
    })
  })
})

describe('resolveTurnstileSiteKey', () => {
  it('reads the site key from any supported key', () => {
    expect(
      resolveTurnstileSiteKey({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: '0x4real' }),
    ).toBe('0x4real')
    expect(resolveTurnstileSiteKey({ VITE_TURNSTILE_SITE_KEY: 'v1' })).toBe('v1')
  })

  it('falls back to the always-passes test key outside production', () => {
    expect(resolveTurnstileSiteKey({})).toBe(turnstileTestSiteKey)
  })

  it('throws in production rather than shipping the test key', () => {
    expect(() =>
      resolveTurnstileSiteKey({ NODE_ENV: 'production' }),
    ).toThrow(/Missing Cloudflare Turnstile site key/i)
  })
})
