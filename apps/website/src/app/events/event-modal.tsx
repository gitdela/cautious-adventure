"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { useLenis } from "lenis/react";

import {
  PortableContent,
  type ContentImageValue,
  type GalleryEventView,
} from "@workspace/content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Eyebrow } from "@workspace/ui/components/marketing";
import { cn } from "@workspace/ui/lib/utils";

import { contentAdapters } from "@/lib/content-adapters";

import { EventPhoto } from "./event-photo";

/**
 * Which variant the modal shows. Same three values as an event's `kind`, but
 * set when the modal opens and deliberately independent of it — a story card
 * opens either its write-up or its own photos.
 */
type EventMode = "photos" | "story" | "video";

// Only pulled in when someone opens a video. `ssr: false` because the player is
// a custom element with no server rendering to do.
const EventVideo = dynamic(
  () => import("./event-video").then((m) => m.EventVideo),
  { ssr: false },
);

const navButtonClass =
  "absolute top-1/2 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-navy-900/55 text-white transition-colors hover:bg-navy-900/72 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

/**
 * One photo at a time with prev/next and a counter — a lightbox, not a grid, so
 * each shot gets the whole panel.
 *
 * The index lives here rather than in the page: the dialog unmounts its content
 * on close, so every open starts back at the first photo without anything
 * having to reset it.
 *
 * Callers must not render this with an empty reel — every step wraps with
 * `% total`, which is `NaN` at zero. `EventModal` guards it.
 */
function PhotoStage({
  photos,
  title,
}: {
  photos: ContentImageValue[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const total = photos.length;

  const step = (delta: number) =>
    setIndex((current) => (current + delta + total) % total);

  // The dialog owns Escape; the arrow keys are ours, and only while this stage
  // is on screen — hence a listener with cleanup rather than a handler.
  useEffect(() => {
    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "ArrowLeft")
        setIndex((c) => (c - 1 + total) % total);
      if (keyEvent.key === "ArrowRight") setIndex((c) => (c + 1) % total);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total]);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-card">
        {photos.map((photo, slot) => (
          <div
            key={`${title}-m${slot + 1}`}
            aria-hidden={slot !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-200 ease-[cubic-bezier(.4,0,.2,1)]",
              slot === index ? "opacity-100" : "opacity-0",
            )}
          >
            <EventPhoto
              photo={photo}
              alt={`${title}, photo ${slot + 1}`}
              width={1600}
              height={1000}
              sizes="(min-width: 900px) 900px, 94vw"
              placeholder={`Drop photo ${slot + 1}: ${title}`}
              priority={slot === 0}
              // The rows crop to fit their strip; this is where you come to see
              // the whole photograph, so nothing is cut. Portrait shots
              // letterbox against the card fill rather than losing their top
              // and bottom — which is what that fill is for.
              contain
            />
          </div>
        ))}

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className={cn(navButtonClass, "left-4")}
            >
              <RiArrowLeftSLine className="size-[22px]" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className={cn(navButtonClass, "right-4")}
            >
              <RiArrowRightSLine className="size-[22px]" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      <p
        aria-live="polite"
        className="mt-4 text-center font-mono text-[12px] tracking-[0.1em] text-muted-foreground"
      >
        {index + 1} / {total}
      </p>
    </div>
  );
}

/**
 * The write-up. Portable Text, so `contentAdapters` has to be in scope — and
 * this is a client file, so it is imported here rather than passed in.
 * CLAUDE.md #5 prescribes exactly that: adapters hold component functions, so
 * they cannot cross the RSC boundary as props, but wiring them inside a client
 * boundary file is the sanctioned route. `lubricants-catalogue.tsx` imports
 * `urlForImage` the same way.
 */
function StoryBody({ event }: { event: GalleryEventView }) {
  return (
    <PortableContent
      value={event.body}
      adapters={contentAdapters}
      className="flex flex-col gap-5 text-[13px] leading-[1.58]"
    />
  );
}

const modeLabels: Record<EventMode, string> = {
  photos: "Photos",
  story: "Event",
  video: "Video",
};

/** "2025 · Photos", and just "Community" for CSR entries. */
function eventEyebrow(event: GalleryEventView, mode: EventMode): string {
  return event.stream === "community"
    ? "Community"
    : `${event.year} · ${modeLabels[mode]}`;
}

function modalDescription(event: GalleryEventView, mode: EventMode): string {
  if (mode === "photos") {
    return `${event.photos.length} photographs from ${event.title}. Use the arrow keys to move between them.`;
  }
  if (mode === "video") return `Video from ${event.title}.`;
  return `The write-up for ${event.title}.`;
}

/**
 * The one modal on the page. `mode` decides what it shows, not the event's own
 * kind — a story row opens the same event as prose or as photos.
 *
 * `event` stays mounted while the dialog animates out — the caller clears
 * visibility, not the event — so the panel keeps its content through the exit.
 * Backdrop, Escape, focus trap and body-scroll lock all come from the dialog
 * primitive rather than being re-implemented here.
 */
function EventModal({
  event,
  mode,
  open,
  onClose,
}: {
  event: GalleryEventView | null;
  mode: EventMode;
  open: boolean;
  onClose: () => void;
}) {
  const lenis = useLenis();

  // The dialog's own scroll lock stops native scrolling; Lenis drives the
  // wheel through its own loop and has to be stopped alongside it.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [open, lenis]);

  if (!event) return null;

  // An event with no reel yet cannot open the lightbox — the stage divides by
  // its photo count. Rows already hide the way in; this is the backstop.
  const showPhotos = mode === "photos" && event.photos.length > 0;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-y-auto px-[var(--card-pad)] pt-12 pb-[var(--card-pad)]",
          // Stories are a column of prose and read better narrow; the lightbox
          // and the film want the extra width for their picture boxes.
          mode === "story"
            ? "sm:max-w-[680px]"
            : "sm:max-w-[min(960px,calc(100vw-4rem))]",
        )}
      >
        <DialogHeader className="gap-0">
          <Eyebrow>{eventEyebrow(event, mode)}</Eyebrow>
          <DialogTitle className="mt-3 font-display text-[length:var(--size-display-sm)] leading-[1.18] font-bold tracking-[-0.02em] text-navy-900">
            {event.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {modalDescription(event, mode)}
          </DialogDescription>
        </DialogHeader>

        {mode === "story" ? (
          <StoryBody event={event} />
        ) : mode === "video" ? (
          <EventVideo event={event} />
        ) : showPhotos ? (
          <PhotoStage photos={event.photos} title={event.title} />
        ) : (
          <p className="text-[13px] leading-[1.58] text-muted-foreground">
            Photographs from this event have not been added yet.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { EventModal, type EventMode };
