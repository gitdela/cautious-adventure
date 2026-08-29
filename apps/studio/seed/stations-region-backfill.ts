/**
 * Backfills `region` (and the region-clustered `order`) onto stations that are
 * already in a dataset.
 *
 * This is the migration companion to `stations-import.ts`. The importer's
 * `--replace` rewrites whole documents and would undo any manager, phone or
 * amenity edit made in Studio since the original import; this script only
 * patches the two fields the region switch actually needs.
 *
 * `region` is a required field, and `/find-a-station` reads live and uncached,
 * so a single station left without one throws in the mapper and 500s the page.
 * The script therefore refuses to finish quietly: it reports stations it could
 * not place and exits non-zero.
 *
 * Auth comes from the Sanity CLI's own login rather than SANITY_WRITE_TOKEN,
 * which is why this runs through `sanity exec` and not `bun run`:
 *
 *   cd apps/studio
 *   SANITY_STUDIO_DATASET=development bun run stations:region:backfill
 *   bun run stations:region:backfill          # whatever .env.local points at
 *
 * Idempotent: stations that already have a region are skipped, so a re-run
 * never undoes an editor's correction. Pass `--force` to overwrite them.
 */
import { getCliClient } from 'sanity/cli'

import { ordersByStationSlug, regions, territories } from './stations-data'

const force = process.argv.includes('--force')

type StationRow = {
  _id: string
  slug: string | null
  hasRegion: boolean
}

async function main() {
  const client = getCliClient()
  const dataset = client.config().dataset
  console.log(
    `Backfilling station regions in "${dataset}"` +
      `${force ? ' (overwriting existing regions)' : ''}.`,
  )

  // 1. Region documents. createIfNotExists, never createOrReplace — an editor
  //    may have renamed one, and the name is what customers read.
  for (const region of regions) {
    await client.createIfNotExists({
      _id: `stationRegion-${region.slug}`,
      _type: 'stationRegion',
      name: region.name,
      slug: { _type: 'slug', current: region.slug },
      order: region.order,
    } as never)
  }

  // 2. Prove they all landed before pointing a required reference at them. An
  //    unresolvable reference reads as null through the query and takes the
  //    page down exactly as a missing one would.
  const present = await client.fetch<string[]>(
    '*[_type == "stationRegion"]._id',
  )
  const missing = regions
    .map((region) => `stationRegion-${region.slug}`)
    .filter((id) => !present.includes(id))
  if (missing.length) {
    throw new Error(`Region documents missing after write: ${missing.join(', ')}`)
  }
  console.log(`  ✓ ${regions.length} regions present`)

  // 3. Reconcile against the dataset, not the seed list — production may have
  //    gained stations since the scrape.
  const rows = await client.fetch<StationRow[]>(
    '*[_type == "station"]{ _id, "slug": slug.current, "hasRegion": defined(region) }',
  )
  const seeded = new Map(
    territories.flatMap((territory) =>
      territory.stations.map((station) => [station.slug, station] as const),
    ),
  )
  const orders = ordersByStationSlug()

  const unknown: string[] = []
  const patches: Array<{ id: string; region: string; order: number }> = []
  let skipped = 0

  for (const row of rows) {
    const seed = row.slug ? seeded.get(row.slug) : undefined
    if (!seed) {
      // Added in Studio after the import. It has no seeded region, and if it
      // has none of its own it will break the directory.
      if (!row.hasRegion) unknown.push(row.slug ?? row._id)
      continue
    }
    if (row.hasRegion && !force) {
      skipped++
      continue
    }
    patches.push({
      id: row._id,
      region: seed.region,
      order: orders.get(seed.slug) ?? 0,
    })
  }

  const absent = [...seeded.keys()].filter(
    (slug) => !rows.some((row) => row.slug === slug),
  )
  if (absent.length) {
    console.log(
      `  · ${absent.length} seeded station(s) not in this dataset: ${absent.join(', ')}`,
    )
  }

  // 4. Patch in one transaction so the dataset never sits half-migrated.
  if (patches.length) {
    const transaction = patches.reduce(
      (tx, patch) =>
        tx.patch(patch.id, {
          set: {
            region: {
              _type: 'reference',
              _ref: `stationRegion-${patch.region}`,
            },
            order: patch.order,
          },
        }),
      client.transaction(),
    )
    await transaction.commit()
  }
  console.log(`  ✓ ${patches.length} stations patched, ${skipped} already had a region`)

  // 5. Verify, and fail loudly if anything is still unplaced.
  const remaining = await client.fetch<number>(
    'count(*[_type == "station" && !defined(region)])',
  )
  if (unknown.length) {
    console.error(
      `\n  ✗ ${unknown.length} station(s) exist in "${dataset}" but not in the ` +
        `seed data and have no region:\n     ${unknown.join('\n     ')}\n` +
        '    Assign a region in Studio, or add them to stations-data.ts and re-run.',
    )
  }
  if (remaining > 0) {
    throw new Error(
      `${remaining} station(s) still have no region — /find-a-station would 500.`,
    )
  }
  console.log('  ✓ every station in this dataset has a region')
  console.log('Done.')
}

// `sanity exec` bundles to CJS, where top-level await is a syntax error.
main().catch((error) => {
  console.error(error)
  process.exit(1)
})
