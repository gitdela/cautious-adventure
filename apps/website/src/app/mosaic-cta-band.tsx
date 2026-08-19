import type { ReactNode } from "react";

/**
 * The closing call-to-action band that sits above the footer on most pages.
 *
 * Background is the page-header banner's flat variant — same navy field and
 * green tile cluster, without the dot texture. It replaced a set of stock
 * industrial photographs that were not PETROSOL's to use; keeping the treatment
 * here means the next change to it is one edit, not nine.
 *
 * No scrim: the mosaic already reads dark enough for white text, and a wash
 * would mute the greens.
 *
 * Callers supply the heading and actions as children — every band is a
 * `SectionHeading` plus a row of buttons, but the copy and links are the whole
 * point of each one, so they are composed rather than configured.
 */
function MosaicCtaBand({ children }: { children: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden py-[var(--section-y)]">
      <div className="absolute inset-0 -z-20 bg-navy-850 bg-[url('/images/header-mosaic-plain.svg')] bg-cover bg-right bg-no-repeat" />
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-8 px-[var(--container-pad)]">
        {children}
      </div>
    </section>
  );
}

export { MosaicCtaBand };
