import * as React from "react";
import { RiArrowDownSLine } from "@remixicon/react";

import { cn } from "@workspace/ui/lib/utils";

/**
 * PETROSOL site chrome (DS NavBar + Footer, per the design handoff's
 * SiteChrome.jsx). Framework-agnostic: apps own routing via `renderLink`, and
 * inject brand artwork / CTA / socials as slots.
 *
 * Header is two-tier: logo left spanning both tiers; a hairlined utility strip
 * on top carrying the CTA and socials; nav links below. Items with `children` open a white dropdown
 * panel — CSS-only (hover / focus-within), so the desktop header stays a
 * server component. The mobile menu (below 960px) is the separate client
 * component in `site-nav-mobile.tsx`.
 */
export type SiteLinkItem = {
  label: string;
  href: string;
};

export type SiteNavItem =
  | SiteLinkItem
  | { label: string; children: SiteLinkItem[] };

export type SiteSocialItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type SiteFooterGroup = {
  title: string;
  items: SiteLinkItem[];
};

export type RenderSiteLink = (item: SiteLinkItem, className: string) => React.ReactNode;

function SocialStrip({
  socials,
  className,
}: {
  socials: SiteSocialItem[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-end gap-2.5", className)}>
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className={cn(
            "inline-grid size-8 place-items-center rounded-full border border-border text-navy-900 transition-colors hover:border-brand hover:bg-brand hover:text-white [&_svg]:size-4",
            // `border-border` is near-black at 8% — invisible over media.
            "group-data-[tone=overlay]/tone:border-white/16 group-data-[tone=overlay]/tone:text-white/55",
          )}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}

type SiteHeaderProps = {
  brand: React.ReactNode;
  items: SiteNavItem[];
  renderLink: RenderSiteLink;
  /** Flexible app-owned content before the desktop utility actions. */
  utility?: React.ReactNode;
  socials?: SiteSocialItem[];
  action?: React.ReactNode;
  /** App-owned interactive desktop navigation, when CSS-only behavior is insufficient. */
  desktopNav?: React.ReactNode;
  /** Mobile bar content (brand + menu trigger), shown below 960px. */
  mobileNav?: React.ReactNode;
  className?: string;
};

function SiteHeader({
  brand,
  items,
  renderLink,
  utility,
  socials = [],
  action,
  desktopNav,
  mobileNav,
  className,
}: SiteHeaderProps) {
  // `tone=overlay` (set by an ancestor, e.g. on a full-bleed video hero) lifts
  // the chrome out of flow and flips it to white-on-media. The dropdown panel
  // stays a light card in both tones, so only its trigger changes.
  const topLinkClassName =
    "inline-flex items-center gap-1 whitespace-nowrap font-display text-[clamp(13px,1.15vw,15px)] font-bold tracking-[-0.01em] text-navy-900 transition-colors hover:text-brand group-data-[tone=overlay]/tone:text-white group-data-[tone=overlay]/tone:hover:text-brand";
  const dropLinkClassName =
    "block rounded-[10px] px-3.5 py-[11px] text-sm font-bold whitespace-nowrap text-navy-900 transition-colors hover:bg-card hover:text-brand";

  return (
    <div
      className={cn(
        "ps-blueprint relative z-40 bg-muted",
        // Overlay lifts the chrome out of flow entirely so it reserves no
        // height. The spec's -118px bottom margin assumed a 118px header; this
        // one measures 127px, and the 9px difference showed as a white strip
        // above the hero. Going absolute is immune to that drift.
        "group-data-[tone=overlay]/tone:absolute group-data-[tone=overlay]/tone:inset-x-0 group-data-[tone=overlay]/tone:top-[var(--site-header-overlay-top,0px)] group-data-[tone=overlay]/tone:bg-transparent group-data-[tone=overlay]/tone:[background-image:none]",
        className,
      )}
    >
      {/* Desktop — two tiers, hidden below 960px */}
      <header className="mx-auto hidden w-full max-w-[1280px] items-center gap-12 px-[var(--container-pad)] py-4 min-[961px]:flex">
        <div className="shrink-0">{brand}</div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Tier 1 — utility strip: the CTA sits beside the socials rather
              than on the nav tier. With five nav items the button was the
              straw that pushed "Contact Us" onto a second line; up here it
              costs the nav nothing and the strip had spare width to give. */}
          {utility || action || socials.length > 0 ? (
            <div className="flex items-center justify-end gap-5 border-b border-border pb-3 group-data-[tone=overlay]/tone:border-white/16">
              {utility}
              {socials.length > 0 ? <SocialStrip socials={socials} /> : null}
              {action ? <div className="shrink-0">{action}</div> : null}
            </div>
          ) : null}

          {/* Tier 2 — nav links */}
          <div className="flex items-center gap-6">
            {desktopNav ?? (
              <nav
                aria-label="Primary navigation"
                className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-x-[clamp(12px,2vw,32px)] gap-y-2"
              >
                {items.map((item) =>
                  "children" in item ? (
                    <span key={item.label} className="group relative inline-flex">
                      <button
                        type="button"
                        aria-haspopup="true"
                        className={topLinkClassName}
                      >
                        {item.label}
                        <RiArrowDownSLine className="size-[13px] text-brand transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                      </button>
                      <div className="pointer-events-none absolute top-full left-1/2 z-50 -translate-x-1/2 -translate-y-1.5 pt-4 opacity-0 transition-[opacity,translate] duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <div className="flex min-w-[248px] flex-col rounded-lg border border-border bg-background p-2 shadow-float">
                          {item.children.map((child) => (
                            <React.Fragment key={child.href}>
                              {renderLink(child, dropLinkClassName)}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </span>
                  ) : (
                    <React.Fragment key={item.label}>
                      {renderLink(item, topLinkClassName)}
                    </React.Fragment>
                  ),
                )}
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bar — shown below 960px; menu behavior lives in the app */}
      {mobileNav ? (
        <div className="min-[961px]:hidden">{mobileNav}</div>
      ) : null}
    </div>
  );
}

type SiteFooterProps = {
  /** Inverse (white-type) brand lockup — navy ground swallows the navy logo. */
  brand: React.ReactNode;
  summary?: React.ReactNode;
  /** Contact lines (tel/mailto anchors) under the summary. */
  contact?: React.ReactNode;
  groups: SiteFooterGroup[];
  renderLink: RenderSiteLink;
  legal?: React.ReactNode;
  tagline?: React.ReactNode;
  className?: string;
};

function SiteFooter({
  brand,
  summary,
  contact,
  groups,
  renderLink,
  legal,
  tagline,
  className,
}: SiteFooterProps) {
  const linkClassName =
    "text-[13px] text-white/72 transition-colors hover:text-white";

  return (
    <footer className={cn("bg-surface-inverse", className)}>
      <div className="mx-auto w-full max-w-[1280px] px-[var(--container-pad)] pt-20 pb-6">
        <div className="grid gap-y-12 min-[1101px]:grid-cols-[minmax(220px,0.8fr)_minmax(0,2.2fr)] min-[1101px]:gap-x-[clamp(64px,8vw,120px)]">
          <div>
            {brand}
            {summary ? (
              <p className="mt-5 max-w-[30ch] text-[13px] leading-relaxed text-white/72">
                {summary}
              </p>
            ) : null}
            {contact ? (
              <div className="mt-4 flex flex-col gap-2 [&_a]:font-display [&_a]:text-[13px] [&_a]:font-bold [&_a]:text-white/72 [&_a]:transition-colors [&_a]:hover:text-white">
                {contact}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 min-[641px]:grid-cols-3 min-[1101px]:gap-x-12 min-[1101px]:gap-y-12">
            {groups.map((group) => (
              <section key={group.title} className="min-w-0">
                <h2 className="mb-4 font-display text-xs font-bold tracking-[0.14em] text-brand uppercase">
                  {group.title}
                </h2>
                <nav className="flex flex-col gap-3">
                  {group.items.map((item) => (
                    <React.Fragment key={item.href}>
                      {renderLink(item, linkClassName)}
                    </React.Fragment>
                  ))}
                </nav>
              </section>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/16 pt-6 text-xs text-white/55">
          <span>{legal}</span>
          {tagline ? <span>{tagline}</span> : null}
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter, SiteHeader, SocialStrip };
