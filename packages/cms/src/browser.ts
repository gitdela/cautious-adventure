/**
 * Browser / published-content entry point.
 *
 * Safe to import from any environment. Exposes the tokenless published client
 * factory and config accessors. Never exposes a token-aware draft client — that
 * lives behind `@workspace/cms/server`, guarded by `server-only`.
 */
export {
  configureSanityClient,
  getPublishedClient,
  getSanityConfig,
  isSanityConfigured,
  resetSanityClientForTests,
  type SanityClientConfig,
} from './config'
