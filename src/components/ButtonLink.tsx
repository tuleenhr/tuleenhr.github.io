"use client";

import Link from "next/link";
import { useRef, type PointerEvent, type ReactNode } from "react";

type Variant = "lilac" | "outline-dark" | "outline-cream" | "ink";

// Hover colours key off the outer link (group-hover), not the face, so they never flicker as the face lifts.
const variants: Record<Variant, string> = {
  lilac: "bg-lilac text-ink-text border-lilac",
  "outline-dark": "border-cream/70 text-cream group-hover:border-cream",
  "outline-cream": "border-ink-text text-ink-text",
  ink: "bg-ink-text text-cream border-ink-text",
};

const MAX_PULL = 5;

/**
 * Pill-shaped link with a gentle lift on hover and a subtle magnetic pull for mouse pointers.
 * The outer <a> is the hover target and never moves; only the inner .btn-face lifts and
 * drifts (see .btn / .btn-face in globals.css), so hovering along the bottom edge can't flicker.
 * Internal routes use next/link; everything else is a plain <a>.
 */
export function ButtonLink({
  href,
  children,
  variant = "lilac",
  newTab = false,
  size = "md",
  className = "",
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  newTab?: boolean;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}) {
  const face = useRef<HTMLSpanElement>(null);

  function onMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches || !face.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const clamp = (n: number) => Math.max(-MAX_PULL, Math.min(MAX_PULL, n));
    face.current.style.setProperty("--mx", `${clamp((e.clientX - (r.left + r.width / 2)) * 0.15)}px`);
    face.current.style.setProperty("--my", `${clamp((e.clientY - (r.top + r.height / 2)) * 0.25)}px`);
  }
  function reset() {
    face.current?.style.removeProperty("--mx");
    face.current?.style.removeProperty("--my");
  }

  const outer = "btn group inline-flex rounded-full";
  const faceCls = `btn-face inline-flex items-center justify-center gap-2 rounded-full border-2 font-semibold whitespace-nowrap ${
    size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"
  } ${variants[variant]} ${className}`;
  const inner = (
    <span ref={face} className={faceCls}>
      {children}
    </span>
  );

  const isInternalRoute = href.startsWith("/") && !href.startsWith("/docs/");
  const external = newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const handlers = { onPointerMove: onMove, onPointerLeave: reset };

  return isInternalRoute ? (
    <Link href={href} className={outer} aria-label={ariaLabel} {...handlers}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={outer} aria-label={ariaLabel} {...external} {...handlers}>
      {inner}
    </a>
  );
}
