import { RiPlayFill } from "@remixicon/react";

import { cn } from "@workspace/ui/lib/utils";

/**
 * DS PlayButton — a white disc with a play glyph, sat over video posters.
 *
 * Rendered as a `<span>` rather than a `<button>` by default: on the events
 * page the whole poster tile is the control, and nesting a button inside a
 * button is invalid. Pass `asButton` where it genuinely is the control.
 *
 * The glyph is 30% of the disc, nudged 2px right so the triangle looks
 * optically centred — its visual mass sits left of its bounding box.
 */
function PlayButton({
  size = 76,
  label = "Play video",
  asButton = false,
  onClick,
  className,
}: {
  size?: number;
  label?: string;
  asButton?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Component = asButton ? "button" : "span";

  return (
    <Component
      {...(asButton
        ? { type: "button" as const, "aria-label": label, onClick }
        : { "aria-hidden": true })}
      style={{ width: size, height: size }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-white shadow-raised transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(.16,1,.3,1)]",
        asButton &&
          "cursor-pointer hover:scale-[1.06] hover:shadow-float focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
        // The poster tile owns the hover, so the disc reacts to it from here.
        !asButton && "group-hover/video:scale-[1.06] group-hover/video:shadow-float",
        className,
      )}
    >
      <RiPlayFill
        aria-hidden="true"
        className="ml-0.5 text-navy-900"
        style={{ width: Math.round(size * 0.3), height: Math.round(size * 0.3) }}
      />
    </Component>
  );
}

export { PlayButton };
