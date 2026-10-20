import type { Metadata } from "next";
import { CaseStudyLayout } from "@/components/case/CaseStudy";
import { BrowserFrame } from "@/components/BrowserWindows";
import { Reveal } from "@/components/ui";
import { caseStudyLabels, fiddlieCase as study } from "@/content";

export const metadata: Metadata = {
  title: "Fiddlie · Tuleen Rowaihy",
  description: study.intro,
  alternates: { canonical: "/fiddlie/" },
};

export default function FiddliePage() {
  return (
    <CaseStudyLayout
      study={study}
      heroSplit
      heroVisual={
        // One larger window: the client dashboard, from the header to the "ready for your feedback" card.
        <BrowserFrame
          shot={{ label: "", image: study.heroImage }}
          onDark
          eager
          sizes="(min-width: 1024px) 520px, 92vw"
          className="shadow-[0_28px_60px_-24px_rgb(0_0_0/0.55)]"
        />
      }
      closing={
        <section aria-labelledby="outcome-title" className="theme-dark px-4 py-16 sm:px-8 md:py-24">
          <Reveal className="mx-auto max-w-6xl">
            <h2 id="outcome-title" className="font-mono text-xs tracking-[0.18em] text-muted-dark uppercase">
              {caseStudyLabels.outcome}
            </h2>
            <p className="mt-6 font-display text-[clamp(1.8rem,4.6vw,3.4rem)] leading-[1.08] text-balance">
              {study.outcome.text}
            </p>
            <p className="mt-8 max-w-2xl text-lg text-muted-dark">{study.outcome.small}</p>
          </Reveal>
        </section>
      }
    />
  );
}
