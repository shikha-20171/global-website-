"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// Force manual scroll restoration immediately on client load
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

/**
 * ScrollToTop: Guarantees that EVERY page opens at the very top (scrollY = 0),
 * preventing the browser from restoring previous scroll positions or opening at the bottom.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  const resetToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  // Immediate reset before paint
  useLayoutEffect(() => {
    resetToTop();
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    resetToTop();

    // Multi-phase check as async content / images / Framer Motion layout loads
    const rId = requestAnimationFrame(resetToTop);
    const t1 = setTimeout(resetToTop, 20);
    const t2 = setTimeout(resetToTop, 80);
    const t3 = setTimeout(resetToTop, 200);
    const t4 = setTimeout(resetToTop, 400);

    return () => {
      cancelAnimationFrame(rId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  // Intercept all internal navigation link clicks before route transition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleGlobalClick = (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // When clicking internal links without specific anchor targets, reset immediately
      if (href.startsWith("/") && !href.includes("#")) {
        resetToTop();
      }
    };

    const handlePopState = () => {
      resetToTop();
      setTimeout(resetToTop, 50);
    };

    document.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}

