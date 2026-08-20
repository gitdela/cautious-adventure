import { Badge } from '@workspace/ui/components/badge'
import { cn } from '@workspace/ui/lib/utils'

import type { ContentAdapters } from '../adapters'
import { formatDate, formatReadTime } from '../format'
import type { BlogPostSummary } from '../types'
import { CoverImage } from './cover-image'

export function BlogCard({
  post,
  href,
  adapters,
  className,
}: {
  post: BlogPostSummary
  href: string
  adapters: ContentAdapters
  className?: string
}) {
  const { Link } = adapters
  const date = formatDate(post.publishedAt)
  const read = formatReadTime(post.readMinutes)

  return (
    <article className={cn('group', className)}>
      <Link href={href} className="block">
        <CoverImage
          image={post.coverImage}
          label={post.category?.title}
          adapters={adapters}
          className="aspect-[1200/630]"
          width={1200}
          height={630}
        />
        <div className="mt-4 flex items-center gap-2">
          {post.category?.title ? (
            <Badge variant="outline">{post.category.title}</Badge>
          ) : null}
          {read ? (
            <span className="num text-[11.5px] text-muted-foreground/50">{read}</span>
          ) : null}
        </div>
        <h3 className="mt-3 text-[18px] font-semibold leading-snug tracking-tight decoration-1 underline-offset-4 group-hover:underline">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-3 text-[12px] text-muted-foreground/70">
          {post.author?.name ? `${post.author.name} · ` : ''}
          <span className="num">{date}</span>
        </div>
      </Link>
    </article>
  )
}
