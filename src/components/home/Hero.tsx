import { ArrowDown } from "lucide-react";
import { hero, now } from "@/content";
import { ButtonLink } from "../ButtonLink";
import { HeroFigure } from "../HeroFigure";
import { ResumeMenu } from "../ResumeMenu";
import { Note, Star } from "../ui";

// Split the headline's lead-in before " to " so desktop can break there: From “what if” / to “it’s live.”
const BREAK = " to ";
const breakAt = hero.headline.before.indexOf(BREAK);
const lineOne = breakAt === -1 ? hero.headline.before : hero.headline.before.slice(0, breakAt);
const lineTwo = breakAt === -1 ? "" : hero.headline.before.slice(breakAt + 1);

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="theme-dark relative z-10 overflow-x-clip px-4 pt-10 pb-12 sm:px-8 md:pt-12 lg:pb-10">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line-dark bg-[#18181a] px-3.5 py-1.5 text-sm text-cream/90">
            <span aria-hidden="true" className="size-2 rounded-full bg-go shadow-[0_0_0_3px_rgb(52_199_123/0.2)]" />
            {hero.status}
          </p>

          {/* Spacing: badge → headline 40px, headline → intro 40px, intro → "Now" 28px, "Now" → buttons 44px */}
          <h1
            id="hero-title"
            className="mt-10 font-display text-[clamp(2.4rem,6.4vw,4.75rem)] leading-[1.1] tracking-[-0.015em] text-balance"
          >
            {/* From 768px the headline breaks before "to"; on phones it wraps naturally (balanced). */}
            {lineOne}
            {lineTwo && (
              <>
                {" "}
                <br className="hidden md:inline" />
                {lineTwo}
              </>
            )}
            <span className="mark">{hero.headline.highlight}</span>
            {hero.headline.after}
          </h1>

          <p className="mt-10 max-w-[36rem] text-lg leading-[1.6] text-pretty text-muted-dark">{hero.sub}</p>
          <p className="mt-7 max-w-xl font-mono text-[13px] leading-relaxed text-muted-dark">
            {now.label}: {now.items.join(" · ")}
          </p>

          <div className="mt-11 flex flex-wrap gap-3">
            <ButtonLink href={hero.primary.href}>
              {hero.primary.label} <ArrowDown className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ResumeMenu label={hero.secondary.label} variant="button" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[300px] pt-12 sm:max-w-[360px] lg:pt-14">
          <Note theme="dark" rotate={-5} className="absolute top-0 left-1 lg:-left-16">
            {hero.note}
          </Note>
          <Star className="absolute top-3 -right-1 size-5 text-cream/80 sm:-right-6" />
          <HeroFigure />
        </div>
      </div>
    </section>
  );
}
