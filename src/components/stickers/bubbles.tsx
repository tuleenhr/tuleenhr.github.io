import type { ReactNode } from "react";
import { CREAM, INK, StickerSvg, edge } from "./art";
import { arabicSticker, chineseSticker } from "./fonts";

// Speech-bubble stickers live apart from the rest because they need the two tiny language font
// subsets (fonts.ts), about 4 KB together.

export type BubbleId = "helloArabic" | "helloMandarin";
export const isBubble = (id: string): id is BubbleId => id === "helloArabic" || id === "helloMandarin";

/** Speech bubble with a small tail, cream fill and ink outline. */
function Bubble({ children }: { children: ReactNode }) {
  const d = "M12 12h40a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H30l-10 9 1-9h-9a8 8 0 0 1-8-8V20a8 8 0 0 1 8-8z";
  return (
    <g>
      <path {...edge} fill={CREAM} d={d} />
      <path fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" d={d} />
      {children}
    </g>
  );
}

const bubbles: Record<BubbleId, ReactNode> = {
  // 5a. مرحبا, laid out right-to-left with an Arabic font so the letters join.
  helloArabic: (
    <Bubble>
      <text
        x="32"
        y="30.5"
        textAnchor="middle"
        dominantBaseline="middle"
        direction="rtl"
        fontSize="15"
        fill={INK}
        style={{ fontFamily: arabicSticker.style.fontFamily, fontWeight: 600 }}
      >
        مرحبا
      </text>
    </Bubble>
  ),

  // 5b. 你好
  helloMandarin: (
    <Bubble>
      <text
        x="32"
        y="29"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        fill={INK}
        style={{ fontFamily: chineseSticker.style.fontFamily, fontWeight: 600 }}
      >
        你好
      </text>
    </Bubble>
  ),
};

export function BubbleArt({ id }: { id: BubbleId }) {
  return <StickerSvg>{bubbles[id]}</StickerSvg>;
}
