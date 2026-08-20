import { readFileSync } from "node:fs";

import { ImageResponse } from "next/og";

/**
 * Shared Open Graph card for the blog. Renders at exactly 1200×630 (1.91:1,
 * the OG standard) with every text/key element inside the safe area —
 * 72px left/right, 56px top, 48px bottom — because the image is shown
 * uncropped at full size.
 *
 * Fonts and the logo are colocated files read at module scope so Next's file
 * tracing bundles them; the brand face (Verdana) is a system font that can't
 * ship to the renderer, so Noto Sans stands in.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const SAFE = { top: 56, bottom: 48, x: 72 };

// Brand palette (globals.css) — satori sees no CSS variables, so hex literals.
const NAVY_900 = "#041a2d";
const NAVY_700 = "#0a3050";
const ORANGE_500 = "#f58326";
const LEAF_500 = "#6bb445";

const notoSans = readFileSync(new URL("./fonts/noto-sans-400.ttf", import.meta.url));
const notoSansBold = readFileSync(new URL("./fonts/noto-sans-700.ttf", import.meta.url));
const logoDataUrl = `data:image/png;base64,${readFileSync(
  new URL("./logo.png", import.meta.url),
).toString("base64")}`;

export type BlogOgProps = {
  title: string;
  eyebrow?: string;
  footerLeft?: string;
};

function titleSize(title: string): number {
  if (title.length <= 55) return 64;
  if (title.length <= 90) return 54;
  return 46;
}

export function renderBlogOg({
  title,
  eyebrow = "Blog",
  footerLeft = "",
}: BlogOgProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: `${SAFE.top}px ${SAFE.x}px ${SAFE.bottom}px`,
          backgroundColor: NAVY_900,
          backgroundImage: `radial-gradient(circle at 82% 18%, ${NAVY_700} 0%, ${NAVY_900} 58%)`,
          color: "#ffffff",
          fontFamily: "Noto Sans",
        }}
      >
        {/* Header — brand lockup + section eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUrl} width={64} height={64} alt="" />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            <span>PETROSOL</span>
            <span style={{ color: ORANGE_500, fontSize: 24, letterSpacing: 4 }}>
              {eyebrow.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Title block with the brand's leaf swash */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: titleSize(title),
              fontWeight: 700,
              lineHeight: 1.16,
              letterSpacing: -1,
              maxWidth: 1000,
              lineClamp: 3,
              display: "block",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              width: 120,
              height: 10,
              borderRadius: 5,
              backgroundColor: LEAF_500,
            }}
          />
        </div>

        {/* Footer — meta left, site right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          <span>{footerLeft}</span>
          <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
            petrosol.com.gh
          </span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Noto Sans", data: notoSans, weight: 400, style: "normal" },
        { name: "Noto Sans", data: notoSansBold, weight: 700, style: "normal" },
      ],
    },
  );
}
