"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { buttonVariants } from "@workspace/ui/components/button";
import { MenuGlyph } from "@workspace/ui/components/menu-glyph";
import type { SiteNavItem } from "@workspace/ui/components/site-chrome";
import { cn } from "@workspace/ui/lib/utils";

import { SiteBrand } from "./site-brand";
import { socialLinks } from "./site-navigation";
import { SocialIcon } from "./social-icon";

const menuButtonClassName =
  "inline-flex size-12 shrink-0 items-center justify-center rounded-full text-brand transition-colors hover:text-brand/80";

function SiteMobileNav({ items }: { items: SiteNavItem[] }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="flex items-center justify-between px-[var(--container-pad)] py-3">
        <SiteBrand size="mobile" />
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={menuButtonClassName}
        >
          <MenuGlyph className="size-[30px]" />
        </button>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="ps-blueprint fixed inset-0 z-50 flex flex-col bg-muted"
        >
          <div className="flex shrink-0 items-center justify-between px-[var(--container-pad)] py-3">
            <SiteBrand size="mobile" />
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              aria-expanded={open}
              onClick={closeMenu}
              className={menuButtonClassName}
            >
              <MenuGlyph open className="size-[30px]" />
            </button>
          </div>

          <nav
            aria-label="Mobile navigation"
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[var(--container-pad)] pt-4 pb-8"
          >
            <Accordion type="single" collapsible className="rounded-none border-0">
              {items.map((item) => {
                if (!("children" in item)) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeMenu}
                      className="block border-b border-border py-5 font-display text-[18px] font-bold text-navy-900"
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <AccordionItem
                    value={item.label}
                    key={item.label}
                    className="border-b border-border data-open:bg-transparent"
                  >
                    <AccordionTrigger className="px-0 py-5 font-display text-[18px] font-bold text-navy-900 no-underline hover:no-underline data-open:text-brand">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1 pb-5 [&_a]:no-underline">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={closeMenu}
                          className="block py-3 text-[17px] text-foreground transition-colors hover:text-brand"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            <Link
              href="/stations"
              onClick={closeMenu}
              className={cn(buttonVariants({ variant: "station" }), "mt-7 w-full")}
            >
              Find Our Station
            </Link>

            <div className="mt-7 flex flex-col gap-4">
              <p className="eyebrow">Follow us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-grid size-11 place-items-center rounded-full border border-border text-navy-900 transition-colors hover:border-brand hover:bg-brand hover:text-white [&_svg]:size-[18px]"
                  >
                    <SocialIcon name={social.name} />
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

export { SiteMobileNav };
