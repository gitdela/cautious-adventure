import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion'

import type { ContentAdapters } from '../adapters'
import type { FaqItem } from '../types'
import { PortableContent } from '../portable-content'
import { ContentEmpty } from '../states'

export function FaqSection({
  items,
  adapters,
  title,
  description,
}: {
  items: FaqItem[]
  adapters: ContentAdapters
  title?: string
  description?: string
}) {
  if (items.length === 0) {
    return <ContentEmpty title="No questions yet" />
  }

  return (
    <section>
      {title ? (
        <h2 className="text-[22px] font-semibold leading-tight tracking-tight sm:text-[26px]">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}

      <Accordion
        type="single"
        collapsible
        className="mt-6 overflow-hidden rounded-xl border bg-card"
      >
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border-b border-border/60 px-6 last:border-b-0"
          >
            <AccordionTrigger className="text-left text-[14.5px] font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <PortableContent
                value={item.answer}
                adapters={adapters}
                className="max-w-2xl text-[13.5px] text-muted-foreground"
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
