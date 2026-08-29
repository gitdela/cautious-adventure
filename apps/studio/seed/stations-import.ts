/**
 * One-off importer for the station directory: regions, territories, stations.
 *
 * Seeds a *fresh* dataset. To add regions to a dataset that already holds
 * stations, use `stations-region-backfill.ts` instead — this script's
 * `--replace` would reset manager, phone and amenity edits made in Studio since
 * the original import.
 *
 * The data itself lives in `stations-data.ts`; see its header for where the 88
 * stations came from and which region assignments are inferred.
 *
 * Idempotent like the other importers: creates what is missing, leaves existing
 * documents alone. Pass `--replace` to overwrite them — and `--yes-production`
 * as well if the target is the production dataset.
 *
 * Run (dataset comes from apps/studio/.env.local unless overridden):
 *   SANITY_WRITE_TOKEN=… bun run stations:import
 *   SANITY_STUDIO_DATASET=production SANITY_WRITE_TOKEN=… bun run stations:import
 */
import { createClient } from '@sanity/client'

import {
  resolveSanityApiVersion,
  resolveSanityDataset,
  resolveSanityProjectId,
} from '@workspace/config/env'

import { ordersByStationSlug, regions, territories } from './stations-data'

const replace = process.argv.includes('--replace')

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error(
    'Missing SANITY_WRITE_TOKEN. Create an editor token in sanity.io/manage and\n' +
      'pass it inline — it is a secret and does not belong in .env.local.',
  )
  process.exit(1)
}

const dataset = resolveSanityDataset(process.env)

// --replace on production would silently undo editor work on 88 live documents.
// Make that a deliberate act rather than a flag someone copy-pasted.
if (replace && dataset === 'production' && !process.argv.includes('--yes-production')) {
  console.error(
    'Refusing to --replace the production dataset: it would reset manager,\n' +
      'phone and amenity edits made in Studio. Use stations-region-backfill.ts\n' +
      'to add regions without touching anything else, or pass --yes-production\n' +
      'if you really mean to overwrite.',
  )
  process.exit(1)
}

const client = createClient({
  projectId: resolveSanityProjectId(process.env),
  dataset,
  apiVersion: resolveSanityApiVersion(process.env),
  token,
  useCdn: false,
})

async function write(doc: Record<string, unknown>): Promise<'created' | 'kept'> {
  if (replace) {
    await client.createOrReplace(doc as never)
    return 'created'
  }
  const before = await client.fetch<string | null>('*[_id == $id][0]._id', {
    id: doc._id,
  })
  if (before) return 'kept'
  await client.create(doc as never)
  return 'created'
}

async function main() {
  const total = territories.reduce((n, t) => n + t.stations.length, 0)
  console.log(
    `Importing ${regions.length} regions, ${territories.length} territories and ` +
      `${total} stations into "${dataset}"` +
      `${replace ? ' (overwriting existing documents)' : ''}.`,
  )

  // Regions first: a station references one, so it has to exist by then.
  let regionsCreated = 0
  for (const region of regions) {
    const outcome = await write({
      _id: `stationRegion-${region.slug}`,
      _type: 'stationRegion',
      name: region.name,
      slug: { _type: 'slug', current: region.slug },
      order: region.order,
    })
    if (outcome === 'created') regionsCreated++
  }
  console.log(
    `  ✓ Regions${''.padEnd(17)} ${regionsCreated} created, ` +
      `${regions.length - regionsCreated} already present`,
  )

  const orders = ordersByStationSlug()

  for (const [index, territory] of territories.entries()) {
    const result = await write({
      _id: `stationTerritory-${territory.slug}`,
      _type: 'stationTerritory',
      name: territory.name,
      slug: { _type: 'slug', current: territory.slug },
      order: index,
    })

    let created = 0
    let kept = 0
    for (const station of territory.stations) {
      const order = orders.get(station.slug)
      if (order === undefined) {
        throw new Error(`No display order computed for "${station.slug}".`)
      }
      const outcome = await write({
        _id: `station-${station.slug}`,
        _type: 'station',
        name: station.name,
        slug: { _type: 'slug', current: station.slug },
        region: {
          _type: 'reference',
          _ref: `stationRegion-${station.region}`,
        },
        territory: {
          _type: 'reference',
          _ref: `stationTerritory-${territory.slug}`,
        },
        manager: station.manager,
        phones: station.phones,
        ...(station.amenities?.length ? { amenities: station.amenities } : {}),
        order,
      })
      if (outcome === 'created') created++
      else kept++
    }

    console.log(
      `  ${result === 'kept' ? '·' : '✓'} ${territory.name.padEnd(24)} ` +
        `${created} created, ${kept} already present`,
    )
  }

  console.log('Done.')
}

await main()
