import type { CSSProperties, ReactNode } from "react";
import type { Highlighted } from "@/content";

type Theme = "dark" | "cream";

export function Section({
  id,
  theme,
  labelledBy,
  className = "",
  children,
}: {
  id?: string;
  theme: Theme;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`theme-${theme} relative overflow-x-clip px-4 py-16 sm:px-8 md:py-24 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/** Fades and rises in once when scrolled into view (see RevealObserver + globals.css). */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  return (
    <Tag
      data-reveal=""
      className={className}
      // Stagger is capped at 60ms so nothing lags behind a fast scroll.
      style={{ "--reveal-delay": `${Math.min(delay, 60)}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, theme }: { children: ReactNode; theme: Theme }) {
  return (
    <p
      className={`font-mono text-xs font-medium tracking-[0.18em] ${
        theme === "dark" ? "text-muted-dark" : "text-muted-cream"
      }`}
    >
      {children}
    </p>
  );
}

export function DisplayHeading({
  id,
  children,
  as: Tag = "h2",
  className = "",
}: {
  id?: string;
  children: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag
      id={id}
      className={`font-display uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(2.6rem,9vw,5.5rem)] ${className}`}
    >
      {children}
    </Tag>
  );
}

export function WithHighlight({ text }: { text: Highlighted }) {
  return (
    <>
      {text.before}
      <span className="mark">{text.highlight}</span>
      {text.after}
    </>
  );
}

/** Handwritten accent note. Five at most on the home page. */
export function Note({
  children,
  theme,
  className = "",
  rotate = -4,
}: {
  children: ReactNode;
  theme: Theme;
  className?: string;
  rotate?: number;
}) {
  return (
    <p
      className={`font-hand text-2xl leading-tight font-medium sm:text-[1.7rem] ${
        theme === "dark" ? "text-lilac" : "text-ink-text"
      } ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </p>
  );
}

export function Pill({ children, theme }: { children: ReactNode; theme: Theme }) {
  return (
    <li
      className={`rounded-full border px-3 py-1 text-sm ${
        theme === "dark" ? "border-line-dark text-cream/90" : "border-ink-text/15 bg-panel text-ink-text"
      }`}
    >
      {children}
    </li>
  );
}

/** Lilac mono pill, used for role labels and window labels. */
export function RoleTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-lilac px-3 py-1 font-mono text-[10.5px] tracking-[0.04em] text-ink-text uppercase sm:text-xs sm:tracking-[0.12em]">
      {children}
    </span>
  );
}

export function StackLine({ items, theme }: { items: string[]; theme: Theme }) {
  return (
    <p className={`font-mono text-xs leading-relaxed ${theme === "dark" ? "text-muted-dark" : "text-muted-cream"}`}>
      {items.join(" · ")}
    </p>
  );
}

/** Light screenshots on dark sections always sit in a cream panel with a 2px border. */
export function Frame({
  children,
  className = "",
  theme,
}: {
  children: ReactNode;
  className?: string;
  theme: Theme;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[24px] border-2 bg-panel ${
        theme === "dark" ? "border-cream/80" : "border-ink-text"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Small four-point star. Used twice on the whole site, at most. */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
      />
    </svg>
  );
}

export function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
      />
    </svg>
  );
}

export function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
      />
    </svg>
  );
}
