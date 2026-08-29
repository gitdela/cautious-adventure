import { defineQuery } from 'groq'
import type { SanityClient } from '@sanity/client'

import { getPublishedClient } from '../config'
import type { NationalLeadershipProfilesQueryResult } from '../generated/sanity.types'

export const nationalLeadershipProfilesQuery = defineQuery(`
  *[_type == "nationalLeadershipProfile"] | order(order asc) {
    _id,
    personName,
    petrosolRole,
    "profileSlug": teamMember->slug.current,
    "photo": coalesce(photo, teamMember->photo),
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
