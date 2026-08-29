import type { GalleryEventView } from "@workspace/content";
import { SectionHeading } from "@workspace/ui/components/marketing";

import { EventList } from "../events/event-list";

function PwnConferences({ conferences }: { conferences: GalleryEventView[] }) {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Women in Leadership"
          highlight="PWN conferences"
        >
          Every chapter of our
        </SectionHeading>
        <p className="mt-6 max-w-[62ch]">
          PWN&apos;s Women in Leadership conferences bring the network together
          around connection, learning and professional growth. Explore every
          conference held so far through the stories, films and photographs
          available from each year.
        </p>
        <div className="mt-14">
          <EventList
            events={conferences}
            emptyTitle="PWN conference stories are being prepared"
            emptyDescription="Published PETROSOL Women Network conferences will appear here."
          />
        </div>
      </div>
    </section>
  );
}

export { PwnConferences };
