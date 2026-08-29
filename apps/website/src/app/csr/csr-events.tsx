import type { GalleryEventView } from "@workspace/content";
import { SectionHeading } from "@workspace/ui/components/marketing";

import { EventList } from "../events/event-list";

function CsrEvents({ events }: { events: GalleryEventView[] }) {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Community investment"
          highlight="communities we serve"
        >
          Our commitment to the
        </SectionHeading>
        <p className="mt-6 max-w-[62ch]">
          See the programmes and partnerships through which PETROSOL supports
          communities across Ghana through practical, lasting investment.
        </p>
        <div className="mt-14">
          <EventList
            events={events}
            emptyTitle="No community stories yet"
            emptyDescription="Published CSR events will appear here."
          />
        </div>
      </div>
    </section>
  );
}

export { CsrEvents };
