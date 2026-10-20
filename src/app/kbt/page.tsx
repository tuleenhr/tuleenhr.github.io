import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { CaseStudyLayout } from "@/components/case/CaseStudy";
import { PhoneVideo } from "@/components/PhoneVideo";
import { QrCode } from "@/components/QrCode";
import { Reveal } from "@/components/ui";
import { caseStudyLabels, images, kbtCase as study, startup } from "@/content";

export const metadata: Metadata = {
  title: "KBT · Tuleen Rowaihy",
  description: study.intro,
  alternates: { canonical: "/kbt/" },
};

export default function KbtPage() {
  const fig = images.heroFigure;
  return (
    <CaseStudyLayout
      study={study}
      heroSplit
      heroVisual={
        // Cream panel so the light screens never glare on the dark hero. From 1024px the
        // figure card sits in front of the phone's lower-right corner; on smaller screens they stack.
        <div className="relative rounded-[28px] border-2 border-cream/80 bg-cream px-5 py-8 sm:px-8 lg:py-10">
          {/* QR in the empty top-right corner (above the figure) from 1024px; in the flow at 768–1023px; hidden on phones */}
          <QrCode url={startup.qr.url} caption={startup.qr.caption} className="mx-auto mb-6 lg:absolute lg:top-8 lg:right-8 lg:m-0" />
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-0">
            <PhoneVideo className="lg:mx-0 lg:shrink-0" />
            <div className="relative z-10 w-full max-w-[380px] overflow-hidden rounded-[22px] border-2 border-ink-text bg-[#f2ede7] shadow-[0_24px_50px_-24px_rgb(0_0_0/0.45)] lg:mt-56 lg:-ml-12 lg:w-[290px] lg:max-w-none">
              <Image src={fig.src} alt={fig.alt} width={fig.width} height={fig.height} loading="eager" sizes="(min-width: 1024px) 290px, 88vw" className="h-auto w-full" />
            </div>
          </div>
        </div>
      }
      closing={
        <section aria-labelledby="next-title" className="theme-dark px-4 py-16 sm:px-8 md:py-24">
          <Reveal className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="next-title" className="font-mono text-xs tracking-[0.18em] text-muted-dark uppercase">
                {caseStudyLabels.whatsNext}
              </h2>
              <span className="rounded-full border border-lilac px-2.5 py-0.5 font-mono text-[11px] tracking-[0.12em] text-lilac uppercase">
                {caseStudyLabels.notLive}
              </span>
            </div>
            <p className="mt-6 font-display text-[clamp(1.8rem,4.6vw,3.4rem)] leading-[1.08] text-balance">
              {study.whatsNext}
            </p>
            <div className="mt-10">
              <ButtonLink href={study.live.href} newTab>
                {study.live.label} <span aria-hidden="true" className="btn-arrow-ne">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </ButtonLink>
            </div>
          </Reveal>
        </section>
      }
    />
  );
}
