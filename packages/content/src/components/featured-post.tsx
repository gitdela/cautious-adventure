import { Badge } from '@workspace/ui/components/badge'

import type { ContentAdapters } from '../adapters'
import { formatDate, formatReadTime } from '../format'
import type { BlogPostSummary } from '../types'
import { CoverImage } from './cover-image'

// Featured post — 12-col grid, text 7/12 left + media 5/12 right at lg (stacked
// on mobile). Per the blog image spec §2.1 the media is a 16:9 cover, inset in
// a padded column (lg:pl-0 to sit flush to the centre gap) and vertically
// centred — never fill-height — so a 1600×900 cover never crops.
export function FeaturedPost({
  post,
  href,
  adapters,
}: {
  post: BlogPostSummary
  href: string
  adapters: ContentAdapters
}) {
  const { Link } = adapters
  const date = formatDate(post.publishedAt)
  const read = formatReadTime(post.readMinutes)

  return (
    <Link href={href} className="group mb-16 block">
      <div className="overflow-hidden rounded-[20px] border bg-card">
        <div className="grid grid-cols-12">
          <div className="col-span-12 flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12">
            <Badge variant="outline" className="mb-5 self-start">
              Latest{post.category?.title ? ` · ${post.category.title}` : ''}
            </Badge>
            <h2 className="text-[26px] font-semibold leading-tight tracking-tight decoration-1 underline-offset-[6px] group-hover:underline sm:text-[32px] lg:text-[40px]">
              {post.title}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-3 text-[12.5px] text-muted-foreground/70">
              {post.author?.name ? <span>{post.author.name}</span> : null}
              {post.author?.name && date ? <span>·</span> : null}
              {date ? <span className="num">{date}</span> : null}
              {read ? (
                <>
                  <span>·</span>
                  <span className="num">{read}</span>
                </>
              ) : null}
            </div>
          </div>
          <div className="col-span-12 flex items-center p-6 sm:p-10 lg:col-span-5 lg:p-12 lg:pl-0">
            <CoverImage
              image={post.coverImage}
              label={post.category?.title}
              adapters={adapters}
              className="aspect-[16/9] w-full"
              width={1200}
              height={675}
              priority
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
