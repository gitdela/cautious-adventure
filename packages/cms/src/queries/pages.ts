import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type {
  PageBySlugQueryResult,
  PageSlugsQueryResult,
} from '../generated/sanity.types'

export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    sections,
    seo
  }
`)

export const pageSlugsQuery = defineQuery(`
  *[_type == "page" && defined(slug.current)]{ "slug": slug.current }
`)

export async function fetchPageBySlug(
  slug: string,
  client: SanityClient = getPublishedClient(),
): Promise<PageBySlugQueryResult> {
  return client.fetch(pageBySlugQuery, { slug })
}

export async function fetchPageSlugs(
  client: SanityClient = getPublishedClient(),
): Promise<PageSlugsQueryResult> {
  return client.fetch(pageSlugsQuery)
}
