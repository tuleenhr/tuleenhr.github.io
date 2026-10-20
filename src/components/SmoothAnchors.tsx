"use client";

import { useEffect } from "react";
import { scrollToTarget } from "@/lib/scrollToTarget";

/**
 * Turns every same-page link (#section, /#section on its own page, and the logo's "/" on
 * the home page) into an eased scroll, then updates the URL with history.pushState.
 * Links to other pages are left alone. Listens in the capture phase so it runs before
 * next/link, which then sees defaultPrevented and doesn't navigate.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;

      const id = decodeURIComponent(url.hash.slice(1));
      // "#top" and the logo's "/" both mean the top of the page.
      const el = id && id !== "top" ? document.getElementById(id) : null;
      if (id && id !== "top" && !el) return;

      e.preventDefault();
      void scrollToTarget(el).then(() => {
        const next = id ? `#${id}` : location.pathname;
        if (location.hash !== (id ? `#${id}` : "")) history.pushState(null, "", next);
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
