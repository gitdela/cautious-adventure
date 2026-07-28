import type {
  ContentAdapters,
  ContentImageProps,
  ContentLinkProps,
} from './adapters'
import type {
  BlogPostFull,
  BlogPostSummary,
  FaqItem,
  PortableTextBlock,
} from './types'

/**
 * Mock adapters for tests — plain `<a>` and `<img>` with no Sanity client
 * dependency. This is exactly why link/image rendering is injected: the shared
 * components render in isolation with no configured client.
 */
export const testAdapters: ContentAdapters = {
  Link: ({ href, children, className }: ContentLinkProps) => (
    <a href={href} className={className} data-adapter="link">
      {children}
    </a>
  ),
  Image: ({ source, alt, className }: ContentImageProps) => (
    <img
      src={typeof source === 'string' ? source : 'mock-image'}
      alt={alt}
      className={className}
      data-adapter="image"
    />
  ),
}

export function span(key: string, text: string, marks: string[] = []) {
  return { _type: 'span' as const, _key: key, text, marks }
}

export const richBody: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'b1',
    style: 'h2',
    markDefs: [],
    children: [span('s1', 'Section heading')],
  },
  {
    _type: 'block',
    _key: 'b2',
    style: 'normal',
    markDefs: [{ _type: 'link', _key: 'l1', href: 'https://example.com' }],
    children: [span('s2', 'external link', ['l1'])],
  },
  {
    _type: 'block',
    _key: 'b3',
    style: 'normal',
    markDefs: [{ _type: 'link', _key: 'l2', href: '/learn/wallets' }],
    children: [span('s3', 'internal link', ['l2'])],
  },
] as unknown as PortableTextBlock[]

export const samplePosts: BlogPostSummary[] = [
  {
    slug: 'getting-started',
    title: 'Getting started with Petrosol',
    excerpt: 'A short walk through your first steps.',
    publishedAt: '2026-05-10T09:00:00Z',
    category: { title: 'Product', slug: 'product' },
    author: { name: 'Alex Mensah', slug: 'alex-mensah' },
    readMinutes: 4,
    coverImage: null,
  },
  {
    slug: 'how-we-work',
    title: 'How we work',
    excerpt: 'A short look at how the team ships.',
    publishedAt: '2026-05-05T09:00:00Z',
    category: { title: 'Product', slug: 'product' },
    author: { name: 'Jordan Osei', slug: 'jordan-osei' },
    readMinutes: 5,
    coverImage: null,
  },
]

export const samplePostFull: BlogPostFull = {
  ...samplePosts[0],
  body: richBody,
}

export const sampleFaqs: FaqItem[] = [
  {
    question: 'How long does verification take?',
    answer: [
      {
        _type: 'block',
        _key: 'a1',
        style: 'normal',
        markDefs: [],
        children: [span('a1s', 'Usually just a few minutes.')],
      },
    ] as unknown as PortableTextBlock[],
  },
]
