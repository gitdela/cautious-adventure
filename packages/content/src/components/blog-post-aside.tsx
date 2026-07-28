'use client'

import {
  RiLinkedinFill,
  RiLinksLine,
  RiMailLine,
  RiTwitterXLine,
} from '@remixicon/react'
import { cn } from '@workspace/ui/lib/utils'
import { useEffect, useState } from 'react'

export type TocHeading = { id: string; text: string }

/**
 * Desktop-only "On this page" timeline (scroll-spy) + Share block, per
 * blog-slug.md §3.4b / §4. The article renders server-side with `id="s-{i}"`
 * headings; this client component observes those DOM nodes to highlight the
 * active entry and smooth-scroll to them.
 */
export function BlogPostAside({
  headings,
  shareUrl,
  title,
}: {
  headings: TocHeading[]
  shareUrl: string
  title: string
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el != null)
    if (!els.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActiveId(vis[0].target.id)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [headings])

  const goTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 96,
        behavior: 'smooth',
      })
    }
  }

  const copyLink = () => {
    navigator.clipboard?.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const url = encodeURIComponent(shareUrl)
  const text = encodeURIComponent(title)
  const shareBtnCls =
    'inline-flex h-9 items-center gap-2.5 self-start rounded-full border border-border px-3.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'

  return (
    <aside className="col-span-4 hidden lg:block">
      <div className="sticky top-24">
        {/* Timeline */}
        <div className="mb-4 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
          On this page
        </div>
        <nav className="flex flex-col gap-0.5 border-l border-border">
          {headings.map((x) => {
            const active = activeId === x.id
            return (
              <button
                key={x.id}
                type="button"
                onClick={() => goTo(x.id)}
                className={cn(
                  '-ml-px border-l-2 py-1.5 pl-4 text-left text-[13px] leading-snug transition-colors',
                  active
                    ? 'border-foreground font-medium text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {x.text}
              </button>
            )
          })}
        </nav>

        {/* Share */}
        <div className="mb-4 mt-10 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
          Share
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={copyLink} className={shareBtnCls}>
            <RiLinksLine className="size-[15px]" />
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            className={shareBtnCls}
          >
            <RiTwitterXLine className="size-[15px]" />
            Share on X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={shareBtnCls}
          >
            <RiLinkedinFill className="size-[15px]" />
            LinkedIn
          </a>
          <a href={`mailto:?subject=${text}&body=${url}`} className={shareBtnCls}>
            <RiMailLine className="size-[15px]" />
            Email
          </a>
        </div>
      </div>
    </aside>
  )
}
