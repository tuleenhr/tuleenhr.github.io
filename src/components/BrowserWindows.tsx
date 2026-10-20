import Image from "next/image";
import type { ReactNode } from "react";
import type { BrowserShot } from "@/content";
import { RoleTag } from "./ui";

/** Simple browser window chrome: thin border, three neutral dots, ~16px radius. */
export function BrowserChrome({
  children,
  onDark = false,
  className = "",
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border bg-panel ${onDark ? "border-cream/80" : "border-ink-text/80"} ${className}`}>
      <div aria-hidden="true" className="flex h-6 items-center gap-1.5 border-b border-ink-text/10 bg-[#ece6dd] px-3">
        <span className="size-2 rounded-full bg-ink-text/25" />
        <span className="size-2 rounded-full bg-ink-text/25" />
        <span className="size-2 rounded-full bg-ink-text/25" />
      </div>
      {children}
    </div>
  );
}

/** A screenshot in the browser chrome, optionally cropped to its top part. */
export function BrowserFrame({
  shot,
  sizes,
  onDark = false,
  eager = false,
  className = "",
}: {
  shot: BrowserShot;
  sizes: string;
  onDark?: boolean;
  eager?: boolean;
  className?: string;
}) {
  const { image, cropTop } = shot;
  const aspect = cropTop ? `${image.width} / ${Math.round(image.height * cropTop)}` : null;
  return (
    <BrowserChrome onDark={onDark} className={className}>
      {aspect ? (
        // Crop by aspect ratio + object-cover/top, so the screenshot is never squashed.
        <div className="relative" style={{ aspectRatio: aspect }}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            className="object-cover object-top"
          />
        </div>
      ) : (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="h-auto w-full"
        />
      )}
    </BrowserChrome>
  );
}

/**
 * Two overlapping browser windows. From 1024px: back window top-left at ~65% width,
 * front window overlapping bottom-right at ~55%. The label pills sit above each
 * window and never on a screenshot (the front pill is right-aligned, past the back
 * window's edge). Below 1024px they stack, front (client) window first.
 */
export function BrowserPair({
  back,
  front,
  onDark = false,
  eager = false,
  width = 560,
}: {
  back: BrowserShot;
  front: BrowserShot;
  onDark?: boolean;
  eager?: boolean;
  /** Rough rendered width of the pair on desktop, for image sizes. */
  width?: number;
}) {
  return (
    <div className="flex flex-col gap-8 lg:block">
      <figure className="order-2 lg:w-[65%]">
        <figcaption className="mb-2.5">
          <RoleTag>{back.label}</RoleTag>
        </figcaption>
        <BrowserFrame shot={back} onDark={onDark} eager={eager} sizes={`(min-width: 1024px) ${Math.round(width * 0.65)}px, 92vw`} />
      </figure>
      <figure className="relative z-10 order-1 lg:-mt-[16%] lg:ml-auto lg:w-[55%]">
        <figcaption className="mb-2.5 lg:text-right">
          <RoleTag>{front.label}</RoleTag>
        </figcaption>
        <BrowserFrame
          shot={front}
          onDark={onDark}
          eager={eager}
          sizes={`(min-width: 1024px) ${Math.round(width * 0.55)}px, 92vw`}
          className="shadow-[0_28px_60px_-24px_rgb(0_0_0/0.45)]"
        />
      </figure>
    </div>
  );
}
