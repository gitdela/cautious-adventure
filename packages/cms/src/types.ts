/**
 * Public type surface for CMS consumers.
 *
 * Re-exports the committed TypeGen output (generated from the schema registry
 * and the `defineQuery` strings). Importing this module also registers the
 * `@sanity/client` query-map augmentation, so `client.fetch(query)` is typed.
 *
 * Where a generated result type is too permissive for a load-bearing surface,
 * add a stable app-facing view model here and validate at the boundary with
 * helpers from `@workspace/cms/validation`.
 */
export * from './generated/sanity.types'
