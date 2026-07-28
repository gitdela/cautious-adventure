/**
 * Framework-neutral GROQ queries and typed fetch functions. No React Query, no
 * Next, no framework imports. Each fetch function resolves the tokenless
 * published client from the singleton by default, but accepts an explicit
 * client so the website can inject a draft client during preview.
 */
export * from './posts'
export * from './legal'
export * from './pages'
