"use client";

import { useEffect } from "react";

/**
 * GlobalArticleLinkHandler
 * Ensures that whenever a user clicks any article link (e.g. /news/...) anywhere
 * across the site, it always opens cleanly in a new tab (target="_blank").
 */
export default function GlobalArticleLinkHandler() {
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("/news/") || href.includes("/news/")) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, []);

  return null;
}
