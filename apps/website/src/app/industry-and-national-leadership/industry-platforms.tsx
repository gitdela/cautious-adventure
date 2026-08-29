import type { GalleryEventView } from "@workspace/content";
import { SectionHeading } from "@workspace/ui/components/marketing";

import { EventList } from "../events/event-list";

function IndustryPlatforms({ events }: { events: GalleryEventView[] }) {
  return (
    <section className="ps-blueprint bg-muted py-[var(--section-y)]">
      <div className="ps-container">
        <SectionHeading
          eyebrow="Knowledge-sharing platforms"
          highlight="industry conversations"
        >
          Investing in the
        </SectionHeading>
        <p className="mt-6 max-w-[62ch]">
          PETROSOL supports platforms that bring policymakers, regulators,
          investors, academics and energy professionals together. Our support
          creates room for practical dialogue on policy, innovation, investment,
          resilience and sustainable growth.
        </p>
        <div className="mt-14">
          <EventList
            events={events}
            emptyTitle="Industry platform stories are being prepared"
            emptyDescription="Published GHIPCON, SPE and related platform stories will appear here."
          />
        </div>
      </div>
    </section>
  );
}

export { IndustryPlatforms };
