"use client";

import { useEffect, useState } from "react";
import { about } from "@/content";
import { Note } from "../ui";

// Positions in the 360×150 drawing. Not real geography: three dots placed loosely left to right
// on one arc (the arc's midpoint lands on Riyadh).
const W = 360;
const H = 150;
const DOTS = [
  { x: 36, y: 72 },
  { x: 180, y: 46 },
  { x: 324, y: 66 },
];
const ARC = "M36 72 Q180 20 324 66";

const formatters = about.route.cities.map(
  (c) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: c.timeZone }),
);

/**
 * London → Riyadh → San Diego, with each city's live local time.
 * Times render on the client only (they'd never match the build-time HTML), so before
 * hydration the city names show alone. They update once a minute, on the minute.
 */
export function CityRoute() {
  const [times, setTimes] = useState<string[] | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimes(formatters.map((f) => f.format(now)));
    };
    tick();
    let interval: ReturnType<typeof setInterval> | undefined;
    const toNextMinute = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(toNextMinute);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div role="group" aria-label={about.route.label} className="relative w-full md:max-w-[360px]" style={{ aspectRatio: `${W} / ${H}` }}>
      <Note theme="cream" rotate={-4} className="absolute top-0 left-[18%] !text-xl whitespace-nowrap sm:!text-2xl">
        {about.note}
      </Note>

      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        <path d={ARC} fill="none" stroke="#A8A39C" strokeWidth="1.5" strokeDasharray="4 6" strokeLinecap="round" />
        {DOTS.map((d, i) => (
          <g key={i}>
            {about.route.cities[i].current && (
              <circle cx={d.x} cy={d.y} r="4" className="route-pulse fill-lilac" />
            )}
            <circle cx={d.x} cy={d.y} r="4" className="fill-lilac" stroke="#141414" strokeWidth="1.5" />
          </g>
        ))}
      </svg>

      <ul>
        {about.route.cities.map((c, i) => (
          <li
            key={c.name}
            className="absolute -translate-x-1/2 text-center font-mono leading-tight"
            style={{ left: `${(DOTS[i].x / W) * 100}%`, top: `${((DOTS[i].y + 14) / H) * 100}%` }}
          >
            <span className="block text-[11px] tracking-[0.12em] whitespace-nowrap uppercase">{c.name}</span>
            <span className="mt-0.5 flex h-4 items-center justify-center gap-1.5 text-xs text-muted-cream">
              {times && <time>{times[i]}</time>}
              {c.current && (
                <span className="rounded-full bg-lilac px-1.5 text-[10px] leading-4 text-ink-text">{about.route.current}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
