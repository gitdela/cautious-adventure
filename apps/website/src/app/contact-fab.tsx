"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiChat3Fill } from "@remixicon/react";

import { cn } from "@workspace/ui/lib/utils";

/**
 * Floating "chat with us" button, tawk.to style.
 *
 * Not a chat widget — it routes to /contact-us, where the real message form
 * lives. Client-only because it reads the pathname to hide itself on the
 * contact page (and its sub-routes), where pointing at /contact-us is noise.
 */
function ContactFab() {
  const pathname = usePathname();

  if (pathname === "/contact-us" || pathname.startsWith("/contact-us/")) return null;

  return (
    <Link
      href="/contact-us"
      aria-label="Contact us"
      className={cn(
        // `p-4` around a 24px icon gives a 56px circle at rest.
        "group fixed right-6 bottom-6 z-50 flex items-center rounded-full p-4",
        // leaf-600, not the lighter leaf-500 logo green: white on #6bb445 is
        // only 2.6:1, which fails AA for the label. leaf-600 clears 4.2:1.
        "bg-leaf-600 text-white shadow-lg",
        // Colour holds steady on hover — the lift and shadow carry the state,
        // so contrast never drops below the ratio chosen above.
        "transition-[transform,box-shadow] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:shadow-xl",
        "focus-visible:ring-2 focus-visible:ring-leaf-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        "sm:right-8 sm:bottom-8",
      )}
    >
      <RiChat3Fill aria-hidden="true" className="size-6 shrink-0" />
      {/* Width — not display — animates, so the label stays in the a11y tree
          and is announced with the link. `overflow-hidden` swallows the inner
          padding at rest, keeping the collapsed state a true circle. */}
      <span
        className={cn(
          "max-w-0 overflow-hidden opacity-0",
          "transition-[max-width,opacity] duration-200 ease-out",
          "group-hover:max-w-[10rem] group-hover:opacity-100",
          "group-focus-visible:max-w-[10rem] group-focus-visible:opacity-100",
          "motion-reduce:transition-none",
        )}
      >
        <span className="block pr-1 pl-3 font-display text-[15px] font-bold whitespace-nowrap">
          Chat with us
        </span>
      </span>
    </Link>
  );
}

export { ContactFab };
