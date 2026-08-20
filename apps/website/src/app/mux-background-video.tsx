"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { MuxBackgroundVideo as MuxEngine } from "@mux/mux-background-video";

import { cn } from "@workspace/ui/lib/utils";

/**
 * Local replacement for `@mux/mux-background-video/react` (0.2.3).
 *
 * The published wrapper drops its engine on effect cleanup without stopping it
 * — `muxRef.current = null` and nothing more. The engine has no public abort:
 * `HlsMini` holds its unload handle in a private field that only fires on a
 * *subsequent* `loadSource()`, and `destroy()` never calls it. So each effect
 * re-run strands a segment loop that runs for the life of the tab, and once a
 * rival engine replaces the video's `src` the old MediaSource closes, leaving
 * the stranded loop reading `sourceBuffers[i].buffered` off `undefined`.
 *
 * React re-runs that effect on StrictMode's double-mount and on every Fast
 * Refresh, which is why dev filled with `can't access property "buffered"`.
 *
 * The fix is to reuse the engine rather than replace it, so every re-run goes
 * through `loadSource()` on the *same* instance — the one code path that does
 * abort the previous load. Keying on the video element rather than the module
 * lets several players coexist (the hero crossfades two) while each keeps that
 * one-engine-per-element guarantee.
 */
const engines = new WeakMap<HTMLVideoElement, MuxEngine>();

function getEngine(video: HTMLVideoElement) {
  let mux = engines.get(video);
  if (!mux) {
    mux = new MuxEngine();
    engines.set(video, mux);
  }
  return mux;
}

type MuxBackgroundVideoProps = {
  src: string;
  maxResolution?: string;
  preload?: "none" | "metadata" | "auto";
  /** Off when a caller sequences several clips itself. */
  loop?: boolean;
  autoPlay?: boolean;
  className?: string;
  /** Hand playback control to the caller. */
  videoRef?: RefObject<HTMLVideoElement | null>;
  /** Poster image, painted underneath the video. */
  children?: ReactNode;
};

function MuxBackgroundVideo({
  src,
  maxResolution,
  preload = "auto",
  loop = true,
  autoPlay = true,
  className,
  videoRef,
  children,
}: MuxBackgroundVideoProps) {
  const internalRef = useRef<HTMLVideoElement>(null);
  const ref = videoRef ?? internalRef;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // React does not reliably reflect `muted` into the attribute, and autoplay
    // is refused without it — so set the property directly too.
    video.muted = true;

    const mux = getEngine(video);
    mux.display = video;
    mux.config = { audio: false, maxResolution, preload };
    mux.src = src;
  }, [ref, src, maxResolution, preload]);

  return (
    <div
      className={cn(
        "relative size-full [&>img]:size-full [&>img]:object-cover",
        className,
      )}
    >
      {children}
      <video
        ref={ref}
        muted
        autoPlay={autoPlay}
        loop={loop}
        playsInline
        disableRemotePlayback
        disablePictureInPicture
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}

export { MuxBackgroundVideo };
