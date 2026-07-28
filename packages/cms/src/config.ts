import { createClient, type SanityClient } from '@sanity/client'

/**
 * Framework-neutral Sanity client singleton.
 *
 * This is the same pattern the future `@workspace/api` package will use
 * (`configureApiClient({ baseURL })`): the package never reads `process.env` /
 * `import.meta.env` itself. Each app resolves a validated config from its own
 * env source and calls `configureSanityClient` exactly once at startup —
 * Next.js in a server module, a future Vite webapp in `main.tsx`.
 *
 * The configured client is tokenless and reads only published content over the
 * CDN. Draft reads use a separate, server-only, token-aware client (see
 * `./server`). Query functions and React Query wrappers resolve the published
 * client from this singleton.
 */
export type SanityClientConfig = {
  projectId: string
  dataset: string
  apiVersion: string
}

let configuredClient: SanityClient | null = null
let configuredConfig: SanityClientConfig | null = null

const NOT_CONFIGURED =
  '[@workspace/cms] Sanity client is not configured. Call configureSanityClient(' +
  '{ projectId, dataset, apiVersion }) once at startup (Next.js: a server ' +
  'module; Vite webapp: main.tsx) before running any CMS query.'

export function configureSanityClient(
  config: SanityClientConfig,
): SanityClient {
  configuredConfig = config
  configuredClient = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    // Tokenless published reads served from the CDN. No token is ever attached
    // to the published client — the dataset is public-read by design.
    useCdn: true,
    perspective: 'published',
    stega: false,
  })
  return configuredClient
}

/** The tokenless published-content client. Throws if not yet configured. */
export function getPublishedClient(): SanityClient {
  if (!configuredClient) throw new Error(NOT_CONFIGURED)
  return configuredClient
}

/** The resolved `{ projectId, dataset, apiVersion }`. Throws if not configured. */
export function getSanityConfig(): SanityClientConfig {
  if (!configuredConfig) throw new Error(NOT_CONFIGURED)
  return configuredConfig
}

export function isSanityConfigured(): boolean {
  return configuredClient !== null
}

/** Test-only reset so a suite can assert the not-configured error path. */
export function resetSanityClientForTests(): void {
  configuredClient = null
  configuredConfig = null
}
