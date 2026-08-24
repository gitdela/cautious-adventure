/**
 * Sets `featuredRank` on the three posts the home page band should carry.
 *
 * The band queries `defined(featuredRank)` and takes the lowest three. Nothing
 * in the imported archive had a rank, so the query matched nothing and the
 * home page rendered no news section at all — the import dropped the ranks the
 * previous records had.
 *
 * The three chosen are the most recent articles that carry a real photograph
 * rather than the old site's stock forecourt shot, so the band looks like three
 * distinct stories instead of the same picture three times.
 *
 * Editors change this in the Studio afterwards; the field is a plain number and
 * this only seeds a sensible starting point.
 *
 * Run:
 *   SANITY_WRITE_TOKEN=… bun run blog:featured --dry-run
 *   SANITY_WRITE_TOKEN=… bun run blog:featured
 */
import { createClient } from '@sanity/client'

import {
  resolveSanityApiVersion,
  resolveSanityDataset,
  resolveSanityProjectId,
} from '@workspace/config/env'

/** Slug → rank. Lower surfaces first. */
const FEATURED: Array<[slug: string, rank: number]> = [
  ['petrosol-commended-for-fuel-quality-and-accuracy', 0],
  ['petrosol-appoints-former-ceo-of-valco-as-its-board-chairman', 1],
  ['the-cfo-of-petrosol-ghana-receives-exemplary-leadership-award', 2],
]

const dryRun = process.argv.includes('--dry-run')

const token = process.env.SANITY_WRITE_TOKEN
if (!token && !dryRun) {
  console.error(
    'Missing SANITY_WRITE_TOKEN. Pass it inline — it is a secret.\n' +
      'Use --dry-run to preview without one.',
  )
  process.exit(1)
}

const dataset = resolveSanityDataset(process.env)
const client = createClient({
  projectId: resolveSanityProjectId(process.env),
  dataset,
  apiVersion: resolveSanityApiVersion(process.env),
  token,
  useCdn: false,
})

async function main() {
  const posts = await client.fetch<
    { _id: string; title: string; featuredRank: number | null }[]
  >('*[_type == "post"]{_id, title, featuredRank}')
  const byId = new Map(posts.map((p) => [p._id, p]))
  const featuredIds = new Set(FEATURED.map(([slug]) => `post-${slug}`))

  console.log(`${dryRun ? 'Dry run — would set' : 'Setting'} in "${dataset}":\n`)

  for (const [slug, rank] of FEATURED) {
    const id = `post-${slug}`
    const post = byId.get(id)
    if (!post) {
      console.log(`  ? ${id} — not in the dataset, skipping`)
      continue
    }
    console.log(`  ${rank}  ${post.title}`)
    if (!dryRun) await client.patch(id).set({ featuredRank: rank }).commit()
  }

  // Anything else holding a rank would compete for the three slots, so clear it.
  const stale = posts.filter(
    (p) => p.featuredRank !== null && !featuredIds.has(p._id),
  )
  for (const post of stale) {
    console.log(`  −  clearing stale rank on ${post.title}`)
    if (!dryRun) await client.patch(post._id).unset(['featuredRank']).commit()
  }

  console.log(dryRun ? '\nNothing was written.' : '\nDone.')
}

await main()
