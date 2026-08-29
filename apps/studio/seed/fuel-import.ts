/**
 * One-off importer for the product tiles in the unified /fuels showcase.
 *
 * Shared fuels-page copy lives in the website. These records provide the two
 * product labels and their approved photos.
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
  /** Path under apps/website/public/. */
  image: string
  imageAlt: string
}

const fuels: FuelSeed[] = [
  {
    slug: 'petrol',
    name: 'Petrol',
    eyebrow: 'Gasoline / Premium',
    image: 'images/fuel/petrosol-petrol-pump.webp',
    imageAlt: 'PETROSOL petrol pump refuelling a vehicle',
  },
  {
    slug: 'diesel',
    name: 'Diesel',
    eyebrow: 'Gasoil / Automotive Gasoil',
    image: 'images/fuel/platinum-diesel-15w40.webp',
    imageAlt: 'PETROSOL Platinum Diesel 15W40 in a 20-litre black container',
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
