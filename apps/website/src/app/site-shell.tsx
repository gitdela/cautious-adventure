import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  SiteFooter,
  SiteHeader,
  type SiteLinkItem,
  type SiteSocialItem,
} from "@workspace/ui/components/site-chrome";

import { SiteBrand } from "./site-brand";
import { SiteDesktopNav } from "./site-desktop-nav";
import { SiteMobileNav } from "./site-mobile-nav";
import {
  footerGroups,
  navigationItems,
  socialLinks,
} from "./site-navigation";
import { SocialIcon } from "./social-icon";

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
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <SiteHeader
        brand={<SiteBrand />}
        items={navigationItems}
        socials={socials}
        renderLink={renderSiteLink}
        desktopNav={<SiteDesktopNav items={navigationItems} />}
        mobileNav={<SiteMobileNav items={navigationItems} />}
        action={
          <Button asChild size="sm" variant="station">
            <Link href="/stations">Find Our Station</Link>
          </Button>
        }
      />

      <div className="flex-1">{children}</div>

      <SiteFooter
        brand={<SiteBrand inverse size="footer" />}
        summary="Quality fuel in full quantity, lubricants and vehicle care — at PETROSOL stations across Ghana."
        contact={
          <>
            <a href="tel:+233362196538">+233 (0)362 196 538</a>
            <a href="mailto:info@petrosol.com.gh">info@petrosol.com.gh</a>
          </>
        }
        groups={footerGroups}
        renderLink={renderSiteLink}
        legal={
          <span>
            © {new Date().getFullYear()} PETROSOL Ghana PLC. All rights reserved.
          </span>
        }
        tagline="energizing dreams!"
      />
    </div>
  );
}
