type HeroVideoItem = {
  kind: "video";
  id: string;
  startAt?: number;
};

type HeroImageItem = {
  kind: "image";
  src: string;
  /**
   * Tailwind `object-position` for the crop, e.g. `object-[center_30%]`.
   * Defaults to centred. Worth setting on any portrait source: the hero band is
   * far wider than it is tall, so a centred crop on a tall frame takes a slice
   * out of the middle and loses whatever is near the top.
   */
  position?: string;
};

type HeroMediaItem = HeroVideoItem | HeroImageItem;

/**
 * The homepage's silent, controls-free media sequence. Videos play to their
 * natural end; each still receives one ten-second slot before the sequence
 * wraps around.
 *
 * Mux assets must use playback policy `public` and video quality `basic` (or
 * `premium`). `startAt` is applied by seeking the element rather than through
 * Mux's instant-clipping parameter so the mini HLS timeline stays intact.
 */
const HERO_MEDIA: readonly HeroMediaItem[] = [
  {
    kind: "image",
    src: "/images/home/plc-team.webp",
  },
  // Portrait source in a wide band: hold the crop high so the faces and the
  // frame's wording stay in shot rather than being sliced out of the middle.
  {
    kind: "image",
    src: "/images/home/plc-frame.webp",
    position: "object-[center_30%]",
  },
  {
    kind: "video",
    id: "cyNPy702EdGZOe00mv9Pc1gGVORzxiTF2uYTx1tcCACWo",
    startAt: 0,
  },
  {
    kind: "video",
    id: "Tjn8I00c8F8xBtSaAgxXKAkThBV8nk008MIbTWsskfyr8",
  },
  {
    kind: "image",
    src: "/images/lubricants/lube-bay-technician.webp",
  },
  // Scenes only. A white-background packshot sat here once and fought the
  // scrim: full-bleed behind light hero copy it blew out the frame.
  {
    kind: "image",
    src: "/images/lubricants/lube-bay-oil-pour.webp",
  },
];

const FADE_MS = 1_000;
const FADE_SECONDS = FADE_MS / 1_000;
const STILL_SLOT_MS = 10_000;
const STILL_ADVANCE_MS = STILL_SLOT_MS - FADE_MS;

function nextHeroMediaIndex(active: number) {
  return (active + 1) % HERO_MEDIA.length;
}

/** Wraps backwards, so the controls loop in both directions. */
function previousHeroMediaIndex(active: number) {
  return (active - 1 + HERO_MEDIA.length) % HERO_MEDIA.length;
}

export {
  FADE_MS,
  FADE_SECONDS,
  HERO_MEDIA,
  nextHeroMediaIndex,
  previousHeroMediaIndex,
  STILL_ADVANCE_MS,
  STILL_SLOT_MS,
  type HeroMediaItem,
  type HeroVideoItem,
};
