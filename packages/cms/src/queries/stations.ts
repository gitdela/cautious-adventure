import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type {
  StationTerritoriesQueryResult,
  StationsQueryResult,
} from '../generated/sanity.types'

/** Territories for the directory's filter, in display order. */
export const stationTerritoriesQuery = defineQuery(`
  *[_type == "stationTerritory"] | order(order asc) {
    _id,
    name,
    "slug": slug.current
  }
`)

/**
 * The whole network in one read. Under a hundred rows, and the directory
 * filters and searches across all of them client-side, so fetching per
 * territory would cost a round trip on every dropdown change and break search.
 *
 * The territory reference is dereferenced here so the view model never carries
 * a raw Sanity reference.
 */
export const stationsQuery = defineQuery(`
  *[_type == "station"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    manager,
    phones,
    amenities,
    "territory": territory->{ name, "slug": slug.current }
  }
`)

export async function fetchStationTerritories(
  client: SanityClient = getPublishedClient(),
): Promise<StationTerritoriesQueryResult> {
  return client.fetch(stationTerritoriesQuery)
}

export async function fetchStations(
  client: SanityClient = getPublishedClient(),
): Promise<StationsQueryResult> {
  return client.fetch(stationsQuery)
}
