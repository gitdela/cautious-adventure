"use client";

import Image from "next/image";
import {
  createRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@workspace/ui/lib/utils";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

import { MuxBackgroundVideo } from "./mux-background-video";

/**
 * Silent, controls-free Mux clips for the homepage hero, crossfading into one
 * another and cycling forever.
 *
 * Each asset must be uploaded with playback policy `public` and video quality
 * `basic` (or `premium`) — the `plus` tier serves MPEG-TS segments that the mini
 * HLS engine cannot transmux, and the video silently fails.
 *
 * `startAt` skips the opening of a clip, in seconds. It is applied by seeking
 * the element — deliberately *not* through Mux's `asset_start_time` param.
 * Mux's instant clipping drops the leading segments but leaves the rest on the
 * asset's original timeline, while the mini HLS engine derives both the
 * duration and `appendWindowEnd` by summing `EXTINF` from zero. So a clipped
 * stream buffers a range that starts after `currentTime` and gets its tail
 * truncated on append, and the video never plays at all. Seeking also lands on
 * the exact second instead of the nearest segment boundary.
 */
type HeroClip = { id: string; startAt?: number };

const HERO_CLIPS: HeroClip[] = [
  { id: "cyNPy702EdGZOe00mv9Pc1gGVORzxiTF2uYTx1tcCACWo", startAt: 0 },
  { id: "Tjn8I00c8F8xBtSaAgxXKAkThBV8nk008MIbTWsskfyr8" },
];

/**
 * Crossfade length. The outgoing clip starts fading this far from its end, so
 * the incoming one is already running underneath by the time it is visible.
 *
 * Tailwind cannot build a class name from a variable — `duration-1000` below
 * has to be changed in step with this.
 */
const FADE_SECONDS = 1;

/** Shown until a playback ID exists, and if the stream never starts. */
const HERO_FALLBACK_IMAGE = "/images/home/fuel-delivery.webp";
const HERO_FALLBACK_ALT = "PETROSOL fuel delivery tanker fleet";

function buildStreamUrl({ id }: HeroClip) {
  return `https://stream.mux.com/${id}.m3u8`;
}

/**
 * The poster has to track `startAt` or it shows a frame the clip never opens
 * on, and you get a visible jump when playback takes over.
 */
function buildPosterUrl({ id, startAt }: HeroClip) {
  const url = new URL(`https://image.mux.com/${id}/thumbnail.webp`);
  url.searchParams.set("time", String(startAt ?? 0));
  return url.toString();
}

/** Autoplay is refused in plenty of ordinary cases (iOS low-power mode, say).
 *  The poster staying visible is the intended fallback, not an error. */
function play(video: HTMLVideoElement | null) {
  void video?.play().catch(() => { });
}

/** Where a clip opens, and where it returns to on every later cycle. */
function startTimeOf(index: number) {
  return HERO_CLIPS[index]?.startAt ?? 0;
}

function useHeroPlayback(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useMemo(
    () => HERO_CLIPS.map(() => createRef<HTMLVideoElement>()),
    [],
  );
  const [active, setActive] = useState(0);

  // Read by the observer without making it a dependency, so going off and back
  // on screen never rebuilds the observer mid-cycle.
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Hand over to the next clip once the current one is within a fade of its
  // end. The incoming clip plays underneath while the outgoing one fades out.
  useEffect(() => {
    if (!enabled) return;

    const nextIndex = (active + 1) % videoRefs.length;
    const current = videoRefs[active]?.current;
    const next = videoRefs[nextIndex]?.current;
    if (!current || !next) return;

    let advanced = false;

    const advance = () => {
      if (advanced) return;
      advanced = true;
      next.currentTime = startTimeOf(nextIndex);
      play(next);
      setActive((index) => (index + 1) % HERO_CLIPS.length);
    };

    // The stream itself always starts at zero, so a clip with `startAt` opens
    // in the wrong place until it is seeked — and the element only holds a seek
    // once the MediaSource has attached, which is what `loadedmetadata` marks.
    // This only ever fires on the very first load: on later cycles `advance`
    // has already placed the clip.
    const openAt = startTimeOf(active);
    const seekToStart = () => {
      current.currentTime = openAt;
    };

    current.addEventListener("loadedmetadata", seekToStart);

    const onTimeUpdate = () => {
      const { duration, currentTime } = current;
      // `duration` is NaN until metadata lands.
      if (!Number.isFinite(duration) || duration === 0) return;
      if (duration - currentTime > FADE_SECONDS) return;
      advance();
    };

    // Safety net: `timeupdate` fires ~4x/second and can skip the window on a
    // very short clip or a stalled tab.
    current.addEventListener("timeupdate", onTimeUpdate);
    current.addEventListener("ended", advance);
    play(current);

    return () => {
      current.removeEventListener("loadedmetadata", seekToStart);
      current.removeEventListener("timeupdate", onTimeUpdate);
      current.removeEventListener("ended", advance);
    };
  }, [enabled, active, videoRefs]);

  // Stop the outgoing clip once it has finished fading out — leaving it running
  // would keep pulling segments for a layer nobody can see.
  useEffect(() => {
    if (!enabled) return;

    const previousIndex = (active - 1 + videoRefs.length) % videoRefs.length;
    const previous = videoRefs[previousIndex]?.current;
    if (!previous) return;

    const timer = setTimeout(() => {
      previous.pause();
      previous.currentTime = startTimeOf(previousIndex);
    }, FADE_SECONDS * 1000);

    return () => clearTimeout(timer);
  }, [enabled, active, videoRefs]);

  // Nothing upstream pauses on scroll, so both streams would otherwise keep
  // fetching for the life of the tab.
  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          videoRefs.forEach((ref) => ref.current?.pause());
          return;
        }
        play(videoRefs[activeRef.current]?.current ?? null);
      },
      { threshold: 0 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [enabled, videoRefs]);

  return { containerRef, videoRefs, active };
}

function StillFallback() {
  return (
    <Image
      src={HERO_FALLBACK_IMAGE}
      alt={HERO_FALLBACK_ALT}
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  );
}

function HeroVideo() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const firstClip = HERO_CLIPS[0];
  const enabled = Boolean(firstClip) && !prefersReducedMotion;
  const { containerRef, videoRefs, active } = useHeroPlayback(enabled);

  if (!firstClip) return <StillFallback />;

  if (prefersReducedMotion) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={buildPosterUrl(firstClip)}
        alt=""
        aria-hidden
        className="size-full object-cover"
      />
    );
  }

  return (
    // The observer needs its own element to watch, and the layers fill it.
    <div ref={containerRef} className="relative size-full">
      {HERO_CLIPS.map((clip, index) => (
        <MuxBackgroundVideo
          key={clip.id}
          src={buildStreamUrl(clip)}
          videoRef={videoRefs[index]}
          maxResolution="720p"
          preload="auto"
          // Sequencing is owned here; a clip that looped itself would never end.
          loop={false}
          autoPlay={index === 0}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-linear",
            index === active ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Direct <img> child is the poster: it paints first and the video
              overlays it, so there is no flash of empty space. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={buildPosterUrl(clip)} alt="" />
        </MuxBackgroundVideo>
      ))}
    </div>
  );
}

export { HeroVideo };
