"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/content";

/**
 * "Résumé" menu with the UK CV and the US résumé. Opens on click, Enter or Space
 * (or ArrowDown); arrow keys move between options; Escape or a click outside closes it.
 */
export function ResumeMenu({ label, variant }: { label: string; variant: "button" | "link" }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    items.current[0]?.focus();
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function onMenuKey(e: React.KeyboardEvent) {
    const i = items.current.findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = site.resumes.length;
      items.current[(i + (e.key === "ArrowDown" ? 1 : n - 1)) % n]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  // The button variant lifts its inner face only (see .btn / .btn-face in globals.css).
  const triggerCls = variant === "button" ? "btn group inline-flex rounded-full" : "u-lilac inline-flex items-center gap-1";
  const faceCls =
    "btn-face inline-flex items-center gap-2 rounded-full border-2 border-cream/70 px-6 py-3 font-semibold text-cream group-hover:border-cream";

  return (
    <div ref={wrap} className="relative inline-flex">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={triggerCls}
      >
        {variant === "button" ? (
          <span className={faceCls}>
            {label}
            <ChevronDown className={`size-4 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </span>
        ) : (
          <>
            {label}
            <ChevronDown className={`size-4 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </>
        )}
      </button>
      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          className={`absolute z-40 min-w-[13rem] rounded-2xl border-2 border-ink-text bg-panel p-1.5 text-ink-text shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)] [--focus:#141414] ${
            variant === "button" ? "top-full left-0 mt-2" : "right-0 bottom-full mb-2"
          }`}
        >
          {site.resumes.map((r, i) => (
            <li key={r.href} role="none">
              <a
                ref={(el) => {
                  items.current[i] = el;
                }}
                role="menuitem"
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-4 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-lilac focus:bg-lilac"
              >
                {r.label}
                <span aria-hidden="true">↗</span>
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
