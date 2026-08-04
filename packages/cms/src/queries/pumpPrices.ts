import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type { PumpPricesQueryResult } from '../generated/sanity.types'

export const pumpPricesQuery = defineQuery(`
  *[_type == "pumpPrices"][0] {
    _id,
    _updatedAt,
    prices[] { fuel, price }
  }
`)

export async function fetchPumpPrices(
  client: SanityClient = getPublishedClient(),
): Promise<PumpPricesQueryResult> {
  return client.fetch(pumpPricesQuery)
}
