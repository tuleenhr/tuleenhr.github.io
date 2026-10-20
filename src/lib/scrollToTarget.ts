/**
 * Eased in-page scrolling (no library), replacing CSS scroll-behavior: smooth.
 *
 * - easeInOutCubic on requestAnimationFrame; duration = clamp(400ms, distance × 0.35ms, 900ms)
 * - lands the target's content 88px from the top, just under the sticky nav
 * - stops if the user takes over (wheel, touch or a key press)
 * - reduced motion: jumps instantly
 * - announces start/end with window events so reveals and the demo video can sit it out
 */

export const NAV_OFFSET = 88;
export const SCROLL_START = "programmatic-scroll:start";
export const SCROLL_END = "programmatic-scroll:end";

let cancelCurrent: (() => void) | null = null;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Where to stop: the section's content (its inner container), not its padding. */
function targetY(el: HTMLElement | null) {
  if (!el) return 0;
  const content = (el.tagName === "SECTION" && (el.firstElementChild as HTMLElement | null)) || el;
  const y = content.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(max, Math.round(y)));
}

/** Focus the section's heading (or the element) without scrolling, for keyboard and screen-reader users. */
function focusTarget(el: HTMLElement | null) {
  const focusEl = el?.querySelector<HTMLElement>("h1, h2") ?? el ?? document.getElementById("top");
  if (!focusEl) return;
  if (!focusEl.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(focusEl.tagName)) {
    focusEl.setAttribute("tabindex", "-1");
    focusEl.style.outline = "none";
  }
  focusEl.focus({ preventScroll: true });
}

/** Scroll to an element (or the top of the page when el is null). Resolves when it settles or is cancelled. */
export function scrollToTarget(el: HTMLElement | null): Promise<void> {
  cancelCurrent?.();
  const to = targetY(el);
  const from = window.scrollY;
  const distance = Math.abs(to - from);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.dispatchEvent(new CustomEvent(SCROLL_START, { detail: { to } }));

  const finish = (cancelled: boolean) => {
    cancelCurrent = null;
    window.dispatchEvent(new CustomEvent(SCROLL_END, { detail: { to, cancelled } }));
    if (!cancelled) focusTarget(el);
  };

  if (reduce || distance < 2) {
    window.scrollTo(0, to);
    finish(false);
    return Promise.resolve();
  }

  const duration = Math.min(900, Math.max(400, distance * 0.35));
  return new Promise((resolve) => {
    let frame = 0;
    const start = performance.now();
    const stopEvents = ["wheel", "touchstart", "keydown"] as const;

    const cleanup = () => {
      cancelAnimationFrame(frame);
      stopEvents.forEach((t) => window.removeEventListener(t, onUserInput));
    };
    const onUserInput = () => {
      cleanup();
      finish(true);
      resolve();
    };
    cancelCurrent = onUserInput;
    stopEvents.forEach((t) => window.addEventListener(t, onUserInput, { passive: true }));

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      window.scrollTo(0, from + (to - from) * easeInOutCubic(t));
      if (t < 1) {
        frame = requestAnimationFrame(step);
      } else {
        cleanup();
        finish(false);
        resolve();
      }
    };
    frame = requestAnimationFrame(step);
  });
}
