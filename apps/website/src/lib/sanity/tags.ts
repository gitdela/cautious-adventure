/**
 * Deterministic cache tags. Every cached CMS read declares one or more of these,
 * and the revalidation webhook maps a changed document to the same tags so only
 * the affected pages refresh. Keep these pure string builders — the webhook and
 * the fetch layer must agree exactly.
 */
export const cacheTags = {
  postList: () => "sanity:post:list",
  post: (id: string) => `sanity:post:${id}`,
  postSlug: (slug: string) => `sanity:post:slug:${slug}`,

  page: (slug: string) => `sanity:page:${slug}`,
  legal: (kind: string) => `sanity:legal:${kind}`,
  pumpPrices: () => "sanity:pumpPrices",

  /** Type-wide tag, used as a delete/slug-change safety net. */
  type: (type: string) => `sanity:type:${type}`,
} as const;
