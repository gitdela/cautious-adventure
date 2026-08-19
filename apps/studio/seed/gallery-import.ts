/**
 * One-off importer for the /events page.
 *
 * Carried over from the hardcoded `EVENTS` array that used to live in
 * `apps/website/src/app/events/events-data.ts`.
 *
 * Three things are deliberately absent, and none of them should be invented:
 *
 *   1. THE STORY COPY IS PLACEHOLDER. The excerpts and write-ups below are the
 *      stand-ins the prototype shipped with, and they say so in their own text.
 *      Replace them verbatim when the real accounts are supplied — do not
 *      embellish them into a history nobody wrote.
 *   2. ONLY THE YEAR OF EACH EVENT IS KNOWN, so every date is written as
 *      1 January. Nothing on the site prints anything finer than the year — the
 *      mapper exposes `year` and not the date — and `order` is what the page
 *      sorts by, so the stand-in day has no effect on anything.
 *   3. THERE ARE NO PHOTOS AND NO MUX PLAYBACK ID. Both are uploaded in the
 *      Studio afterwards. `readReel` below picks reels up automatically once
 *      they exist (see its comment), and `--playback-id` wires the promo film in
 *      when someone has the ID.
 *
 * Idempotent like the fuel and lubricants importers: creates what is missing,
 * leaves existing documents alone. Pass `--replace` to overwrite them.
 *
 * Run (dataset comes from apps/studio/.env.local unless overridden):
 *   SANITY_WRITE_TOKEN=… bun run gallery:import
 *   SANITY_WRITE_TOKEN=… bun run gallery:import --playback-id=cyNPy702Ed…
 *   SANITY_STUDIO_DATASET=production SANITY_WRITE_TOKEN=… bun run gallery:import
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { createClient } from '@sanity/client'

import {
  resolveSanityApiVersion,
  resolveSanityDataset,
  resolveSanityProjectId,
} from '@workspace/config/env'

type EventSeed = {
  /** Reused verbatim from the old hardcoded ids, so nothing is renamed. */
  slug: string
  title: string
  kind: 'photos' | 'story' | 'video'
  /** Omitted for community work, which has no date. */
  year?: string
  stream?: 'community'
  /** Stories only. Placeholder — see the note at the top of this file. */
  excerpt?: string
  body?: [string, string]
  /** Videos only. */
  caption?: string
}

/** Placeholder, verbatim from the prototype. Reads as a stand-in on purpose. */
const PLACEHOLDER_BODY: [string, string] = [
  'Placeholder copy — the write-up for this event has not been supplied yet. Replace this paragraph with the real account before the page goes live.',
  'Placeholder copy — second paragraph. It exists so the modal’s layout, spacing and photo grid can be reviewed at a realistic length.',
]

const PLACEHOLDER_EXCERPT =
  'Placeholder excerpt — the short summary for this event is still to be written and supplied.'

const events: EventSeed[] = [
  {
    slug: 'gal-christmas-2025',
    title: 'A PETROSOL Christmas',
    year: '2025',
    kind: 'story',
    excerpt: PLACEHOLDER_EXCERPT,
    body: PLACEHOLDER_BODY,
  },
  {
    slug: 'gal-oilgas-awards-2025',
    title: 'Ghana Oil and Gas Awards',
    year: '2025',
    kind: 'photos',
  },
  {
    slug: 'gal-quality-awards-2025',
    title: 'National Quality Awards',
    year: '2025',
    kind: 'photos',
  },
  {
    slug: 'gal-promo-2025',
    title: 'Energizing Dreams Promo',
    year: '2025',
    kind: 'video',
    caption: 'Watch the promo film',
  },
  {
    slug: 'gal-energy-awards-2025',
    title: 'Ghana Energy Awards',
    year: '2025',
    kind: 'photos',
  },
  {
    slug: 'gal-hrfocus-2025',
    title: 'HR Focus Conference',
    year: '2025',
    kind: 'photos',
  },
  {
    slug: 'gal-wil-2025',
    title: 'Women in Leadership Conference',
    year: '2025',
    kind: 'story',
    excerpt: PLACEHOLDER_EXCERPT,
    body: PLACEHOLDER_BODY,
  },
  {
    slug: 'gal-chamber-2024',
    title: '4th Chamber of Business Awards',
    year: '2024',
    kind: 'photos',
  },
  {
    slug: 'gal-wil-2024',
    title: 'PETROSOL Women in Leadership Conference',
    year: '2024',
    kind: 'story',
    excerpt: PLACEHOLDER_EXCERPT,
    body: PLACEHOLDER_BODY,
  },
  {
    slug: 'gal-mining-energy-2023',
    title: 'Women in Mining & Energy Awards',
    year: '2023',
    kind: 'photos',
  },
  {
    slug: 'gal-oilgas-awards-2023',
    title: 'Oil & Gas Awards',
    year: '2023',
    kind: 'photos',
  },
  {
    slug: 'gal-ewn-2023',
    title: 'EWN Conference',
    year: '2023',
    kind: 'photos',
  },
  {
    slug: 'gal-lions-club',
    title: 'PETROSOL & Lions Club',
    stream: 'community',
    kind: 'story',
    excerpt: PLACEHOLDER_EXCERPT,
    body: PLACEHOLDER_BODY,
  },
]

const replace = process.argv.includes('--replace')
const dryRun = process.argv.includes('--dry-run')
const playbackId = process.argv
  .find((arg) => arg.startsWith('--playback-id='))
  ?.split('=')[1]

const token = process.env.SANITY_WRITE_TOKEN
// A dry run builds and prints the documents without ever opening a connection,
// so it needs no token — check what is about to be written before writing it.
if (!token && !dryRun) {
  console.error(
    'Missing SANITY_WRITE_TOKEN. Create an editor token in sanity.io/manage and\n' +
      'pass it inline — it is a secret and does not belong in .env.local.\n' +
      'Pass --dry-run to preview the documents without one.',
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

const eventsDir = new URL('../../website/public/images/events/', import.meta.url)

/**
 * Portable Text needs a `_key` on every array member. These are derived from
 * the slug rather than random so a `--replace` re-run produces an identical
 * document instead of a diff of nothing but keys.
 */
function paragraph(slug: string, index: number, text: string) {
  return {
    _type: 'block',
    _key: `${slug}-p${index}`,
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: `${slug}-p${index}-s`, text, marks: [] },
    ],
  }
}

/** Uploads a photo once per dataset, reusing the asset on later runs. */
async function uploadPhoto(dir: URL, filename: string): Promise<string> {
  const existing = await client.fetch<string | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    { filename },
  )
  if (existing) return existing

  const file = readFileSync(fileURLToPath(new URL(filename, dir)))
  const asset = await client.assets.upload('image', file, { filename })
  return asset._id
}

/**
 * Reads a reel for one event, if anyone has dropped one in. Nothing exists
 * today, so this is a no-op on every event — it is here so that the day the
 * photography lands, the reels can be seeded with no code change:
 *
 *   apps/website/public/images/events/<slug>/*.webp   uploaded in filename order
 *   apps/website/public/images/events/<slug>/alts.json  { "01.webp": "…" }
 *
 * Without an `alts.json` the alt text falls back to the event title, which is at
 * least true, rather than a fabricated description of a photo nobody has read.
 */
async function readReel(event: EventSeed) {
  const dir = new URL(`${event.slug}/`, eventsDir)
  if (!existsSync(fileURLToPath(dir))) return undefined

  const files = readdirSync(fileURLToPath(dir))
    .filter((name) => /\.(webp|jpe?g|png)$/i.test(name))
    .sort()
  if (files.length === 0) return undefined

  const altsPath = fileURLToPath(new URL('alts.json', dir))
  const alts: Record<string, string> = existsSync(altsPath)
    ? JSON.parse(readFileSync(altsPath, 'utf8'))
    : {}

  const photos = []
  for (const [index, filename] of files.entries()) {
    const assetId = await uploadPhoto(dir, filename)
    photos.push({
      _type: 'image',
      _key: `${event.slug}-img${index + 1}`,
      asset: { _type: 'reference', _ref: assetId },
      alt: alts[filename] ?? event.title,
    })
  }
  console.log(`    ↑ ${photos.length} photos`)
  return photos
}

function buildDoc(event: EventSeed, index: number, photos?: unknown[]) {
  const isCommunity = event.stream === 'community'

  return {
    _id: `galleryEvent-${event.slug}`,
    _type: 'galleryEvent',
    title: event.title,
    slug: { _type: 'slug', current: event.slug },
    kind: event.kind,
    stream: isCommunity ? 'community' : 'event',
    // Omitted entirely for community work — the field is genuinely absent
    // there, not empty. Elsewhere the day is a stand-in; only the year is real.
    ...(isCommunity ? {} : { eventDate: `${event.year}-01-01` }),
    order: index,
    ...(photos ? { photos } : {}),
    ...(event.excerpt ? { excerpt: event.excerpt } : {}),
    ...(event.body
      ? {
          body: event.body.map((text, i) => paragraph(event.slug, i + 1, text)),
        }
      : {}),
    ...(event.caption ? { caption: event.caption } : {}),
    // Only ever set from the command line. Nothing here invents an ID.
    ...(event.kind === 'video' && playbackId
      ? { muxPlaybackId: playbackId, posterTime: 0 }
      : {}),
  }
}

async function main() {
  if (dryRun) {
    console.log(
      `Dry run — ${events.length} documents that WOULD be written to "${dataset}":\n`,
    )
    for (const [index, event] of events.entries()) {
      console.log(JSON.stringify(buildDoc(event, index), null, 2))
    }
    console.log('\nNothing was written.')
    return
  }

  console.log(
    `Importing ${events.length} gallery events into "${dataset}"` +
      `${replace ? ' (overwriting existing documents)' : ''}.`,
  )

  for (const [index, event] of events.entries()) {
    const id = `galleryEvent-${event.slug}`
    const exists = await client.fetch<string | null>('*[_id == $id][0]._id', {
      id,
    })
    if (exists && !replace) {
      console.log(`  · ${event.title} (already present)`)
      continue
    }

    // Reading the reel before the existence check would orphan uploads on a
    // re-run — the same rule the fuel importer follows.
    const photos = await readReel(event)
    const doc = buildDoc(event, index, photos)

    if (replace) await client.createOrReplace(doc as never)
    else await client.create(doc as never)
    console.log(`  ✓ ${event.title}`)
  }

  console.log(
    'Done. Photos and the promo film’s Mux playback ID are still outstanding —\n' +
      'add them in the Studio. The story copy is placeholder and must be replaced.',
  )
}

await main()
