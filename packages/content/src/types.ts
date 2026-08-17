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

/**
 * A person on the Leadership or Board page. The summary is what the listing
 * grids render; `TeamMemberFull` adds the long bio and is fetched only by the
 * individual profile page, since it is the heaviest field.
 */
export type TeamMemberSummary = {
  id: string
  slug: string
  name: string
  role: string
  /**
   * Which pages this person appears on. Present on the summary because a
   * listing page needs it to tell its OWN featured person from someone who is
   * featured on the other page — the CEO sits in both groups.
   */
  groups: string[]
  photo?: ContentImageValue | null
  shortBio?: string | null
  /** Rendered as a pull quote. Chairman only, at time of writing. */
  quote?: string | null
  featured: boolean
}

export type TeamMemberFull = TeamMemberSummary & {
  /**
   * Optional second image for the profile page. Absent for most people — the
   * page should fall back to the headshot rather than assume it exists.
   */
  coverPhoto?: ContentImageValue | null
  bio: PortableTextBlock[]
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
