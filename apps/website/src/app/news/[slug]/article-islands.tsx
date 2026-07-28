"use client";

import { useEffect, useState } from "react";
import { RiLinksLine } from "@remixicon/react";

import { cn } from "@workspace/ui/lib/utils";

/** Fixed reading-progress bar along the top of the viewport. */
function ArticleProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-50 h-1 bg-brand"
      style={{ width: `${progress * 100}%` }}
    />
  );
}

/**
 * "In this story" dotted timeline (scroll-spy). The article renders
 * server-side with `id="sec-{i}"` headings; this observes those nodes.
 */
function ArticleTimeline({ headings }: { headings: string[] }) {
  const ids = headings.map((_, i) => `sec-${i}`);
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const els = headings
      .map((_, i) => document.getElementById(`sec-${i}`))
      .filter((el): el is HTMLElement => el != null);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  const goTo = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 120,
        behavior: "smooth",
      });
    }
  };

  return (
    <aside className="sticky top-[110px] hidden min-[901px]:block">
      <p className="eyebrow mb-5">In this story</p>
      <nav aria-label="In this story" className="relative flex flex-col gap-6 pl-[22px]">
        <span className="absolute top-1.5 bottom-1.5 left-[5px] w-0.5 bg-border" />
        {headings.map((heading, i) => {
          const active = activeId === ids[i];
          return (
            <a
              key={heading}
              href={`#${ids[i]}`}
              onClick={(event) => goTo(event, ids[i])}
              className="relative"
            >
              <span
                className={cn(
                  "absolute top-0.5 -left-[22px] size-3 rounded-full border-2 transition-colors",
                  active
                    ? "border-brand bg-brand"
                    : "border-ink-400 bg-background",
                )}
              />
              <span
                className={cn(
                  "font-display text-[14px] leading-[1.4] transition-colors",
                  active
                    ? "font-bold text-brand"
                    : "font-medium text-navy-900 hover:text-brand",
                )}
              >
                {heading}
              </span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

const sharePillClass =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-[18px] font-display text-[14px] font-medium text-foreground transition-colors hover:bg-ink-100";

/** Share pills at the article foot, per the handoff. */
function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    ["X", `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`],
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`],
    ["WhatsApp", `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`],
  ];

  const copyLink = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="eyebrow mr-2">Share</span>
      {links.map(([label, href]) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={sharePillClass}
        >
          {label}
        </a>
      ))}
      <button type="button" onClick={copyLink} className={sharePillClass}>
        <RiLinksLine className="size-4" />
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

export { ArticleProgress, ArticleTimeline, ShareRow };
