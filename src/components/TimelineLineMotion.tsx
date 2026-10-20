"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

/** Lilac line that draws down the timeline as you scroll (full length with reduced motion). */
export default function TimelineLineMotion() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="absolute top-5 bottom-5 left-[9px] w-px origin-top bg-lilac sm:left-[169px]"
      style={{ scaleY: reduce ? 1 : scaleY }}
    />
  );
}
