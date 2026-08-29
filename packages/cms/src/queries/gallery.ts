import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type { GalleryEventsQueryResult } from '../generated/sanity.types'

/**
 * Gallery events in page order. Passing `stream: null` returns the whole
 * gallery for /events; passing a stream or series lets another page reuse the
 * same projection without downloading unrelated records.
 *
 * `order` is not projected — it is the sort key, not something the page renders.
 *
 * Images come back raw. URLs are built at render time by `urlForImage`, which is
 * why there is no `asset->` dereference here or anywhere else in this package.
 */
export const galleryEventsQuery = defineQuery(`
  *[
    _type == "galleryEvent" &&
    (!defined($stream) || stream == $stream) &&
    (!defined($series) || series == $series)
  ] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    kind,
    stream,
    series,
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
  return client.fetch(galleryEventsQuery, { stream: null, series: null })
}
