import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { hero, site } from "@/content";

// Built once into out/og.png (a real .png file, so GitHub Pages serves it as image/png).
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

/** 1200×630 share card: cream background, name in the display font, the headline, and the KBT figure. */
export async function GET() {
  const root = process.cwd();
  const [display, body] = await Promise.all([
    readFile(path.join(root, "src/assets/ArchivoBlack-Regular.woff")),
    readFile(path.join(root, "src/assets/InterTight-Medium.woff")),
  ]);
  const { before, highlight, after } = hero.headline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F0F10",
          padding: "72px 80px",
          color: "#F6F1EA",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Inter Tight", fontSize: 28, color: "#A8A39C" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#B9A6FF" }} />
          {site.name}
        </div>
        {/* Headline: the highlighted phrase keeps its curly quote and full stop attached. */}
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Archivo Black", fontSize: 104, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>{before.replace(/\s*“$/, "")}</span>
          <span style={{ display: "flex" }}>
            “<span style={{ background: "#B9A6FF", color: "#141414", padding: "0 14px", borderRadius: 12 }}>{highlight}</span>
            {after}
          </span>
        </div>
        <div style={{ display: "flex", fontFamily: "Inter Tight", fontSize: 26, color: "#A8A39C" }}>
          Software engineer · Co-founder &amp; CTO of KBT · {site.url.replace("https://", "")}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Black", data: display, weight: 400, style: "normal" },
        { name: "Inter Tight", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}
