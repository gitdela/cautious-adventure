"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowDownSLine } from "@remixicon/react";

import type { SiteNavItem } from "@workspace/ui/components/site-chrome";
import { cn } from "@workspace/ui/lib/utils";

const topLinkClassName =
  "inline-flex items-center gap-1 whitespace-nowrap font-display text-[clamp(13px,1.15vw,15px)] font-bold tracking-[-0.01em] text-navy-900 transition-colors hover:text-brand";
const dropLinkClassName =
  "block rounded-[10px] px-3.5 py-[11px] text-sm font-bold whitespace-nowrap text-navy-900 transition-colors hover:bg-card hover:text-brand";

function SiteDesktopNav({ items }: { items: SiteNavItem[] }) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  return (
    <nav
      aria-label="Primary navigation"
      className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-x-[clamp(12px,2vw,32px)] gap-y-2"
    >
      {items.map((item, index) => {
        if (!("children" in item)) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className={topLinkClassName}
              onClick={() => setOpenLabel(null)}
            >
              {item.label}
            </Link>
          );
        }

        const isOpen = openLabel === item.label;
        const panelId = `desktop-nav-panel-${index}`;

        return (
          <div
            key={item.label}
            className="relative inline-flex"
            onMouseEnter={() => setOpenLabel(item.label)}
            onMouseLeave={() => setOpenLabel(null)}
            onFocusCapture={() => setOpenLabel(item.label)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setOpenLabel(null);
              }
            }}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;

              event.preventDefault();
              event.currentTarget.querySelector("button")?.focus();
              setOpenLabel(null);
            }}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={topLinkClassName}
              onClick={() => setOpenLabel(isOpen ? null : item.label)}
            >
              {item.label}
              <RiArrowDownSLine
                className={cn(
                  "size-[13px] text-brand transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              id={panelId}
              className={cn(
                "pointer-events-none absolute top-full left-1/2 z-50 -translate-x-1/2 -translate-y-1.5 pt-4 opacity-0 transition-[opacity,translate] duration-200",
                isOpen && "pointer-events-auto translate-y-0 opacity-100",
              )}
            >
              <div className="flex min-w-[248px] flex-col rounded-lg border border-border bg-background p-2 shadow-float">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={dropLinkClassName}
                    onClick={() => setOpenLabel(null)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export { SiteDesktopNav };
