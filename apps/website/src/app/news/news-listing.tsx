"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

import {
  ContentEmpty,
  formatDate,
  type BlogPostSummary,
} from "@workspace/content";
import { Badge } from "@workspace/ui/components/badge";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import { SectionHeading } from "@workspace/ui/components/marketing";
import { cn } from "@workspace/ui/lib/utils";

const PER_PAGE = 3;

const pillClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-[18px] font-display text-[14px] font-medium transition-colors";

function pillState(active: boolean) {
  return active
    ? "border-navy-800 bg-navy-800 text-white"
    : "border-border bg-background text-foreground hover:bg-ink-50";
}

function tagOf(post: BlogPostSummary) {
  return post.category?.title ?? "News";
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

function FeaturedCarousel({ slides }: { slides: BlogPostSummary[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      6000,
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-background shadow-card">
        {slides.map((post, i) => (
          <div
            key={post.slug}
            className={cn(
              "grid-cols-1 items-stretch min-[841px]:grid-cols-2",
              i === index ? "grid" : "hidden",
            )}
          >
            <div className="min-h-[220px] min-[841px]:min-h-[300px]">
              <ImagePlaceholder
                label={`Drop a photo — ${post.title.slice(0, 40)}…`}
              />
            </div>
            <div className="flex flex-col gap-4 p-[clamp(24px,3vw,40px)]">
              <ArticleMeta post={post} />
              <Link
                href={`/news/${post.slug}`}
                className="font-display text-[length:var(--size-display-sm)] leading-[1.18] font-bold tracking-[-0.02em] text-navy-900 transition-colors hover:text-brand"
              >
                {post.title}
              </Link>
              <p className="flex-1">{post.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-3">
        {slides.map((post, i) => (
          <button
            key={post.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Story ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-2.5 cursor-pointer rounded-full transition-[width,background-color]",
              i === index ? "w-7 bg-brand" : "w-2.5 bg-ink-200 hover:bg-ink-300",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function NewsCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-background shadow-card transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1">
      <div className="h-[190px] shrink-0">
        <ImagePlaceholder label={`Drop a photo — ${post.title.slice(0, 40)}…`} />
      </div>
      <Link
        href={`/news/${post.slug}`}
        className="flex flex-1 flex-col gap-3 p-[var(--card-pad)]"
      >
        <ArticleMeta post={post} />
        <h3 className="font-display text-[18px] leading-[1.3] font-bold text-navy-900 transition-colors group-hover:text-brand">
          {post.title}
        </h3>
      </Link>
    </article>
  );
}

function NewsListing({ posts }: { posts: BlogPostSummary[] }) {
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
  const featured = posts.slice(0, 3);
  const rest = posts.slice(3);
  const filtered = tag === "All" ? rest : rest.filter((post) => tagOf(post) === tag);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const shown = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const pickTag = (next: string) => {
    setTag(next);
    setPage(0);
  };

  return (
    <section className="ps-blueprint bg-muted pt-[var(--section-y-tight)] pb-[var(--section-y)]">
      <div className="ps-container flex flex-col gap-[var(--gutter)]">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Media · Newsroom" highlight="the network">
            News from across
          </SectionHeading>
          <span className="pb-2 font-mono text-[12px] tracking-[0.14em] text-muted-foreground uppercase">
            Updated {formatDate(posts[0]?.publishedAt)}
          </span>
        </div>

        <FeaturedCarousel slides={featured} />

        <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Filter news by tag">
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

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[var(--gutter)] min-[1100px]:grid-cols-3">
          {shown.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>

        {pages > 1 ? (
          <nav
            aria-label="News pages"
            className="mt-6 flex items-center justify-center gap-3"
          >
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
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
                onClick={() => setPage(i)}
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
              onClick={() => setPage(page + 1)}
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
