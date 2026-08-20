/**
 * One-off importer for the /fuel sections.
 *
 * Copy is carried over verbatim from the `PetrolSection` / `DieselSection`
 * components in `apps/website/src/app/fuel/fuel-sections.tsx`, and the photos
 * from `apps/website/public/images/`.
 *
 * Idempotent like the lubricants importer: creates what is missing, leaves
 * existing documents alone. Pass `--replace` to overwrite them.
 *
 * Run (dataset comes from apps/studio/.env.local unless overridden):
 *   SANITY_WRITE_TOKEN=… bun run fuel:import
 *   SANITY_STUDIO_DATASET=production SANITY_WRITE_TOKEN=… bun run fuel:import
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { createClient } from '@sanity/client'

import {
  resolveSanityApiVersion,
  resolveSanityDataset,
  resolveSanityProjectId,
} from '@workspace/config/env'

type FuelSeed = {
  slug: string
  name: string
  eyebrow: string
  heading: string
  highlight: string
  body: string[]
  /** Path under apps/website/public/. */
  image: string
  imageAlt: string
}

const fuels: FuelSeed[] = [
  {
    slug: 'petrol',
    name: 'Petrol',
    eyebrow: 'Gasoline / Premium',
    heading: 'Petrol that arrives as clean as it',
    highlight: 'left the depot',
    image: 'images/fuel/petrosol-petrol-pump.webp',
    imageAlt: 'PETROSOL petrol pump refuelling a vehicle',
    body: [
      'PETROSOL markets high quality petrol that meets both local and international standards — fit for use in all makes of petrol vehicles and machines from around the world.',
      'To maintain its integrity, we’ve invested heavily so that from the loading depots to the stations, all the way to your fuel tank, no contaminants gain access to the product.',
      'Besides getting it in full quantity, you get the full benefit of every litre — while the environment is protected from harmful emissions.',
    ],
  },
  {
    slug: 'diesel',
    name: 'Diesel',
    eyebrow: 'Gasoil / Automotive Gasoil',
    heading: 'Low sulfur diesel, protected',
    highlight: 'every step',
    image: 'images/home/refinery-tanks.webp',
    imageAlt: 'Petroleum storage tanks',
    body: [
      'Like our petrol, PETROSOL diesel meets both local and international standards — guaranteed fit for all makes of diesel vehicles and machines from around the world.',
      'Our low sulfur diesel travels a protected chain: from loading depot to station to your tank, no contaminants gain access to the product.',
      'Every litre delivers its full benefit, in full quantity — with fewer harmful emissions along the way.',
    ],
  },
]

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
const client = createClient({
  projectId: resolveSanityProjectId(process.env),
  dataset,
  apiVersion: resolveSanityApiVersion(process.env),
  token,
  useCdn: false,
})

const publicDir = new URL('../../website/public/', import.meta.url)

/** Uploads a photo once per dataset, reusing the asset on later runs. */
async function uploadPhoto(path: string): Promise<string> {
  const filename = path.split('/').pop() as string
  const existing = await client.fetch<string | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    { filename },
  )
  if (existing) {
    console.log(`  · reusing asset ${filename}`)
    return existing
  }

  const file = readFileSync(fileURLToPath(new URL(path, publicDir)))
  const asset = await client.assets.upload('image', file, { filename })
  console.log(`  ↑ uploaded ${filename}`)
  return asset._id
}

async function main() {
  console.log(
    `Importing ${fuels.length} fuel products into "${dataset}"` +
      `${replace ? ' (overwriting existing documents)' : ''}.`,
  )

  for (const [index, fuel] of fuels.entries()) {
    const id = `fuelProduct-${fuel.slug}`
    const exists = await client.fetch<string | null>('*[_id == $id][0]._id', {
      id,
    })
    if (exists && !replace) {
      console.log(`  · ${fuel.name} (already present)`)
      continue
    }

    // Uploading before the existence check would orphan assets on a re-run.
    const assetId = await uploadPhoto(fuel.image)
    const doc = {
      _id: id,
      _type: 'fuelProduct',
      name: fuel.name,
      slug: { _type: 'slug', current: fuel.slug },
      eyebrow: fuel.eyebrow,
      heading: fuel.heading,
      highlight: fuel.highlight,
      body: fuel.body,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: fuel.imageAlt,
      },
      order: index,
    }

    if (replace) await client.createOrReplace(doc as never)
    else await client.create(doc as never)
    console.log(`  ✓ ${fuel.name}`)
  }

  console.log('Done.')
}

await main()
