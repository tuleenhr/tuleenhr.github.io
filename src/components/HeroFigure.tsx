"use client";

import { useEffect, useRef } from "react";
import { FitFigure } from "./FitFigure";

const MAX_DRIFT = 8;

/** The KBT fit figure, drifting a few pixels with the mouse on desktop. No auto motion. */
export function HeroFigure() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0, ty = 0, x = 0, y = 0, frame = 0;
    const tick = () => {
      // Ease towards the target so the drift feels soft.
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: MouseEvent) => {
      tx = ((e.clientX / innerWidth) * 2 - 1) * MAX_DRIFT;
      ty = ((e.clientY / innerHeight) * 2 - 1) * MAX_DRIFT;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    addEventListener("mousemove", onMove, { passive: true });
    return () => {
      removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Only the figure frame drifts with the mouse; the size control and caption under it stay put.
  return <FitFigure eager frameRef={ref} />;
}
