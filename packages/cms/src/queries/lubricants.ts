import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type {
  LubricantCategoriesQueryResult,
  LubricantProductsQueryResult,
} from '../generated/sanity.types'

/** Filter chips for the catalogue, in display order. */
export const lubricantCategoriesQuery = defineQuery(`
  *[_type == "lubricantCategory"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`)

/**
 * The whole catalogue in one read. Filtering happens client-side on an
 * eleven-product list, so paginating or querying per category would cost a
 * round trip to save nothing.
 *
 * The category reference is dereferenced here rather than in the mapper, so the
 * view model never carries a raw Sanity reference.
 */
export const lubricantProductsQuery = defineQuery(`
  *[_type == "lubricantProduct"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    grade,
    standard,
    applications,
    drainInterval,
    benefits,
    image,
    featuredOnHome,
    "category": category->{ title, "slug": slug.current }
  }
`)

export async function fetchLubricantCategories(
  client: SanityClient = getPublishedClient(),
): Promise<LubricantCategoriesQueryResult> {
  return client.fetch(lubricantCategoriesQuery)
}

export async function fetchLubricantProducts(
  client: SanityClient = getPublishedClient(),
): Promise<LubricantProductsQueryResult> {
  return client.fetch(lubricantProductsQuery)
}
