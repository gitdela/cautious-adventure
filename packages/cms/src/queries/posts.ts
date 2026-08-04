import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type {
  PostBySlugQueryResult,
  PostListQueryResult,
  PostSlugsQueryResult,
  PostCountQueryResult,
} from '../generated/sanity.types'

// Published filter, repeated across queries: has a slug and is not future-dated.
const PUBLISHED = `_type == "post" && defined(slug.current) && publishedAt <= now()`

// Bounded page window via $start/$end — never fetch the whole collection.
export const postListQuery = defineQuery(`
  *[${PUBLISHED}] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    updatedAt,
    coverImage,
    featuredRank,
    "author": author->{ name, "slug": slug.current, avatar },
    "category": category->{ title, "slug": slug.current }
  }
`)

// Explicitly-curated home slots: only posts with a featuredRank, best first.
export const featuredPostsQuery = defineQuery(`
  *[${PUBLISHED} && defined(featuredRank)] | order(featuredRank asc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    updatedAt,
    coverImage,
    featuredRank,
    "author": author->{ name, "slug": slug.current, avatar },
    "category": category->{ title, "slug": slug.current }
  }
`)

export const postCountQuery = defineQuery(`count(*[${PUBLISHED}])`)

export const postBySlugQuery = defineQuery(`
  *[${PUBLISHED} && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    updatedAt,
    coverImage,
    body,
    "author": author->{ name, "slug": slug.current, avatar, bio, links },
    "category": category->{ title, "slug": slug.current },
    seo
  }
`)

// For sitemap / static params. Slugs only, no bodies.
export const postSlugsQuery = defineQuery(`
  *[${PUBLISHED}]{ "slug": slug.current }
`)

export type PostListParams = { start: number; end: number }

export async function fetchPostList(
  params: PostListParams,
  client: SanityClient = getPublishedClient(),
): Promise<PostListQueryResult> {
  return client.fetch(postListQuery, params)
}

export async function fetchPostCount(
  client: SanityClient = getPublishedClient(),
): Promise<PostCountQueryResult> {
  return client.fetch(postCountQuery)
}

export async function fetchPostBySlug(
  slug: string,
  client: SanityClient = getPublishedClient(),
): Promise<PostBySlugQueryResult> {
  return client.fetch(postBySlugQuery, { slug })
}

export async function fetchPostSlugs(
  client: SanityClient = getPublishedClient(),
): Promise<PostSlugsQueryResult> {
  return client.fetch(postSlugsQuery)
}
