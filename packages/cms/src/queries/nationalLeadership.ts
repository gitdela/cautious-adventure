import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type { NationalLeadershipProfilesQueryResult } from '../generated/sanity.types'

/**
 * Portrait and profile link resolve in three steps: the photo override on this
 * document, then the referenced team member, then an exact name match against
 * `teamMember`.
 *
 * The name match is the safety net for the common editorial case: the profile
 * is written for someone who already has a leadership or board portrait, but
 * the optional reference was never wired up. Without it the page falls back to
 * a "portrait coming soon" placeholder while the photo sits in the dataset.
 */
export const nationalLeadershipProfilesQuery = defineQuery(`
  *[_type == "nationalLeadershipProfile"] | order(order asc) {
    _id,
    personName,
    petrosolRole,
    "profileSlug": coalesce(
      teamMember->slug.current,
      *[_type == "teamMember" && name == ^.personName][0].slug.current
    ),
    "photo": coalesce(
      photo,
      teamMember->photo,
      *[_type == "teamMember" && name == ^.personName][0].photo
    ),
    appointments[] {
      _key,
      institution,
      position,
      status,
      tenure,
      summary,
      sourceUrl
    }
  }
`)

export async function fetchNationalLeadershipProfiles(
  client: SanityClient = getPublishedClient(),
): Promise<NationalLeadershipProfilesQueryResult> {
  return client.fetch(nationalLeadershipProfilesQuery)
}
