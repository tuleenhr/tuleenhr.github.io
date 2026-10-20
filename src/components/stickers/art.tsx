import type { ReactNode } from "react";

/**
 * Sticker illustrations: flat inline SVG in the site palette. Each shape is drawn over a thick
 * white stroke (paint-order: stroke) for the die-cut edge; StickerArt adds the soft shadow.
 */
export const INK = "#141414";
const LILAC = "#B9A6FF";
export const CREAM = "#F6F1EA";
const GOLD = "#F2C14E";
const BRICK = "#C8553D"; // the London bus only
const PALM = "#6BAF84"; // palm fronds only
export const edge = {
  stroke: "#fff",
  strokeWidth: 7,
  strokeLinejoin: "round" as const,
  paintOrder: "stroke" as const,
};

export type StickerId = "plane" | "clapper" | "star" | "palm" | "bus" | "pan";

const art: Record<StickerId, ReactNode> = {
  plane: (
    <g>
      <path
        {...edge}
        fill={LILAC}
        d="M32 6c3 0 4.5 3 4.5 7v12l18 10v6l-18-5v10l6 5v5l-10.5-3L21.5 56v-5l6-5V36l-18 5v-6l18-10V13c0-4 1.5-7 4.5-7z"
      />
      <path fill={INK} d="M30 12h4v6h-4z" opacity="0.85" />
      <path fill={CREAM} d="M29 40h6v3h-6z" />
    </g>
  ),
  clapper: (
    <g>
      <rect {...edge} x="10" y="26" width="44" height="28" rx="4" fill={INK} />
      <g transform="rotate(-14 12 24)">
        <rect
          {...edge}
          x="10"
          y="14"
          width="44"
          height="10"
          rx="2"
          fill={CREAM}
        />
        <path
          fill={INK}
          d="M16 14h6l-5 10h-6zM28 14h6l-5 10h-6zM40 14h6l-5 10h-6z"
        />
      </g>
      <rect x="16" y="33" width="20" height="3" rx="1.5" fill={LILAC} />
      <rect
        x="16"
        y="40"
        width="30"
        height="3"
        rx="1.5"
        fill={CREAM}
        opacity="0.6"
      />
    </g>
  ),
  star: (
    <path
      {...edge}
      fill={GOLD}
      d="M32 6l7.6 15.4 17 2.5-12.3 12 2.9 16.9L32 44.9l-15.2 7.9 2.9-16.9-12.3-12 17-2.5z"
    />
  ),

  // 2. Palm tree on a little sand mound (one tree for two sunny cities).
  palm: (
    <g>
      {/* sand and trunk: both white edges first, then the fills and ink outlines on top,
          so the trunk sits in the sand without a white seam */}
      <ellipse {...edge} cx="32" cy="53" rx="19" ry="6" fill={GOLD} />
      <path
        {...edge}
        fill={CREAM}
        d="M29.5 53c0-12 1.5-24 5.5-37h4.5c-3.5 13-5 25-5 37z"
      />
      <ellipse
        cx="32"
        cy="53"
        rx="19"
        ry="6"
        fill={GOLD}
        stroke={INK}
        strokeWidth="1.5"
      />
      <path
        fill={CREAM}
        stroke={INK}
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M29.5 53c0-12 1.5-24 5.5-37h4.5c-3.5 13-5 25-5 37z"
      />
      <path
        fill="none"
        stroke={INK}
        strokeWidth="1.2"
        d="M30.5 45h4.6M31.4 38h4.6M33 31h4.6"
      />
      {/* fronds, raised so more of the trunk shows */}
      <g transform="translate(-2 -8)">
        <path
          {...edge}
          fill={PALM}
          d="M38 22c-6-8-16-9-24-4 8-1 14 1 19 6-7-2-14 1-18 8 6-4 13-5 19-3-3 4-4 9-3 14 3-6 6-10 9-12 2 4 5 7 10 9-2-5-4-9-8-12 6-1 12 1 17 6-3-7-9-11-17-11 5-4 11-5 18-3-7-6-16-5-22 2z"
        />
        <path
          fill="none"
          stroke={INK}
          strokeWidth="1.5"
          strokeLinejoin="round"
          d="M38 22c-6-8-16-9-24-4 8-1 14 1 19 6-7-2-14 1-18 8 6-4 13-5 19-3-3 4-4 9-3 14 3-6 6-10 9-12 2 4 5 7 10 9-2-5-4-9-8-12 6-1 12 1 17 6-3-7-9-11-17-11 5-4 11-5 18-3-7-6-16-5-22 2z"
        />
      </g>
    </g>
  ),

  // 3. Double-decker in muted brick red (the only red in the set).
  bus: (
    <g>
      {/* wheel edges first, so the body's own edge and the wheels sit cleanly on top */}
      <circle {...edge} cx="19" cy="51" r="5" fill={INK} />
      <circle {...edge} cx="45" cy="51" r="5" fill={INK} />
      <rect {...edge} x="8" y="10" width="48" height="40" rx="6" fill={BRICK} />
      <rect x="12" y="15" width="40" height="9" rx="2" fill={CREAM} />
      <path stroke={BRICK} strokeWidth="2" d="M22 15v9M32 15v9M42 15v9" />
      <rect x="8" y="27" width="48" height="3" fill={INK} opacity="0.85" />
      <rect x="12" y="33" width="28" height="9" rx="2" fill={CREAM} />
      <path stroke={BRICK} strokeWidth="2" d="M21 33v9M30 33v9" />
      <rect
        x="44"
        y="33"
        width="8"
        height="14"
        rx="1.5"
        fill={CREAM}
        stroke={INK}
        strokeWidth="1"
      />
      <circle cx="19" cy="51" r="5" fill={INK} />
      <circle cx="45" cy="51" r="5" fill={INK} />
      <circle cx="19" cy="51" r="1.8" fill={CREAM} />
      <circle cx="45" cy="51" r="1.8" fill={CREAM} />
    </g>
  ),

  // 4. Frying pan with a sunny-side-up egg. The handle runs into the pan: both white edges are
  // drawn first and both fills on top, so there's no white seam where they meet.
  pan: (
    <g>
      <g transform="rotate(-24 27 34)">
        <rect
          {...edge}
          x="40"
          y="30.5"
          width="23"
          height="7"
          rx="3.5"
          fill={INK}
        />
      </g>
      <circle {...edge} cx="27" cy="34" r="21" fill={INK} />
      <g transform="rotate(-24 27 34)">
        <rect x="40" y="30.5" width="23" height="7" rx="3.5" fill={INK} />
        <circle cx="59.5" cy="34" r="1.3" fill={CREAM} opacity="0.7" />
      </g>
      <circle cx="27" cy="34" r="21" fill={INK} />
      <circle cx="27" cy="34" r="16" fill="#2B2A2E" />
      <path
        fill="#FFFDF9"
        d="M16 33c0-7 6-11 12-10 7 1 11 6 10 12-1 7-8 9-13 8-6-1-9-4-9-10z"
      />
      <circle cx="28" cy="33" r="5" fill={GOLD} />
      <circle cx="26.5" cy="31.5" r="1.4" fill="#fff" opacity="0.8" />
    </g>
  ),
};

/** Wraps any sticker drawing in the shared 64×64 frame with the soft shadow. */
export function StickerSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="size-full overflow-visible drop-shadow-[0_3px_3px_rgb(0_0_0/0.18)]"
    >
      {children}
    </svg>
  );
}

export function StickerArt({ id }: { id: StickerId }) {
  return <StickerSvg>{art[id]}</StickerSvg>;
}
