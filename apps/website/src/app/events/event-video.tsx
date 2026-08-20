"use client";

import MuxPlayer from "@mux/mux-player-react";

import type { GalleryEventView } from "@workspace/content";
import { PlayButton } from "@workspace/ui/components/play-button";

import { muxPosterUrl } from "./event-photo";

/**
 * The film itself, inside the modal.
 *
 * Its own file so the modal can pull it in with `next/dynamic` — the player is
 * a heavy custom-element wrapper and only one row on the page uses it, so it
 * has no business in the initial payload.
 *
 * This is NOT the same component as the home hero's. That one is
 * `@mux/mux-background-video`, a decorative looper that hard-disables audio and
 * renders `aria-hidden` with no controls. A gallery film needs sound, a scrubber
 * and fullscreen, so it gets the real player.
 */
function EventVideo({ event }: { event: GalleryEventView }) {
  // A video row can be filed before whoever holds the footage has uploaded it.
  // The placeholder says exactly that, which is the truth of the situation.
  if (!event.muxPlaybackId) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-lg bg-navy-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
          <PlayButton size={76} />
          <p className="font-mono text-[11px] tracking-[0.1em] text-white/72 uppercase">
            Video placeholder &mdash; share the file or link to embed
          </p>
        </div>
      </div>
    );
  }

  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId={event.muxPlaybackId}
      poster={muxPosterUrl(event.muxPlaybackId, event.posterTime)}
      metadata={{ video_title: event.title }}
      className="aspect-video w-full overflow-hidden rounded-lg"
    />
  );
}

export { EventVideo };
