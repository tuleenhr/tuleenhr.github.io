import Image from "next/image";
import { about, images } from "@/content";
import { publicFileExists } from "@/lib/publicFile";
import { Eyebrow, Reveal, Section } from "../ui";
import { CityRoute } from "./CityRoute";
import { StickerLayer, StickerRow } from "./Stickers";

export function About() {
  // public/me.jpg is optional; without it the section renders text-only.
  const hasPhoto = publicFileExists(images.me.src);

  return (
    <Section id="about" theme="cream" labelledBy="about-title">
      <StickerLayer />
      <div className={`grid gap-12 ${hasPhoto ? "lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center" : ""}`}>
        <Reveal>
          <Eyebrow theme="cream">{about.eyebrow}</Eyebrow>
          <h2 id="about-title" className="mt-4 font-display text-[clamp(2.8rem,9vw,5.5rem)] leading-[0.95] tracking-[-0.015em]">
            {about.heading}
          </h2>
          <div className={`mt-8 grid gap-10 ${hasPhoto ? "" : "md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:items-center md:gap-14"}`}>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-text/85 sm:text-xl">{about.body}</p>
            <CityRoute />
          </div>
          <p className="mt-6 text-sm font-medium text-muted-cream">{about.details}</p>
          <StickerRow />
        </Reveal>

        {hasPhoto && (
          <Reveal delay={60}>
            <div className="overflow-hidden rounded-[28px] border-2 border-ink-text">
              <Image
                src={images.me.src}
                alt={images.me.alt}
                width={images.me.width}
                height={images.me.height}
                sizes="(min-width: 1024px) 380px, 90vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
