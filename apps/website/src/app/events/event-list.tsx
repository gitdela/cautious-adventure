"use client";

import { useState } from "react";
import { RiArrowRightLine, RiImageLine } from "@remixicon/react";

import { ContentEmpty, type GalleryEventView } from "@workspace/content";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";
import { PlayButton } from "@workspace/ui/components/play-button";
import { cn } from "@workspace/ui/lib/utils";

import { EventModal, type EventMode } from "./event-modal";
import { EventPhoto, EventPoster } from "./event-photo";

/** The first three tiles of a photos row; the fourth is the way into the reel. */
const STRIP_TILES = 3;

/** Both buttons on a story card, and the only text links on a card in the system. */
const cardLinkClass =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-display text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

/**
 * Tile geometry, and the crop requested to fill it.
 *
 * The strip is four columns of a 1280px container with 24px gutters, so a tile
 * is ~302px wide. At 340px tall that is a shade taller than square, which is
 * what event photography needs — people standing up, trophies held overhead.
 *
 * TILE_W/TILE_H ask Sanity for that same ratio at 2× for retina. Keeping them in
 * step with the height below is the point: request a square for a landscape box
 * and the photo gets cropped twice, once by Sanity and again by `object-cover`.
 */
const TILE_W = 640;
const TILE_H = 720;

const tileClass = "relative h-[340px] overflow-hidden rounded-xl";

type OpenEvent = (event: GalleryEventView, mode?: EventMode) => void;

/** The year tag reads "CSR" for community work, which has no year. */
function yearTag(event: GalleryEventView) {
  return event.stream === "community" ? "CSR" : event.year;
}

function RowHeader({ event }: { event: GalleryEventView }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h3 className="m-0 font-display text-[24px] font-semibold tracking-[-0.02em] text-navy-900">
        {event.title}
      </h3>
      <span className="shrink-0 font-mono text-[12px] tracking-[0.1em] text-muted-foreground">
        {yearTag(event)}
      </span>
    </div>
  );
}

/** Row type 1 — a strip of photo tiles, the last of which opens the reel. */
function PhotosRow({
  event,
  onOpen,
}: {
  event: GalleryEventView;
  onOpen: OpenEvent;
}) {
  const { photos } = event;
  // The strip holds four tiles. Beyond that the fourth carries a count of what
  // it is standing in for; at exactly four it is simply the fourth photo.
  const strip = photos.slice(0, STRIP_TILES);
  const lastTile = photos[STRIP_TILES];
  const remaining = photos.length - STRIP_TILES - 1;

  return (
    <div>
      <div className="mb-4">
        <RowHeader event={event} />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[var(--gutter)]">
        {/* No reel yet: three placeholders and no way in, rather than a
            lightbox that opens onto nothing. */}
        {photos.length === 0
          ? Array.from({ length: STRIP_TILES }, (_, slot) => (
              <div key={slot} className={tileClass}>
                <ImagePlaceholder label={`Drop a photo: ${event.title}`} />
              </div>
            ))
          : null}

        {strip.map((photo, slot) => (
          <div key={`${event.id}-${slot}`} className={tileClass}>
            <EventPhoto
              photo={photo}
              alt={`${event.title}, photo ${slot + 1}`}
              width={TILE_W}
              height={TILE_H}
              sizes="(min-width: 1100px) 300px, (min-width: 700px) 45vw, 90vw"
              placeholder={`Drop a photo: ${event.title}`}
            />
          </div>
        ))}

        {lastTile ? (
          <button
            type="button"
            onClick={() => onOpen(event, "photos")}
            aria-label={`View all photos: ${event.title}`}
            className={cn(
              tileClass,
              "cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
            )}
          >
            <EventPhoto
              photo={lastTile}
              alt={`${event.title}, photo ${STRIP_TILES + 1}`}
              width={TILE_W}
              height={TILE_H}
              sizes="(min-width: 1100px) 300px, (min-width: 700px) 45vw, 90vw"
              placeholder={`Drop a photo: ${event.title}`}
            />
            {/* Only when the tile is standing in for photos you cannot see.
                At exactly four it is just the fourth photo, and an overlay
                would be claiming a "+0 more" that does not exist. */}
            {remaining > 0 ? (
              <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy-900/62">
                <span className="font-display text-[24px] font-semibold text-white">
                  +{remaining} more
                </span>
                <span className="font-mono text-[12px] tracking-[0.1em] text-white/72">
                  VIEW ALL
                </span>
              </span>
            ) : null}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Row type 2 — photo beside a short write-up, with the only text links on a card. */
function StoryRow({
  event,
  onOpen,
}: {
  event: GalleryEventView;
  onOpen: OpenEvent;
}) {
  // A story's own card photo if it has one, otherwise the first of its reel.
  const panel = event.coverImage ?? event.photos[0] ?? null;

  return (
    <article className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] overflow-hidden rounded-xl bg-card">
      <div className="relative min-h-[340px]">
        <EventPhoto
          photo={panel}
          alt={event.title}
          // The panel is ~628px wide beside the text and stretches to its
          // height, so this asks for roughly that shape rather than a portrait
          // crop the box would then cut the top and bottom off.
          width={900}
          height={520}
          sizes="(min-width: 900px) 50vw, 100vw"
          placeholder={`Drop a photo: ${event.title}`}
        />
      </div>
      <div className="flex flex-col justify-center gap-4 p-[var(--card-pad)]">
        <RowHeader event={event} />
        <p className="m-0 text-[13px] leading-[1.58]">{event.excerpt}</p>
        {/* Sanctioned exception to "no text links on cards": the card itself is
            not the affordance here, so the story needs its own ways in — one to
            the write-up, one to the same event's photos. */}
        <div className="flex flex-wrap gap-6">
          <button
            type="button"
            onClick={() => onOpen(event, "story")}
            className={cn(
              cardLinkClass,
              "text-orange-600 hover:text-orange-700",
            )}
          >
            Read more
            <RiArrowRightLine className="size-4" aria-hidden="true" />
          </button>
          {/* Nothing to open until a reel exists. */}
          {event.photos.length > 0 ? (
            <button
              type="button"
              onClick={() => onOpen(event, "photos")}
              className={cn(
                cardLinkClass,
                "text-navy-900 hover:text-orange-600",
              )}
            >
              <RiImageLine className="size-4" aria-hidden="true" />
              View photos
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** Row type 3 — a full-width poster; the whole tile opens the film. */
function VideoRow({
  event,
  onOpen,
}: {
  event: GalleryEventView;
  onOpen: OpenEvent;
}) {
  const reel = event.photos.length;

  return (
    <figure className="relative m-0 h-[clamp(280px,38vw,440px)] overflow-hidden rounded-xl">
      <EventPoster event={event} sizes="100vw" />

      {/* The whole poster plays the film. A full-cover button rather than a
          role="button" figure: the stills control below has to be a real button,
          and interactive content cannot be nested inside another control. */}
      <button
        type="button"
        onClick={() => onOpen(event, "video")}
        aria-label={`Play video: ${event.title}`}
        className="absolute inset-0 grid cursor-pointer place-items-center focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <PlayButton size={64} />
      </button>

      {/* A shoot usually produces stills alongside the film. Rendered after the
          play target so it sits above it and takes its own clicks. The count is
          there because it is what tells you whether the reel is worth opening. */}
      {reel > 0 ? (
        <button
          type="button"
          onClick={() => onOpen(event, "photos")}
          className="absolute top-4 right-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-navy-900/62 px-4 font-display text-[13px] font-semibold text-white transition-colors hover:bg-navy-900/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
        >
          <RiImageLine className="size-4" aria-hidden="true" />
          {reel} {reel === 1 ? "photo" : "photos"}
        </button>
      ) : null}

      {/* Click-through, so the gradient and caption do not carve a dead strip
          out of the play target underneath. */}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 bg-gradient-to-t from-navy-900/82 to-transparent px-5 pt-10 pb-4 font-display text-[13px] font-medium text-white">
        <span>{event.caption ?? event.title}</span>
        <span className="shrink-0 font-mono text-[12px] tracking-[0.1em] text-white/72">
          {yearTag(event)}
        </span>
      </figcaption>
    </figure>
  );
}

function EventList({
  events,
  emptyTitle,
  emptyDescription,
}: {
  events: GalleryEventView[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  // `openEvent` stays set while the modal animates out — only `show` clears on
  // close — so the panel keeps its content through the exit transition.
  const [openEvent, setOpenEvent] = useState<GalleryEventView | null>(null);
  const [mode, setMode] = useState<EventMode>("photos");
  const [show, setShow] = useState(false);

  // Rows default to their own kind of modal; the story card's two buttons say
  // which one they want instead.
  const open: OpenEvent = (event, nextMode = event.kind) => {
    setOpenEvent(event);
    setMode(nextMode);
    setShow(true);
  };

  if (events.length === 0) {
    return <ContentEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <>
      <div className="flex flex-col gap-16">
        {events.map((event) =>
          event.kind === "photos" ? (
            <PhotosRow key={event.id} event={event} onOpen={open} />
          ) : event.kind === "story" ? (
            <StoryRow key={event.id} event={event} onOpen={open} />
          ) : (
            <VideoRow key={event.id} event={event} onOpen={open} />
          ),
        )}
      </div>

      <EventModal
        event={openEvent}
        mode={mode}
        open={show}
        onClose={() => setShow(false)}
      />
    </>
  );
}

export { EventList };
