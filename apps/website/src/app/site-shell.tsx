import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  SiteFooter,
  SiteHeader,
  type SiteLinkItem,
  type SiteSocialItem,
} from "@workspace/ui/components/site-chrome";

import { RETAIL_NETWORK_SIZE } from "@/lib/company";

import { ContactFab } from "./contact-fab";
import { HeaderTone, SiteBrandAuto } from "./header-tone";
import { SiteBrand } from "./site-brand";
import { SiteDesktopNav } from "./site-desktop-nav";
import { SiteMobileNav } from "./site-mobile-nav";
import {
  footerGroups,
  navigationItems,
  socialLinks,
} from "./site-navigation";
import { SocialIcon } from "./social-icon";
import { SiteTopBarSlot } from "./site-top-bar-slot";

function renderSiteLink(item: SiteLinkItem, className: string) {
  const isExternal =
    item.href.startsWith("http") ||
    item.href.startsWith("mailto:") ||
    item.href.startsWith("tel:");

  if (isExternal) {
    return (
      <a className={className} href={item.href}>
        {item.label}
      </a>
    );
  }

  return (
    <Link className={className} href={item.href}>
      {item.label}
    </Link>
  );
}

const socials: SiteSocialItem[] = socialLinks.map((social) => ({
  label: social.label,
  href: social.href,
  icon: <SocialIcon name={social.name} />,
}));

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    // `relative` anchors the header when it goes absolute in overlay tone.
    <div className="relative flex min-h-full flex-1 flex-col bg-background [--site-header-overlay-top:2.25rem]">
      <HeaderTone>
        <SiteTopBarSlot />
        <SiteHeader
          brand={<SiteBrandAuto />}
          items={navigationItems}
          socials={socials}
          renderLink={renderSiteLink}
          desktopNav={<SiteDesktopNav items={navigationItems} />}
          mobileNav={<SiteMobileNav items={navigationItems} />}
          action={
            <Button asChild size="sm" variant="station">
              <Link href="/find-a-station">Find our Station</Link>
            </Button>
          }
        />
      </HeaderTone>

      <div className="flex-1">{children}</div>

      <SiteFooter
        brand={<SiteBrand tone="inverse" size="footer" />}
        summary={`Visit any of our ${RETAIL_NETWORK_SIZE} PETROSOL stations across Ghana and experience reliable and clean fuel in full quantity.`}
        contact={
          <>
            <a href="tel:+233362196538">+233 (0)362 196 538</a>
            <a href="mailto:info@petrosol.com.gh">info@petrosol.com.gh</a>
          </>
        }
        groups={footerGroups}
        renderLink={renderSiteLink}
        legal={
          <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              © {new Date().getFullYear()} PETROSOL PLATINUM ENERGY PLC. All rights reserved.
            </span>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
          </span>
        }
        tagline="energizing dreams!"
      />

      <ContactFab />
    </div>
  );
}
