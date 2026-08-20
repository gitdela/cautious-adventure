import { cn } from "@workspace/ui/lib/utils";

/**
 * Bespoke hamburger/close glyph matching the StationIcon grid (24 viewBox,
 * 1.8 stroke). `open` morphs the bars into an X; rendered statically it just
 * shows the corresponding state.
 */

const lineClassName =
  "[transform-box:fill-box] origin-center transition-[transform,opacity] duration-(--motion-fast) ease-[cubic-bezier(0.4,0,0.2,1)]";

function MenuGlyph({
  open = false,
  className,
}: {
  open?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("block size-[26px] shrink-0", className)}
    >
      <line
        x1="4"
        y1="6.5"
        x2="20"
        y2="6.5"
        className={cn(
          lineClassName,
          open && "[transform:translateY(5.5px)_rotate(45deg)]",
        )}
      />
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        className={cn(lineClassName, open && "opacity-0 [transform:scaleX(0.4)]")}
      />
      <line
        x1="4"
        y1="17.5"
        x2="20"
        y2="17.5"
        className={cn(
          lineClassName,
          open && "[transform:translateY(-5.5px)_rotate(-45deg)]",
        )}
      />
    </svg>
  );
}

export { MenuGlyph };
