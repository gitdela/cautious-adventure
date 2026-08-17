import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type {
  TeamMemberBySlugQueryResult,
  TeamMemberSlugsQueryResult,
  TeamMembersByGroupQueryResult,
} from '../generated/sanity.types'

/**
 * Members of one group, in display order.
 *
 * Deliberately omits `bio` — the listing pages never show it, and it is by far
 * the largest field. The full bio is fetched only by the profile page.
 */
export const teamMembersByGroupQuery = defineQuery(`
  *[_type == "teamMember" && $group in groups] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    role,
    groups,
    photo,
    shortBio,
    quote,
    featured
  }
`)

/** One member with the full bio, for the profile page. */
export const teamMemberBySlugQuery = defineQuery(`
  *[_type == "teamMember" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    role,
    groups,
    photo,
    coverPhoto,
    shortBio,
    quote,
    featured,
    bio
  }
`)

/** Every slug, for `generateStaticParams` on the profile route. */
export const teamMemberSlugsQuery = defineQuery(`
  *[_type == "teamMember" && defined(slug.current)].slug.current
`)

export async function fetchTeamMembersByGroup(
  group: string,
  client: SanityClient = getPublishedClient(),
): Promise<TeamMembersByGroupQueryResult> {
  return client.fetch(teamMembersByGroupQuery, { group })
}

export async function fetchTeamMemberBySlug(
  slug: string,
  client: SanityClient = getPublishedClient(),
): Promise<TeamMemberBySlugQueryResult> {
  return client.fetch(teamMemberBySlugQuery, { slug })
}

export async function fetchTeamMemberSlugs(
  client: SanityClient = getPublishedClient(),
): Promise<TeamMemberSlugsQueryResult> {
  return client.fetch(teamMemberSlugsQuery)
}
