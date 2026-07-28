import 'server-only'

import { createClient, type SanityClient } from '@sanity/client'

import { getSanityConfig } from './config'

/**
 * Server-only, token-aware draft client for Next.js Draft Mode preview.
 *
 * `import 'server-only'` makes any accidental import from a client bundle a
 * build error, so the read token can never leak to the browser. Published
 * server reads must NOT use this — they use the tokenless `getPublishedClient()`
 * from `./config`.
 */
export type DraftClientOptions = {
  token: string
}

export function getDraftClient({ token }: DraftClientOptions): SanityClient {
  if (!token) {
    throw new Error(
      '[@workspace/cms] getDraftClient requires a server-only read token.',
    )
  }

  const { projectId, dataset, apiVersion } = getSanityConfig()

  return createClient({
    projectId,
    dataset,
    apiVersion,
    // Drafts must never be cached at the CDN edge, and must resolve the
    // drafts perspective using the viewer-scoped token.
    useCdn: false,
    perspective: 'drafts',
    token,
    stega: false,
  })
}
