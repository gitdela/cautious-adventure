import {
  createImageUrlBuilder,
  type ImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url'

import { getSanityConfig } from './config'

export type { SanityImageSource }

/**
 * Returns a Sanity image URL builder for a source. Framework-agnostic: it emits
 * URLs only. Framework image components (`next/image`, native `<img>`) are
 * supplied app-locally, not here.
 *
 *   urlForImage(post.coverImage).width(1200).height(630).url()
 */
export function urlForImage(source: SanityImageSource): ImageUrlBuilder {
  const { projectId, dataset } = getSanityConfig()
  return createImageUrlBuilder({ projectId, dataset }).image(source)
}
