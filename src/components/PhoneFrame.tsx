import type { CSSProperties, ReactNode } from "react";

/**
 * CSS phone mockup (rounded bezel, no device image). On dark sections the bezel
 * gets a cream edge so the light screen inside always reads as a framed card.
 */
export function PhoneFrame({
  children,
  onDark = false,
  className = "",
  screenStyle,
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
  screenStyle?: CSSProperties;
}) {
  return (
    <div
      className={`rounded-[42px] border-2 bg-ink-text p-[9px] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] ${
        onDark ? "border-cream/80" : "border-ink-text"
      } ${className}`}
    >
      <div className="relative overflow-hidden rounded-[33px] bg-cream" style={screenStyle}>
        {children}
      </div>
    </div>
  );
}
