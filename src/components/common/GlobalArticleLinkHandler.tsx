"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * GlobalArticleLinkHandler
 * Intercepts anchor clicks and routes them through Next.js client-side router
 * to ensure smooth transitions and trigger loading.tsx properly.
 */
export default function GlobalArticleLinkHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      
      // If it's an internal link
      if (
        href && 
        href.startsWith("/") && 
        !anchor.hasAttribute("download")
      ) {
        // Only prevent default and push if it's not trying to open in a new tab explicitly
        // (though the old code removed target="_blank" anyway for /news/)
        if (anchor.getAttribute("target") !== "_blank") {
          e.preventDefault();
          router.push(href);
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [router]);

  return null;
}
