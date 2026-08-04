import * as React from "react";
import { RiArrowDownSLine } from "@remixicon/react";

import { cn } from "@workspace/ui/lib/utils";

/**
 * Petrosol site chrome (DS NavBar + Footer, per the design handoff's
 * SiteChrome.jsx). Framework-agnostic: apps own routing via `renderLink`, and
 * inject brand artwork / CTA / socials as slots.
 *
 * Header is two-tier: logo left spanning both tiers; a hairlined social strip
 * on top; nav links + CTA below. Items with `children` open a white dropdown
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
          className="inline-grid size-8 place-items-center rounded-full border border-border text-navy-900 transition-colors hover:border-brand hover:bg-brand hover:text-white [&_svg]:size-4"
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
  socials = [],
  action,
  desktopNav,
  mobileNav,
  className,
}: SiteHeaderProps) {
  const topLinkClassName =
    "inline-flex items-center gap-1 whitespace-nowrap font-display text-[clamp(13px,1.15vw,15px)] font-bold tracking-[-0.01em] text-navy-900 transition-colors hover:text-brand";
  const dropLinkClassName =
    "block rounded-[10px] px-3.5 py-[11px] text-sm font-bold whitespace-nowrap text-navy-900 transition-colors hover:bg-card hover:text-brand";

  return (
    <div className={cn("ps-blueprint relative z-40 bg-muted", className)}>
      {/* Desktop — two tiers, hidden below 960px */}
      <header className="mx-auto hidden w-full max-w-[1280px] items-center gap-12 px-[var(--container-pad)] py-4 min-[961px]:flex">
        <div className="shrink-0">{brand}</div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Tier 1 — utility social strip */}
          {socials.length > 0 ? (
            <SocialStrip socials={socials} className="border-b border-border pb-3" />
          ) : null}

          {/* Tier 2 — nav links + CTA */}
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
            {action ? <div className="shrink-0">{action}</div> : null}
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
        <div className="grid grid-cols-[repeat(2,minmax(120px,1fr))] gap-x-8 gap-y-10 min-[561px]:grid-cols-[repeat(3,minmax(120px,1fr))] min-[1101px]:grid-cols-[minmax(220px,1.4fr)_repeat(5,minmax(120px,1fr))]">
          {/* Brand column — spans the full row until the widest layout */}
          <div className="col-span-full min-[1101px]:col-span-1">
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

          {groups.map((group) => (
            <section key={group.title} className="min-w-[120px]">
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

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/16 pt-6 text-xs text-white/55">
          <span>{legal}</span>
          {tagline ? <span>{tagline}</span> : null}
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter, SiteHeader, SocialStrip };
