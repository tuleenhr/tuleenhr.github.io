"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type Ref } from "react";
import { fitFigure as F } from "@/content";

type Size = (typeof F.sizes)[number];
type Fit = keyof typeof F.fitLabels;

// Area tint (behind) and label text colour (on white, ≥4.5:1) per fit, matching KBT's palette.
const COLOURS: Record<Fit, { area: string; text: string }> = {
  good: { area: "#4CAF7D", text: "#2F7D55" },
  fitted: { area: "#E8964A", text: "#A85F1C" },
  relaxed: { area: "#5B8BD6", text: "#3966AE" },
};
const IW = F.image.width;
const IH = F.image.height;
const CARD_W = 126;
const pctX = (x: number) => `${(x / IW) * 100}%`;
const pctY = (y: number) => `${(y / IH) * 100}%`;

/**
 * The KBT reference figure with live callouts. The figure image is clean (no labels or tints);
 * each fit area is a mask from the original export, tinted by fit, and the labels are HTML.
 * The S / M / L control is a radio group (arrow keys move between sizes).
 */
export function FitFigure({
  eager = false,
  frameRef,
}: {
  eager?: boolean;
  frameRef?: Ref<HTMLDivElement>;
}) {
  const [size, setSize] = useState<Size>(F.defaultSize);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  const fits = F.fits[size];

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const dir =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + F.sizes.length) % F.sizes.length;
    setSize(F.sizes[n]);
    radios.current[n]?.focus();
  }

  return (
    <div>
      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-[28px] border-2 border-cream/80 bg-[#f2ede7] [container-type:inline-size]"
        style={{ aspectRatio: `${IW} / ${IH}` }}
      >
        <Image
          src={F.image.src}
          alt={F.image.alt}
          width={IW}
          height={IH}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          sizes="(min-width: 640px) 360px, 300px"
          className="absolute inset-0 h-full w-full"
        />
        {/* Fit areas: exact shapes from the export, recoloured per fit. */}
        {F.areas.map((a) => (
          <div
            key={a.id}
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.42] transition-[background-color] duration-150"
            style={{
              backgroundColor: COLOURS[fits[a.id]].area,
              maskImage: `url(/kbt/fit-masks/${a.id}.png)`,
              WebkitMaskImage: `url(/kbt/fit-masks/${a.id}.png)`,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          />
        ))}
        {/* Connector lines and dots */}
        <svg
          viewBox={`0 0 ${IW} ${IH}`}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          {F.areas.map((a) => {
            const y = a.dot[1];
            const x1 = a.side === "left" ? a.card[0] + CARD_W : a.card[0];
            const c = COLOURS[fits[a.id]].area;
            return (
              <g
                key={a.id}
                className="[&>*]:transition-[stroke,fill] [&>*]:duration-150"
              >
                <line
                  x1={x1}
                  y1={y}
                  x2={a.dot[0]}
                  y2={y}
                  stroke={c}
                  strokeWidth="2.5"
                />
                <circle
                  cx={a.dot[0]}
                  cy={y}
                  r="8"
                  fill={c}
                  stroke="#fff"
                  strokeWidth="3.5"
                />
              </g>
            );
          })}
        </svg>
        {/* Callout cards */}
        <ul aria-label={`Fit for size ${size}`}>
          {F.areas.map((a) => {
            const fit = fits[a.id];
            return (
              <li
                key={a.id}
                className="absolute flex items-center gap-[1.6cqw] rounded-[2.2cqw] border border-ink-text/10 bg-white px-[2cqw] py-[1.4cqw] shadow-[0_2px_6px_rgb(0_0_0/0.08)]"
                style={{
                  left: pctX(a.card[0]),
                  top: pctY(a.card[1] - 6),
                  width: pctX(CARD_W),
                }}
              >
                <span
                  aria-hidden="true"
                  className="size-[1.6cqw] shrink-0 rounded-full transition-colors duration-150"
                  style={{ backgroundColor: COLOURS[fit].area }}
                />
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="text-[clamp(9px,3cqw,13px)] font-semibold text-ink-text">
                    {a.label}
                  </span>
                  <span
                    key={fit}
                    className="fit-fade text-[clamp(8px,2.5cqw,11px)] font-semibold"
                    style={{ color: COLOURS[fit].text }}
                  >
                    {F.fitLabels[fit]}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        <div
          role="radiogroup"
          aria-label={F.groupLabel}
          className="inline-flex rounded-full border border-line-dark bg-[#18181a] p-1"
        >
          {F.sizes.map((s, i) => {
            const on = s === size;
            return (
              <button
                key={s}
                ref={(el) => {
                  radios.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                onClick={() => setSize(s)}
                onKeyDown={(e) => onKey(e, i)}
                className={`min-w-11 rounded-full px-3 py-1 font-mono text-sm font-semibold transition-colors duration-150 ${
                  on
                    ? "bg-lilac text-ink-text"
                    : "text-muted-dark hover:text-cream"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        <p className="text-center font-mono text-xs text-muted-dark">{F.caption}</p>
      </div>
    </div>
  );
}
