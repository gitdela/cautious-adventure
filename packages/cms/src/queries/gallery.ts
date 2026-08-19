import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type { GalleryEventsQueryResult } from '../generated/sanity.types'

/**
 * Every gallery event, in page order. One read for the whole of /events: a
 * dozen-odd documents that the page filters by year in place, so querying per
 * year would cost a round trip to save nothing.
 *
 * `order` is not projected — it is the sort key, not something the page renders.
 *
 * Images come back raw. URLs are built at render time by `urlForImage`, which is
 * why there is no `asset->` dereference here or anywhere else in this package.
 */
export const galleryEventsQuery = defineQuery(`
  *[_type == "galleryEvent"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    kind,
    stream,
    eventDate,
    coverImage,
    photos,
    excerpt,
    body,
    caption,
    muxPlaybackId,
    posterTime
  }
`)

export async function fetchGalleryEvents(
  client: SanityClient = getPublishedClient(),
): Promise<GalleryEventsQueryResult> {
  return client.fetch(galleryEventsQuery)
}
