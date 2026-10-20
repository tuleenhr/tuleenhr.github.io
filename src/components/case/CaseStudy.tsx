import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { caseStudyLabels as L, type CaseStudy } from "@/content";
import { Footer } from "../Footer";
import { Nav } from "../Nav";
import { HowItWorks } from "../HowItWorks";
import { SkipLink } from "../SkipLink";
import { DisplayHeading, Eyebrow, Pill, Reveal, Section, WithHighlight } from "../ui";

/** Shared layout for /kbt and /fiddlie. Sections alternate dark and cream. */
export function CaseStudyLayout({
  study,
  heroVisual,
  heroSplit = false,
  closing,
}: {
  study: CaseStudy;
  heroVisual: ReactNode;
  /** Put the visual beside the text from 1024px up (otherwise it sits below). */
  heroSplit?: boolean;
  /** Final dark block (outcome / what's next). */
  closing: ReactNode;
}) {
  const intro = (
    <div>
      <Eyebrow theme="dark">{study.eyebrow}</Eyebrow>
      <h1
        id="case-title"
        className={`mt-5 max-w-4xl font-display leading-[1.02] tracking-[-0.015em] text-balance ${
          heroSplit ? "text-[clamp(2.3rem,5vw,4rem)]" : "text-[clamp(2.3rem,6.2vw,4.6rem)]"
        }`}
      >
        <WithHighlight text={study.heading} />
      </h1>
      <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-dark">{study.intro}</p>
      <ul aria-label="At a glance" className="mt-7 flex flex-wrap gap-2">
        {study.pills.map((p) => (
          <Pill key={p} theme="dark">
            {p}
          </Pill>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <SkipLink />
      <Nav />
      <main id="top" tabIndex={-1} className="outline-none">
        {/* Hero (dark) */}
        <section aria-labelledby="case-title" className="theme-dark px-4 pt-8 pb-16 sm:px-8 md:pt-10 md:pb-24">
          <div className="mx-auto max-w-6xl">
            <Link href={study.backHref} className="inline-flex text-sm text-muted-dark hover:text-cream">
              {L.back}
            </Link>
            {heroSplit ? (
              <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-14">
                {intro}
                {heroVisual}
              </div>
            ) : (
              <>
                <div className="mt-10">{intro}</div>
                <div className="mt-12">{heroVisual}</div>
              </>
            )}
          </div>
        </section>

        {/* Problem / role (cream) */}
        <Section theme="cream" labelledBy="facts-title">
          <h2 id="facts-title" className="sr-only">
            Overview
          </h2>
          <div className={`grid gap-5 ${study.facts.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
            {study.facts.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 60}>
                <div className="h-full rounded-[24px] border-2 border-ink-text bg-panel p-6 sm:p-7">
                  <h3 className="font-display text-xl">{f.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-text/85">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* How it works (dark) */}
        <Section theme="dark" labelledBy="how-title">
          <Reveal>
            <DisplayHeading id="how-title">{L.howItWorks}</DisplayHeading>
          </Reveal>
          <HowItWorks steps={study.blocks} device={study.device} />
          {study.alsoBuilt && (
            <Reveal className="mt-12 md:mt-16">
              <h3 className="font-mono text-xs tracking-[0.18em] text-muted-dark uppercase">{L.alsoBuilt}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {study.alsoBuilt.map((item) => (
                  <li key={item} className="rounded-full border border-line-dark px-3 py-1 font-mono text-xs text-cream/85">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </Section>

        {/* Stack + challenges (cream) */}
        <Section theme="cream" labelledBy="challenges-title">
          <Reveal>
            <h2 className="font-mono text-xs tracking-[0.18em] text-muted-cream uppercase">{L.underTheHood}</h2>
            <p className="mt-3 rounded-[20px] bg-ink-text px-5 py-4 font-mono text-xs leading-relaxed text-cream sm:text-sm">
              {study.stack}
            </p>
            {study.stackNote && <p className="mt-3 text-sm text-muted-cream">{study.stackNote}</p>}
          </Reveal>

          <Reveal className="mt-14 md:mt-16">
            <h2 id="challenges-title" className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-none uppercase">
              {L.challenges}
            </h2>
          </Reveal>
          <ul aria-labelledby="challenges-title" className="mt-10 grid gap-5 lg:grid-cols-3">
            {study.challenges.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 2) * 60}>
                <div className="h-full rounded-[24px] border-2 border-ink-text bg-panel p-6 sm:p-7">
                  <h3 className="text-lg leading-snug font-semibold">{c.title}</h3>
                  <p className="mt-4 flex gap-2 leading-relaxed text-ink-text/85">
                    <span aria-hidden="true" className="font-semibold">
                      →
                    </span>
                    <span>{c.text}</span>
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>

        {closing}

        {/* Next case study (cream, runs into the footer) */}
        <nav aria-label="Next case study" className="theme-cream px-4 pt-14 pb-8 sm:px-8 md:pt-16">
          <div className="mx-auto max-w-6xl">
            <Link href={study.next.href} className="group inline-flex flex-col gap-2">
              <span className="font-mono text-xs tracking-[0.18em] text-muted-cream uppercase">{L.next}</span>
              <span className="inline-flex items-center gap-3 font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-none uppercase decoration-lilac decoration-[6px] underline-offset-[10px] group-hover:underline">
                {study.next.label}
                <ArrowRight className="size-[0.8em] transition-transform delay-[40ms] duration-[180ms] group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </nav>
      </main>
      <Footer withContact />
    </>
  );
}
