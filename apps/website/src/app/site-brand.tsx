import Image from "next/image";
import Link from "next/link";

import { cn } from "@workspace/ui/lib/utils";

/**
 * `desktop` is free to grow to ~95px: the two-tier nav column, not the logo,
 * sets the 127px header height that `HeroSection` pads for. `mobile` is not —
 * there the logo *is* the tallest thing in the bar, so any change to it moves
 * the 78px the hero hardcodes and opens a gap above the video.
 */
const sizeClasses = {
  mobile: "h-[54px]",
  desktop: "h-[72px]",
  footer: "h-[clamp(44px,5vw,56px)]",
};

/**
 * `inverse` is the footer's white-badge lockup (opaque JPG, so it needs the
 * rounded mask). `overlay` is the transparent PNG for floating over media —
 * white wordmark, no mask.
 */
const toneSources = {
  default: "/brand/logo-lockup.png",
  inverse: "/brand/logo-lockup-white.jpg",
  overlay: "/brand/logo-lockup-inverse.png",
};

function SiteBrand({
  tone = "default",
  size = "desktop",
  className,
}: {
  tone?: keyof typeof toneSources;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="PETROSOL home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={toneSources[tone]}
        alt="PETROSOL — energizing dreams!"
        width={3862}
        height={1360}
        priority={size !== "footer"}
        className={cn(
          "w-auto object-contain",
          sizeClasses[size],
          tone === "inverse" && "rounded-full",
        )}
      />
    </Link>
  );
}

export { SiteBrand };
