import type { ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

type StationIconName =
  | "pump"
  | "fuel-drop"
  | "jerrycan"
  | "tanker"
  | "station-pin"
  | "shop"
  | "fullcare";

const paths: Record<StationIconName, ReactNode> = {
  pump: (
    <>
      <path d="M3 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15" />
      <path d="M2 21h12" />
      <rect x="5.5" y="7" width="5" height="4" rx="1" />
      <path d="M13 11h1.5a2 2 0 0 1 2 2v3.5a1.5 1.5 0 0 0 3 0V10l-2.5-2.5" />
    </>
  ),
  "fuel-drop": (
    <>
      <path d="M12 3s6 6.4 6 10.2A6 6 0 0 1 6 13.2C6 9.4 12 3 12 3z" />
      <path d="M9.5 13.5A2.5 2.5 0 0 0 12 16" />
    </>
  ),
  jerrycan: (
    <>
      <rect x="4" y="7" width="16" height="14" rx="2" />
      <path d="M8 7V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V7M8 11l8 6M16 11l-8 6" />
    </>
  ),
  tanker: (
    <>
      <rect x="1.5" y="7" width="12.5" height="8" rx="3.5" />
      <path d="M14 9.5h3.5l3 3V15h-6.5M8 17.5h7" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  "station-pin": (
    <>
      <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z" />
      <path d="M12 6.5s2.6 2.8 2.6 4.5a2.6 2.6 0 0 1-5.2 0c0-1.7 2.6-4.5 2.6-4.5z" />
    </>
  ),
  shop: (
    <>
      <path d="M4 4h16l1.2 3.4a2.4 2.4 0 0 1-4.7.6 2.4 2.4 0 0 1-4.75 0A2.4 2.4 0 0 1 7 8a2.4 2.4 0 0 1-4.7-.6L4 4z" />
      <path d="M4 9v11h16V9M8 20v-6h8v6" />
    </>
  ),
  fullcare: (
    <>
      <path d="M12 3l7 3v5.5c0 4.3-2.9 7.7-7 9.5-4.1-1.8-7-5.2-7-9.5V6l7-3z" />
      <path d="M9 12l2.2 2.2 4.3-4.2" />
    </>
  ),
};

function StationIcon({
  name,
  className,
}: {
  name: StationIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
    >
      {paths[name]}
    </svg>
  );
}

function StationChip({
  name,
  className,
}: {
  name: StationIconName;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-grid size-14 shrink-0 place-items-center rounded-full bg-brand text-white",
        className,
      )}
    >
      <StationIcon name={name} />
    </span>
  );
}

export { StationChip, StationIcon, type StationIconName };
