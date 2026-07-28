export type EnvSource = Record<string, string | undefined>

export const localUrls = {
  api: 'http://localhost:4000',
  website: 'http://localhost:3000',
  webapp: 'http://localhost:5174',
} as const

// True when the env source indicates a production build/runtime.
// - Next.js / Node: `NODE_ENV === 'production'`
// - Vite:           `MODE === 'production'` (set by `vite build`)
function isProductionEnv(env: EnvSource): boolean {
  return env.NODE_ENV === 'production' || env.MODE === 'production'
}

// Resolve an env-driven URL, walking `keys` in priority order.
// In production we fail loud instead of silently falling back to localhost —
// a misconfigured deploy should crash at boot, not silently call the
// visitor's own machine.
function resolveUrl(
  env: EnvSource,
  keys: readonly string[],
  label: string,
  fallback: string,
): string {
  for (const key of keys) {
    const value = env[key]
    if (typeof value === 'string' && value.length > 0) return value
  }

  if (isProductionEnv(env)) {
    throw new Error(
      `[@workspace/config] Missing required env var for ${label}. ` +
        `Set one of: ${keys.join(', ')}. ` +
        `Production builds must not fall back to ${fallback}.`,
    )
  }

  return fallback
}

export function resolveApiBaseUrl(env: EnvSource = {}) {
  return resolveUrl(
    env,
    ['NEXT_PUBLIC_API_BASE_URL', 'VITE_API_BASE_URL', 'API_BASE_URL'],
    'API base URL',
    localUrls.api,
  )
}

export function resolveWebsiteUrl(env: EnvSource = {}) {
  return resolveUrl(
    env,
    ['NEXT_PUBLIC_WEBSITE_URL', 'VITE_WEBSITE_URL', 'WEBSITE_URL'],
    'website URL',
    localUrls.website,
  )
}

export function resolveWebappUrl(env: EnvSource = {}) {
  return resolveUrl(
    env,
    ['NEXT_PUBLIC_WEBAPP_URL', 'VITE_WEBAPP_URL', 'WEBAPP_URL'],
    'webapp URL',
    localUrls.webapp,
  )
}

// ---------------------------------------------------------------------------
// Sanity CMS configuration
//
// These resolve the *public* Sanity client config only — project ID, dataset,
// and API version. They never resolve server-only tokens/secrets (read token,
// preview secret, webhook secret); those are read directly from the server
// environment in the Next.js app, never through @workspace/config.
// ---------------------------------------------------------------------------

// Datasets are an explicit allowlist. A typo or an unknown name should fail
// loudly rather than silently target the wrong content. A `staging` dataset can
// be added here once a dedicated staging deployment exists.
export const sanityDatasets = ['development', 'production'] as const
export type SanityDataset = (typeof sanityDatasets)[number]

// Pinned, date-formatted API version. Never a dynamic `new Date()` — a moving
// version silently changes query behavior across deploys.
export const sanityApiVersionFallback = '2026-07-01'

export type SanityConfig = {
  projectId: string
  dataset: SanityDataset
  apiVersion: string
}

// First non-empty value across a priority-ordered key list.
function firstDefined(
  env: EnvSource,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const value = env[key]
    if (typeof value === 'string' && value.length > 0) return value
  }
  return undefined
}

const DATE_API_VERSION = /^\d{4}-\d{2}-\d{2}$/

function assertDateApiVersion(value: string): string {
  if (!DATE_API_VERSION.test(value)) {
    throw new Error(
      `[@workspace/config] Invalid Sanity API version "${value}". ` +
        `Use a pinned date string like ${sanityApiVersionFallback}, never a dynamic version.`,
    )
  }
  return value
}

// Project ID is always required — there is no safe local fallback (unlike an
// API base URL). It is public (shipped in the browser bundle) so it lives in
// the committed env templates, but a build with it missing is a misconfig.
export function resolveSanityProjectId(env: EnvSource = {}): string {
  const value = firstDefined(env, [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'VITE_SANITY_PROJECT_ID',
    'SANITY_STUDIO_PROJECT_ID',
    'SANITY_PROJECT_ID',
  ])
  if (value) return value
  throw new Error(
    '[@workspace/config] Missing Sanity project ID. Set one of: ' +
      'NEXT_PUBLIC_SANITY_PROJECT_ID, VITE_SANITY_PROJECT_ID, SANITY_STUDIO_PROJECT_ID.',
  )
}

// Dataset never silently defaults to `production`. In development it falls back
// to `development`; in production it must be set explicitly.
export function resolveSanityDataset(env: EnvSource = {}): SanityDataset {
  const value = firstDefined(env, [
    'NEXT_PUBLIC_SANITY_DATASET',
    'VITE_SANITY_DATASET',
    'SANITY_STUDIO_DATASET',
    'SANITY_DATASET',
  ])

  if (value) {
    if (!(sanityDatasets as readonly string[]).includes(value)) {
      throw new Error(
        `[@workspace/config] Unknown Sanity dataset "${value}". ` +
          `Allowed: ${sanityDatasets.join(', ')}.`,
      )
    }
    return value as SanityDataset
  }

  if (isProductionEnv(env)) {
    throw new Error(
      '[@workspace/config] Missing Sanity dataset in a production build. ' +
        'Set NEXT_PUBLIC_SANITY_DATASET / VITE_SANITY_DATASET explicitly; ' +
        'production must never fall back to a default dataset.',
    )
  }

  return 'development'
}

export function resolveSanityApiVersion(env: EnvSource = {}): string {
  const value = firstDefined(env, [
    'NEXT_PUBLIC_SANITY_API_VERSION',
    'VITE_SANITY_API_VERSION',
    'SANITY_STUDIO_API_VERSION',
    'SANITY_API_VERSION',
  ])

  if (value) return assertDateApiVersion(value)

  if (isProductionEnv(env)) {
    throw new Error(
      '[@workspace/config] Missing Sanity API version in a production build. ' +
        `Set NEXT_PUBLIC_SANITY_API_VERSION / VITE_SANITY_API_VERSION (e.g. ${sanityApiVersionFallback}).`,
    )
  }

  return sanityApiVersionFallback
}

// Convenience aggregate used by each app's `configureSanityClient` bootstrap.
export function resolveSanityConfig(env: EnvSource = {}): SanityConfig {
  return {
    projectId: resolveSanityProjectId(env),
    dataset: resolveSanityDataset(env),
    apiVersion: resolveSanityApiVersion(env),
  }
}
