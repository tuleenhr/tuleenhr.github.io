"use client";

import dynamic from "next/dynamic";

// Motion is only needed for this scroll-linked line, so it loads after the page has rendered.
const DrawnLine = dynamic(() => import("./TimelineLineMotion"), { ssr: false });

export function TimelineLine() {
  return <DrawnLine />;
}
