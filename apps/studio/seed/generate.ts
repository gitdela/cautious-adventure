/**
 * Generates `seed.ndjson` for the DEVELOPMENT dataset.
 *
 * Neutral placeholder content only — no legal/compliance claims. Deterministic
 * `_id`s + `sanity dataset import --replace` make seeding idempotent.
 *
 * Run:  bun run seed:generate  (then)  bun run seed:dev
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

type Doc = Record<string, unknown>

// Minimal Portable Text helpers with deterministic keys (drift-stable).
function span(key: string, text: string) {
  return { _type: 'span', _key: key, text, marks: [] as string[] }
}
function block(key: string, text: string, style = 'normal') {
  return {
    _type: 'block',
    _key: key,
    style,
    markDefs: [],
    children: [span(`${key}s`, text)],
  }
}
function body(id: string, paras: string[]) {
  return paras.map((text, i) => block(`${id}-b${i}`, text))
}
function heading(key: string, text: string) {
  return block(key, text, 'h2')
}
function ref(id: string) {
  return { _type: 'reference', _ref: id }
}

const docs: Doc[] = [
  // --- Authors ---
  {
    _id: 'author-alex',
    _type: 'author',
    name: 'Alex Mensah',
    slug: { _type: 'slug', current: 'alex-mensah' },
    bio: 'Writes about the product and what the team is building.',
  },
  {
    _id: 'author-jordan',
    _type: 'author',
    name: 'Jordan Osei',
    slug: { _type: 'slug', current: 'jordan-osei' },
    bio: 'Covers industry topics in plain English.',
  },

  // --- Categories ---
  {
    _id: 'category-product',
    _type: 'category',
    title: 'Product',
    slug: { _type: 'slug', current: 'product' },
    order: 1,
  },
  {
    _id: 'category-industry',
    _type: 'category',
    title: 'Industry',
    slug: { _type: 'slug', current: 'industry' },
    order: 2,
  },

  // --- Posts (no coverImage: editors add one in Studio) ---
  {
    _id: 'post-hello-petrosol',
    _type: 'post',
    title: 'Hello, Petrosol',
    slug: { _type: 'slug', current: 'hello-petrosol' },
    excerpt: 'What Petrosol is, why we are building it, and what comes next.',
    author: ref('author-alex'),
    category: ref('category-product'),
    publishedAt: '2026-07-01T09:00:00Z',
    body: [
      heading('p1-h1', 'Why Petrosol'),
      ...body('p1a', [
        'This is placeholder copy seeded into the development dataset so the blog surface renders end to end.',
        'Replace it with a real introduction in Sanity Studio.',
      ]),
      heading('p1-h2', 'What comes next'),
      ...body('p1b', [
        'A second section so the table of contents and heading anchors have more than one entry.',
      ]),
    ],
  },
  {
    _id: 'post-how-we-work',
    _type: 'post',
    title: 'How we work',
    slug: { _type: 'slug', current: 'how-we-work' },
    excerpt: 'A short look at how the Petrosol team ships.',
    author: ref('author-jordan'),
    category: ref('category-industry'),
    publishedAt: '2026-07-10T09:00:00Z',
    body: [
      heading('p2-h1', 'Small releases'),
      ...body('p2a', [
        'Placeholder body copy — enough words to exercise typography, lists, and read-time estimation.',
      ]),
    ],
  },

  // --- Company page (renders at /about) ---
  {
    _id: 'page-about',
    _type: 'page',
    title: 'About Petrosol',
    slug: { _type: 'slug', current: 'about' },
    sections: [
      {
        _type: 'heroSection',
        _key: 'about-hero',
        heading: 'About Petrosol',
        subheading: 'Placeholder positioning line — replace in Studio.',
      },
      {
        _type: 'richTextSection',
        _key: 'about-story',
        heading: 'Our story',
        body: body('about-story', [
          'Seeded placeholder prose so the About page renders while real copy is written.',
        ]),
      },
      {
        _type: 'valuesSection',
        _key: 'about-values',
        heading: 'What we value',
        items: [
          { _type: 'item', _key: 'v1', title: 'Clarity', description: 'Plain language, no surprises.' },
          { _type: 'item', _key: 'v2', title: 'Reliability', description: 'Boring in the best way.' },
          { _type: 'item', _key: 'v3', title: 'Care', description: 'Details matter.' },
        ],
      },
    ],
  },

  // --- Legal (one approved version per kind) ---
  {
    _id: 'legal-privacy-2026-07',
    _type: 'legalDocument',
    documentKind: 'privacy',
    title: 'Privacy Policy',
    version: '2026-07',
    slug: { _type: 'slug', current: 'privacy' },
    effectiveAt: '2026-07-01T00:00:00Z',
    publishedAt: '2026-07-01T00:00:00Z',
    approvalState: 'approved',
    approver: 'seed',
    approvedAt: '2026-07-01T00:00:00Z',
    body: body('legal-privacy', [
      'Placeholder privacy policy seeded for development. Not a real policy.',
    ]),
  },
  {
    _id: 'legal-terms-2026-07',
    _type: 'legalDocument',
    documentKind: 'terms',
    title: 'Terms of Service',
    version: '2026-07',
    slug: { _type: 'slug', current: 'terms' },
    effectiveAt: '2026-07-01T00:00:00Z',
    publishedAt: '2026-07-01T00:00:00Z',
    approvalState: 'approved',
    approver: 'seed',
    approvedAt: '2026-07-01T00:00:00Z',
    body: body('legal-terms', [
      'Placeholder terms of service seeded for development. Not real terms.',
    ]),
  },

  // --- Pump prices (home hero board, singleton) ---
  {
    _id: 'pumpPrices',
    _type: 'pumpPrices',
    prices: [
      { _type: 'fuelPrice', _key: 'petrol', fuel: 'Petrol', price: 9.8 },
      { _type: 'fuelPrice', _key: 'diesel', fuel: 'Diesel', price: 16 },
      { _type: 'fuelPrice', _key: 'premium', fuel: 'Premium', price: 11.2 },
    ],
  },
]

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n'
const out = fileURLToPath(new URL('./seed.ndjson', import.meta.url))
writeFileSync(out, ndjson)
console.log(`Wrote ${docs.length} documents to ${out}`)
