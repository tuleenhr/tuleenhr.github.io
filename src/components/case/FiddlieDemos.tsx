"use client";

import { Check } from "lucide-react";
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { fiddlieDemos } from "@/content";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SNAP_MS = 150;

/** Clear drag offsets so every chip slides back to its slot. */
function snapHome(els: Iterable<HTMLElement>) {
  for (const el of els) {
    el.style.transition = reduceMotion() ? "none" : `transform ${SNAP_MS}ms ease-out`;
    el.style.transform = "";
  }
}

/**
 * "Plan in lanes" demo, styled like Fiddlie's stage timeline: three milestones on a track.
 * Drag a node (pointer or touch) or focus it and use the arrow keys to reorder. Statuses belong
 * to the slot (1 complete, 2 in progress, 3 upcoming), so only the names move and the timeline
 * can't have a gap. Horizontal from 640px, vertical below. One level of undo.
 */
export function ReorderDemo() {
  const D = fiddlieDemos.reorder;
  const [order, setOrder] = useState<string[]>(D.milestones);
  const [prev, setPrev] = useState<string[] | null>(null);
  const [announce, setAnnounce] = useState("");
  const [dragging, setDragging] = useState<string | null>(null);
  const nodes = useRef(new Map<string, HTMLButtonElement>());
  const flipFrom = useRef(new Map<string, DOMRect>());
  const refocus = useRef<string | null>(null);
  const drag = useRef<{ id: string; axis: "x" | "y"; start: number; moved: boolean; centers: number[]; step: number } | null>(
    null,
  );

  const snapshot = () => {
    flipFrom.current = new Map([...nodes.current].map(([id, el]) => [id, el.getBoundingClientRect()]));
  };

  // FLIP: slide each node from where it was drawn into its new slot.
  useLayoutEffect(() => {
    const from = flipFrom.current;
    flipFrom.current = new Map();
    for (const [id, el] of nodes.current) {
      el.style.transition = "none";
      el.style.transform = "";
      const before = from.get(id);
      if (!before || reduceMotion()) continue;
      const now = el.getBoundingClientRect();
      const dx = before.left - now.left;
      const dy = before.top - now.top;
      if (!dx && !dy) continue;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      void el.offsetWidth;
      el.style.transition = `transform ${SNAP_MS}ms ease-out`;
      el.style.transform = "";
    }
    if (refocus.current) {
      nodes.current.get(refocus.current)?.focus();
      refocus.current = null;
    }
  }, [order]);

  function commit(next: string[], movedId: string) {
    if (next.join() === order.join()) return;
    setPrev(order);
    setOrder(next);
    setAnnounce(D.moved(movedId, next.indexOf(movedId) + 1, next.length));
  }

  type Drag = NonNullable<typeof drag.current>;
  /** Slot the dragged node would land in, from its current centre. */
  function targetIndex(d: Drag, delta: number) {
    const from = order.indexOf(d.id);
    const centre = d.centers[from] + delta;
    return d.centers.filter((c, i) => i !== from && c < centre).length;
  }

  function onPointerDown(e: PointerEvent<HTMLButtonElement>, id: string) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const axis = window.matchMedia("(min-width: 640px)").matches ? "x" : "y";
    const rects = order.map((o) => nodes.current.get(o)!.getBoundingClientRect());
    const centers = rects.map((r) => (axis === "x" ? r.left + r.width / 2 : r.top + r.height / 2));
    drag.current = { id, axis, start: axis === "x" ? e.clientX : e.clientY, moved: false, centers, step: centers[1] - centers[0] };
  }

  function onPointerMove(e: PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d) return;
    const delta = (d.axis === "x" ? e.clientX : e.clientY) - d.start;
    if (!d.moved && Math.abs(delta) < 4) return;
    if (!d.moved) setDragging(d.id);
    d.moved = true;
    const from = order.indexOf(d.id);
    const to = targetIndex(d, delta);
    const move = (v: number) => (d.axis === "x" ? `translateX(${v}px)` : `translateY(${v}px)`);
    order.forEach((id, i) => {
      const el = nodes.current.get(id)!;
      if (id === d.id) {
        el.style.transition = "none";
        el.style.transform = `${move(delta)} scale(1.05)`;
        return;
      }
      // Nodes between the old and new slot slide aside to make room.
      let shift = 0;
      if (from < to && i > from && i <= to) shift = -d.step;
      if (from > to && i < from && i >= to) shift = d.step;
      el.style.transition = reduceMotion() ? "none" : `transform ${SNAP_MS}ms ease-out`;
      el.style.transform = shift ? move(shift) : "";
    });
  }

  function onPointerUp(e: PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    drag.current = null;
    setDragging(null);
    if (!d || !d.moved) return;
    const from = order.indexOf(d.id);
    const to = targetIndex(d, (d.axis === "x" ? e.clientX : e.clientY) - d.start);
    snapshot(); // where everything is drawn right now (including drag offsets)
    if (from === to) {
      snapHome(nodes.current.values());
      return;
    }
    const next = order.filter((id) => id !== d.id);
    next.splice(to, 0, d.id);
    commit(next, d.id);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, id: string) {
    const dir = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : 0;
    if (!dir) return;
    e.preventDefault();
    const from = order.indexOf(id);
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    snapshot();
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    refocus.current = id;
    commit(next, id);
  }

  function undo() {
    if (!prev) return;
    snapshot();
    setOrder(prev);
    setPrev(null);
    setAnnounce("");
  }

  return (
    <div className="mt-6 rounded-[16px] border border-line-dark bg-[#161618] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.14em] text-muted-dark">{D.eyebrow}</p>
        <button
          type="button"
          onClick={undo}
          disabled={!prev}
          className="rounded-full border border-cream/60 px-3 py-1 text-xs font-semibold text-cream disabled:opacity-35"
        >
          {D.undo}
        </button>
      </div>

      <div className="relative mt-7 sm:mt-9">
        {/* Track: muted behind all three nodes, lilac from node 1 to node 2 (progress so far).
            Horizontal from 640px (node centres at 1/6, 1/2, 5/6), vertical below. */}
        <div aria-hidden="true" className="absolute top-[22px] bottom-[22px] left-[20px] w-1 rounded-full bg-[#2C2B2A] sm:top-[20px] sm:right-[16.67%] sm:bottom-auto sm:left-[16.67%] sm:h-1 sm:w-auto" />
        <div aria-hidden="true" className="absolute top-[22px] left-[20px] h-[calc(50%-22px)] w-1 rounded-full bg-lilac sm:top-[20px] sm:left-[16.67%] sm:h-1 sm:w-[33.33%]" />

        <ol aria-label={D.listLabel} className="relative grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0">
          {order.map((id, slot) => {
            const status = D.statuses[slot];
            const lifted = dragging === id;
            return (
              <li key={id} className="flex sm:justify-center">
                <button
                  ref={(el) => {
                    if (el) nodes.current.set(id, el);
                    else nodes.current.delete(id);
                  }}
                  type="button"
                  aria-describedby="reorder-hint"
                  onPointerDown={(e) => onPointerDown(e, id)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  onKeyDown={(e) => onKeyDown(e, id)}
                  className={`group relative flex cursor-grab touch-none items-center gap-4 rounded-2xl text-left select-none active:cursor-grabbing sm:flex-col sm:gap-3 sm:text-center ${
                    lifted ? "z-10" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-5 left-1/2 hidden -translate-x-1/2 font-mono text-xs tracking-[-0.2em] text-muted-dark opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
                  >
                    ⋮⋮
                  </span>
                  <StageNode slot={slot} lifted={lifted} />
                  <span className="flex flex-col">
                    <span className={`text-[15px] leading-tight font-medium ${slot === 2 ? "text-muted-dark" : "text-cream"}`}>{id}</span>
                    <span className="mt-1 font-mono text-[11px] tracking-[0.12em] text-muted-dark uppercase">{status}</span>
                    <span className="sr-only">
                      , stage {slot + 1} of {order.length}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="mt-6 font-mono text-xs text-muted-dark">{D.caption}</p>
      <p id="reorder-hint" className="sr-only">
        {D.hint}
      </p>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}

/** The circle for a slot: 1 complete (lilac + check), 2 in progress (lilac ring + badge), 3 upcoming (muted ring). */
function StageNode({ slot, lifted }: { slot: number; lifted: boolean }) {
  const shadow = lifted ? "shadow-[0_10px_24px_-8px_rgb(0_0_0/0.7)]" : "";
  if (slot === 0) {
    return (
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-lilac text-ink-text ${shadow}`}>
        <Check className="size-5" strokeWidth={3} aria-hidden="true" />
      </span>
    );
  }
  if (slot === 1) {
    return (
      <span className={`relative flex size-11 shrink-0 rounded-full border-[3px] border-lilac bg-ink ${shadow}`}>
        <span className="absolute -top-1 -right-1 size-3 rounded-full border-2 border-[#161618] bg-cream" />
      </span>
    );
  }
  return <span className={`size-11 shrink-0 rounded-full border-2 border-[#4A4845] bg-[#161618] ${shadow}`} />;
}

type Pin = { x: number; y: number };

/**
 * "Feedback in rounds" demo on a sample design (an illustration, not a client file).
 * Click to drop a numbered pin with the next comment; Enter on the focused design drops one
 * near the centre. Three pins max, then Reset.
 */
export function PinDemo() {
  const D = fiddlieDemos.pins;
  const max = D.comments.length;
  const [pins, setPins] = useState<Pin[]>([]);
  const surface = useRef<HTMLDivElement>(null);

  function add(p: Pin) {
    setPins((ps) => (ps.length >= max ? ps : [...ps, p]));
  }
  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    const r = surface.current!.getBoundingClientRect();
    add({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }
  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    // Near the centre, nudged so repeated Enter presses don't stack on one spot.
    add({ x: 50 + (pins.length - 1) * 12, y: 50 + (pins.length - 1) * 8 });
  }

  return (
    <div className="absolute inset-0">
      <div
        ref={surface}
        role="button"
        tabIndex={0}
        aria-label={D.surfaceLabel(pins.length, max)}
        aria-disabled={pins.length >= max}
        onClick={onClick}
        onKeyDown={onKey}
        className={`absolute inset-0 ${pins.length < max ? "cursor-crosshair" : "cursor-default"} [--focus:#141414]`}
      >
        <SampleDesign label={D.designLabel} />
        {pins.map((p, i) => {
          const flip = p.x > 58;
          return (
            <div
              key={i}
              className="pointer-events-none absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className="absolute -top-3 -left-3 flex size-6 items-center justify-center rounded-full border-2 border-ink-text bg-lilac font-mono text-xs font-semibold text-ink-text shadow">
                {i + 1}
              </span>
              <span
                className={`absolute top-4 w-max max-w-[11rem] rounded-xl border border-ink-text/15 bg-panel px-2.5 py-1.5 text-xs leading-snug text-ink-text shadow-md ${
                  flip ? "right-1" : "left-1"
                }`}
              >
                {D.comments[i]}
              </span>
            </div>
          );
        })}
      </div>
      {pins.length >= max && (
        <button
          type="button"
          onClick={() => {
            setPins([]);
            surface.current?.focus();
          }}
          className="absolute top-2 right-2 rounded-full border-2 border-ink-text bg-panel px-3 py-1 text-xs font-semibold text-ink-text [--focus:#141414]"
        >
          {D.reset}
        </button>
      )}
    </div>
  );
}

/** A simple packaging-artwork illustration to pin comments on (sample only). */
function SampleDesign({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <rect width="320" height="200" fill="#F6F1EA" />
      {/* box artwork */}
      <rect x="92" y="22" width="136" height="156" rx="18" fill="#FFFDF9" stroke="#141414" strokeWidth="1.5" />
      <rect x="92" y="22" width="136" height="54" rx="18" fill="#B9A6FF" />
      <rect x="92" y="58" width="136" height="18" fill="#B9A6FF" />
      {/* logo */}
      <circle cx="160" cy="49" r="9" fill="#141414" />
      <circle cx="160" cy="49" r="4" fill="#B9A6FF" />
      {/* title and copy lines */}
      <rect x="110" y="92" width="100" height="9" rx="4.5" fill="#141414" />
      <rect x="110" y="110" width="78" height="6" rx="3" fill="#A8A39C" />
      <rect x="110" y="122" width="88" height="6" rx="3" fill="#A8A39C" />
      {/* product badge */}
      <rect x="110" y="142" width="44" height="20" rx="10" fill="none" stroke="#141414" strokeWidth="1.5" />
      <rect x="164" y="142" width="46" height="20" rx="10" fill="#141414" />
    </svg>
  );
}
