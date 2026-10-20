import { journey } from "@/content";
import { TimelineLine } from "./TimelineLine";
import { Reveal } from "./ui";

/**
 * Vertical timeline, newest first: one compact row per entry (date · role · organisation).
 * The line that draws down as you scroll is a small client component, and each marker
 * fills when its row is revealed (see the .marker-fill rules in globals.css).
 */
export function Timeline() {
  return (
    <ol className="relative mt-10">
      {/* the marker column is 20px wide at left 0 (mobile) or after the 140px date column (sm+) */}
      <div aria-hidden="true" className="absolute top-5 bottom-5 left-[9px] w-px bg-line-dark sm:left-[169px]" />
      <TimelineLine />
      {journey.rows.map((row) => (
        <Reveal
          as="li"
          key={row.title + row.dates}
          className="relative grid min-h-14 grid-cols-[20px_1fr] items-center gap-x-5 border-b border-line-dark/60 py-2.5 last:border-b-0 sm:grid-cols-[140px_20px_1fr]"
        >
          <span
            aria-hidden="true"
            className="col-start-1 row-span-2 flex size-5 items-center justify-center rounded-full border-2 border-lilac bg-ink sm:row-span-1 sm:col-start-2"
          >
            <span className="marker-fill size-2 rounded-full bg-lilac" />
          </span>
          <p className="col-start-2 font-mono text-xs text-muted-dark sm:col-start-1 sm:row-start-1 sm:text-right sm:text-sm">
            {row.dates}
          </p>
          <p className="col-start-2 leading-snug sm:col-start-3 sm:row-start-1">
            <span className="font-semibold">{row.title}</span>
            <span className="text-muted-dark"> · </span>
            <span className="text-lilac">{row.place}</span>
          </p>
        </Reveal>
      ))}
    </ol>
  );
}
