import { RiImageLine } from "@remixicon/react";

import { cn } from "@workspace/ui/lib/utils";

function ImagePlaceholder({
  label = "Photo",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "grid size-full place-items-center bg-ink-100 p-5 text-center text-muted-foreground",
        className,
      )}
    >
      <span className="flex max-w-[28ch] flex-col items-center gap-2 text-[13px] font-medium">
        <RiImageLine className="size-7 opacity-55" aria-hidden="true" />
        {label}
      </span>
    </div>
  );
}

export { ImagePlaceholder };
