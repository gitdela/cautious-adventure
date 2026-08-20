/**
 * One-off importer for the lubricants catalogue.
 *
 * The products below are carried over verbatim from the array that used to live
 * in `apps/website/src/app/lubricants/lubricants-data.ts`, so the page renders
 * exactly what it rendered before the move. Pack shots are uploaded from
 * `apps/website/public/images/lubricants/`.
 *
 * Deterministic `_id`s make it idempotent: by default it creates what is missing
 * and leaves existing documents alone, so a second run is safe even after
 * editors have started working. Pass `--replace` to overwrite them, which is
 * what you want only when re-importing this file as the source of truth.
 *
 * Run (dataset comes from apps/studio/.env.local unless overridden):
 *   SANITY_WRITE_TOKEN=… bun run lubricants:import
 *   SANITY_STUDIO_DATASET=production SANITY_WRITE_TOKEN=… bun run lubricants:import
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { createClient } from '@sanity/client'

import {
  resolveSanityApiVersion,
  resolveSanityDataset,
  resolveSanityProjectId,
} from '@workspace/config/env'

type CategorySeed = {
  slug: string
  title: string
}

type ProductSeed = {
  slug: string
  name: string
  category: string
  grade: string
  standard: string
  applications: string
  benefits: string[]
  drainInterval?: string
  /** Filename under apps/website/public/images/lubricants/. */
  image?: string
  featuredOnHome?: boolean
}

const categories: CategorySeed[] = [
  { slug: 'engine-oils', title: 'Engine oils' },
  { slug: 'motorcycle-oils', title: 'Motorcycle oils' },
  { slug: 'gear-transmission', title: 'Gear & transmission' },
  { slug: 'brake-fluid-coolant', title: 'Brake fluid & coolant' },
]

const products: ProductSeed[] = [
  {
    slug: 'neo-0w20',
    name: 'Platinum NEO 0W20',
    category: 'engine-oils',
    grade: 'SAE 0W-20 · full synthetic',
    standard: 'ACEA C3 · Syntec® additives',
    applications:
      'Hybrids and modern engines — Toyota, Honda, Ford and GM models that specify 0W-20',
    benefits: [
      'Easy cold starts with quick oil circulation',
      'Lower internal friction for improved fuel economy',
      'Extended drain intervals between changes',
      'Exceptional engine cleanliness and anti-wear stability',
    ],
  },
  {
    slug: 'jet-hd40',
    name: 'JET HD 40',
    category: 'engine-oils',
    grade: 'SAE 40 · heavy duty',
    standard: 'API SJ/CD · ACEA E2, A3/B2',
    image: 'jet-hd-40.webp',
    applications:
      'Hard-working taxis, buses and vans in tough driving conditions — heavy traffic, warm climates and older high-mileage engines',
    benefits: [
      'Premium heavy duty oil for petrol and diesel engines',
      'European-made from virgin base oils and Syntec® additives',
      'Greater engine protection and cleanliness',
      'Longer life compared to conventional oils',
    ],
  },
  {
    slug: 'plus-5w30',
    name: 'Platinum Plus 5w30 FE',
    category: 'engine-oils',
    grade: 'SAE 5W-30 · pure synthetic',
    standard: 'API SN-Plus/CF · ACEA C2/C3',
    drainInterval: 'Up to 10,000 km',
    image: 'platinum-plus-5w30-fe.webp',
    featuredOnHome: true,
    applications:
      "Today's high-tech, low-emissions engines — with or without exhaust after-treatment",
    benefits: [
      'Quick lubrication on start-up',
      'Increased fuel efficiency',
      'Long / extended drain capability (C3)',
      'Backwards compatible with older performance levels',
    ],
  },
  {
    slug: 'plus-10w40',
    name: 'Platinum Plus 10w40',
    category: 'engine-oils',
    grade: 'SAE 10W-40 · pure synthetic',
    standard: 'API SN/CF · ACEA C3',
    drainInterval: 'Up to 10,000 km',
    image: 'platinum-plus-10w40.webp',
    featuredOnHome: true,
    applications:
      'Modern high performance petrol and diesel engines — European, American and Japanese, with exhaust after-treatment',
    benefits: [
      'DPF compliant',
      'Long / extended drain capability',
      'Exceptional long-term anti-wear and oxidation stability',
      'Excellent high and low temperature performance',
    ],
  },
  {
    slug: 'petrol-20w50',
    name: 'Platinum Petrol 20w50',
    category: 'engine-oils',
    grade: 'SAE 20W-50 multigrade',
    standard: 'Syntec® additive technology',
    drainInterval: 'Up to 7,000 km',
    applications:
      'Hard-working petrol engines in warm climates — also approved for diesel and LPG engines',
    benefits: [
      'Excellent high temperature stability',
      'High shear stability for stay-in-grade performance',
      'Reduced engine wear and oil consumption',
      'Ideal mixed fleet lubricant',
    ],
  },
  {
    slug: 'diesel-15w40',
    name: 'Platinum Diesel 15w40',
    category: 'engine-oils',
    grade: 'SAE 15W-40 · universal diesel',
    standard: 'Syntec® additives',
    applications:
      'Hard-working diesel engines on heavy plant, trucks, buses, vans and cars',
    benefits: [
      'Lasts up to twice as long as standard oils',
      'Cooler running, more power, less fuel',
      'Increased soot handling for longer drains',
      'Improved bore polishing protection',
    ],
  },
  {
    slug: 'ultra-15w40',
    name: 'PETROSOL Ultra 15w40 HD',
    category: 'engine-oils',
    grade: 'SAE 15W-40 · heavy duty diesel',
    standard: 'API CI-4/SL · ACEA A3/B3, E7/E3',
    image: 'ultra-15w40-hd.webp',
    featuredOnHome: true,
    applications:
      'Modern heavy duty diesel engines in arduous conditions — trucks, buses, vans and cars, including turbo- and super-charged engines',
    benefits: [
      'Ultra heavy-duty UHDDEO — out-performs all standard oils',
      'Superior detergents keep turbo and pistons clean',
      'Engines run cooler, deliver more power',
      'Protects better, lasts longer, promotes fuel economy',
    ],
  },
  {
    slug: 'moto-20w50',
    name: 'Platinum Motorcycle 20w50 4T',
    category: 'motorcycle-oils',
    grade: 'SAE 20W-50 · 4T',
    standard: 'Exceeds JASO MA and MA-2',
    applications: '4-stroke motorcycles and wet-clutch applications',
    benefits: [
      'Engine and clutch lubricant in one',
      'High shear stability for stay-in-grade performance',
      'Excellent high temperature stability',
      'Better exhaust emissions',
    ],
  },
  {
    slug: 'gear-ep',
    name: 'Gear EP 80w90',
    category: 'gear-transmission',
    grade: 'SAE 80W-90 & 85W-140 · full synthetic',
    standard: 'Exceeds API GL-5',
    applications:
      'Hypoid, bevel, spiral and standard gearboxes on trucks, cars, buses, tractors and mining equipment',
    benefits: [
      'High load carrying ability',
      'Greatly reduces noise and wear',
      'Rust and corrosion protection when idle',
      'Outstanding low and high temperature performance',
    ],
  },
  {
    slug: 'atf-6',
    name: 'PETROSOL ATF-6',
    category: 'gear-transmission',
    grade: 'Dexron VI · pure synthetic',
    standard: 'Mercon LV · JASO 1A-LV',
    image: 'atf-6.webp',
    featuredOnHome: true,
    applications:
      'Modern automatic gearboxes, transfer cases and power steering systems where a DEXRON VI fluid is specified — GM, Ford, Chrysler, Honda, Hyundai, Kia, Toyota, Mercedes, VW, BMW and more',
    benefits: [
      '100% synthetic low-viscosity ATF',
      'Smoother gear changes, longer transmission life',
      'Reduces fuel usage for more efficient driving',
      'Backwards compatible where ATF IIIG or IIIH is called for',
    ],
  },
  {
    slug: 'brake-dot4',
    name: 'PETROSOL DOT-4 Brake Fluid',
    category: 'brake-fluid-coolant',
    grade: 'DOT 4',
    standard: 'Resistant to 260°C',
    applications:
      'All disc and drum hydraulic braking systems, including anti-lock, and hydraulic clutch systems',
    benefits: [
      'Safe, reliable braking in all conditions',
      'Effective in high performance, high load applications',
      'Protects against rust and corrosion',
      'Mixable with other fluids of the same specification',
    ],
  },
  {
    slug: 'cool-ant',
    name: 'PETROSOL Cool-Ant',
    category: 'brake-fluid-coolant',
    grade: 'Ready-to-use coolant & antifreeze',
    standard: 'Protection from −25°C to +115°C',
    applications:
      'All modern cooling systems, diesel and petrol, automotive and heavy duty — including aluminium alloy radiators',
    benefits: [
      'Free of borate, nitrite, nitrate, amine, phosphate and silicate',
      'Long-life protection against corrosion and pitting',
      'No residue — keeps coolant pathways clear',
      'Compatible with metals, plastic and rubber tubing',
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

const imageDir = new URL(
  '../../website/public/images/lubricants/',
  import.meta.url,
)

/** Uploads a pack shot once per dataset, reusing the asset on later runs. */
async function uploadPackShot(filename: string): Promise<string> {
  const existing = await client.fetch<string | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    { filename },
  )
  if (existing) {
    console.log(`  · reusing asset ${filename}`)
    return existing
  }

  const file = readFileSync(fileURLToPath(new URL(filename, imageDir)))
  const asset = await client.assets.upload('image', file, { filename })
  console.log(`  ↑ uploaded ${filename}`)
  return asset._id
}

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
  console.log(
    `Importing ${categories.length} categories and ${products.length} products ` +
      `into "${dataset}"${replace ? ' (overwriting existing documents)' : ''}.`,
  )

  for (const [index, category] of categories.entries()) {
    const result = await write({
      _id: `lubricantCategory-${category.slug}`,
      _type: 'lubricantCategory',
      title: category.title,
      slug: { _type: 'slug', current: category.slug },
      order: index,
    })
    console.log(`  ${result === 'kept' ? '·' : '✓'} ${category.title}`)
  }

  for (const [index, product] of products.entries()) {
    // Uploading before the existence check would orphan assets on a re-run, so
    // resolve the document first and only touch the asset when writing.
    const id = `lubricantProduct-${product.slug}`
    const exists = await client.fetch<string | null>('*[_id == $id][0]._id', {
      id,
    })
    if (exists && !replace) {
      console.log(`  · ${product.name} (already present)`)
      continue
    }

    const assetId = product.image
      ? await uploadPackShot(product.image)
      : undefined

    await write({
      _id: id,
      _type: 'lubricantProduct',
      name: product.name,
      slug: { _type: 'slug', current: product.slug },
      category: {
        _type: 'reference',
        _ref: `lubricantCategory-${product.category}`,
      },
      order: index,
      featuredOnHome: product.featuredOnHome === true,
      grade: product.grade,
      standard: product.standard,
      applications: product.applications,
      ...(product.drainInterval ? { drainInterval: product.drainInterval } : {}),
      benefits: product.benefits,
      ...(assetId
        ? {
            image: {
              _type: 'image',
              asset: { _type: 'reference', _ref: assetId },
              alt: `${product.name} lubricant pack`,
            },
          }
        : {}),
    })
    console.log(`  ✓ ${product.name}`)
  }

  console.log('Done.')
}

await main()
