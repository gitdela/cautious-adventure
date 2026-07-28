import type { ComponentType, ReactNode } from 'react'
import type { SanityImageSource } from '@workspace/cms/image'

/**
 * Framework injection point.
 *
 * Content components are framework-neutral — they never import `next/*` or
 * React Router. Each app supplies how to render an internal link and an image.
 * The website injects `next/link` + `next/image`; the webapp injects React
 * Router `Link` + a native `<img>`. Both build the actual image URL from the
 * Sanity source via `@workspace/cms/image`.
 */
export type ContentLinkProps = {
  href: string
  children: ReactNode
  className?: string
}
export type ContentLink = ComponentType<ContentLinkProps>

export type ContentImageProps = {
  source: SanityImageSource
  alt: string
  width?: number
  height?: number
  sizes?: string
  className?: string
  priority?: boolean
}
export type ContentImage = ComponentType<ContentImageProps>

export type ContentAdapters = {
  Link: ContentLink
  Image: ContentImage
}
