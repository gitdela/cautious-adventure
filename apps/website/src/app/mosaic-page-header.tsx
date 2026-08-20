import type { ReactNode } from "react";

import { PageHeader } from "@workspace/ui/components/page-header";

/**
 * The inner-page header band: deep navy with a cluster of green tiles hugging
 * the right edge. Every page with a header uses this — the home page has no
 * header band and keeps its video hero.
 *
 * Defined once here rather than repeated per page so the treatment cannot
 * drift, and so the asset path lives in the app rather than in `packages/ui`,
 * which stays content-agnostic.
 */

/**
 * `scrim={false}` is load-bearing: `PageHeader`'s default wash
 * (`bg-navy-900/72`) exists to keep white text legible over a photograph, and
 * it would visibly mute the greens. The mosaic supplies its own contrast — the
 * left ~60% is plain navy precisely so the title and breadcrumb land on a clean
 * field — so the wash is not needed.
 *
 * `bg-right` pins the tile cluster to the right edge at every width; `bg-cover`
 * keeps it full-bleed with no seams or letterboxing. `bg-navy-850` matches the
 * SVG's own base field, so there is no flash of a different colour while the
 * asset loads.
 */
function MosaicPageHeader({
  title,
  breadcrumbs,
  titleAs,
}: {
  title: string;
  breadcrumbs: ReactNode;
  titleAs?: "h1" | "p";
}) {
  return (
    <PageHeader
      title={title}
      breadcrumbs={breadcrumbs}
      titleAs={titleAs}
      scrim={false}
      background={
        <div className="size-full bg-navy-850 bg-[url('/images/header-mosaic.svg')] bg-cover bg-right bg-no-repeat" />
      }
    />
  );
}

export { MosaicPageHeader };
