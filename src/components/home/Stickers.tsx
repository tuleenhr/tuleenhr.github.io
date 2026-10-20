"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { about } from "@/content";
import { StickerArt } from "../stickers/art";
import { BubbleArt, isBubble } from "../stickers/bubbles";

type StickerId = (typeof about.stickers)[number]["id"];

/** Draws any About sticker, picture or speech bubble. */
function Art({ id }: { id: StickerId }) {
  return isBubble(id) ? <BubbleArt id={id} /> : <StickerArt id={id} />;
}

// Where each sticker starts (percent of the About section) and its resting tilt. Loose clusters
// in About's empty space: above the city route, below it, and after the languages line.
const START: Record<StickerId, { left: number; top: number; rotate: number }> = {
  star: { left: 63, top: 8, rotate: -10 },
  helloArabic: { left: 73, top: 15, rotate: 6 },
  plane: { left: 85, top: 9, rotate: 12 },
  bus: { left: 91, top: 27, rotate: -7 },
  palm: { left: 66, top: 77, rotate: 8 },
  pan: { left: 78, top: 78, rotate: -12 },
  clapper: { left: 90, top: 75, rotate: 9 },
  helloMandarin: { left: 50, top: 80, rotate: -6 },
};
const NUDGE = 10;

/**
 * From 1024px: four stickers scattered in About's empty space. Drag them (pointer or touch)
 * anywhere inside the section, or focus one and nudge it with the arrow keys. They wobble
 * a little when dropped. Positions live in memory, so a reload resets them.
 */
export function StickerLayer() {
  const layer = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [wobble, setWobble] = useState<string | null>(null);
  const drag = useRef<{ id: string; px: number; py: number; ox: number; oy: number; moved: boolean } | null>(null);

  /** Keep the sticker inside the section. */
  function clamp(el: HTMLElement, x: number, y: number, ox: number, oy: number) {
    const L = layer.current!.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const baseLeft = r.left - ox;
    const baseTop = r.top - oy;
    return {
      x: Math.max(L.left - baseLeft, Math.min(L.right - r.width - baseLeft, x)),
      y: Math.max(L.top - baseTop, Math.min(L.bottom - r.height - baseTop, y)),
    };
  }

  function set(id: string, el: HTMLElement, x: number, y: number) {
    const cur = offsets[id] ?? { x: 0, y: 0 };
    setOffsets((o) => ({ ...o, [id]: clamp(el, x, y, cur.x, cur.y) }));
  }

  function drop(id: string) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setWobble(null);
    requestAnimationFrame(() => setWobble(id));
  }

  function onPointerDown(e: PointerEvent<HTMLButtonElement>, id: string) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const cur = offsets[id] ?? { x: 0, y: 0 };
    drag.current = { id, px: e.clientX, py: e.clientY, ox: cur.x, oy: cur.y, moved: false };
  }
  function onPointerMove(e: PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    if (!d.moved && Math.hypot(dx, dy) < 3) return;
    d.moved = true;
    set(d.id, e.currentTarget, d.ox + dx, d.oy + dy);
  }
  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (d?.moved) drop(d.id);
  }
  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, id: string) {
    const step: Record<string, [number, number]> = {
      ArrowLeft: [-NUDGE, 0],
      ArrowRight: [NUDGE, 0],
      ArrowUp: [0, -NUDGE],
      ArrowDown: [0, NUDGE],
    };
    const s = step[e.key];
    if (!s) return;
    e.preventDefault();
    const cur = offsets[id] ?? { x: 0, y: 0 };
    set(id, e.currentTarget, cur.x + s[0], cur.y + s[1]);
  }

  return (
    <div ref={layer} className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
      {about.stickers.map((s) => {
        const start = START[s.id];
        const o = offsets[s.id] ?? { x: 0, y: 0 };
        return (
          <button
            key={s.id}
            type="button"
            aria-label={`${s.label}, draggable`}
            aria-describedby="sticker-hint"
            onPointerDown={(e) => onPointerDown(e, s.id)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(e) => onKeyDown(e, s.id)}
            onAnimationEnd={() => setWobble(null)}
            className={`pointer-events-auto absolute size-16 cursor-grab touch-none rounded-2xl select-none active:cursor-grabbing lg:size-[72px] [--focus:#141414] ${
              wobble === s.id ? "sticker-wobble" : ""
            }`}
            style={
              {
                left: `${start.left}%`,
                top: `${start.top}%`,
                translate: `${o.x}px ${o.y}px`,
                rotate: `${start.rotate}deg`,
                "--r": `${start.rotate}deg`,
              } as React.CSSProperties
            }
          >
            <Art id={s.id} />
          </button>
        );
      })}
      <p id="sticker-hint" className="sr-only">
        {about.stickerHint}
      </p>
    </div>
  );
}

/** Below 1024px: the same stickers in a fixed row under the paragraph (not draggable). */
export function StickerRow() {
  const tilts = [8, -10, 6, -8];
  return (
    <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 lg:hidden">
      {about.stickers.map((s, i) => (
        <span
          key={s.id}
          role="img"
          aria-label={s.label}
          className="size-12 sm:size-14"
          style={{ rotate: `${tilts[i % tilts.length]}deg` }}
        >
          <Art id={s.id} />
        </span>
      ))}
    </div>
  );
}
