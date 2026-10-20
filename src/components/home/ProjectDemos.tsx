"use client";

import { useEffect, useRef, useState } from "react";
import { respawnDemo as R, sidekickDemo as S } from "@/content";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Called from the click handler only (kept outside the component so render stays pure). */
const rollRareDrop = () => Math.random() < R.rareDropChance;

/**
 * Respawn card: log habits for XP. Repeating the same habit gives less each time
 * (10 → 8 → 5 → 3); switching resets it. 50 XP per level, with a 10% rare drop.
 */
export function RespawnDemo() {
  const [xp, setXp] = useState(0); // XP within the current level
  const [last, setLast] = useState<{ habit: string; repeats: number } | null>(null);
  const [levelUp, setLevelUp] = useState(false);
  const [floats, setFloats] = useState<{ id: number; habit: string; amount: number }[]>([]);
  const [drop, setDrop] = useState(false);
  const nextId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  function log(habit: string) {
    if (levelUp) return;
    const repeats = last?.habit === habit ? last.repeats + 1 : 0;
    const mult = R.repeatMultipliers[Math.min(repeats, R.repeatMultipliers.length - 1)];
    const amount = Math.round(R.baseXp * mult);
    setLast({ habit, repeats });

    if (!prefersReducedMotion()) {
      const id = nextId.current++;
      setFloats((f) => [...f, { id, habit, amount }]);
      later(() => setFloats((f) => f.filter((x) => x.id !== id)), 600);
    }
    if (rollRareDrop()) {
      setDrop(true);
      later(() => setDrop(false), 2000);
    }

    const next = Math.min(R.xpPerLevel, xp + amount);
    setXp(next);
    if (next >= R.xpPerLevel) {
      setLevelUp(true);
      later(() => {
        setLevelUp(false);
        setXp(0);
        setLast(null);
      }, 1500);
    }
  }

  const status = levelUp ? R.levelUp : drop ? R.rareDrop : last && last.repeats >= 2 ? R.diminishing : "";

  return (
    <div className="mt-5">
      <div role="group" aria-label={R.groupLabel} className="flex flex-wrap gap-2">
        {R.habits.map((h) => (
          <span key={h} className="relative inline-flex">
            <button
              type="button"
              onClick={() => log(h)}
              aria-pressed={last?.habit === h}
              className={`rounded-full border px-3 py-1 font-mono text-xs ${
                last?.habit === h ? "border-lilac bg-lilac text-ink-text" : "border-lilac/60 text-lilac hover:border-lilac"
              }`}
            >
              {h}
            </button>
            {floats
              .filter((f) => f.habit === h)
              .map((f) => (
                <span
                  key={f.id}
                  aria-hidden="true"
                  className="xp-float pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-xs font-semibold whitespace-nowrap text-lilac"
                >
                  +{f.amount} XP
                </span>
              ))}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div
          role="progressbar"
          aria-label={R.barLabel}
          aria-valuemin={0}
          aria-valuemax={R.xpPerLevel}
          aria-valuenow={xp}
          className="h-1 flex-1 overflow-hidden rounded-full bg-line-dark"
        >
          <div
            className="h-full rounded-full bg-lilac motion-safe:transition-[width] motion-safe:duration-300"
            style={{ width: `${(xp / R.xpPerLevel) * 100}%` }}
          />
        </div>
        <span className="font-mono text-xs text-muted-dark tabular-nums">
          {xp}/{R.xpPerLevel} XP
        </span>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 font-mono text-xs text-lilac">
        {status}
      </p>
      <p className="font-mono text-xs text-muted-dark">{R.caption}</p>
    </div>
  );
}

/**
 * Sidekick card body: the description, or (toggled) a sample morning brief that types out.
 * Screen readers get the whole brief at once; the typing is visual only.
 */
export function SidekickBody({ description }: { description: string }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const full = S.text.length;

  useEffect(() => {
    if (!open) return;
    if (prefersReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(full);
      return;
    }
    setShown(0);
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= full) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 30);
    return () => clearInterval(id);
  }, [open, full]);

  return (
    <>
      {open ? (
        <div id="sidekick-brief" className="mt-3 rounded-[16px] border border-line-dark bg-ink p-4">
          <p className="font-mono text-[11px] tracking-[0.12em] text-lilac uppercase">{S.label}</p>
          <p className="sr-only">{S.text}</p>
          <p aria-hidden="true" className="mt-2 min-h-[7.5rem] leading-relaxed text-cream/90">
            {S.text.slice(0, shown)}
            {shown < full && <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-lilac" />}
          </p>
          {shown < full && (
            <button type="button" onClick={() => setShown(full)} className="mt-2 font-mono text-xs text-muted-dark underline underline-offset-4">
              {S.skip}
            </button>
          )}
        </div>
      ) : (
        <p className="mt-3 leading-relaxed text-muted-dark">{description}</p>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="sidekick-brief"
        onClick={() => setOpen((o) => !o)}
        className="mt-4 self-start rounded-full border-2 border-lilac px-3.5 py-1.5 text-sm font-semibold text-lilac hover:bg-lilac hover:text-ink-text"
      >
        {open ? S.close : S.open}
      </button>
    </>
  );
}
