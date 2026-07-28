import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from '@portabletext/react'
import type { SanityImageSource } from '@workspace/cms/image'

import type { ContentAdapters } from './adapters'

/**
 * Server-compatible Portable Text renderer. No `"use client"` — an entire
 * article stays a server component; only genuinely interactive custom blocks
 * (none yet) would be isolated into their own client components.
 *
 * External links are hardened at render time (target + safe rel); internal
 * links go through the app's Link adapter. Inline images go through the Image
 * adapter so each framework controls its own image element.
 */
function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

type ImageBlockValue = SanityImageSource & { alt?: string; caption?: string }

export function buildPortableComponents(
  adapters: ContentAdapters,
): PortableTextComponents {
  const { Link, Image } = adapters

  return {
    block: {
      h2: ({ children }) => (
        <h2 className="mt-10 scroll-mt-24 text-2xl font-semibold tracking-tight">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="mt-6 scroll-mt-24 text-lg font-semibold tracking-tight">
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="mt-6 border-l-2 border-border pl-4 text-muted-foreground italic">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className="mt-4 leading-relaxed text-foreground/90">{children}</p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mt-4 list-disc space-y-1 pl-6">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="mt-4 list-decimal space-y-1 pl-6">{children}</ol>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
          {children}
        </code>
      ),
      link: ({ value, children }) => {
        const href: string = value?.href ?? '#'
        if (isExternalHref(href)) {
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
      image: ({ value }: { value: ImageBlockValue }) => (
        <figure className="mt-6">
          <Image
            source={value}
            alt={value.alt ?? ''}
            width={1200}
            height={675}
            sizes="(min-width: 768px) 768px, 100vw"
            className="rounded-lg border"
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

export type PortableContentProps = {
  value: PortableTextBlock[]
  adapters: ContentAdapters
  className?: string
}

export function PortableContent({
  value,
  adapters,
  className,
}: PortableContentProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={buildPortableComponents(adapters)} />
    </div>
  )
}
