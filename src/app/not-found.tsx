import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { notFound as copy } from "@/content";

export const metadata: Metadata = {
  title: copy.title,
  robots: { index: false },
};

/** Static export writes this as 404.html, which GitHub Pages serves for unknown paths. */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="top" className="theme-dark flex min-h-[calc(100svh-4rem-7rem)] items-center px-4 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-mono text-xs tracking-[0.18em] text-muted-dark">{copy.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,9vw,5.5rem)] leading-[0.95] uppercase">
            {copy.heading.before}
            <span className="mark">{copy.heading.highlight}</span>
            {copy.heading.after}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-dark">{copy.body}</p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full border-2 border-lilac bg-lilac px-6 py-3 font-semibold text-ink-text"
          >
            {copy.cta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
