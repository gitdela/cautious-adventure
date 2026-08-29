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

/**
 * Leadership and board, carried over verbatim from the arrays that previously
 * lived in the page components. `slugify` keeps ids and slugs deterministic so
 * re-seeding is idempotent.
 */
/**
 * Slug rule per the leadership spec: lowercase, drop honorifics, strip
 * non-letters, spaces to hyphens. "Robert Kingsley Yeboah Esq." →
 * `robert-kingsley-yeboah`.
 */
function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\besq\.?\b/g, '')
    .replace(/[^a-z]+/g, '-')
    .replace(/^-|-$/g, '')
}

function teamMember(
  groups: Array<'leadership' | 'board'>,
  order: number,
  name: string,
  role: string,
  bioParas: string[],
  opts: { featured?: boolean; shortBio?: string; quote?: string } = {},
): Doc {
  const slug = slugify(name)
  return {
    _id: `team-${slug}`,
    _type: 'teamMember',
    name,
    slug: { _type: 'slug', current: slug },
    role,
    groups,
    order,
    featured: opts.featured ?? false,
    ...(opts.shortBio ? { shortBio: opts.shortBio } : {}),
    ...(opts.quote ? { quote: opts.quote } : {}),
    bio: body(`team-${slug}`, bioParas),
  }
}

/**
 * Role-based draft bio. The spec is explicit that only the CEO's and the
 * Chairman's biographies are final — everyone else gets a description of the
 * remit, never invented personal history. The DRAFT marker is deliberate: it
 * should be obvious in Studio that this needs replacing.
 */
function draftBio(name: string, remit: string): string[] {
  return [
    `${name} leads ${remit} at PETROSOL Platinum Energy, working with the senior team to hold the standards the company sets for itself across Ghana's downstream petroleum sector.`,
    'DRAFT — this biography describes the role rather than the person. Replace it with a supplied biography before launch.',
  ]
}

// One document per person. The CEO carries both groups rather than appearing
// twice — two documents would mean two profile pages and two photos for one
// human. `order` is shared across groups, which is why the numbers interleave.
// The CEO's and the Chairman's bios are final — they are the same copy the
// Leadership and Board feature blocks carry. Everyone else is a role-based
// draft, flagged as such.
const CEO_BIO = [
  "Michael Bozumbil serves as the Chief Executive Officer of PETROSOL Platinum Energy PLC, leading the company's strategic direction and operational excellence across Ghana's petroleum downstream sector.",
  "Under his leadership, PETROSOL has grown to operate over 115 fuel stations nationwide, achieved triple ISO certification, and established itself as one of Ghana's premier privately-owned Oil Marketing Companies — with a reputation for clean fuel in full quantity and service excellence.",
  "His vision of being a model of excellence in the global energy space continues to drive PETROSOL's expansion and its commitment to energizing the dreams of Ghanaians.",
]

const CHAIRMAN_BIO = [
  "Daniel Acheampong serves as the Board Chairman of PETROSOL Platinum Energy, providing strategic oversight and governance leadership to the company's long-term direction. With extensive experience in corporate governance and Ghana's downstream petroleum sector, he brings institutional credibility to the board.",
  "His leadership philosophy centres on accountability, transparency and building durable commercial organisations that can withstand the demands of a competitive energy market. He has been instrumental in shaping PETROSOL's governance framework since its founding.",
  "Under his chairmanship, the company has pursued ISO certification across quality, environment and safety management systems — a commitment that reflects the board's view that operational excellence is a prerequisite for sustained brand trust.",
]

const teamMembers: Doc[] = [
  teamMember(
    ['leadership', 'board'],
    0,
    'Michael Bozumbil',
    'Chief Executive Officer',
    CEO_BIO,
    {
      featured: true,
      // The leadership page renders this as the preview beside his portrait.
      // Blank lines separate paragraphs.
      shortBio: CEO_BIO.join('\n\n'),
    },
  ),
  teamMember(
    ['leadership'],
    1,
    'Joseph Yaribil',
    'Head, Compliance and Supply Chain',
    draftBio('Joseph Yaribil', 'compliance and supply chain'),
  ),
  teamMember(
    ['leadership'],
    2,
    'Philip Boamah Assampong',
    'Head, Marketing & Ag. Commercial Business Manager',
    draftBio('Philip Boamah Assampong', 'marketing and commercial business'),
  ),
  teamMember(
    ['leadership'],
    3,
    'Rita Afful',
    'Human Resources Manager',
    draftBio('Rita Afful', 'human resources'),
  ),
  teamMember(
    ['leadership'],
    4,
    'Michael Affum Oseikoh',
    'Head, Finance and Planning',
    draftBio('Michael Affum Oseikoh', 'finance and planning'),
  ),
  teamMember(
    ['leadership'],
    5,
    'Oko Kwei Odai',
    'Head, Projects, Technology and Maintenance',
    draftBio('Oko Kwei Odai', 'projects, technology and maintenance'),
  ),
  teamMember(
    ['leadership'],
    6,
    'Isaac Debezor',
    'Head, Risk and Internal Audit',
    draftBio('Isaac Debezor', 'risk and internal audit'),
  ),

  teamMember(['board'], 10, 'Daniel Acheampong', 'Board Chairman', CHAIRMAN_BIO),
  teamMember(
    ['board'],
    11,
    'Robert Kingsley Yeboah Esq.',
    'Board Secretary',
    draftBio('Robert Kingsley Yeboah', 'the board secretariat'),
  ),
  teamMember(
    ['board'],
    12,
    'Lawrencia Himans',
    'Board Member',
    draftBio('Lawrencia Himans', 'board oversight'),
  ),
  teamMember(
    ['board'],
    13,
    'Linda Bozumbil',
    'Board Member',
    draftBio('Linda Bozumbil', 'board oversight'),
  ),
  teamMember(
    ['board'],
    14,
    'William Ntim-Boadu',
    'Board Member',
    draftBio('William Ntim-Boadu', 'board oversight'),
  ),
]

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
    title: 'Hello, PETROSOL',
    slug: { _type: 'slug', current: 'hello-petrosol' },
    excerpt: 'What PETROSOL is, why we are building it, and what comes next.',
    author: ref('author-alex'),
    category: ref('category-product'),
    publishedAt: '2026-07-01T09:00:00Z',
    body: [
      heading('p1-h1', 'Why PETROSOL'),
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
    excerpt: 'A short look at how the PETROSOL team ships.',
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
    title: 'About PETROSOL',
    slug: { _type: 'slug', current: 'about' },
    sections: [
      {
        _type: 'heroSection',
        _key: 'about-hero',
        heading: 'About PETROSOL',
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

  // --- Team (Leadership + Board) ---
  // Names and roles carry over from the hardcoded arrays these replaced, so
  // the dev dataset matches what the pages used to show. Bios are placeholder
  // prose, and no photos are seeded — those are uploaded through Studio.
  ...teamMembers,
]

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n'
const out = fileURLToPath(new URL('./seed.ndjson', import.meta.url))
writeFileSync(out, ndjson)
console.log(`Wrote ${docs.length} documents to ${out}`)
