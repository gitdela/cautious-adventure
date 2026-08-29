import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type {
  StationRegionsQueryResult,
  StationsQueryResult,
} from '../generated/sanity.types'

/**
 * Regions for the directory's filter, in display order.
 *
 * Only regions that actually hold a station: all sixteen exist as documents so
 * an editor can file a new site anywhere, but offering a customer a region with
 * nothing in it is a dead end. Filtering here rather than in the component means
 * the dropdown grows on its own the day a station opens in Volta — no deploy.
 */
export const stationRegionsQuery = defineQuery(`
  *[_type == "stationRegion" && count(*[_type == "station" && references(^._id)]) > 0]
    | order(order asc) {
    _id,
    name,
    "slug": slug.current
  }
`)

/**
 * The whole network in one read. Under a hundred rows, and the directory
 * filters and searches across all of them client-side, so fetching per
 * region would cost a round trip on every dropdown change and break search.
 *
 * The region reference is dereferenced here so the view model never carries
 * a raw Sanity reference. `territory` is deliberately not projected — it is an
 * internal sales grouping and no public surface may show it.
 */
export const stationsQuery = defineQuery(`
  *[_type == "station"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    manager,
    phones,
    amenities,
    "region": region->{ name, "slug": slug.current }
  }
`)

export async function fetchStationRegions(
  client: SanityClient = getPublishedClient(),
): Promise<StationRegionsQueryResult> {
  return client.fetch(stationRegionsQuery)
}

export async function fetchStations(
  client: SanityClient = getPublishedClient(),
): Promise<StationsQueryResult> {
  return client.fetch(stationsQuery)
}
