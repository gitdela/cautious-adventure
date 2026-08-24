"use client";

import Image from "next/image";

import { urlForImage } from "@workspace/cms/image";
import type { ContentImageValue, GalleryEventView } from "@workspace/content";
import { ImagePlaceholder } from "@workspace/ui/components/image-placeholder";

/**
 * The events page's two image slots, shared by the rows and the lightbox.
 *
 * Both fall back to a placeholder rather than rendering an empty box: an event
 * record is routinely created before its photography arrives, and the page has
 * to read as "photos to come" rather than as broken.
 *
 * These are client components because the rows they sit in are — the modal
 * state lives there. `urlForImage` reads the config singleton, which the
 * lubricants catalogue already relies on from a client island.
 */

function EventPhoto({
  photo,
  alt,
  width,
  height,
  sizes,
  placeholder,
  priority,
  contain = false,
}: {
  photo?: ContentImageValue | null;
  /** Used when the image carries no alt of its own. */
  alt: string;
  /**
   * The frame to fill. Keep this at the SAME ratio as the box it renders into —
   * requesting a square for a landscape tile means Sanity crops to square and
   * `object-cover` then crops again, losing content on both axes.
   */
  width: number;
  height: number;
  sizes: string;
  placeholder: string;
  priority?: boolean;
  /** Show the whole photo, letterboxed, instead of cropping it to fill. */
  contain?: boolean;
}) {
  if (!photo) return <ImagePlaceholder label={placeholder} />;

  const builder = urlForImage(photo).width(width).height(height).auto("format");

  return (
    <Image
      // `max` scales the photo down to fit the box without cutting anything, so
      // the lightbox shows the whole shot. Everywhere else fills the box and
      // anchors to the top: in event photography the subject is in the upper
      // half — faces, trophies held up, a banner behind a line of people — and a
      // centre crop takes exactly that off first.
      //
      // Note `crop("top")` REPLACES the hotspot rather than deferring to it, so
      // a hotspot set in Studio has no effect on these tiles.
      src={
        contain
          ? builder.fit("max").url()
          : builder.fit("crop").crop("top").url()
      }
      alt={photo.alt ?? alt}
      fill
      sizes={sizes}
      priority={priority}
      className={contain ? "object-contain" : "object-cover"}
    />
  );
}

/** Mux generates a still from the film itself, so a video needs no upload. */
function muxPosterUrl(playbackId: string, time: number) {
  const url = new URL(`https://image.mux.com/${playbackId}/thumbnail.webp`);
  url.searchParams.set("time", String(time));
  return url.toString();
}

/**
 * A video row's poster. An uploaded still wins — someone chose that frame
 * deliberately — then Mux's own thumbnail, then the placeholder.
 */
function EventPoster({
  event,
  sizes,
}: {
  event: GalleryEventView;
  sizes: string;
}) {
  if (event.coverImage) {
    return (
      <EventPhoto
        photo={event.coverImage}
        alt={`${event.title} video still`}
        // The poster band is full-width and short — roughly 2.9:1, not 16:9.
        width={1800}
        height={620}
        sizes={sizes}
        placeholder={`Drop a video still: ${event.title}`}
      />
    );
  }

  if (event.muxPlaybackId) {
    return (
      <Image
        src={muxPosterUrl(event.muxPlaybackId, event.posterTime)}
        alt={`${event.title} video still`}
        fill
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  return <ImagePlaceholder label={`Drop a video still: ${event.title}`} />;
}

export { EventPhoto, EventPoster, muxPosterUrl };
