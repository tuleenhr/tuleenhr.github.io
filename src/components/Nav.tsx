"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { nav, site } from "@/content";
import { ButtonLink } from "./ButtonLink";

/** Sticky top nav. On the home page it highlights the section in view with a lilac dot. */
export function Nav({ home = false }: { home?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!home) return;
    let frame = 0;
    // The active section is the one crossing a line 40% down the viewport.
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const l of nav.links) {
        const r = document.getElementById(l.id)?.getBoundingClientRect();
        if (r && r.top <= line && r.bottom > line) current = l.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [home]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const hrefFor = (id: string) => (home ? `#${id}` : `/#${id}`);

  return (
    // Same container as every section (px-4/sm:px-8 outside, max-w-6xl inside) so the logo lines up with content.
    <header className="theme-dark sticky top-0 z-50 border-b border-line-dark bg-ink px-4 sm:px-8">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="font-display text-base tracking-tight sm:text-lg">
          {site.name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id}>
                <a
                  href={hrefFor(l.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative text-sm hover:text-cream ${
                    isActive ? "text-cream" : "text-muted-dark"
                  }`}
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-lilac ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ButtonLink href={nav.cta.href} size="sm">
            {nav.cta.label} <span aria-hidden="true" className="btn-arrow-ne">↗</span>
          </ButtonLink>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line-dark md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!open} className="-mx-4 border-t border-line-dark px-4 sm:-mx-8 sm:px-8 md:hidden">
        <ul className="mx-auto max-w-6xl py-2">
          {nav.links.map((l) => (
            <li key={l.id}>
              <a
                href={hrefFor(l.id)}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-3 font-display text-xl uppercase"
              >
                {l.label}
                {active === l.id && <span aria-hidden="true" className="size-2 rounded-full bg-lilac" />}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
