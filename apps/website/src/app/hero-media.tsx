"use client";

import Image from "next/image";
import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@workspace/ui/lib/utils";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

import {
  FADE_MS,
  FADE_SECONDS,
  HERO_MEDIA,
  nextHeroMediaIndex,
  STILL_ADVANCE_MS,
  type HeroMediaItem,
  type HeroVideoItem,
} from "./hero-media-config";
import { MuxBackgroundVideo } from "./mux-background-video";

/**
 * The final second of each media item is shared with the incoming one.
 * Tailwind cannot build these class names from variables, so `duration-1000`
 * and `duration-[10000ms]` below must be changed in step with these values.
 */
/** Shown only if the media sequence is ever emptied. */
const HERO_FALLBACK_IMAGE = "/images/home/fuel-delivery.webp";

function buildStreamUrl({ id }: HeroVideoItem) {
  return `https://stream.mux.com/${id}.m3u8`;
}

/**
 * The poster has to track `startAt` or it shows a frame the clip never opens
 * on, and you get a visible jump when playback takes over.
 */
function buildPosterUrl({ id, startAt }: HeroVideoItem) {
  const url = new URL(`https://image.mux.com/${id}/thumbnail.webp`);
  url.searchParams.set("time", String(startAt ?? 0));
  return url.toString();
}

/** Autoplay may be refused in ordinary cases such as iOS low-power mode. The
 * poster staying visible is the intended fallback, not an error. */
function play(video: HTMLVideoElement | null) {
  void video?.play().catch(() => {});
}

function seek(video: HTMLVideoElement, time: number) {
  video.currentTime = time;
}

function startTimeOf(item: HeroVideoItem) {
  return item.startAt ?? 0;
}

function useHeroPlayback(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useMemo(
    () =>
      HERO_MEDIA.map((item) =>
        item.kind === "video" ? createRef<HTMLVideoElement>() : null,
      ),
    [],
  );
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // The observer needs the current item without being rebuilt each time the
  // sequence advances.
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Mirrors `active` for the same reason: `goTo` must not be rebuilt (and the
  // effects below re-run) every time a crossfade starts or finishes.
  const outgoingRef = useRef(outgoing);

  useEffect(() => {
    outgoingRef.current = outgoing;
  }, [outgoing]);

  /**
   * Advances the sequence. Reads position from refs so its identity stays stable.
   */
  const goTo = useCallback(
    (target: number) => {
      const current = activeRef.current;
      if (target === current) return;

      // Retire a pending video replaced mid-crossfade. Its cleanup timer
      // would be cancelled, leaving it playing unseen.
      const pending = outgoingRef.current;
      if (pending !== null && pending !== target) {
        const pendingItem = HERO_MEDIA[pending];
        const pendingVideo = videoRefs[pending]?.current;
        if (pendingItem?.kind === "video" && pendingVideo) {
          pendingVideo.pause();
          seek(pendingVideo, startTimeOf(pendingItem));
        }
      }

      const nextItem = HERO_MEDIA[target];

      // Start an incoming video under the outgoing layer so it is already
      // moving while the one-second opacity transition reveals it.
      if (nextItem?.kind === "video") {
        const nextVideo = videoRefs[target]?.current;
        if (nextVideo) {
          if (nextVideo.readyState >= HTMLMediaElement.HAVE_METADATA) {
            seek(nextVideo, startTimeOf(nextItem));
          }
          play(nextVideo);
        }
      }

      setOutgoing(current);
      setActive(target);
    },
    [videoRefs],
  );

  const advance = useCallback(() => {
    goTo(nextHeroMediaIndex(activeRef.current));
  }, [goTo]);

  // Videos own their timing. Hand over when the active clip enters its final
  // second, leaving it running until the crossfade completes.
  useEffect(() => {
    if (!enabled) return;

    const item = HERO_MEDIA[active];
    if (!item || item.kind !== "video") return;

    const current = videoRefs[active]?.current;
    if (!current) return;

    let advanced = false;
    const advanceOnce = () => {
      if (advanced) return;
      advanced = true;
      advance();
    };

    // The stream starts at zero. Seeking only sticks after the MediaSource has
    // attached, which is what `loadedmetadata` marks on the first load.
    const openAt = startTimeOf(item);
    const seekToStart = () => {
      seek(current, openAt);
    };

    current.addEventListener("loadedmetadata", seekToStart);
    if (current.readyState >= HTMLMediaElement.HAVE_METADATA) seekToStart();

    const onTimeUpdate = () => {
      const { duration, currentTime } = current;
      if (!Number.isFinite(duration) || duration === 0) return;
      if (duration - currentTime > FADE_SECONDS) return;
      advanceOnce();
    };

    current.addEventListener("timeupdate", onTimeUpdate);
    current.addEventListener("ended", advanceOnce);
    play(current);

    return () => {
      current.removeEventListener("loadedmetadata", seekToStart);
      current.removeEventListener("timeupdate", onTimeUpdate);
      current.removeEventListener("ended", advanceOnce);
    };
  }, [enabled, active, advance, videoRefs]);

  // A still's ten-second slot includes the final one-second crossfade.
  // Pausing this timer offscreen keeps visitors from returning mid-sequence.
  useEffect(() => {
    if (!enabled || !isVisible) return;

    const item = HERO_MEDIA[active];
    if (!item || item.kind !== "image") return;

    const timer = setTimeout(advance, STILL_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [enabled, active, advance, isVisible]);

  // Once the opacity transition is over, stop and rewind an outgoing video.
  // Clearing `outgoing` also resets a now-hidden still's zoom instantly.
  useEffect(() => {
    if (!enabled || outgoing === null) return;

    const timer = setTimeout(() => {
      const item = HERO_MEDIA[outgoing];
      const previousVideo = videoRefs[outgoing]?.current;

      if (item?.kind === "video" && previousVideo) {
        previousVideo.pause();
        seek(previousVideo, startTimeOf(item));
      }

      setOutgoing((index) => (index === outgoing ? null : index));
    }, FADE_MS);

    return () => clearTimeout(timer);
  }, [enabled, outgoing, videoRefs]);

  // Nothing upstream pauses media on scroll, so the hero owns its viewport
  // observer and stops both playback and still timers while it is offscreen.
  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        setIsVisible(visible);

        if (!visible) {
          videoRefs.forEach((ref) => ref?.current?.pause());
          return;
        }

        const activeIndex = activeRef.current;
        if (HERO_MEDIA[activeIndex]?.kind === "video") {
          play(videoRefs[activeIndex]?.current ?? null);
        }
      },
      { threshold: 0 },
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      videoRefs.forEach((ref) => ref?.current?.pause());
    };
  }, [enabled, videoRefs]);

  return {
    active,
    containerRef,
    isVisible,
    outgoing,
    videoRefs,
  };
}

/** The media layer sits behind the hero's text and scrim. */
function MediaLayer({
  children,
  containerRef,
}: {
  children: ReactNode;
  containerRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={containerRef} className="absolute inset-0 -z-20">
      {children}
    </div>
  );
}

function StillFallback() {
  return (
    <Image
      src={HERO_FALLBACK_IMAGE}
      alt=""
      aria-hidden
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  );
}

function StaticMedia({ item }: { item: HeroMediaItem }) {
  if (item.kind === "image") {
    return (
      <Image
        src={item.src}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className={cn("object-cover", item.position)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={buildPosterUrl(item)}
      alt=""
      aria-hidden
      className="size-full object-cover"
    />
  );
}

function HeroMedia() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const firstItem = HERO_MEDIA[0];
  const enabled = Boolean(firstItem) && !prefersReducedMotion;
  const { active, containerRef, isVisible, outgoing, videoRefs } =
    useHeroPlayback(enabled);

  if (!firstItem)
    return (
      <MediaLayer>
        <StillFallback />
      </MediaLayer>
    );

  // Nothing advances under reduced motion, so there is nothing to navigate.
  if (prefersReducedMotion)
    return (
      <MediaLayer>
        <StaticMedia item={firstItem} />
      </MediaLayer>
    );

  return (
      <MediaLayer containerRef={containerRef}>
        {HERO_MEDIA.map((item, index) => {
          const isActive = index === active;
          const isMovingStill =
            item.kind === "image" &&
            isVisible &&
            (isActive || index === outgoing);
          const layerClassName = cn(
            "absolute inset-0 transition-opacity duration-1000 ease-linear",
            isActive ? "opacity-100" : "opacity-0",
          );

          if (item.kind === "image") {
            return (
              <div
                key={item.src}
                data-hero-media="image"
                data-active={isActive || undefined}
                aria-hidden
                className={layerClassName}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="100vw"
                  className={cn(
                    "object-cover",
                    item.position,
                    // The drift runs the full ten-second slot, so its speed is
                    // the distance travelled. Raising the target to 1.14
                    // makes the push more noticeable while keeping
                    // the movement alive for the whole slot instead of
                    // arriving early and freezing.
                    isMovingStill
                      ? "scale-[1.14] transition-transform duration-[10000ms] ease-linear"
                      : "scale-100 transition-none",
                  )}
                />
              </div>
            );
          }

          const videoRef = videoRefs[index];
          if (!videoRef) return null;

          return (
            <MuxBackgroundVideo
              key={item.id}
              src={buildStreamUrl(item)}
              videoRef={videoRef}
              maxResolution="720p"
              preload="auto"
              loop={false}
              autoPlay={index === 0}
              className={layerClassName}
            >
              {/* A direct image child paints before video can play, avoiding a
                blank frame while Mux attaches its MediaSource. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={buildPosterUrl(item)} alt="" aria-hidden />
            </MuxBackgroundVideo>
          );
        })}
      </MediaLayer>
  );
}

export { HeroMedia };
