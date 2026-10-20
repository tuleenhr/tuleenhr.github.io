import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages (writes to ./out).
  output: "export",
  // Emit /kbt/index.html so GitHub Pages serves /kbt/ without a server.
  trailingSlash: true,
  // No image server on a static host; screenshots are pre-sized by scripts/optimize-images.mjs.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
