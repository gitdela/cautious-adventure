"use client";

import { useEffect, useState } from "react";

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

export { ArticleProgress };
