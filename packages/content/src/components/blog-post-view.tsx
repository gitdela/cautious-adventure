import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { RiArrowRightLine, RiArrowRightSLine } from '@remixicon/react'
import { Badge } from '@workspace/ui/components/badge'

import type { ContentAdapters } from '../adapters'
import { formatDate } from '../format'
import type { BlogPostFull, BlogPostSummary, PortableTextBlock } from '../types'
import { BlogCard } from './blog-card'
import { BlogPostAside, type TocHeading } from './blog-post-aside'
import { CoverImage } from './cover-image'

/* eslint-disable @typescript-eslint/no-explicit-any */

function initials(name: string): string {
  return name
    .split(' ')
    .map((s) => s[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function blockText(block: any): string {
  return (block?.children ?? []).map((c: any) => c?.text ?? '').join('')
}

type Heading = { id: string; text: string; key: string }

function extractHeadings(body: PortableTextBlock[]): Heading[] {
  const out: Heading[] = []
  for (const b of body as any[]) {
    if (b?._type === 'block' && b?.style === 'h2') {
      out.push({ id: `s-${out.length}`, text: blockText(b), key: b._key })
    }
  }
  return out
}

function estimateReadMinutes(body: PortableTextBlock[]): number {
  let words = 0
  for (const b of body as any[]) {
    if (b?._type === 'block') {
      words += blockText(b).split(/\s+/).filter(Boolean).length
    }
  }
  return Math.max(1, Math.round(words / 200))
}

/** Related picker per §1: exclude current, same-topic first, exactly `count`. */
export function pickRelated(
  all: BlogPostSummary[],
  current: { slug: string; category?: { title?: string | null } | null },
  count = 3,
): BlogPostSummary[] {
  const topic = current.category?.title ?? null
  return all
    .filter((p) => p.slug !== current.slug)
    .sort(
      (a, b) =>
        Number(b.category?.title === topic) - Number(a.category?.title === topic),
    )
    .slice(0, count)
}

// Article body — spec §3.4a typography. `idByKey` gives each h2 its positional
// `s-{i}` id so the timeline can target it.
function articleComponents(
  adapters: ContentAdapters,
  idByKey: Map<string, string>,
): PortableTextComponents {
  const { Link, Image } = adapters
  return {
    block: {
      h2: ({ value, children }: any) => (
        <h2
          id={idByKey.get(value._key)}
          className="mt-12 mb-1 scroll-mt-24 text-[22px] font-semibold leading-tight tracking-tight sm:text-[26px]"
        >
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="mt-8 scroll-mt-24 text-[18px] font-semibold tracking-tight">
          {children}
        </h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="mt-6 scroll-mt-24 text-[16px] font-semibold">{children}</h4>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="mt-5 border-l-2 border-border pl-4 text-[16px] italic leading-[1.75] text-muted-foreground">
          {children}
        </blockquote>
      ),
      normal: ({ children }: any) => (
        <p className="mt-5 text-[16px] leading-[1.75] text-muted-foreground">
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="mt-5 list-disc space-y-1 pl-6 text-[16px] leading-[1.75] text-muted-foreground">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="mt-5 list-decimal space-y-1 pl-6 text-[16px] leading-[1.75] text-muted-foreground">
          {children}
        </ol>
      ),
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      em: ({ children }: any) => <em className="italic">{children}</em>,
      code: ({ children }: any) => (
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
          {children}
        </code>
      ),
      link: ({ value, children }: any) => {
        const href: string = value?.href ?? '#'
        if (/^https?:\/\//i.test(href)) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-medium underline underline-offset-4"
            >
              {children}
            </a>
          )
        }
        if (href.startsWith('mailto:')) {
          return (
            <a href={href} className="font-medium underline underline-offset-4">
              {children}
            </a>
          )
        }
        return (
          <Link href={href} className="font-medium underline underline-offset-4">
            {children}
          </Link>
        )
      },
    },
    types: {
      image: ({ value }: any) => (
        <figure className="mt-6">
          <Image
            source={value}
            alt={value.alt ?? ''}
            width={1200}
            height={675}
            className="rounded-xl border"
          />
          {value.caption ? (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      ),
    },
  }
}

export function BlogPostView({
  post,
  related,
  adapters,
  blogHref = '/blog',
  basePath = '/blog',
  shareUrl = '',
}: {
  post: BlogPostFull
  related: BlogPostSummary[]
  adapters: ContentAdapters
  blogHref?: string
  basePath?: string
  shareUrl?: string
}) {
  const { Link } = adapters
  const topic = post.category?.title ?? ''
  const date = formatDate(post.publishedAt)
  const readMin = estimateReadMinutes(post.body)
  const headings = extractHeadings(post.body)
  const idByKey = new Map(headings.map((h) => [h.key, h.id]))
  const toc: TocHeading[] = headings.map((h) => ({ id: h.id, text: h.text }))

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 lg:px-10">
      {/* Breadcrumb — §3.1 */}
      <div className="pt-8 lg:pt-12">
        <nav className="flex items-center gap-2 text-[12.5px] text-muted-foreground/70">
          <Link href={blogHref} className="transition-colors hover:text-foreground">
            Blog
          </Link>
          <RiArrowRightSLine className="size-[14px]" />
          {topic ? (
            <>
              <span className="text-muted-foreground">{topic}</span>
              <RiArrowRightSLine className="size-[14px]" />
            </>
          ) : null}
          <span className="max-w-[220px] truncate text-foreground sm:max-w-none">
            {post.title}
          </span>
        </nav>
      </div>

      {/* Article header — §3.2 */}
      <header className="max-w-[760px] pt-8 lg:pt-10">
        <div className="flex items-center gap-2">
          {topic ? <Badge variant="outline">{topic}</Badge> : null}
          <span className="num text-[11.5px] text-muted-foreground/70">
            {readMin} min read
          </span>
        </div>
        <h1 className="mt-5 text-[32px] font-semibold leading-[1.06] tracking-tight sm:text-[42px] lg:text-[52px]">
          {post.title}
        </h1>
        <div className="mt-6 flex items-center gap-3 text-[13px] text-muted-foreground">
          {post.author?.name ? (
            <>
              <div className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-muted text-[12px] font-medium text-foreground">
                {initials(post.author.name)}
              </div>
              <span className="font-medium text-muted-foreground">
                {post.author.name}
              </span>
              {date ? <span>·</span> : null}
            </>
          ) : null}
          {date ? (
            <time dateTime={post.publishedAt} className="num">
              {date}
            </time>
          ) : null}
        </div>
      </header>

      {/* Hero media — blog image spec §2.3: 16:9 cover capped at the header
          measure (760px), left-aligned, so a 1600×900 cover never crops. */}
      <section className="pt-8 lg:pt-10">
        <CoverImage
          image={post.coverImage}
          label={topic}
          adapters={adapters}
          className="aspect-[16/9] w-full max-w-[760px]"
          width={1600}
          height={900}
          priority
        />
      </section>

      {/* Body + aside — §3.4 */}
      <section className="pb-16 pt-10 lg:pb-24 lg:pt-14">
        <div className="grid grid-cols-12 gap-x-6 lg:gap-x-16">
          <article className="col-span-12 max-w-[720px] lg:col-span-8">
            {post.excerpt ? (
              <p className="text-[19px] font-normal leading-[1.65] text-foreground sm:text-[20px]">
                {post.excerpt}
              </p>
            ) : null}

            <PortableText
              value={post.body}
              components={articleComponents(adapters, idByKey)}
            />

            {/* Author card — §3.4a */}
            {post.author?.name ? (
              <div className="mt-14 flex items-start gap-4 rounded-[20px] border p-6">
                <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[15px] font-medium">
                  {initials(post.author.name)}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70">
                    Written by
                  </div>
                  <div className="mt-1 text-[15px] font-medium">
                    {post.author.name}
                  </div>
                  <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                    {post.author.bio ??
                      'Part of the Petrosol team.'}
                  </p>
                </div>
              </div>
            ) : null}
          </article>

          {toc.length > 0 ? (
            <BlogPostAside headings={toc} shareUrl={shareUrl} title={post.title} />
          ) : null}
        </div>
      </section>

      {/* Related — §3.5 */}
      {related.length > 0 ? (
        <section className="pb-16 lg:pb-24">
          <div className="border-t pt-12">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="text-[22px] font-semibold tracking-tight sm:text-[26px]">
                Related reading
              </h2>
              <Link
                href={blogHref}
                className="inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
              >
                All posts <RiArrowRightLine className="size-[12px]" />
              </Link>
            </div>
            <div className="grid grid-cols-12 gap-x-6 gap-y-12">
              {related.map((p) => (
                <div key={p.slug} className="col-span-12 md:col-span-6 lg:col-span-4">
                  <BlogCard
                    post={p}
                    href={`${basePath}/${p.slug}`}
                    adapters={adapters}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
