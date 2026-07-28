import type { ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

function PageHeader({
  title,
  breadcrumbs,
  background,
  className,
  titleAs: TitleTag = "h1",
}: {
  title: string;
  breadcrumbs: ReactNode;
  background?: ReactNode;
  className?: string;
  /** Demote the band title when the page's real h1 lives in the content (e.g. article pages). */
  titleAs?: "h1" | "p";
}) {
  return (
    <section
      aria-labelledby="page-title"
      className={cn(
        "relative isolate overflow-hidden bg-surface-inverse",
        className,
      )}
    >
      {background ? (
        <div className="absolute inset-0 -z-20 [&_img]:size-full [&_img]:object-cover">
          {background}
        </div>
      ) : null}
      <div className="absolute inset-0 -z-10 bg-navy-900/72" />
      <div className="ps-container flex min-h-[180px] flex-col justify-center gap-4 py-12">
        {breadcrumbs}
        <TitleTag
          id="page-title"
          className="font-display text-[length:var(--size-display-sm)] leading-[1.18] font-bold tracking-[-0.02em] text-white"
        >
          {title}
        </TitleTag>
      </div>
    </section>
  );
}

export { PageHeader };
