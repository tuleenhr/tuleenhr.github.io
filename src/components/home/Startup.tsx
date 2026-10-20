import { ArrowRight } from "lucide-react";
import { startup } from "@/content";
import { ButtonLink } from "../ButtonLink";
import { PhoneVideo } from "../PhoneVideo";
import { QrCode } from "../QrCode";
import { Eyebrow, Note, Reveal, Section } from "../ui";

export function Startup() {
  return (
    <Section id="startup" theme="cream" labelledBy="startup-title">
      {/* items-center lines the text up with the middle of the phone (note above and control below roughly balance) */}
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
        <Reveal>
          <Eyebrow theme="cream">{startup.eyebrow}</Eyebrow>
          <h2 id="startup-title" className="mt-4 font-display text-[clamp(4.5rem,16vw,9rem)] leading-[0.85] tracking-[-0.02em]">
            {startup.heading}
          </h2>
          <p className="mt-6 font-display text-[clamp(1.6rem,4vw,2.5rem)] leading-[1.08] text-balance">
            {startup.tagline}
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-text/85">{startup.body}</p>
          <p className="mt-5 font-mono text-sm text-muted-cream">{startup.role}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={startup.live.href} variant="ink" newTab>
              {startup.live.label} <span aria-hidden="true" className="btn-arrow-ne">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </ButtonLink>
            <ButtonLink href={startup.story.href} variant="outline-cream">
              {startup.story.label} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={60} className="relative pt-14">
          <Note theme="cream" rotate={-4} className="absolute top-0 right-0 left-0 text-center lg:-left-10 lg:text-left">
            {startup.note} <span aria-hidden="true">↓</span>
          </Note>
          {/* QR beside the phone from 768px (hidden on phones, where "Try it live" is enough) */}
          <div className="flex items-end justify-center gap-5">
            <PhoneVideo className="!mx-0" />
            <QrCode url={startup.qr.url} caption={startup.qr.caption} className="mb-16" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
