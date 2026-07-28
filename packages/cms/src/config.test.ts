import { afterEach, describe, expect, it } from 'vitest'

import {
  configureSanityClient,
  getPublishedClient,
  getSanityConfig,
  isSanityConfigured,
  resetSanityClientForTests,
} from './config'

const CONFIG = {
  projectId: 'abc123xy',
  dataset: 'development',
  apiVersion: '2026-07-01',
}

afterEach(() => {
  resetSanityClientForTests()
})

describe('configureSanityClient', () => {
  it('throws a clear error when queried before configuration', () => {
    expect(isSanityConfigured()).toBe(false)
    expect(() => getPublishedClient()).toThrow(/not configured/i)
    expect(() => getSanityConfig()).toThrow(/not configured/i)
  })

  it('exposes a tokenless published client after configuration', () => {
    configureSanityClient(CONFIG)
    expect(isSanityConfigured()).toBe(true)

    const client = getPublishedClient()
    expect(client.config().projectId).toBe('abc123xy')
    expect(client.config().dataset).toBe('development')
    expect(client.config().useCdn).toBe(true)
    // The published client must never carry a token.
    expect(client.config().token).toBeUndefined()
  })

  it('returns the resolved config', () => {
    configureSanityClient(CONFIG)
    expect(getSanityConfig()).toEqual(CONFIG)
  })
})
