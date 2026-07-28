import Link from "next/link";
import { RiArrowRightSLine } from "@remixicon/react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

function SiteBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-display text-[11px] tracking-[0.06em] uppercase">
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="contents">
              {index > 0 ? (
                <RiArrowRightSLine
                  className="size-3 text-white/55"
                  aria-hidden="true"
                />
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-white/78 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={current ? "page" : undefined}
                  className={current ? "text-orange-400" : "text-white/78"}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { SiteBreadcrumbs, type BreadcrumbItem };
