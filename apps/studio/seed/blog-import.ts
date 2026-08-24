/**
 * Replaces the blog with the ten news articles from the old public site.
 *
 * DESTRUCTIVE. This deletes EVERY existing `post` document, then recreates the
 * ten from `blog-content.ts`. That is the intent: the records already in the
 * dataset were truncated summaries under short slugs, and the two seed
 * placeholders ("Hello, PETROSOL", "How we work") plus the three long-form
 * guides were dropped by decision. The guides' source markdown still lives in
 * `docs/blogs/` if they are ever wanted back.
 *
 * Slugs are the ones from the old public URLs, so anything already linked or
 * indexed keeps resolving once the domain points at the new site.
 *
 * Images are pulled from the old Squarespace CDN and uploaded into Sanity, so
 * the new site does not depend on that account staying alive. Six of the ten
 * articles have no photograph of their own and fall back to a stock forecourt
 * shot; it is uploaded once and shared, which is exactly what the old site did.
 *
 * Run (dataset comes from apps/studio/.env.local unless overridden):
 *   SANITY_WRITE_TOKEN=… bun run blog:import --dry-run
 *   SANITY_WRITE_TOKEN=… bun run blog:import
 *   SANITY_STUDIO_DATASET=production SANITY_WRITE_TOKEN=… bun run blog:import
 */
import { createClient } from '@sanity/client'

import {
  resolveSanityApiVersion,
  resolveSanityDataset,
  resolveSanityProjectId,
} from '@workspace/config/env'

import { articles } from './blog-content'

/** Every article on the old site carries this byline. */
const AUTHOR = {
  _id: 'author-francis-gemegah',
  _type: 'author',
  name: 'Francis Gemegah',
  slug: { _type: 'slug', current: 'francis-gemegah' },
}

/** Seed placeholders whose only posts are being deleted. */
const ORPHAN_AUTHOR_IDS = ['author-jordan', 'author-alex']

const dryRun = process.argv.includes('--dry-run')

const token = process.env.SANITY_WRITE_TOKEN
if (!token && !dryRun) {
  console.error(
    'Missing SANITY_WRITE_TOKEN. Create an editor token in sanity.io/manage and\n' +
      'pass it inline — it is a secret and does not belong in .env.local.\n' +
      'Pass --dry-run to preview without one.',
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

/**
 * Portable Text needs a `_key` on every array member. Deterministic keys mean a
 * re-run produces an identical document rather than a diff of nothing but keys.
 */
function paragraph(slug: string, index: number, text: string) {
  return {
    _type: 'block',
    _key: `${slug}-p${index}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${slug}-p${index}-s`, text, marks: [] }],
  }
}

/**
 * Downloads a remote image and uploads it to Sanity, once per dataset.
 *
 * Keyed on the filename so the stock forecourt shot shared by six articles is
 * fetched and stored a single time, and so re-runs reuse the asset rather than
 * piling up duplicates.
 */
const assetCache = new Map<string, string>()

async function uploadFromUrl(url: string): Promise<string> {
  const filename = decodeURIComponent(
    (url.split('/').pop() ?? 'image').split('?')[0] as string,
  ).replace(/\+/g, ' ')

  const cached = assetCache.get(filename)
  if (cached) return cached

  const existing = await client.fetch<string | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    { filename },
  )
  if (existing) {
    console.log(`    · reusing ${filename}`)
    assetCache.set(filename, existing)
    return existing
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Could not fetch ${url} — ${response.status}`)
  }
  const asset = await client.assets.upload(
    'image',
    Buffer.from(await response.arrayBuffer()),
    { filename },
  )
  console.log(`    ↑ uploaded ${filename}`)
  assetCache.set(filename, asset._id)
  return asset._id
}

async function main() {
  if (dryRun) {
    console.log(
      `Dry run — would replace every post in "${dataset}" with these ${articles.length}:\n`,
    )
    for (const a of articles) {
      console.log(
        `  ${a.publishedAt}  ${a.title.slice(0, 60)}\n` +
          `     slug=${a.slug}\n` +
          `     ${a.body.length} paragraphs · category=${a.categoryId}\n` +
          `     image=${a.image.url.split('/').pop()?.slice(0, 60)}`,
      )
    }
    console.log('\nNothing was written.')
    return
  }

  // Delete first: slugs are changing, so updating in place would leave the old
  // records behind under their previous slugs.
  const existing = await client.fetch<string[]>('*[_type == "post"]._id')
  if (existing.length > 0) {
    console.log(`Deleting ${existing.length} existing posts…`)
    await existing
      .reduce((tx, id) => tx.delete(id), client.transaction())
      .commit()
  }

  for (const id of ORPHAN_AUTHOR_IDS) {
    // Only safe once their posts are gone, which the delete above guarantees.
    await client.delete(id).catch(() => undefined)
  }
  console.log(`Removed ${ORPHAN_AUTHOR_IDS.length} placeholder authors.`)

  await client.createOrReplace(AUTHOR as never)
  console.log(`Author: ${AUTHOR.name}`)

  console.log(`\nImporting ${articles.length} articles into "${dataset}".`)
  for (const article of articles) {
    console.log(`  ${article.title.slice(0, 58)}`)
    const assetId = await uploadFromUrl(article.image.url)

    await client.createOrReplace({
      _id: `post-${article.slug}`,
      _type: 'post',
      title: article.title,
      slug: { _type: 'slug', current: article.slug },
      excerpt: article.excerpt,
      publishedAt: `${article.publishedAt}T09:00:00Z`,
      author: { _type: 'reference', _ref: AUTHOR._id },
      category: { _type: 'reference', _ref: article.categoryId },
      coverImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: article.image.alt,
      },
      body: article.body.map((text, i) => paragraph(article.slug, i + 1, text)),
    } as never)
    console.log(`  ✓ ${article.body.length} paragraphs`)
  }

  console.log(
    '\nDone. Copy is reproduced as published, typos included — correct it in\n' +
      'the Studio. Six articles share the old site’s stock forecourt photo.',
  )
}

await main()
