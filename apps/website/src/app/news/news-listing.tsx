"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { useLenis } from "lenis/react";

import { urlForImage } from "@workspace/cms/image";
import {
  ContentEmpty,
  formatDate,
  type BlogPostSummary,
} from "@workspace/content";
import { Badge } from "@workspace/ui/components/badge";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { cn } from "@workspace/ui/lib/utils";

import { SCROLL_HEADER_OFFSET } from "../smooth-scroll";

/** Two full rows of the three-column grid at desktop width. */
const PER_PAGE = 6;

const pillClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-[18px] font-display text-[14px] font-medium transition-colors";

function pillState(active: boolean) {
  return active
    ? "border-navy-800 bg-navy-800 text-white"
    : "border-border bg-background text-foreground hover:bg-ink-50";
}

function tagOf(post: BlogPostSummary) {
  return post.category?.title ?? "Blog";
}

/**
 * A post's cover, or a placeholder while photography is outstanding.
 *
 * The listing rendered the placeholder unconditionally until the news archive
 * was imported, because nothing in the dataset had a cover to show.
 */
function PostCover({
  post,
  width,
  height,
  sizes,
  priority,
}: {
  post: BlogPostSummary;
  /** Requested crop, so each frame ratio honours the photo's hotspot. */
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
}) {
  if (!post.coverImage) {
    return (
      <ImagePlaceholder label={`Drop a photo: ${post.title.slice(0, 40)}…`} />
    );
  }

  return (
    <Image
      src={urlForImage(post.coverImage)
        .width(width)
        .height(height)
        .fit("crop")
        .auto("format")
        .url()}
      alt={post.coverImage.alt ?? post.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );
}

function ArticleMeta({ post }: { post: BlogPostSummary }) {
  return (
    <div className="flex items-center gap-3">
      <Badge>{tagOf(post)}</Badge>
      <time
        dateTime={post.publishedAt}
        className="font-mono text-[12px] text-muted-foreground"
      >
        {formatDate(post.publishedAt)}
      </time>
    </div>
  );
}

/** The latest story, held above the archive as a single static highlight. */
function FeaturedPost({ post }: { post: BlogPostSummary }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-background shadow-card">
      <div className="grid grid-cols-1 items-stretch min-[841px]:grid-cols-2">
        <div className="relative min-h-[220px] min-[841px]:min-h-[300px]">
          <PostCover
            post={post}
            width={1200}
            height={900}
            sizes="(min-width: 841px) 50vw, 100vw"
            priority
          />
        </div>
        <div className="flex flex-col gap-4 p-[clamp(24px,3vw,40px)]">
          <ArticleMeta post={post} />
          <Link
            href={`/blog/${post.slug}`}
            className="font-display text-[length:var(--size-display-sm)] leading-[1.18] font-bold tracking-[-0.02em] text-navy-900 transition-colors hover:text-brand"
          >
            {post.title}
          </Link>
          <p className="flex-1">{post.excerpt}</p>
        </div>
      </div>
    </div>
  );
}

function NewsCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-background shadow-card transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1">
      <div className="relative h-[190px] shrink-0">
        <PostCover
          post={post}
          width={760}
          height={480}
          sizes="(min-width: 1100px) 400px, (min-width: 700px) 45vw, 90vw"
        />
      </div>
      <Link
        href={`/blog/${post.slug}`}
        className="flex flex-1 flex-col gap-3 p-[var(--card-pad)]"
      >
        <ArticleMeta post={post} />
        {/* Clamped so the cards keep a common height: titles now run from four
            words to a dozen, and the snippet below needs a predictable start. */}
        <h3 className="line-clamp-2 font-display text-[16px] leading-[1.35] font-bold text-navy-900 transition-colors group-hover:text-brand">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-[13px] leading-[1.58]">
          {post.excerpt}
        </p>
      </Link>
    </article>
  );
}

function NewsListing({ posts }: { posts: BlogPostSummary[] }) {
  const lenis = useLenis();
  const gridRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [tag, setTag] = useState("All");

  if (posts.length === 0) {
    return (
      <section className="ps-blueprint bg-muted pt-[var(--section-y-tight)] pb-[var(--section-y)]">
        <div className="ps-container">
          <ContentEmpty
            title="No stories yet"
            description="Published stories will appear here."
          />
        </div>
      </section>
    );
  }

  const tags = ["All", ...new Set(posts.map(tagOf))];
  // The newest post leads the page. `posts` arrives sorted by publishedAt desc
  // from the query, and the empty case has already returned above.
  const featured = posts[0]!;
  // The highlight is laid over the archive, not a slice taken out of it: the
  // grid lists every post, including the featured one.
  //
  // Featured posts used to be cut from the grid, which also cut them from the
  // tag filter: the chips are built from all posts, so a tag whose only
  // article was featured filtered down to an empty grid.
  const filtered =
    tag === "All" ? posts : posts.filter((post) => tagOf(post) === tag);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const shown = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const pickTag = (next: string) => {
    setTag(next);
    setPage(0);
  };

  /**
   * Paging swaps the cards underneath a reader who is at the bottom of the
   * list, so move them back to the first card of the new page.
   *
   * Done in the handler rather than an effect on `page`: this is a response to
   * a click, and an effect would also fire on first render and whenever the
   * filter reset the page to zero.
   */
  const goToPage = (next: number) => {
    setPage(next);
    if (!gridRef.current) return;
    // Under reduced motion `useLenis()` is undefined (Lenis never mounts) and
    // the native fallback stays instant via the CSS scroll-behavior override.
    if (lenis) {
      lenis.scrollTo(gridRef.current, { offset: SCROLL_HEADER_OFFSET });
    } else {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="ps-blueprint bg-muted pt-[var(--section-y-tight)] pb-[var(--section-y)]">
      <div className="ps-container flex flex-col gap-[var(--gutter)]">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="PETROSOL blog" highlight="the network">
            Stories from across
          </SectionHeading>
          <span className="pb-2 font-mono text-[12px] tracking-[0.14em] text-muted-foreground uppercase">
            Updated {formatDate(posts[0]?.publishedAt)}
          </span>
        </div>

        <FeaturedPost post={featured} />

        <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Filter blog by tag">
          {tags.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => pickTag(item)}
              aria-pressed={tag === item}
              className={cn(pillClass, pillState(tag === item))}
            >
              {item}
            </button>
          ))}
        </div>

        <div
          ref={gridRef}
          // Breathing room so the first card is not flush against the top edge.
          className="grid scroll-mt-8 grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3"
        >
          {shown.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>

        {pages > 1 ? (
          <nav
            aria-label="Blog pages"
            className="mt-6 flex items-center justify-center gap-3"
          >
            <button
              type="button"
              disabled={page === 0}
              onClick={() => goToPage(page - 1)}
              aria-label="Previous page"
              className={cn(
                pillClass,
                pillState(false),
                "min-w-11 px-3 disabled:cursor-default disabled:opacity-60",
              )}
            >
              <RiArrowLeftSLine className="size-[18px]" />
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={`Page ${i + 1}`}
                aria-current={i === page ? "page" : undefined}
                className={cn(pillClass, pillState(i === page), "min-w-11 px-3")}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={page === pages - 1}
              onClick={() => goToPage(page + 1)}
              aria-label="Next page"
              className={cn(
                pillClass,
                pillState(false),
                "min-w-11 px-3 disabled:cursor-default disabled:opacity-60",
              )}
            >
              <RiArrowRightSLine className="size-[18px]" />
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  );
}

export { NewsListing };
