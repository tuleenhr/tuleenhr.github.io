"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { kbtVideo } from "@/content";
import { SCROLL_END, SCROLL_START } from "@/lib/scrollToTarget";
import { PhoneFrame } from "./PhoneFrame";

/**
 * KBT demo in a CSS phone frame. Plays muted and looped once it scrolls into view,
 * except with prefers-reduced-motion, where it shows the poster and a play button.
 * (Playback is started from JS rather than the autoplay attribute, because autoplay
 * makes the browser download the whole video on page load, even below the fold.)
 */
export function PhoneVideo({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  // The poster is attached as the phone approaches the screen, so it isn't fetched
  // on page load (it would compete with the hero for bandwidth).
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      v.pause();
      v.currentTime = 0;
      // Syncing UI to a browser preference that's only readable after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReduced(true);
    }
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    setPlaying(!v.paused);

    // Play only while on screen (and never on its own with reduced motion or after a manual pause).
    // During a programmatic scroll it stays paused, then resumes if it ends up visible.
    let scrolling = false;
    const visible = () => {
      const r = v.getBoundingClientRect();
      return r.bottom > r.height * 0.25 && r.top < window.innerHeight - r.height * 0.25;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!scrolling && !isReduced && !userPaused.current && v.paused) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    const onScrollStart = () => {
      scrolling = true;
      if (!visible() && !v.paused) v.pause();
    };
    const onScrollEnd = () => {
      scrolling = false;
      if (visible()) {
        if (!isReduced && !userPaused.current && v.paused) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    };
    window.addEventListener(SCROLL_START, onScrollStart);
    window.addEventListener(SCROLL_END, onScrollEnd);
    io.observe(v);
    const nearIo = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          nearIo.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    nearIo.observe(v);
    return () => {
      window.removeEventListener(SCROLL_START, onScrollStart);
      window.removeEventListener(SCROLL_END, onScrollEnd);
      io.disconnect();
      nearIo.disconnect();
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      void v.play();
    } else {
      userPaused.current = true;
      v.pause();
    }
  }

  const showOverlay = reduced && !playing;

  return (
    <div className={`mx-auto w-[min(72vw,260px)] ${className}`}>
      <PhoneFrame onDark={onDark} screenStyle={{ aspectRatio: "384 / 848" }}>
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          src={kbtVideo.src}
          poster={near ? kbtVideo.poster : undefined}
          aria-label={kbtVideo.label}
          muted
          loop
          playsInline
          preload="metadata"
        />
        {showOverlay && (
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center bg-ink/20"
            aria-label="Play the KBT demo video"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-lilac text-ink-text shadow-lg">
              <Play className="size-7 translate-x-0.5" aria-hidden="true" />
            </span>
          </button>
        )}
      </PhoneFrame>

      {/* Centred under the phone so it never covers the frame or the screen. */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={toggle}
          // Hidden (but keeps its space) while the big play overlay is showing.
          className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-sm font-semibold ${
            onDark ? "border-cream/70 text-cream" : "border-ink-text text-ink-text"
          } ${showOverlay ? "invisible" : ""}`}
          // Accessible name starts with the visible text (WCAG label-in-name).
          aria-label={playing ? "Pause demo video" : "Play demo video"}
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {playing ? "Pause demo" : "Play demo"}
        </button>
      </div>
    </div>
  );
}
