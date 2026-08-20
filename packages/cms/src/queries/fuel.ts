import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type { FuelProductsQueryResult } from '../generated/sanity.types'

/**
 * Every fuel section on /fuel, in display order. Two documents today, so there
 * is nothing to paginate or filter.
 */
export const fuelProductsQuery = defineQuery(`
  *[_type == "fuelProduct"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    eyebrow,
    heading,
    highlight,
    body,
    image
  }
`)

export async function fetchFuelProducts(
  client: SanityClient = getPublishedClient(),
): Promise<FuelProductsQueryResult> {
  return client.fetch(fuelProductsQuery)
}
