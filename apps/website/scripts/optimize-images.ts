/**
 * Normalises every image under `public/images` to a capped-width WebP.
 *
 * Static art is shipped straight out of `public/`, so whatever lands there is
 * what the repo carries and the host serves. Camera-resolution exports (5000px,
 * multiple MB) are pure waste: nothing on the site renders wider than a
 * full-bleed banner, every usage goes through `next/image` with a `sizes` cap.
 *
 * PNG/JPG sources are replaced by a sibling `.webp` and deleted. Existing
 * `.webp` files are re-encoded in place — they are the heaviest offenders.
 * `public/brand/**` is never touched.
 *
 *   bun run images:optimize [--dry-run] [--quality=82] [--max-width=2000]
 */
import { readdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const IMAGES_DIR = fileURLToPath(new URL("../public/images", import.meta.url));
const CONVERTIBLE = new Set([".png", ".jpg", ".jpeg", ".webp"]);
/** Minimum saving before an existing WebP is worth re-encoding. See `convert`. */
const REENCODE_THRESHOLD = 0.2;

/**
 * Art that must keep a resolution above the global `--max-width` cap, listed by
 * path relative to `public/images`.
 *
 * These render full-bleed at `sizes="100vw"`, so a 2000px source is upscaled by
 * the browser on any HiDPI display and reads as soft. Without this list a
 * routine `images:optimize` run would silently shrink them back and the blur
 * would reappear with no obvious cause.
 */
const KEEP_FULL_RES = new Set([
  "about/team-culture.webp",
  "about/fleet-team.webp",
]);

const flag = (name: string, fallback: number) => {
  const raw = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  const value = raw ? Number(raw.split("=")[1]) : Number.NaN;
  return Number.isFinite(value) ? value : fallback;
};

const dryRun = process.argv.includes("--dry-run");
const quality = flag("quality", 82);
const maxWidth = flag("max-width", 2000);

async function collect(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return collect(full);
      return CONVERTIBLE.has(path.extname(entry.name).toLowerCase())
        ? [full]
        : [];
    }),
  );
  return files.flat().sort();
}

const kb = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)}M`
    : `${Math.round(bytes / 1024)}K`;

type Result = { label: string; before: number; after: number };

async function convert(file: string): Promise<Result> {
  const rel = path.relative(IMAGES_DIR, file);
  const before = (await stat(file)).size;
  const isWebp = path.extname(file).toLowerCase() === ".webp";
  const target = file.replace(/\.(png|jpe?g|webp)$/i, ".webp");

  if (KEEP_FULL_RES.has(rel)) {
    return { label: `${rel} (kept — full res)`, before, after: before };
  }

  // `.rotate()` with no argument bakes in EXIF orientation before sharp strips
  // metadata — without it, portrait phone shots come out sideways.
  const encoded = await sharp(file)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toBuffer();

  // Every re-encode of a lossy WebP comes out a few percent smaller, so "did it
  // shrink?" would re-encode forever and quality would drift down generation by
  // generation. Only accept a pass that pays for that loss. An untouched source
  // clears this by a mile (90%+); a file this script already processed lands
  // around 5-10% and is left alone, which is what makes re-runs safe.
  if (isWebp && 1 - encoded.byteLength / before < REENCODE_THRESHOLD) {
    return { label: `${rel} (kept)`, before, after: before };
  }

  if (!dryRun) {
    if (isWebp) {
      // sharp cannot read and write the same path in one pass.
      const tmp = `${target}.tmp`;
      await writeFile(tmp, encoded);
      await rename(tmp, target);
    } else {
      await writeFile(target, encoded);
      await unlink(file);
    }
  }

  const label = isWebp ? rel : `${rel} → ${path.basename(target)}`;
  return { label, before, after: encoded.byteLength };
}

const files = await collect(IMAGES_DIR);
if (files.length === 0) {
  console.log(`No images found under ${IMAGES_DIR}`);
  process.exit(0);
}

console.log(
  `${dryRun ? "[dry run] " : ""}${files.length} images · max ${maxWidth}px · quality ${quality}\n`,
);

const results: Result[] = [];
for (const file of files) {
  const result = await convert(file);
  results.push(result);
  const delta = result.after - result.before;
  const pct = result.before ? Math.round((delta / result.before) * 100) : 0;
  console.log(
    `  ${result.label.padEnd(48)} ${kb(result.before).padStart(6)} → ${kb(result.after).padStart(6)}  ${pct > 0 ? "+" : ""}${pct}%`,
  );
}

const before = results.reduce((sum, r) => sum + r.before, 0);
const after = results.reduce((sum, r) => sum + r.after, 0);
console.log(
  `\n  total ${kb(before)} → ${kb(after)} (${Math.round((1 - after / before) * 100)}% smaller)`,
);
if (dryRun) console.log("  nothing written — drop --dry-run to apply");
