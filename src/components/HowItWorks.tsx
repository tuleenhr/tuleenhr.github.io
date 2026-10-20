"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { caseStudyLabels as L, fiddlieDemos, type CaseBlock, type CaseStudy } from "@/content";
import { PinDemo, ReorderDemo } from "./case/FiddlieDemos";
import { BrowserChrome } from "./BrowserWindows";
import { PhoneFrame } from "./PhoneFrame";

type Device = CaseStudy["device"];

/**
 * "How it works" for the case studies.
 *
 * Server-rendered as a plain stacked list, every step with its own screenshot, so
 * nothing is hidden without JS or with reduced motion. Once JS runs (and motion is
 * allowed) the wrapper gets data-enhanced and the CSS in globals.css switches to:
 *  - ≥1024px: a sticky device on the left that crossfades to the active step's screen,
 *    with the steps scrolling past on the right;
 *  - <1024px: a horizontal scroll-snap row of cards with a counter and prev/next buttons.
 */
export function HowItWorks({ steps, device }: { steps: CaseBlock[]; device: Device }) {
  const list = useRef<HTMLOListElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mq = matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    // Upgrading after mount is the point: the server HTML is the no-JS fallback.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnhanced(true);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Desktop: the step crossing the middle 10% of the screen is the active one.
  useEffect(() => {
    if (!enhanced || !desktop || !list.current) return;
    const items = [...list.current.children];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(items.indexOf(e.target));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enhanced, desktop]);

  // Mobile/tablet: the card closest to the row's snap point is the active one.
  useEffect(() => {
    const row = list.current;
    if (!enhanced || desktop || !row) return;
    const onScroll = () => {
      const start = snapStart(row);
      const offsets = [...row.children].map((c) => Math.abs(c.getBoundingClientRect().left - start));
      setActive(offsets.indexOf(Math.min(...offsets)));
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => row.removeEventListener("scroll", onScroll);
  }, [enhanced, desktop]);

  function goTo(i: number) {
    const row = list.current;
    const card = row?.children[i];
    if (!row || !card) return;
    row.scrollBy({ left: card.getBoundingClientRect().left - snapStart(row), behavior: "smooth" });
  }

  return (
    <div className="how mt-12 md:mt-16" data-enhanced={enhanced ? "" : undefined}>
      {enhanced && (
        <div className="how-device">
          <DeviceScreens steps={steps} device={device} active={active} />
          <ol aria-hidden="true" className="mt-6 flex justify-center gap-2">
            {steps.map((s, i) => (
              <li key={s.title} className={`h-1.5 w-8 rounded-full ${i === active ? "bg-lilac" : "bg-cream/20"}`} />
            ))}
          </ol>
        </div>
      )}

      <div className="min-w-0">
        {enhanced && (
          <div className="how-nav mb-5 items-center justify-between">
            <p className="font-mono text-sm text-muted-dark" aria-live="polite">
              {active + 1} / {steps.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                disabled={active === 0}
                aria-label={L.prevStep}
                className="flex size-10 items-center justify-center rounded-full border-2 border-cream/70 disabled:opacity-35"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                disabled={active === steps.length - 1}
                aria-label={L.nextStep}
                className="flex size-10 items-center justify-center rounded-full border-2 border-cream/70 disabled:opacity-35"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <ol ref={list} className="how-steps">
          {steps.map((s, i) => (
            <li key={s.title} className="how-step" data-active={i === active ? "" : undefined}>
              <div className="how-shot">
                <SingleScreen step={s} device={device} />
                <DemoCaption step={s} />
              </div>
              <div className="how-text">
                <p className="font-mono text-3xl text-lilac lg:text-4xl">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-display text-[1.6rem] leading-[1.1] lg:text-[2rem]">{s.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-cream">{s.lead}</p>
                <div className="mt-5 border-l-2 border-lilac pl-4">
                  <p className="font-mono text-xs tracking-[0.18em] text-muted-dark uppercase">{L.whatIBuilt}</p>
                  <p className="mt-1.5 text-lg leading-relaxed text-cream/80">{s.built}</p>
                </div>
                {s.demo === "reorder" && <ReorderDemo />}
                {s.demo === "pins" && s.image && <PinCard />}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Screen x where a snapped card starts: the row's left edge plus its padding. */
function snapStart(row: HTMLElement) {
  return row.getBoundingClientRect().left + parseFloat(getComputedStyle(row).paddingLeft);
}

/** One step's screenshot in its device (stacked fallback and mobile cards). */
function SingleScreen({ step, device }: { step: CaseBlock; device: Device }) {
  const img = step.image;
  if (device === "phone") {
    return (
      <PhoneFrame onDark className="mx-auto w-[min(56vw,250px)]" screenStyle={{ aspectRatio: "600 / 1298" }}>
        {img && <Image src={img.src} alt={img.alt} fill sizes="250px" className="object-cover object-top" />}
      </PhoneFrame>
    );
  }
  return (
    <BrowserChrome onDark>
      {/* An empty cream screen until the step has a screenshot */}
      <div className="relative aspect-[16/10] bg-cream">
        {step.demo === "pins" && !img && <PinDemo />}
        {img && (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1024px) 480px, 85vw"
            className={step.contain ? "object-contain" : "object-cover object-top"}
          />
        )}
      </div>
    </BrowserChrome>
  );
}

/** The pin demo as a small framed card under the step text (when the step has a real screenshot). */
function PinCard() {
  return (
    <div className="mt-6 max-w-[380px]">
      <BrowserChrome onDark>
        <div className="relative aspect-[16/10] bg-cream">
          <PinDemo />
        </div>
      </BrowserChrome>
      <p className="mt-3 font-mono text-xs text-muted-dark">{fiddlieDemos.pins.caption}</p>
    </div>
  );
}

/** Caption under a screen that holds a demo. */
function DemoCaption({ step }: { step: CaseBlock }) {
  if (step.demo !== "pins" || step.image) return null;
  return <p className="mt-3 text-center font-mono text-xs text-muted-dark">{fiddlieDemos.pins.caption}</p>;
}

/**
 * The sticky device: all four screens stacked, crossfading to the active one.
 * All four are mounted together so they load together and the swap never flashes empty.
 */
function DeviceScreens({ steps, device, active }: { steps: CaseBlock[]; device: Device; active: number }) {
  // A step without a screenshot has no layer, so the device shows its empty screen.
  const layers = steps.map((s, i) =>
    s.image ? (
    <Image
      key={s.image.src}
      src={s.image.src}
      alt={s.image.alt}
      aria-hidden={i !== active}
      fill
      sizes={device === "phone" ? "280px" : "520px"}
      className={`transition-opacity duration-[250ms] ${i === active ? "opacity-100" : "opacity-0"} ${
        s.contain ? "object-contain" : "object-cover object-top"
      }`}
    />
    ) : null,
  );
  // Interactive demo screens sit on top while their step is active (and can't be clicked otherwise).
  const demoLayers = steps.map((s, i) =>
    s.demo === "pins" && !s.image ? (
      <div
        key={`demo-${i}`}
        aria-hidden={i !== active}
        inert={i !== active}
        className={`absolute inset-0 transition-opacity duration-[250ms] ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <PinDemo />
      </div>
    ) : null,
  );
  if (device === "phone") {
    return (
      <PhoneFrame onDark className="mx-auto w-[280px]" screenStyle={{ aspectRatio: "600 / 1298" }}>
        {layers}
      </PhoneFrame>
    );
  }
  return (
    <>
      <BrowserChrome onDark>
        <div className="relative aspect-[16/10] bg-cream">
          {layers}
          {demoLayers}
        </div>
      </BrowserChrome>
      <div className="h-6">{steps[active] && <DemoCaption step={steps[active]} />}</div>
    </>
  );
}
