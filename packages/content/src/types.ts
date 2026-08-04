import type { PortableTextBlock } from '@portabletext/react'
import type { SanityImageSource } from '@workspace/cms/image'

/**
 * Stable, presentation-focused view models. App routes map raw CMS query
 * results onto these before handing them to components, so the components
 * never depend on the shape of a generated GROQ result.
 */

export type ContentImageValue = SanityImageSource & { alt?: string | null }

export type AuthorRef = {
  name: string
  slug?: string | null
  avatar?: ContentImageValue | null
  bio?: string | null
}

export type CategoryRef = {
  title: string
  slug?: string | null
}

export type BlogPostSummary = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  category?: CategoryRef | null
  author?: AuthorRef | null
  readMinutes?: number | null
  coverImage?: ContentImageValue | null
}

export type BlogPostFull = BlogPostSummary & {
  body: PortableTextBlock[]
  updatedAt?: string | null
}

export type FaqItem = {
  question: string
  answer: PortableTextBlock[]
}

export type PumpPriceView = {
  fuel: string
  /** GHS per litre. */
  amount: number
}

export type PumpPriceBoardView = {
  /** ISO datetime of the last publish — shown as the board's date. */
  updatedAt: string
  prices: PumpPriceView[]
}

export type LegalDocumentView = {
  documentKind: string
  title: string
  version: string
  effectiveAt: string
  jurisdiction?: string | null
  body: PortableTextBlock[]
}

export type { PortableTextBlock }
