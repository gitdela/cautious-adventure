'use client'

import { cn } from '@workspace/ui/lib/utils'
import { useMemo, useState } from 'react'

import type { ContentAdapters } from '../adapters'
import type { BlogPostSummary } from '../types'
import { BlogCard } from './blog-card'
import { FeaturedPost } from './featured-post'
import { ContentEmpty } from '../states'

/**
 * Interactive blog listing — featured post + category filter chips + grid
 * (blog-page.md §4.2–4.3). Client component so filtering is instant.
 *
 * `basePath` (a string like "/blog") is used instead of an href-builder
 * function because functions can't be passed from a Server Component to a
 * Client Component. Category chips are derived from the categories actually
 * present on the posts, plus "All".
 */
export function BlogListing({
  posts,
  basePath,
  adapters,
  featured = true,
  emptyState,
}: {
  posts: BlogPostSummary[]
  basePath: string
  adapters: ContentAdapters
  featured?: boolean
  emptyState?: React.ReactNode
}) {
  const categories = useMemo(() => {
    const seen = new Set<string>()
    for (const p of posts) if (p.category?.title) seen.add(p.category.title)
    return ['All', ...Array.from(seen)]
  }, [posts])

  const [filter, setFilter] = useState('All')

  if (posts.length === 0) {
    return (
      <>
        {emptyState ?? (
          <ContentEmpty
            title="No posts yet"
            description="New writing from the Petrosol team will show up here."
          />
        )}
      </>
    )
  }

  const first = posts[0]
  const visible =
    filter === 'All'
      ? posts
      : posts.filter((p) => p.category?.title === filter)
  const href = (slug: string) => `${basePath}/${slug}`

  return (
    <div>
      {featured ? (
        <FeaturedPost post={first} href={href(first.slug)} adapters={adapters} />
      ) : null}

      {/* Header row — §4.3: "All posts" + filter chips */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="text-[20px] font-semibold tracking-tight sm:text-[22px] lg:text-[24px]">
          All posts
        </h2>
        {categories.length > 1 ? (
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'h-8 rounded-full px-3 text-[12.5px] font-medium transition-colors',
                  filter === f
                    ? 'bg-foreground text-background'
                    : 'border border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Grid — §4.3: gap-x-6 gap-y-12, 1/2/3-up */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              href={href(post.slug)}
              adapters={adapters}
            />
          ))}
        </div>
      ) : (
        <ContentEmpty title={`No posts in ${filter}`} />
      )}
    </div>
  )
}
