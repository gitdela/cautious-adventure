/**
 * Normalises the blog post titles to sentence case.
 *
 * The imported archive inherited the old site's mixed casing — four titles in
 * full caps, one sentence case, the rest title case. Sentence case is the one
 * convention with a single rule (first word plus proper nouns), which is why
 * the others drifted apart: title case turns every `with` / `a` / `for` into a
 * judgement call, and the source disagreed with itself on all three.
 *
 * A transform cannot do this. `CFO`, `VALCO`, `GHS`, `PETROSOL` and the award
 * and day names all have to keep their capitals, so the titles are written out
 * by hand in `blog-content.ts` and this only carries them across.
 *
 * PATCHES ONLY THE TITLE. Slugs are the old public URLs and must not move;
 * bodies, images and dates are already correct and are left untouched.
 *
 * Run:
 *   SANITY_WRITE_TOKEN=… bun run blog:titles --dry-run
 *   SANITY_WRITE_TOKEN=… bun run blog:titles
 */
import { createClient } from '@sanity/client'

import {
  resolveSanityApiVersion,
  resolveSanityDataset,
  resolveSanityProjectId,
} from '@workspace/config/env'

import { articles } from './blog-content'

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
  const current = await client.fetch<{ _id: string; title: string }[]>(
    '*[_type == "post"]{_id, title}',
  )
  const byId = new Map(current.map((p) => [p._id, p.title]))

  console.log(
    `${dryRun ? 'Dry run — would rename' : 'Renaming'} posts in "${dataset}":\n`,
  )

  let changed = 0
  for (const article of articles) {
    const id = `post-${article.slug}`
    const before = byId.get(id)

    if (before === undefined) {
      console.log(`  ? ${id} — not in the dataset, skipping`)
      continue
    }
    if (before === article.title) {
      console.log(`  · ${article.title}`)
      continue
    }

    console.log(`  − ${before}`)
    console.log(`  + ${article.title}\n`)
    changed += 1

    // `patch` rather than `createOrReplace`: everything else on the document is
    // already right, and a replace would need the body and image resupplied.
    if (!dryRun) {
      await client.patch(id).set({ title: article.title }).commit()
    }
  }

  console.log(
    dryRun
      ? `${changed} would change. Nothing was written.`
      : `Done — ${changed} renamed.`,
  )
}

await main()
