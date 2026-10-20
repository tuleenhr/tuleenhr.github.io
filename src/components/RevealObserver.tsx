"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SCROLL_END, SCROLL_START } from "@/lib/scrollToTarget";

/**
 * Adds data-in to every [data-reveal] element the first time it scrolls into view,
 * and honours #hash targets on page load.
 */
export function RevealObserver() {
  const pathname = usePathname();

  // Arriving from another page at /#section: the browser's own jump gets lost
  // during hydration, so scroll to the target once the page is ready.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const pending = new Set(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])"));
    if (!pending.size) return;

    let io: IntersectionObserver | null = null;
    // Paused while scrollToTarget runs, so sections don't fade in one after another mid-jump.
    let paused = false;
    const show = (el: Element) => {
      el.setAttribute("data-in", "");
      pending.delete(el as HTMLElement);
      io?.unobserve(el);
    };
    const showInstantly = (el: HTMLElement) => {
      el.style.transition = "none";
      show(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.style.removeProperty("transition")));
    };

    if (!("IntersectionObserver" in window)) {
      pending.forEach(show);
      return;
    }

    io = new IntersectionObserver(
      (entries) => {
        if (paused) return;
        for (const entry of entries) if (entry.isIntersecting) show(entry.target);
      },
      // Positive bottom margin: start the reveal just before the element scrolls into view.
      { threshold: 0, rootMargin: "0px 0px 15% 0px" },
    );
    pending.forEach((el) => io!.observe(el));

    // A fast scroll or an anchor jump can carry an element from below the viewport
    // to above it between two frames, so the observer never sees it intersect.
    // Sweep on scroll and reveal anything that has reached the viewport.
    let frame = 0;
    const sweep = () => {
      frame = 0;
      if (paused) return;
      for (const el of pending) if (el.getBoundingClientRect().top < window.innerHeight * 1.15) show(el);
      if (!pending.size) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    sweep();

    // After a programmatic scroll: everything above and on screen appears at once (no fade);
    // anything further down keeps its normal reveal.
    const onStart = () => {
      paused = true;
    };
    const onEnd = () => {
      paused = false;
      for (const el of [...pending]) if (el.getBoundingClientRect().top < window.innerHeight) showInstantly(el);
    };
    window.addEventListener(SCROLL_START, onStart);
    window.addEventListener(SCROLL_END, onEnd);

    return () => {
      io?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(SCROLL_START, onStart);
      window.removeEventListener(SCROLL_END, onEnd);
    };
  }, [pathname]);

  return null;
}
