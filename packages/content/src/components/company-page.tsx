import { cn } from '@workspace/ui/lib/utils'

import type { ContentAdapters } from '../adapters'
import type { AuthorRef, ContentImageValue, PortableTextBlock } from '../types'
import { CoverImage } from './cover-image'
import { PortableContent } from '../portable-content'

type HeroSection = {
  _type: 'heroSection'
  _key: string
  heading: string
  subheading?: string | null
}
type RichTextSection = {
  _type: 'richTextSection'
  _key: string
  heading?: string | null
  body: PortableTextBlock[]
}
type ImageTextSection = {
  _type: 'imageTextSection'
  _key: string
  heading: string
  body?: string | null
  image?: ContentImageValue | null
  imagePosition?: 'left' | 'right' | null
}
type ValuesSection = {
  _type: 'valuesSection'
  _key: string
  heading?: string | null
  items?: { _key?: string; title: string; description?: string | null }[]
}
type TeamSection = {
  _type: 'teamSection'
  _key: string
  heading?: string | null
  members?: AuthorRef[]
}
type CtaSection = {
  _type: 'ctaSection'
  _key: string
  heading: string
  body?: string | null
}

export type CompanyPageSection =
  | HeroSection
  | RichTextSection
  | ImageTextSection
  | ValuesSection
  | TeamSection
  | CtaSection

export function CompanyPage({
  title,
  sections,
  adapters,
}: {
  title: string
  sections: CompanyPageSection[]
  adapters: ContentAdapters
}) {
  return (
    <div className="mx-auto w-full max-w-[900px]">
      <h1 className="sr-only">{title}</h1>
      <div className="space-y-16">
        {sections.map((section) => (
          <Section key={section._key} section={section} adapters={adapters} />
        ))}
      </div>
    </div>
  )
}

function Section({
  section,
  adapters,
}: {
  section: CompanyPageSection
  adapters: ContentAdapters
}) {
  switch (section._type) {
    case 'heroSection':
      return (
        <section className="text-center">
          <h2 className="text-[32px] font-semibold leading-tight tracking-tight sm:text-[44px]">
            {section.heading}
          </h2>
          {section.subheading ? (
            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
              {section.subheading}
            </p>
          ) : null}
        </section>
      )

    case 'richTextSection':
      return (
        <section>
          {section.heading ? (
            <h2 className="text-[24px] font-semibold tracking-tight">
              {section.heading}
            </h2>
          ) : null}
          <PortableContent value={section.body} adapters={adapters} />
        </section>
      )

    case 'imageTextSection':
      return (
        <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div
            className={cn(
              section.imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2',
            )}
          >
            <CoverImage
              image={section.image}
              label={section.heading}
              adapters={adapters}
              className="aspect-[4/3]"
              width={800}
              height={600}
            />
          </div>
          <div
            className={cn(
              section.imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1',
            )}
          >
            <h2 className="text-[24px] font-semibold tracking-tight">
              {section.heading}
            </h2>
            {section.body ? (
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            ) : null}
          </div>
        </section>
      )

    case 'valuesSection':
      return (
        <section>
          {section.heading ? (
            <h2 className="text-[24px] font-semibold tracking-tight">
              {section.heading}
            </h2>
          ) : null}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(section.items ?? []).map((item, i) => (
              <div
                key={item._key ?? i}
                className="rounded-xl border bg-card p-6"
              >
                <h3 className="text-[16px] font-semibold">{item.title}</h3>
                {item.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )

    case 'teamSection':
      return (
        <section>
          {section.heading ? (
            <h2 className="text-[24px] font-semibold tracking-tight">
              {section.heading}
            </h2>
          ) : null}
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {(section.members ?? []).map((member, i) => (
              <div key={member.slug ?? i} className="text-center">
                {member.avatar ? (
                  <CoverImage
                    image={member.avatar}
                    label={member.name}
                    adapters={adapters}
                    className="mx-auto aspect-square w-24 rounded-full"
                    width={200}
                    height={200}
                  />
                ) : null}
                <div className="mt-3 text-sm font-medium">{member.name}</div>
                {member.bio ? (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {member.bio}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )

    case 'ctaSection':
      return (
        <section className="rounded-xl border bg-card p-8 text-center sm:p-12">
          <h2 className="text-[26px] font-semibold tracking-tight">
            {section.heading}
          </h2>
          {section.body ? (
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {section.body}
            </p>
          ) : null}
        </section>
      )

    default:
      return null
  }
}
